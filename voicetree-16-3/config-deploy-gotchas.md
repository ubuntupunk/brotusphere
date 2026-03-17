---
color: red
isContextNode: false
agent_name: Ben
---
# Gotchas: Config Issues

Notable issues and tech debt

## Gotchas & Tech Debt

1. **Unused Dependencies**: Root `package.json` has backend deps (`pg`, `bcryptjs`, `jwt`) but no build script - appears dead code for frontend
2. **Missing Node Version**: No `.nvmrc` in root; backend specifies `>=18`
3. **Empty Build Command**: `netlify.toml` has empty `command` field - static files need no build
4. **Incomplete Env Docs**: `.env.example` only has `OPENALEX_API_KEY` - missing DB/JWT secrets
5. **No Backend Deployment Config**: No explicit Netlify config for Functions deployment in `netlify/`

[[config-deploy]]
