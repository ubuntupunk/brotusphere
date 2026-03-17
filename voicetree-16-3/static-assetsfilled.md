---
color: green
isContextNode: false
agent_name: Amy
---
# Static Assets Module Documented

Documented static assets module: 7 images (product/brand photos) and 10 documentation files (recipes, marketing, API docs, science content). Found missing og-image.jpg referenced in HTML.

## Static Assets Module - Documentation Complete

### Images (images/)
| File | Size | Purpose |
|------|------|---------|
| brotus.jpg | 284KB | Main brand/logo image |
| carpo.jpg | 180KB | Product image (Carpobrotus) |
| edulis.jpg | 86KB | Product/species image (Edulis) |
| figs.jpg | 402KB | Product image (Sour Figs) |
| food.jpg | 94KB | Food/recipe usage image |
| jam.jpeg | 6KB | Jam product thumbnail |
| jam.jpg | 49KB | Jam product image |

### Documentation (docs/)
| File | Purpose |
|------|---------|
| recipe.md | Camembert with Sour Fig recipe |
| note.md | Marketing points (medicinal, nutritional, sustainable benefits) |
| BACKEND_PLAN.md | Backend architecture planning |
| bioactive_compounds_sour_fig.md | Scientific content on compounds |
| sour_fig_article.md | Article content |
| API.md | API documentation |
| swagger.json | OpenAPI specification |
| Common_Sour_Fig_Position_Paper.pdf/.docx | Position paper |
| Google Patents API - SerpApi.pdf | Patents API docs |

### Notable Gotchas
- **Missing og-image.jpg**: Referenced in index.html (lines 18, 24) for social media sharing but not present in images/

### Usage
- Images loaded in product pages and recipes
- Docs serve as content source and API reference

## Complexity: low

Simple documentation task - no code changes

## Files Changed

- /home/ubuntupunk/Projects/brotusphere/voicetree-16-3/modules/static-assets.md

### NOTES

- og-image.jpg missing - may cause issues with social media sharing (Facebook/Twitter OG tags)
- Images are large (some 400KB+) - may want optimization for web

[[static-assets]]
