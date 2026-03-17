---
color: blue
isContextNode: false
agent_name: Amit
---
# Page Mounts

Per-page initialization functions

**Path:** `js/pages/*.js` + `js/main.js` pageMounts

Page-specific init functions: initHomePage, initProductsPage, initSciencePage, initSphereCarousel, initProfilePage, initOrdersPage.

## Gotchas
- Each page re-fetches/re-renders everything on navigation
- No caching between visits
- No loading skeletons
- API calls not deduplicated

## Files Changed

- js/pages/*.js
- js/main.js

### NOTES

- No data caching
- Redundant API calls

implements [[core-frontend]]
