# AGENTS.md - Brotusphere Development Guide

## Project Overview

Brotusphere is a vanilla JavaScript SPA featuring:
- ES6 modules with import/export
- Custom client-side router using History API
- Template string-based page components
- CSS with CSS custom properties for theming

## Project Structure

```
/                         # Root
├── index.html            # Main HTML shell
├── js/
│   ├── main.js           # App entry point
│   ├── router.js         # SPA router class
│   └── pages/            # Page components (export functions)
│       ├── home.js, about.js, health.js
│       ├── products.js, contact.js
│       ├── science.js    # API calls to Semantic Scholar, USPTO, ClinicalTrials.gov
│       └── notFound.js
├── css/styles.css
├── package.json
└── SPEC.md
```

---

## Commands

```bash
npm run dev      # Start dev server on port 3000
npm start       # Start production server on port 3000

# When tests are added:
npm test                      # Run all tests
npm test -- tests/file.test.js # Run single test
npm test -- --watch          # Watch mode
```

---

## Code Style Guidelines

### JavaScript

#### Imports
```javascript
// Correct
import Router from './router.js';
import { home } from './pages/home.js';

// Avoid
import * as Pages from './pages/home.js';
```

#### Naming Conventions
- **Files**: kebab-case (`main.js`, `router.js`)
- **Classes**: PascalCase (`Router`, `CartManager`)
- **Functions/variables**: camelCase (`initAnimations()`, `cartItems`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS`, `API_BASE_URL`)

#### Functions
- Use async/await for asynchronous operations
- Always handle errors with try/catch for API calls

```javascript
async function fetchPapers() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error('Error fetching papers:', error);
        return [];
    }
}
```

#### Template Strings
Page components must return template strings as functions:

```javascript
export function home() {
    return `
<div class="page" id="page-home">
    <h1>Welcome</h1>
</div>
    `;
}
```

---

### CSS

- Use CSS custom properties for colors/spacing
- Mobile-first responsive approach
- BEM-like naming: `.block__element--modifier`

```css
:root {
    --primary: #2D5016;
    --secondary: #F4A259;
}

.button {
    padding: var(--spacing-md);
    background: var(--primary);
}
```

---

### HTML Attributes

- Use `data-*` attributes for JavaScript hooks
- Use `data-link` for SPA navigation
- Use `data-product` for product buttons

```html
<a href="/about" data-link>About</a>
<button data-product="1">Add to Cart</button>
```

---

## Page Component Guidelines

### Creating a New Page

1. Create `js/pages/[pagename].js`
2. Export a function returning the page HTML template:

```javascript
export function pageName() {
    return `
<div class="page" id="page-pagename">
    <!-- Page content -->
</div>
    `;
}
```

3. Register in `js/router.js`:

```javascript
import { pageName } from './pages/pagename.js';

const pages = {
    // ...existing pages
    pageName
};
```

4. Add route in `js/main.js`:

```javascript
const router = new Router({
    '/pagename': { page: 'pageName' }
});
```

5. Add nav link to `index.html` (nav and mobile-menu)

---

## Error Handling

- Wrap async operations in try/catch
- Provide fallback data for failed API calls

```javascript
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch failed:', error);
        return null;
    }
}
```

---

## Browser Compatibility

- Target: Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses ES6 modules, async/await, Template Literals

---

## Git Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit: `git add . && git commit -m "Description"`
3. Push: `git push origin main`

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Add new page | Create `js/pages/[name].js`, register in router |
| Add new route | Add to router config in `js/main.js` |
| Add nav link | Update `index.html` nav and mobile-menu |
