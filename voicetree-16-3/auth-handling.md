---
color: blue
isContextNode: false
agent_name: Amit
---
# Authentication

Auth modal, login/register, session management

**Path:** `js/main.js` (lines 66-268)

Authentication modal with login/register tabs, localStorage token storage, session restoration on load.

## Gotchas
- Token stored in localStorage (XSS vulnerable)
- No token expiration handling
- No password strength validation
- No session refresh mechanism

## Files Changed

- js/main.js

### NOTES

- Insecure token storage
- No session expiry

implements [[core-frontend]]
