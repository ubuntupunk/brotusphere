import pool from '../netlify/lib/db.js';
import schema from '../netlify/lib/schema.sql' with { type: 'text' };
import insertProducts from '../netlify/lib/insert-products.sql' with { type: 'text' };
import { verifyAdminKey, authError } from '../netlify/lib/auth.js';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return authError('Method Not Allowed', 405);
  }

  // Only allow in development or with admin key
  const adminCheck = verifyAdminKey(event);
  if (!adminCheck.authorized) {
    return authError(adminCheck.reason, 403);
  }

  // Only allow in development or with admin key
  const adminKey = event.headers['x-admin-key'];
  if (process.env.NODE_ENV === 'production' && adminKey !== process.env.ADMIN_KEY) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  try {
    // Create tables
    const statements = schema.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    // Insert sample products
    const productStatements = insertProducts.split(';').filter(s => s.trim());
    for (const statement of productStatements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Database initialized' })
    };
  } catch (error) {
    console.error('Init error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
}
