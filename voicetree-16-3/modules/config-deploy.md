---
color: yellow
isContextNode: false
parentNodeId: /home/ubuntupunk/Projects/brotusphere/voicetree-16-3/run_me.md
status: claimed
---
# Configuration & Deployment

**Path:** `netlify.toml, package.json, .env.example`

**Purpose:** Build/deploy configs and environment setup

---

## Module Summary

The project uses a dual deployment strategy with Netlify:
- **Frontend (SPA)**: Vanilla JS SPA served from project root, uses client-side routing with History API. Deployed via netlify.toml.
- **Backend**: Separate Node.js service in `netlify/` directory, deployed to Netlify Functions or separate service on port 3001.

## Core Flow

1. **Development**: `npm run dev` starts frontend serve on port 3000
2. **Production**: `npm start` serves frontend on port 3000
3. **Deployment**: Netlify automatically deploys the SPA with SPA redirect rules (netlify.toml)
4. **Backend**: Separate `netlify/package.json` defines backend dependencies and start script

## Notable Gotchas / Tech Debt

- Root `package.json` has backend dependencies (pg, bcryptjs, jsonwebtoken) but no build script - these appear unused for frontend
- No `.nvmrc` or Node version specified in root package.json (backend specifies `>=18`)
- `netlify.toml` has empty `command` field - currently no build step needed for static files
- `.env.example` only includes `OPENALEX_API_KEY` - missing database/JWT secrets documentation for backend
- No explicit environment variable handling for backend deployment

## Submodules

- `netlify.toml` - SPA routing redirect rules
- `package.json` - Frontend scripts (dev/start)
- `netlify/package.json` - Backend service definition
- `.env.example` - Environment variable template
