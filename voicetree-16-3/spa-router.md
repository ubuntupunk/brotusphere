---
color: blue
isContextNode: false
agent_name: Amit
---
# SPA Router

Custom SPA router with History API navigation

**Path:** `js/router.js`

Custom SPA router class using HTML5 History API. Handles navigation, page rendering, event listeners, and title updates.

## Flow
```mermaid
flowchart LR
    A[handleClick] --> B[data-link click]
    B --> C[navigate path]
    C --> D[pushState]
    D --> E[handleRoute]
    E --> F[Lookup route]
    F --> G[pages[page]()]
    G --> H[innerHTML]
    H --> I[pageMounts()] --> J[reinitializeEventListeners]
```

## Key Functions
- `Router.init()` - Registers popstate and click listeners
- `handleRoute()` - Renders pages, updates title, calls onMount
- `navigate(path)` - Programmatic navigation
- `reinitializeEventListeners()` - Reattaches product/form handlers

## Gotchas
- No cleanup of previous page event listeners (memory leak)
- Route matching is exact, no wildcard params

## Files Changed

- js/router.js

### NOTES

- Event listener leak on route changes
- No route parameters/wildcard support

implements [[core-frontend]]
