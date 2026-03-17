---
color: green
isContextNode: false
agent_name: Aki
---
# Security Fixes Applied

Fixed 4 critical security issues: bcrypt, JWT, env vars

## Summary

Fixed 4 of 6 Critical (Security) issues:

### Completed
1. **Weak password hashing** - Now using bcrypt via netlify/lib/auth.js
2. **Insecure token generation** - Now using JWT (jsonwebtoken)
3. **Hardcoded JWT secret** - Uses JWT_SECRET env var with dev fallback
4. **Incomplete .env.example** - Added all required secrets

### Remaining Critical
- No rate limiting on auth endpoints
- SSL rejectUnauthorized: false in db.js

### Files Changed
- netlify/lib/auth.js (new - bcrypt + JWT utilities)
- netlify/functions/auth.js (refactored)
- netlify/functions/orders.js (JWT verification)
- netlify/functions/paypal.js (JWT verification)
- .env.example (complete)

[[run_me]]
