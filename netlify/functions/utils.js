const jwt = require('jsonwebtoken');

function createCookieHeader(token) {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    'Set-Cookie': `auth_token=${token}; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`
  };
}

function parseCookies(event) {
  const cookieHeader = event.headers.cookie || '';
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const [key, val] = c.trim().split('=');
    if (key) cookies[key] = val;
  });
  return cookies;
}

async function verifyToken(event) {
  const cookies = parseCookies(event);
  const token = cookies.auth_token || event.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-in-production');
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

module.exports = {
  createCookieHeader,
  parseCookies,
  verifyToken,
  successResponse,
  errorResponse
};
