import pool from '../lib/db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Only allow in development or with admin key
  const adminKey = event.headers['x-admin-key'];
  if (process.env.NODE_ENV === 'production' && adminKey !== process.env.ADMIN_KEY) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  try {
    const schema = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'schema.sql'), 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
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
