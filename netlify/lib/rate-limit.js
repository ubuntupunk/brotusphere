const rateLimitStore = new Map();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

function rateLimit(key, maxRequests = RATE_LIMIT_MAX_REQUESTS, windowMs = RATE_LIMIT_WINDOW_MS) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get or create rate limit record
  let record = rateLimitStore.get(key);
  
  if (!record || record.windowStart < windowStart) {
    record = {
      windowStart: now,
      requests: []
    };
  }
  
  // Clean old requests
  record.requests = record.requests.filter(time => time > windowStart);
  
  // Check limit
  if (record.requests.length >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.windowStart + windowMs
    };
  }
  
  // Add this request
  record.requests.push(now);
  rateLimitStore.set(key, record);
  
  return {
    allowed: true,
    remaining: maxRequests - record.requests.length,
    resetTime: record.windowStart + windowMs
  };
}

function checkRateLimit(event, action = 'auth') {
  const ip = event.headers['x-forwarded-for'] || 
             event.headers['client-ip'] || 
             'unknown';
  
  const key = `${action}:${ip}`;
  const result = rateLimit(key);
  
  if (!result.allowed) {
    return {
      statusCode: 429,
      headers: { 
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000)
      },
      body: JSON.stringify({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      })
    };
  }
  
  return null; // Not rate limited
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.windowStart < now - RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

module.exports = {
  rateLimit,
  checkRateLimit
};
