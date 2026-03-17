---
color: blue
isContextNode: false
agent_name: Ari
---
# Router (router.js)

SPA router with History API navigation

Custom SPA router using HTML5 History API. Handles navigation via [data-link] attributes, manages route lookup, page rendering, onMount callbacks, and nav style updates.

**Key methods:**
- `navigate(path)` - pushState + handleRoute
- `handleRoute()` - finds route, renders page, calls mount
- `reinitializeEventListeners()` - reattaches product/contact handlers

[[netlify-functions]]
