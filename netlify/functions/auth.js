const { pool } = require('../lib/db.js');
const { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken,
  getTokenFromEvent,
  createAuthResponse,
  authError
} = require('../lib/auth.js');
const { checkRateLimit } = require('../lib/rate-limit.js');

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
  if (storedHash.startsWith('hash_')) {
    const oldHash = simpleHash(password);
    if (oldHash === storedHash) {
      const newHash = await hashPassword(password);
      await pool.query('UPDATE user_profiles SET password_hash = $1 WHERE id = $2', [newHash, userId]);
      console.log('Migrated user password to bcrypt:', userId);
      return true;
    }
    return false;
  }
  return verifyPassword(password, storedHash);
}

exports.handler = async function(event, context) {
  const { action } = event.queryStringParameters || {};

  if (event.httpMethod === 'POST' && (action === 'signup' || action === 'login')) {
    const rateLimitResponse = checkRateLimit(event, action);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  if (event.httpMethod === 'POST' && action === 'signup') {
    const { name, email, password } = JSON.parse(event.body || '{}');

    if (!name || !email || !password) {
      return authError('Name, email and password required', 400);
    }

    if (password.length < 6) {
      return authError('Password must be at least 6 characters', 400);
    }

    try {
      const existing = await pool.query('SELECT id FROM user_profiles WHERE email = $1', [email.toLowerCase()]);
      
      if (existing.rows.length > 0) {
        return authError('User already exists', 409);
      }

      const hashedPassword = await hashPassword(password);

      const result = await pool.query(`
        INSERT INTO user_profiles (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role, created_at
      `, [name, email.toLowerCase(), hashedPassword]);

      const user = result.rows[0];
      const token = generateToken(user);

      return createAuthResponse(user, token);
    } catch (error) {
      console.error('Signup error:', error);
      return authError('Registration failed: ' + error.message, 500);
    }
  }

  if (event.httpMethod === 'POST' && action === 'login') {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return authError('Email and password required', 400);
    }

    try {
      const result = await pool.query(
        'SELECT id, name, email, password_hash, role FROM user_profiles WHERE email = $1',
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
        'SELECT id, name, email, role FROM user_profiles WHERE id = $1',
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

  // POST /auth?action=forgot-password
  if (event.httpMethod === 'POST' && action === 'forgot-password') {
    const { email } = JSON.parse(event.body || '{}');

    if (!email) {
      return authError('Email required', 400);
    }

    try {
      const result = await pool.query(
        'SELECT id, name FROM user_profiles WHERE email = $1',
        [email.toLowerCase()]
      );

      if (result.rows.length === 0) {
        // Don't reveal if user exists
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'If the email exists, a reset link will be sent.' })
        };
      }

      // Generate reset token
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

      await pool.query(
        'UPDATE user_profiles SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3',
        [resetToken, resetExpiry, email.toLowerCase()]
      );

      // In production, send email here
      console.log('Password reset token:', resetToken);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'If the email exists, a reset link will be sent.' })
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return authError('Failed to process request', 500);
    }
  }

  // POST /auth?action=reset-password
  if (event.httpMethod === 'POST' && action === 'reset-password') {
    const { token, password } = JSON.parse(event.body || '{}');

    if (!token || !password) {
      return authError('Token and password required', 400);
    }

    if (password.length < 6) {
      return authError('Password must be at least 6 characters', 400);
    }

    try {
      const result = await pool.query(
        'SELECT id FROM user_profiles WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
        [token]
      );

      if (result.rows.length === 0) {
        return authError('Invalid or expired token', 400);
      }

      const hashedPassword = await hashPassword(password);

      await pool.query(
        'UPDATE user_profiles SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2',
        [hashedPassword, result.rows[0].id]
      );

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Password reset successful' })
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return authError('Failed to reset password', 500);
    }
  }

  return authError('Invalid action', 400);
};
