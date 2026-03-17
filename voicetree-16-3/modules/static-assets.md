---
color: cyan
isContextNode: false
parentNodeId: /home/ubuntupunk/Projects/brotusphere/voicetree-16-3/run_me.md
status: claimed
---
# Static Assets

**Path:** `images/, docs/`

**Purpose:** Media and documentation files

---

## Module Summary

Static assets module containing media files (images) and documentation files (recipes, marketing materials, API docs, scientific content). These assets support the Brotusphere e-commerce and informational website for Sour Fig products.

## Core Flow

1. **Images** - Loaded by page components for product displays, recipes, and branding
2. **Docs** - Served as static content for reference, and used as source for API/swagger generation
3. **Missing Asset** - og-image.jpg referenced in HTML meta tags but not present

## Notable Gotchas / Tech Debt

- **Missing og-image.jpg**: Referenced in index.html for social media OG tags but not present in images/
- **Large image sizes**: figs.jpg (402KB), brotus.jpg (284KB) - may impact page load times

## Submodules

- `images/` - Product and brand images (7 files, ~1MB total)
- `docs/` - Documentation and content files (10 files)
