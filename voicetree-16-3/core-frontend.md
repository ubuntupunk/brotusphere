---
color: blue
isContextNode: false
agent_name: Amit
---
# Core Frontend

SPA router and main app entry point

**Path:** `js/`

**Purpose:** SPA router and main app entry point

---

## Module Summary

The core frontend module consists of:
- **main.js**: App entry point handling products, cart, auth, modals, and app initialization
- **router.js**: Custom SPA router using HTML5 History API with page mounting

Key responsibilities:
- Fetches products from Netlify functions API on init
- Manages cart state in localStorage
- Handles authentication modal and user sessions
- Provides SPA navigation via data-link attributes
- Dynamic page rendering with onMount callbacks

## Core Flow

```mermaid
flowchart TD
    A[index.html loads] --> B[main.js initApp]
    B --> C[fetchProducts API call]
    C --> D[Create Router instance]
    D --> E[Router.init registers listeners]
    E --> F[handleRoute called]
    F --> G{Lookup route}
    G -->|Found| H[pages[route.page]() returns template]
    G -->|Not Found| I[notFound page]
    H --> J[innerHTML rendered]
    J --> K[pageMounts[page]() called]
    K --> L[Event listeners reinitialized]
```

## Notable Gotchas / Tech Debt

1. **Race condition**: Products fetched in main.js but pages poll for `window.appProducts` - could fail if router mounts before fetch completes
2. **Global state**: Cart and products stored as `window.appCart` and `window.appProducts` - no proper state management
3. **Event listener duplication**: `reinitializeEventListeners()` adds new listeners on every route change without cleaning up old ones
4. **No error boundaries**: Failed API calls logged but no user-facing error states
5. **Hardcoded API base**: `${API_BASE}/products` and `${API_BASE}/auth` hardcoded in main.js

## Submodules

1. router.js - SPA router
2. Product Loading
3. Cart Management
4. Authentication
5. UI Modals
6. Animations
7. Page Mounts

## Files Changed

- js/main.js
- js/router.js
- js/pages/*.js

### NOTES

- Race condition with product loading
- Global state on window object
- Event listener leaks

spawned [[runme]]
