const { pool } = require('../lib/db.js');
const { getTokenFromEvent, verifyToken } = require('../lib/auth.js');

const ROLES = ['admin', 'staff', 'customer'];

function requireAdmin(user) {
  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return false;
  }
  return true;
}

async function handler(event, context) {
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

  // Get user's role from database
  const userResult = await pool.query(
    'SELECT id, role FROM user_profiles WHERE id = $1',
    [decoded.id]
  );

  if (userResult.rows.length === 0) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'User not found' })
    };
  }

  const user = userResult.rows[0];

  if (!requireAdmin(user)) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Admin access required. Your role: ' + (user.role || 'none') })
    };
  }

  const { action } = event.queryStringParameters;

  // GET /admin?action=orders
  if (event.httpMethod === 'GET' && action === 'orders') {
    try {
      const result = await pool.query(`
        SELECT o.id, o.status, o.total, o.tracking_number, o.tracking_carrier,
               o.fulfilled_at, o.received_at,
               o.shipping_name, o.shipping_address, o.shipping_address2, o.shipping_city, o.shipping_postal_code, o.shipping_country,
               o.billing_name, o.billing_address, o.billing_address2, o.billing_city, o.billing_postal_code, o.billing_country,
               o.payer_email, o.paypal_order_id, o.paypal_transaction_id,
               o.created_at,
               up.name as customer_name, up.email as customer_email,
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'product_id', oi.product_id,
                   'name', p.name,
                   'image_url', p.image_url,
                   'quantity', oi.quantity,
                   'unit_price', oi.unit_price
                 )
               ) FILTER (WHERE oi.id IS NOT NULL) as items
        FROM orders o
        JOIN user_profiles up ON o.user_id = up.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        GROUP BY o.id, up.name, up.email
        ORDER BY o.created_at DESC
        LIMIT 100
      `);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: result.rows })
      };
    } catch (error) {
      console.error('Admin orders error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch orders' })
      };
    }
  }

  // GET /admin?action=users
  if (event.httpMethod === 'GET' && action === 'users') {
    try {
      const result = await pool.query(`
        SELECT id, name, email, phone, role, created_at,
               (SELECT COUNT(*) FROM orders WHERE user_id = user_profiles.id) as order_count
        FROM user_profiles
        ORDER BY created_at DESC
        LIMIT 100
      `);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: result.rows })
      };
    } catch (error) {
      console.error('Admin users error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch users' })
      };
    }
  }

  // GET /admin?action=products
  if (event.httpMethod === 'GET' && action === 'products') {
    try {
      const result = await pool.query(`
        SELECT p.*,
               COALESCE(SUM(oi.quantity), 0) as total_sold
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: result.rows })
      };
    } catch (error) {
      console.error('Admin products error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch products' })
      };
    }
  }

  // PATCH /admin?action=update-order
  if (event.httpMethod === 'PATCH' && action === 'update-order') {
    const { orderId, status, trackingNumber, trackingCarrier, markFulfilled } = JSON.parse(event.body || '{}');

    if (!orderId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Order ID required' })
      };
    }

    try {
      const updates = ['updated_at = NOW()'];
      const params = [orderId];
      let paramIndex = 2;

      if (status) {
        updates.push(`status = $${paramIndex++}`);
        params.push(status);
      }

      if (trackingNumber !== undefined) {
        updates.push(`tracking_number = $${paramIndex++}`);
        params.push(trackingNumber || null);
        
        // Auto-set fulfilled_at when tracking number is added
        if (trackingNumber) {
          updates.push(`fulfilled_at = NOW()`);
        }
      }

      if (trackingCarrier) {
        updates.push(`tracking_carrier = $${paramIndex++}`);
        params.push(trackingCarrier);
      }

      if (markFulfilled === true) {
        updates.push(`fulfilled_at = NOW()`);
      }

      if (updates.length === 0) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'No fields to update' })
        };
      }

      const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Order not found' })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: result.rows[0] })
      };
    } catch (error) {
      console.error('Admin update order error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to update order' })
      };
    }
  }

  // PATCH /admin?action=update-user
  if (event.httpMethod === 'PATCH' && action === 'update-user') {
    const { userId, role } = JSON.parse(event.body || '{}');

    if (!userId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'User ID required' })
      };
    }

    if (role && !ROLES.includes(role)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid role' })
      };
    }

    try {
      const updates = ['updated_at = NOW()'];
      const params = [userId];
      
      if (role) {
        updates.push('role = $2');
        params.push(role);
      }

      const query = `UPDATE user_profiles SET ${updates.join(', ')} WHERE id = $1 RETURNING id, name, email, role`;
      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'User not found' })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: result.rows[0] })
      };
    } catch (error) {
      console.error('Admin update user error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to update user' })
      };
    }
  }

  // PATCH /admin?action=update-product
  if (event.httpMethod === 'PATCH' && action === 'update-product') {
    const { productId, name, description, price, stock, isActive } = JSON.parse(event.body || '{}');

    if (!productId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Product ID required' })
      };
    }

    try {
      const updates = ['updated_at = NOW()'];
      const params = [productId];
      let paramIndex = 2;

      if (name) {
        updates.push(`name = $${paramIndex++}`);
        params.push(name);
      }
      if (description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        params.push(description);
      }
      if (price !== undefined) {
        updates.push(`price = $${paramIndex++}`);
        params.push(price);
      }
      if (stock !== undefined) {
        updates.push(`stock = $${paramIndex++}`);
        params.push(stock);
      }
      if (isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        params.push(isActive);
      }

      const query = `UPDATE products SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Product not found' })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: result.rows[0] })
      };
    } catch (error) {
      console.error('Admin update product error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to update product' })
      };
    }
  }

  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Invalid action' })
  };
}

module.exports.handler = async function(event, context) {
  return handler(event, context);
};
