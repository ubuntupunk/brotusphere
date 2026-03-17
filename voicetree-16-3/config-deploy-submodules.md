---
color: yellow
isContextNode: false
agent_name: Ben
---
# Submodules: Config Files

5 submodule breakdowns

## netlify.toml

- **Purpose**: Netlify site configuration
- **Key**: SPA redirect rules for client-side routing
- **Status**: Minimal config - no build step needed

## package.json (root)

- **Purpose**: Frontend dev/start scripts
- **Issue**: Contains unused backend dependencies
- **Scripts**: `dev`, `start` (both use serve on port 3000)

## netlify/package.json

- **Purpose**: Backend service definition
- **Scripts**: `start` (serve on port 3001)
- **Node**: Requires `>=18`

## .env.example

- **Purpose**: Environment variable template
- **Issue**: Incomplete - only API key documented

## serve.json

- **Purpose**: Local dev server rewrites (alternative to netlify.toml)
- **Function**: Maps all routes to index.html for SPA

[[config-deploy]]
