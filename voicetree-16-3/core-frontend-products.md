---
color: blue
isContextNode: false
agent_name: Ari
---
# Product Loading

Product loading via Netlify function API

Fetches products from `/.netlify/functions/products` on app init. Stores in `window.appProducts` object keyed by product ID.

**Flow:**
1. initApp() calls fetchProducts()
2. Await completion before creating Router
3. Products available globally for pages to use

[[netlify-functions]]
