import pool from '../lib/db.js';

const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

export async function handler(event, context) {
  const { action } = event.queryStringParameters;

  // POST /paypal?action=create-order
  if (event.httpMethod === 'POST' && action === 'create-order') {
    const { items, total } = JSON.parse(event.body || '{}');

    if (!items || items.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No items in cart' })
      };
    }

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'ZAR',
              value: total.toFixed(2)
            },
            description: 'Brotusphere Order'
          }]
        })
      });

      const order = await response.json();
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: order.id,
          status: order.status
        })
      };
    } catch (error) {
      console.error('PayPal create order error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to create PayPal order' })
      };
    }
  }

  // POST /paypal?action=capture-order
  if (event.httpMethod === 'POST' && action === 'capture-order') {
    const { orderId, items, userId, shipping } = JSON.parse(event.body || '{}');

    if (!orderId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Order ID required' })
      };
    }

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const capture = await response.json();

      if (capture.status !== 'COMPLETED') {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Payment not completed' })
        };
      }

      // Get the transaction ID
      const transactionId = capture.purchase_units[0]?.payments?.captures[0]?.id;

      // Create order in database
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');

        // Calculate total and check stock
        let total = 0;
        const orderItems = [];

        for (const item of items) {
          const product = await client.query(
            'SELECT id, name, price, stock FROM products WHERE id = $1 AND is_active = true',
            [item.productId]
          );
          
          if (product.rows.length === 0) {
            throw new Error(`Product not found: ${item.productId}`);
          }

          if (product.rows[0].stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.rows[0].name}`);
          }

          const lineTotal = parseFloat(product.rows[0].price) * item.quantity;
          total += lineTotal;

          orderItems.push({
            productId: product.rows[0].id,
            name: product.rows[0].name,
            price: product.rows[0].price,
            quantity: item.quantity
          });
        }

        // Insert order
        const orderResult = await client.query(`
          INSERT INTO orders (user_id, total, shipping_name, shipping_address, shipping_city, shipping_postal_code, shipping_country, paypal_order_id, paypal_transaction_id, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'paid')
          RETURNING id
        `, [
          userId,
          total,
          shipping?.name,
          shipping?.address,
          shipping?.city,
          shipping?.postalCode,
          shipping?.country,
          orderId,
          transactionId
        ]);

        const dbOrderId = orderResult.rows[0].id;

        // Insert order items and reduce stock
        for (const item of orderItems) {
          await client.query(`
            INSERT INTO order_items (order_id, product_id, quantity, unit_price)
            VALUES ($1, $2, $3, $4)
          `, [dbOrderId, item.productId, item.quantity, item.price]);

          await client.query(`
            UPDATE products SET stock = stock - $1 WHERE id = $2
          `, [item.quantity, item.productId]);

          await client.query(`
            INSERT INTO stock_movements (product_id, quantity_change, type, reference_id)
            VALUES ($1, $2, 'sale', $3)
          `, [item.productId, -item.quantity, dbOrderId]);
        }

        await client.query('COMMIT');

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            success: true, 
            orderId: dbOrderId,
            transactionId
          })
        };
      } catch (dbError) {
        await client.query('ROLLBACK');
        throw dbError;
      } finally {
        client.release();
      }

    } catch (error) {
      console.error('PayPal capture error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message || 'Failed to capture payment' })
      };
    }
  }

  // POST /paypal?action=refund
  if (event.httpMethod === 'POST' && action === 'refund') {
    const { transactionId, orderId, amount } = JSON.parse(event.body || '{}');

    if (!transactionId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Transaction ID required' })
      };
    }

    try {
      const accessToken = await getAccessToken();
      
      const refundBody = amount 
        ? { amount: { value: amount.toFixed(2), currency_code: 'ZAR' } }
        : {};

      const response = await fetch(`${PAYPAL_API}/v2/payments/captures/${transactionId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(refundBody)
      });

      const refund = await response.json();

      if (refund.status === 'COMPLETED') {
        // Update order status and restore stock
        const client = await pool.connect();
        
        try {
          await client.query('BEGIN');

          // Get order items
          const orderItems = await client.query(
            'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
            [orderId]
          );

          // Restore stock
          for (const item of orderItems.rows) {
            await client.query(
              'UPDATE products SET stock = stock + $1 WHERE id = $2',
              [item.quantity, item.product_id]
            );

            await client.query(`
              INSERT INTO stock_movements (product_id, quantity_change, type, reference_id, notes)
              VALUES ($1, $2, 'return', $3, 'Refund processed')
            `, [item.product_id, item.quantity, orderId]);
          }

          // Update order status
          await client.query(
            "UPDATE orders SET status = 'refunded', updated_at = NOW() WHERE id = $1",
            [orderId]
          );

          await client.query('COMMIT');
        } catch (dbError) {
          await client.query('ROLLBACK');
          throw dbError;
        } finally {
          client.release();
        }
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          refundId: refund.id,
          status: refund.status
        })
      };
    } catch (error) {
      console.error('PayPal refund error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to process refund' })
      };
    }
  }

  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Invalid action' })
  };
}
