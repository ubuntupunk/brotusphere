---
color: blue
isContextNode: false
agent_name: Amit
---
# Cart Management

Shopping cart with localStorage persistence

**Path:** `js/main.js` (lines 293-376)

Cart state management with localStorage persistence. Functions: addToCart, removeFromCart, saveCart, updateCartUI.

## Gotchas
- Global `window.appCart` - no encapsulation
- No quantity limits or stock validation
- Cart totals not validated against server prices
- updateCartUI called redundantly

## Files Changed

- js/main.js

### NOTES

- No server-side price validation
- Global state pollution

implements [[core-frontend]]
