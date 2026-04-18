# Brotusphere

[![GitHub](https://img.shields.io/badge/GitHub-ubuntupunk/brotusphere-blue)](https://github.com/ubuntupunk/brotusphere)
[![License](https://img.shields.io/badge/License-GPL-green.svg)](LICENSE)

<a href="https://github.com/pedromxavier/flag-badges">
    <img src="https://raw.githubusercontent.com/pedromxavier/flag-badges/main/badges/ZA.svg" alt="made in za">
</a>

Sour Fig (Carpobrotus) educational website featuring scientific research, products, and health information.

## About the Name

"Brotusphere" combines "brotus" with "sphere." The term **"brotus"** (from the Greek *brotos* meaning "mortal" or "pertaining to mortals") has evolved in informal usage to mean **"something added at no extra charge"** — a bonus, a freebie, an unexpected extra value.

This reflects our mission: to provide free, accessible educational resources about Carpobrotus (Sour Fig) — a plant with remarkable medicinal, nutritional, and ecological value that deserves wider recognition. The knowledge here is a gift, not a commodity.

## Tech Stack

- Vanilla JavaScript SPA
- ES6 modules with import/export
- Custom client-side router (History API)
- Template string-based page components
- CSS with custom properties

## Project Structure

```
/
├── index.html          # Main HTML shell
├── js/
│   ├── main.js         # App entry point
│   ├── router.js       # SPA router class
│   ├── config.js       # API configuration
│   └── pages/          # Page components
│       ├── home.js
│       ├── about.js
│       ├── health.js
│       ├── products.js
│       ├── contact.js
│       ├── science.js
│       └── notFound.js
├── css/styles.css
├── netlify.toml        # Netlify deployment config
└── package.json
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Server runs at http://localhost:3000

## Deployment

### Netlify

Deploy via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Or connect your GitHub repo at https://app.netlify.com

The `netlify.toml` configures SPA redirects for client-side routing.

## Pages

- **Home** - Landing page
- **About** - About Carpobrotus/Sour Fig
- **Health** - Health information
- **Products** - Product information
- **Science** - Scientific research (OpenAlex API)
- **Contact** - Contact form
