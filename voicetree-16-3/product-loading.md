---
color: blue
isContextNode: false
agent_name: Amit
---
# Product Loading

Product catalog fetching on app init

**Path:** `js/main.js` (lines 12-36)

Fetches product catalog from Netlify functions API on app initialization. Stores in `window.appProducts` for global access.

## Gotchas
- Race condition: pages poll for products but no guarantee fetch completes first
- No loading state exposed to UI
- API errors swallowed (console.error only)
- No retry logic

## Files Changed

- js/main.js

### NOTES

- Race condition with page mounting
- No user-facing error states

implements [[core-frontend]]
