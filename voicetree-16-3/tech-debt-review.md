# Brotusphere Gotchas & Tech Debt - Consolidated for Review

> Generated from codebase graph exploration. Review before assigning fixes.

---

## Priority: Critical (Security)

| # | Module | Issue | Location |
|---|--------|-------|----------|
| 1 | Netlify Functions | Weak password hashing - uses simpleHash instead of bcrypt | `netlify/functions/auth.js` |
| 2 | Netlify Functions | Insecure token generation - Base64 encoding, not JWT | `netlify/functions/utils.js` |
| 3 | Netlify Functions | Hardcoded JWT secret 'dev-secret' | `netlify/functions/utils.js:26` |
| 4 | Netlify Functions | No rate limiting on auth endpoints | `netlify/functions/auth.js` |
| 5 | Database Layer | SSL `rejectUnauthorized: false` bypasses cert verification | `netlify/lib/db.js` |
| 6 | Config/Deploy | Incomplete .env.example - missing DB/JWT secrets | `.env.example` |

---

## Priority: High (Reliability/Performance)

| # | Module | Issue | Location |
|---|--------|-------|----------|
| 7 | Core Frontend | Race condition - products fetched async, pages poll window.appProducts | `js/main.js` |
| 8 | Core Frontend | Event listener duplication - no cleanup on route change | `js/router.js:125-147` |
| 9 | Core Frontend | Global state window.appCart, window.appProducts - no proper state mgmt | `js/main.js` |
| 10 | Page Components | Event listener reinit on every nav - inefficient, duplicates possible | `js/router.js` |
| 11 | Page Components | No cleanup on unmount - listeners accumulate | All pages |
| 12 | Database Layer | No transaction wrapper - manual begin/commit/rollback error-prone | `netlify/lib/db.js` |
| 13 | Database Layer | No connection string validation - cryptic errors if missing | `netlify/lib/db.js` |
| 14 | Netlify Functions | Duplicate order logic in orders.js and paypal.js | `netlify/functions/orders.js`, `paypal.js` |

---

## Priority: Medium (Maintainability)

| # | Module | Issue | Location |
|---|--------|-------|----------|
| 15 | Page Components | No component system - just template strings | All pages |
| 16 | Page Components | Global state coupling - window.appProducts | `js/pages/home.js:121` |
| 17 | Page Components | Hardcoded API base `/.netlify/functions` | `js/pages/home.js:102` |
| 18 | Page Components | Inconsistent init patterns - only 6/10 pages have init | Various pages |
| 19 | Core Frontend | Hardcoded API base in main.js | `js/main.js` |
| 20 | Core Frontend | No error boundaries - failed API calls not shown to user | `js/main.js` |
| 21 | Database Layer | No query parameterization validation | `netlify/lib/db.js` |
| 22 | Database Layer | Missing connection pool limits | `netlify/lib/db.js` |
| 23 | Database Layer | No prepared statement caching | `netlify/lib/db.js` |
| 24 | Netlify Functions | Admin key exposure - x-admin-key header without middleware | Multiple functions |
| 25 | Config/Deploy | Unused Dependencies - root package.json has backend deps | `package.json` |
| 26 | Config/Deploy | Missing Node version .nvmrc | Root |
| 27 | Config/Deploy | No explicit Netlify Functions deployment config | `netlify/` |

---

## Priority: Low (Enhancement)

| # | Module | Issue | Location |
|---|--------|-------|----------|
| 28 | Database Layer | Hardcoded sample products - image URLs never populated | `netlify/lib/schema.sql` |
| 29 | Config/Deploy | Empty build command in netlify.toml | `netlify.toml` |

---

## Summary by Module

| Module | Gotcha Count |
|--------|---------------|
| Netlify Functions | 6 |
| Database Layer | 7 |
| Page Components | 6 |
| Core Frontend | 5 |
| Config/Deploy | 5 |
| **Total** | **29** |

---

## Next Steps

- [ ] Review and prioritize
- [ ] Assign critical/high items to agents
- [ ] Create tracking issues
