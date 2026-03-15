import pool from '../lib/db.js';
import { verifyNeonAuth, successResponse, errorResponse, parseCookies } from './utils.js';

async function getUserProfile(event) {
  const cookies = parseCookies(event);
  const token = cookies['neon-session'] || event.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return null;

  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.decode(token);
    
    if (!decoded?.sub) return null;

    const result = await pool.query('SELECT id, neon_user_id, name FROM user_profiles WHERE neon_user_id = $1', [decoded.sub]);
    return result.rows[0] || null;
  } catch (e) {
    return null;
  }
}

export async function handler(event, context) {
  const user = await getUserProfile(event);

  // GET - List user's orders
  if (event.httpMethod === 'GET') {
    if (!user) {
      return errorResponse(401, 'Unauthorized');
    }

    try {
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
      `, [user.id]);

      return successResponse({ orders: result.rows });
    } catch (error) {
      console.error('Get orders error:', error);
      return errorResponse(500, 'Failed to fetch orders');
    }
  }

  // POST - Create new order
  if (event.httpMethod === 'POST') {
    if (!user) {
      return errorResponse(401, 'Please sign in to place an order');
    }

    const { items, shipping, paypalOrderId } = JSON.parse(event.body || '{}');

    if (!items || items.length === 0) {
      return errorResponse(400, 'No items in cart');
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check stock and calculate total
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await client.query('SELECT id, name, price, stock FROM products WHERE id = $1 AND is_active = true', [item.productId]);
        
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

      // Create order
      const orderResult = await client.query(`
        INSERT INTO orders (user_id, total, shipping_name, shipping_address, shipping_city, shipping_postal_code, shipping_country, paypal_order_id, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
        RETURNING id
      `, [
        user.id,
        total,
        shipping?.name,
        shipping?.address,
        shipping?.city,
        shipping?.postalCode,
        shipping?.country,
        paypalOrderId
      ]);

      const orderId = orderResult.rows[0].id;

      // Create order items and reduce stock
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

      return successResponse({ orderId, total });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Create order error:', error);
      return errorResponse(400, error.message);
    } finally {
      client.release();
    }
  }

  return errorResponse(405, 'Method Not Allowed');
}
