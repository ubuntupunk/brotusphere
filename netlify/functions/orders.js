import pool, { query } from '../lib/db.js';
import { createOrder, getUserOrders } from '../lib/orders.js';

function parseCookies(event) {
  const cookieHeader = event.headers.cookie || '';
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const [key, val] = c.trim().split('=');
    if (key) cookies[key] = val;
  });
  return cookies;
}

async function getUserProfile(event) {
  const cookies = parseCookies(event);
  const token = cookies['auth_token'];
  
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');
    
    if (!userId) return null;
    
    const result = await query('SELECT id, name, email FROM user_profiles WHERE id = $1', [userId]);
    return result.rows[0] || null;
  } catch (e) {
    return null;
  }
}

function successResponse(data) {
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
}

function errorResponse(statusCode, message) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: message }) };
}

export async function handler(event, context) {
  const user = await getUserProfile(event);

  // GET - List user's orders
  if (event.httpMethod === 'GET') {
    if (!user) {
      return errorResponse(401, 'Unauthorized');
    }

    try {
      const orders = await getUserOrders(user.id);
      return successResponse({ orders });
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

    try {
      const { orderId, total } = await createOrder(user.id, items, shipping, paypalOrderId);
      return successResponse({ orderId, total });
    } catch (error) {
      console.error('Create order error:', error);
      return errorResponse(400, error.message);
    }
  }

  return errorResponse(405, 'Method Not Allowed');
}
