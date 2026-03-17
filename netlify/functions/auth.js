import pool from '../lib/db.js';
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken,
  getTokenFromEvent,
  createAuthResponse,
  authError
} from '../lib/auth.js';

export async function handler(event, context) {
  const { action } = event.queryStringParameters;

  // POST /auth?action=signup - Register new user
  if (event.httpMethod === 'POST' && action === 'signup') {
    const { name, email, password } = JSON.parse(event.body || '{}');

    if (!name || !email || !password) {
      return authError('Name, email and password required', 400);
    }

    if (password.length < 6) {
      return authError('Password must be at least 6 characters', 400);
    }

    try {
      // Check if user exists
      const existing = await pool.query('SELECT id FROM user_profiles WHERE email = $1', [email.toLowerCase()]);
      
      if (existing.rows.length > 0) {
        return authError('User already exists', 409);
      }

      // Hash password with bcrypt
      const hashedPassword = await hashPassword(password);

      // Create user
      const result = await pool.query(`
        INSERT INTO user_profiles (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
      `, [name, email.toLowerCase(), hashedPassword]);

      const user = result.rows[0];
      const token = generateToken(user);

      return createAuthResponse(user, token);
    } catch (error) {
      console.error('Signup error:', error);
      return authError('Registration failed: ' + error.message, 500);
    }
  }

  // POST /auth?action=login - Login user
  if (event.httpMethod === 'POST' && action === 'login') {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return authError('Email and password required', 400);
    }

    try {
      const result = await pool.query(
        'SELECT id, name, email, password_hash FROM user_profiles WHERE email = $1',
        [email.toLowerCase()]
      );
      
      if (result.rows.length === 0) {
        return authError('Invalid credentials');
      }

      const user = result.rows[0];
      const valid = await verifyPassword(password, user.password_hash);

      if (!valid) {
        return authError('Invalid credentials');
      }

      const token = generateToken(user);

      return createAuthResponse(user, token);
    } catch (error) {
      console.error('Login error:', error);
      return authError('Login failed', 500);
    }
  }

  // GET /auth?action=verify - Verify token
  if (event.httpMethod === 'GET' && action === 'verify') {
    const token = getTokenFromEvent(event);
    
    if (!token) {
      return authError('No token provided', 401);
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return authError('Invalid or expired token', 401);
    }
    
    try {
      const result = await pool.query(
        'SELECT id, name, email FROM user_profiles WHERE id = $1',
        [decoded.id]
      );
      
      if (result.rows.length === 0) {
        return authError('User not found', 404);
      }
      
      return createAuthResponse(result.rows[0], token);
    } catch (error) {
      console.error('Verify error:', error);
      return authError('Verification failed', 500);
    }
  }

  return authError('Invalid action', 400);
}
