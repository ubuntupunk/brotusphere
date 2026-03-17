---
color: green
isContextNode: false
parentNodeId: /home/ubuntupunk/Projects/brotusphere/voicetree-16-3/run_me.md
status: claimed
---
# Page Components

**Path:** `js/pages/`

**Purpose:** All page UI components (home, about, health, products, etc.)

---

## Module Summary

Page components in `js/pages/` export template string functions and optional init* functions.

Each page:
- Returns HTML template string via default export function
- May export init* function called after router renders the page
- Uses BEM-like class naming and CSS custom properties

Pages: home, about, health, products, contact, science, sphere, profile, orders, notFound

## Core Flow

```mermaid
flowchart LR
    subgraph "Router"
        A[handleRoute] --> B[pages[pageName]()]
    end
    subgraph "Page Component"
        B --> C[Return template string]
        C --> D[innerHTML = template]
    end
    subgraph "Init Function"
        D --> E[initPageName called]
        E --> F[DOM manipulation / API calls]
    end
```

## Notable Gotchas / Tech Debt

1. **Duplicate getEmoji**: Function copied in main.js, home.js, products.js - should be shared utility
2. **Race condition**: Pages poll for `window.appProducts` using setTimeout - fragile pattern
3. **No loading states**: Pages show "Loading..." then jump to content
4. **Inline event handlers**: init* functions attach click handlers inline rather than via delegation
5. **Hardcoded API_BASE**: Each page that needs API defines its own API_BASE constant

## Submodules

1. **home.js** - Landing page with hero, about section, features, products preview
2. **products.js** - Shop grid with all products, stock warnings
3. **science.js** - Scientific research page calling external APIs (Semantic Scholar, etc.)
4. **sphere.js** - Articles/library carousel page
5. **profile.js** - User profile with initProfilePage for protected content
6. **orders.js** - Order history with initOrdersPage
7. **Static pages** - about, health, contact, notFound (simple templates)
