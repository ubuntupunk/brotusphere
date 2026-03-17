---
color: blue
isContextNode: false
agent_name: Ama
---
# Core Frontend Explored

Core Frontend - SPA router + 10 page components + global state via window

## Summary

The Core Frontend module implements a vanilla JavaScript SPA with:
- **Custom SPA Router** using History API (`js/router.js`)
- **10 Page Components** exported as template string functions (`js/pages/*.js`)
- **Global State Management** via window properties (cart, products, user)
- **Authentication Flow** with localStorage tokens
- **Cart Management** persisted to localStorage

**Key Entry Point**: `js/main.js` - orchestrates app init, fetches products, creates router

## Core Flow

```mermaid
flowchart TD
    A[index.html] --> B[main.js: initApp]
    B --> C[fetchProducts from /products API]
    C --> D[window.appProducts populated]
    D --> E[new Router with routes config]
    E --> F[router.handleRoute on popstate/click]
    F --> G[pages[pageName]() returns template]
    G --> H[pageContainer.innerHTML = template]
    H --> I[pageMounts[pageName]() runs init]
    I --> J[reinitializeEventListeners for data-*]
```

## Notable Gotchas / Tech Debt

1. **Monolithic main.js** - 425 lines mixing state, events, API, routing
2. **Global window state** - `window.appProducts`, `window.appCart` scattered
3. **Race condition risk** - Pages poll for products with setTimeout
4. **Event listener leaks** - `reinitializeEventListeners()` adds new listeners without cleanup
5. **No state management** - Auth state duplicated in localStorage and variables
6. **Hardcoded API base** - Repeated in multiple files
7. **Console.log debugging** - Heavy debug logging in production

## Submodules

| # | Submodule | Path | Purpose |
|---|-----------|------|---------|
| 1 | **Router** | `js/router.js` | SPA routing with History API |
| 2 | **Page Components** | `js/pages/*.js` | 10 page templates |
| 3 | **State Management** | `main.js` | Cart, products in window globals |
| 4 | **API Integration** | `main.js:fetchProducts` | Product fetching |
| 5 | **Event System** | main.js + router.js | Modal, cart, nav handlers |
| 6 | **Animation** | `main.js:initAnimations` | IntersectionObserver fade-in |
| 7 | **Auth Flow** | `main.js` | Login/register with JWT |

## Diagram

```mermaid
flowchart TD
    A[index.html] --> B[main.js initApp]
    B --> C[fetchProducts API]
    C --> D[Router created]
    D --> E[handleRoute]
    E --> F[pages[page]() template]
    F --> G[innerHTML rendered]
    G --> H[pageMounts[page]() init]
```

### NOTES

- No TypeScript - vanilla JS only
- No testing framework
- CSS in separate file

[[core-frontend]]
