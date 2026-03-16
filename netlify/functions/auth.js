import pool from '../lib/db.js';

export async function handler(event, context) {
  const { action } = event.queryStringParameters;

  // POST /auth?action=signup - Register new user
  if (event.httpMethod === 'POST' && action === 'signup') {
    const { name, email, password } = JSON.parse(event.body || '{}');

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Name, email and password required' })
      };
    }

    try {
      // Check if user exists
      const existing = await pool.query('SELECT id FROM user_profiles WHERE email = $1', [email.toLowerCase()]);
      
      if (existing.rows.length > 0) {
        return {
          statusCode: 409,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'User already exists' })
        };
      }

      // Hash password
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(`
        INSERT INTO user_profiles (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
      `, [name, email.toLowerCase(), hashedPassword]);

      const user = result.rows[0];

      // Generate simple token (for demo - use JWT in production)
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

      return {
        statusCode: 201,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `auth_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`
        },
        body: JSON.stringify({ 
          user: { id: user.id, name: user.name, email: user.email },
          token
        })
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Registration failed' })
      };
    }
  }

  // POST /auth?action=login - Login user
  if (event.httpMethod === 'POST' && action === 'login') {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Email and password required' })
      };
    }

    try {
      const result = await pool.query(
        'SELECT id, name, email, password_hash FROM user_profiles WHERE email = $1',
        [email.toLowerCase()]
      );
      
      if (result.rows.length === 0) {
        return {
          statusCode: 401,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }

      const user = result.rows[0];
      const bcrypt = await import('bcryptjs');
      const valid = await bcrypt.compare(password, user.password_hash);

      if (!valid) {
        return {
          statusCode: 401,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }

      const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

      return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `auth_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`
        },
        body: JSON.stringify({ 
          user: { id: user.id, name: user.name, email: user.email },
          token
        })
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Login failed' })
      };
    }
  }

  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Invalid action' })
  };
}
