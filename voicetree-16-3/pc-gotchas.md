---
color: green
isContextNode: false
agent_name: Anna
---
# Gotchas & Tech Debt

Identified 6 tech debt items: no component system, event reinit issues, global coupling, inconsistent init patterns

## Notable Gotchas / Tech Debt

1. **No component system** - Just template strings, no props/state
2. **Event listener reinit on every nav** - Inefficient, duplicates possible
3. **Global state coupling** - `home.js:121` uses `window.appProducts`
4. **Inconsistent init patterns** - Only 6/10 pages have init functions
5. **No cleanup on unmount** - Listeners accumulate
6. **Hardcoded API base** (`home.js:102`) - `/.netlify/functions` baked in

## Complexity: low

Documentation-only task

### NOTES

- router.js:125-147 reinitializes all event listeners on every navigation

fills in [[page-components]]
