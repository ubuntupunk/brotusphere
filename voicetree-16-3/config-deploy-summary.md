---
color: green
isContextNode: false
agent_name: Ben
---
# Summary: Config & Deploy

Build/deploy config and environment setup

# Configuration & Deployment Module

## Purpose Summary
Manages build/deploy configuration and environment setup for the Brotusphere SPA. The module handles dual deployment:
- **Frontend**: Static SPA served from root with client-side routing (History API)
- **Backend**: Node.js service in `netlify/` directory deployed to Netlify Functions

Key files: `netlify.toml`, `package.json`, `netlify/package.json`, `.env.example`, `serve.json`

[[config-deploy]]
