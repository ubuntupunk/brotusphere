---
color: blue
isContextNode: false
agent_name: Amit
---
# UI Modals

Cart, auth, and mobile menu modals

**Path:** `js/main.js` (lines 54-123, 126-171)

UI modals: cart, auth, mobile menu. Uses overlay for modal stacking.

## Gotchas
- Modal state managed via CSS classes only
- No focus trapping in modals
- Overlay click closes all modals
- No keyboard (Escape) handling

## Files Changed

- js/main.js

### NOTES

- No focus trapping
- No keyboard accessibility

implements [[core-frontend]]
