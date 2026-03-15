import pool from '../lib/db.js';
import { createCookieHeader } from './utils.js';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { action, email, password, name } = JSON.parse(event.body || '{}');

  try {
    if (action === 'signup') {
      if (!email || !password || !name) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
      }

      // Check if user exists
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return { statusCode: 409, body: JSON.stringify({ error: 'User already exists' }) };
      }

      // Create user with bcrypt
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [name, email, hashedPassword]
      );

      const user = result.rows[0];
      const token = await createToken(user);

      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json', ...createCookieHeader(token) },
        body: JSON.stringify({ user: { id: user.id, name: user.name, email: user.email }, token })
      };
    }

    if (action === 'login') {
      if (!email || !password) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing email or password' }) };
      }

      const result = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
      }

      const user = result.rows[0];
      const bcrypt = await import('bcryptjs');
      const valid = await bcrypt.compare(password, user.password_hash);

      if (!valid) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
      }

      const token = await createToken(user);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', ...createCookieHeader(token) },
        body: JSON.stringify({ user: { id: user.id, name: user.name, email: user.email }, token })
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };

  } catch (error) {
    console.error('Auth error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}

async function createToken(user) {
  const jwt = await import('jsonwebtoken');
  return jwt.default.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'dev-secret-change-in-production',
    { expiresIn: '7d' }
  );
}
