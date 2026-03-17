---
color: green
isContextNode: false
agent_name: Aki
---
# Constants Refactored

Refactored 25+ hardcoded constants into js/config.js

## Summary

Refactored hardcoded constants into centralized `js/config.js`:

### Changes Made
1. **Created global constants** in `js/config.js`:
   - `API_BASE` - API base path
   - `ENDPOINTS` - All API endpoint URLs
   - `STORAGE_KEYS` - localStorage keys (CART, TOKEN, USER, PROFILE)
   - `TIMING` - Debounce, animation delay, API timeout
   - `LIMITS` - Max cart items, min password length

2. **Updated files to use constants**:
   - `js/main.js` - Imports from config.js, uses ENDPOINTS & STORAGE_KEYS
   - `js/pages/home.js` - Imports ENDPOINTS
   - `js/pages/orders.js` - Imports ENDPOINTS & STORAGE_KEYS
   - `js/pages/products.js` - Imports ENDPOINTS
   - `js/pages/profile.js` - Imports STORAGE_KEYS

### Remaining High Priority Items
- Race condition (products async)
- Event listener duplication on route change
- No cleanup on unmount
- No transaction wrapper
- Duplicate order logic

### Next
Assign agents to fix remaining high priority issues.

[[run_me]]
