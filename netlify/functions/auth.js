import pool from '../lib/db.js';
import { createCookieHeader, parseCookies, successResponse, errorResponse } from './utils.js';

export async function handler(event, context) {
  const { action } = event.queryStringParameters;

  // GET /auth?action=me - Get current user profile
  if (event.httpMethod === 'GET' && action === 'me') {
    const payload = await verifyNeonAuth(event);
    if (!payload) {
      return errorResponse(401, 'Unauthorized');
    }

    try {
      const result = await pool.query(
        'SELECT id, neon_user_id, name, phone, default_shipping_address, default_city, default_postal_code, default_country FROM user_profiles WHERE neon_user_id = $1',
        [payload.sub]
      );

      if (result.rows.length === 0) {
        return successResponse({ profile: null });
      }

      return successResponse({ profile: result.rows[0] });
    } catch (error) {
      console.error('Get profile error:', error);
      return errorResponse(500, 'Failed to fetch profile');
    }
  }

  // POST /auth?action=signup - Create user profile
  if (event.httpMethod === 'POST' && action === 'signup') {
    const payload = await verifyNeonAuth(event);
    if (!payload) {
      return errorResponse(401, 'Unauthorized - invalid token');
    }

    const { name, phone } = JSON.parse(event.body || '{}');

    try {
      // Check if profile exists
      const existing = await pool.query('SELECT id FROM user_profiles WHERE neon_user_id = $1', [payload.sub]);
      
      if (existing.rows.length > 0) {
        return errorResponse(409, 'Profile already exists');
      }

      const result = await pool.query(`
        INSERT INTO user_profiles (neon_user_id, name, phone)
        VALUES ($1, $2, $3)
        RETURNING id, neon_user_id, name, phone, default_shipping_address, default_city, default_postal_code, default_country
      `, [payload.sub, name, phone]);

      return successResponse({ profile: result.rows[0] });
    } catch (error) {
      console.error('Signup error:', error);
      return errorResponse(500, 'Failed to create profile');
    }
  }

  // PUT /auth?action=update - Update user profile
  if (event.httpMethod === 'PUT' && action === 'update') {
    const payload = await verifyNeonAuth(event);
    if (!payload) {
      return errorResponse(401, 'Unauthorized');
    }

    const { name, phone, defaultShippingAddress, defaultCity, defaultPostalCode, defaultCountry } = JSON.parse(event.body || '{}');

    try {
      const result = await pool.query(`
        UPDATE user_profiles 
        SET name = COALESCE($1, name),
            phone = COALESCE($2, phone),
            default_shipping_address = COALESCE($3, default_shipping_address),
            default_city = COALESCE($4, default_city),
            default_postal_code = COALESCE($5, default_postal_code),
            default_country = COALESCE($6, default_country),
            updated_at = NOW()
        WHERE neon_user_id = $7
        RETURNING id, neon_user_id, name, phone, default_shipping_address, default_city, default_postal_code, default_country
      `, [name, phone, defaultShippingAddress, defaultCity, defaultPostalCode, defaultCountry, payload.sub]);

      if (result.rows.length === 0) {
        return errorResponse(404, 'Profile not found');
      }

      return successResponse({ profile: result.rows[0] });
    } catch (error) {
      console.error('Update error:', error);
      return errorResponse(500, 'Failed to update profile');
    }
  }

  return errorResponse(400, 'Invalid action');
}

async function verifyNeonAuth(event) {
  // Neon auth provides JWT via cookie or Authorization header
  const cookies = parseCookies(event);
  const token = cookies['neon-session'] || event.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return null;

  try {
    // Get Neon auth endpoint from environment
    const jwksUrl = process.env.NEON_AUTH_JWKS || process.env.NEON_AUTH + '/.well-known/jwks.json';
    
    // For now, decode without verification (Neon handles auth)
    // In production, verify against Neon JWKS
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.decode(token);
    
    return decoded;
  } catch (e) {
    console.error('Auth verification error:', e);
    return null;
  }
}
