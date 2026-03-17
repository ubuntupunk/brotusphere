const { pool } = require('../lib/db.js');
const { createOrder } = require('../lib/orders.js');
const { getTokenFromEvent, verifyToken } = require('../lib/auth.js');

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

module.exports.handler = async function handler(event, context) {
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
    const { orderId, items, shipping } = JSON.parse(event.body || '{}');

    // Get user from JWT token
    const token = getTokenFromEvent(event);
    if (!token) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid or expired token' })
      };
    }
    
    const userId = decoded.id;

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

      // Create order in database using shared function
      try {
        const { orderId: dbOrderId, total } = await createOrder(
          userId,
          items,
          shipping,
          orderId,
          transactionId,
          'paid'
        );

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
        console.error('Database error:', dbError);
        throw dbError;
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
