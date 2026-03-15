import pool from '../lib/db.js';

export async function handler(event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { orderId, email } = event.queryStringParameters;

  if (!orderId || !email) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Order ID and email required' })
    };
  }

  try {
    const result = await pool.query(`
      SELECT o.id, o.status, o.total, o.tracking_number, o.tracking_carrier,
             o.shipping_name, o.shipping_city, o.shipping_postal_code, o.created_at,
             json_agg(
               json_build_object(
                 'name', p.name,
                 'quantity', oi.quantity,
                 'unit_price', oi.unit_price
               )
             ) FILTER (WHERE oi.id IS NOT NULL) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1 AND u.email = $2
      GROUP BY o.id
    `, [orderId, email]);

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Order not found' })
      };
    }

    const order = result.rows[0];
    
    // Build tracking message
    let trackingInfo = null;
    if (order.tracking_number) {
      trackingInfo = {
        carrier: order.tracking_carrier,
        number: order.tracking_number,
        url: getTrackingUrl(order.tracking_carrier, order.tracking_number)
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: {
          id: order.id,
          status: order.status,
          total: order.total,
          tracking: trackingInfo,
          shipping: {
            name: order.shipping_name,
            city: order.shipping_city,
            postalCode: order.shipping_postal_code
          },
          items: order.items,
          createdAt: order.created_at
        }
      })
    };
  } catch (error) {
    console.error('Track order error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to fetch order' })
    };
  }
}

function getTrackingUrl(carrier, number) {
  if (!carrier || !number) return null;
  
  const carriers = {
    'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${number}`,
    'fedex': `https://www.fedex.com/fedextrack/?trknbr=${number}`,
    'ups': `https://www.ups.com/track?tracknum=${number}`,
    'south-african-postal': `https://www.postoffice.co.za/track/',
    'default': null
  };

  return carriers[carrier?.toLowerCase()] || carriers.default;
}
