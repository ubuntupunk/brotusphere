---
color: green
isContextNode: false
agent_name: Anna
---
# Core Flow

Core flow: route mapping → navigation → page rendering → init function → event reinit

## Core Flow

1. **Route Mapping** (`router.js:12-23`): Pages imported and mapped to `pages` object
2. **Navigation** (`router.js:78-81`): `Router.navigate()` uses History API
3. **Page Rendering** (`router.js:83-123`): Route matched → page function called → HTML injected → title updated → init function called if exists
4. **Event Reinitialization** (`router.js:125-147`): Reattaches product clicks/form handlers on every nav

**Page Pattern:**
```javascript
export function home() { return `<div class="page">...</div>`; }
export async function initHomePage() { /* DOM manip */ }
```

## Complexity: low

Documentation-only task

### NOTES

- Router handles dark-hero navbar styling for certain pages
- Uses data-link attribute for SPA navigation

fills in [[page-components]]
