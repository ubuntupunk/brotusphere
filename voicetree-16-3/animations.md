---
color: blue
isContextNode: false
agent_name: Amit
---
# Animations

Fade-in animations with IntersectionObserver

**Path:** `js/main.js` (lines 382-396)

IntersectionObserver-based fade-in animations for elements with `.fade-in` class.

## Gotchas
- Observer never disconnected (cleanup on navigation)
- Stagger delay uses index from all observed elements
- No reduced-motion support

## Files Changed

- js/main.js

### NOTES

- Memory leak - observer not disconnected
- No accessibility support

implements [[core-frontend]]
