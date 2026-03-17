import pool from './db.js';

export async function createOrder(userId, items, shipping = {}, paypalOrderId = null, paypalTransactionId = null, status = 'pending', billing = {}, payerEmail = null) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

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

    const orderResult = await client.query(`
      INSERT INTO orders (
        user_id, total, 
        shipping_name, shipping_address, shipping_address2, shipping_city, shipping_postal_code, shipping_country,
        billing_name, billing_address, billing_address2, billing_city, billing_postal_code, billing_country,
        payer_email,
        paypal_order_id, paypal_transaction_id, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id
    `, [
      userId,
      total,
      shipping?.name,
      shipping?.address,
      shipping?.address2,
      shipping?.city,
      shipping?.postalCode,
      shipping?.country,
      billing?.name || shipping?.name,
      billing?.address,
      billing?.address2,
      billing?.city,
      billing?.postalCode,
      billing?.country,
      payerEmail,
      paypalOrderId,
      paypalTransactionId,
      status
    ]);
      status
    ]);

    const orderId = orderResult.rows[0].id;

    for (const item of orderItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.productId, item.quantity, item.price]);

      await client.query(`
        UPDATE products SET stock = stock - $1 WHERE id = $2
      `, [item.quantity, item.productId]);

      await client.query(`
        INSERT INTO stock_movements (product_id, quantity_change, type, reference_id)
        VALUES ($1, $2, 'sale', $3)
      `, [item.productId, -item.quantity, orderId]);
    }

    await client.query('COMMIT');

    return { orderId, total };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserOrders(userId) {
  const result = await pool.query(`
    SELECT o.id, o.status, o.total, o.tracking_number, o.tracking_carrier,
           o.shipping_name, o.shipping_city, o.shipping_postal_code, o.created_at,
           json_agg(
             json_build_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'name', p.name,
               'quantity', oi.quantity,
               'unit_price', oi.unit_price
             )
           ) FILTER (WHERE oi.id IS NOT NULL) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [userId]);

  return result.rows;
}
