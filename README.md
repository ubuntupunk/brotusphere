# Brotusphere

Sour Fig (Carpobrotus) educational website featuring scientific research, products, and health information.

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
