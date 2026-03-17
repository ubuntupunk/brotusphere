---
color: orange
isContextNode: false
parentNodeId: /home/ubuntupunk/Projects/brotusphere/voicetree-16-3/run_me.md
status: claimed
---
# Netlify Functions

**Path:** `netlify/functions/`

**Purpose:** Serverless backend API endpoints

---

## Module Summary

Serverless backend API endpoints for the Brotusphere e-commerce application. Handles authentication (signup/login), product management, order processing with PayPal integration, order tracking, and database initialization. Uses PostgreSQL (Neon) as the database backend.

## Core Flow

1. **auth.js** - User registration and login with token-based sessions
2. **products.js** - Product catalog retrieval and admin creation
3. **orders.js** - Authenticated order creation and order history
4. **paypal.js** - PayPal payment flow (create order, capture payment, refunds)
5. **track.js** - Public order tracking by order ID and email
6. **init-db.js** - Database schema setup and seed data
7. **utils.js** - Shared cookie parsing and response helpers

## Notable Gotchas / Tech Debt

- **Weak password hashing**: Uses simple hash function (`simpleHash`) instead of bcrypt
- **Insecure token generation**: Base64 encoding of user ID + timestamp, not proper JWT
- **Duplicate order logic**: Order creation duplicated in `orders.js` and `paypal.js`
- **Hardcoded JWT secret**: Default 'dev-secret' in `utils.js:26`
- **No rate limiting**: Auth endpoints vulnerable to brute force
- **Admin key exposure**: `x-admin-key` header check without proper middleware

## Submodules

| File | Purpose | Key Endpoints |
|------|---------|---------------|
| `auth.js` | User authentication | POST `/auth?action=signup`, POST `/auth?action=login` |
| `products.js` | Product catalog | GET `/products`, POST `/products` (admin) |
| `orders.js` | Order management | GET `/orders`, POST `/orders` |
| `paypal.js` | Payment processing | POST `/paypal?action=create-order`, `capture-order`, `refund` |
| `track.js` | Order tracking | GET `/track?orderId=&email=` |
| `init-db.js` | Database setup | POST `/init-db` |
| `utils.js` | Shared utilities | Cookie parsing, token verification, response helpers |
