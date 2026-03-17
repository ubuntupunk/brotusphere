import pool from '../netlify/lib/db.js';
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken,
  getTokenFromEvent,
  createAuthResponse,
  authError
} from '../netlify/lib/auth.js';

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(16);
}

async function verifyAndMigratePassword(password, storedHash, userId) {
  // Check if old simpleHash format
  if (storedHash.startsWith('hash_')) {
    const oldHash = simpleHash(password);
    if (oldHash === storedHash) {
      // Migrate to bcrypt
      const newHash = await hashPassword(password);
      await pool.query('UPDATE user_profiles SET password_hash = $1 WHERE id = $2', [newHash, userId]);
      console.log('Migrated user password to bcrypt:', userId);
      return true;
    }
    return false;
  }
  
  // Use bcrypt for new format
  return verifyPassword(password, storedHash);
}
import { checkRateLimit } from '../netlify/lib/rate-limit.js';

export async function handler(event, context) {
  const { action } = event.queryStringParameters;

  // Apply rate limiting to auth endpoints
  if (event.httpMethod === 'POST' && (action === 'signup' || action === 'login')) {
    const rateLimitResponse = checkRateLimit(event, action);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

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
      const valid = await verifyAndMigratePassword(password, user.password_hash, user.id);

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
