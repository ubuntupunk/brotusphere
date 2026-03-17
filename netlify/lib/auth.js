import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function parseCookies(event) {
  const cookieHeader = event.headers.cookie || '';
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const [key, val] = c.trim().split('=');
    if (key) cookies[key] = val;
  });
  return cookies;
}

export function getTokenFromEvent(event) {
  const cookies = parseCookies(event);
  const cookieToken = cookies['auth_token'];
  
  if (cookieToken) return cookieToken;
  
  const authHeader = event.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

export function createAuthResponse(user, token, includeCookie = true) {
  const headers = { 'Content-Type': 'application/json' };
  
  if (includeCookie) {
    headers['Set-Cookie'] = `auth_token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`;
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      user: { id: user.id, name: user.name, email: user.email },
      token
    })
  };
}

export function authError(message, statusCode = 401) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: message })
  };
}
