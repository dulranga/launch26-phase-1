---
name: sci-fi-wrapper
description: Generate wrapper components for shadcn UI elements and apply sci‑fi PNG borders to them. This skill automates creating files in `src/ui/` that import the base components from `src/components/ui/`, add the required classNames, and overlay PNG border assets for cards, buttons, etc.
---

This skill:
1. Ensures `shadcn` components are installed in `src/components/ui/` (runs `npx shadcn@latest init` if missing).
2. For each requested component (e.g., Button, Card, Input, Dialog), creates a wrapper file in `src/ui/` that:
   - Imports the original component.
   - Accepts the same props and spreads them.
   - Adds Sci‑Fi specific Tailwind classes.
   - Renders an `<img>` element with the PNG border positioned absolutely behind the component (or uses CSS `background-image` with the PNG).
3. Updates `tailwind.config.js` to include custom colors, border utilities, and background‑image utilities for the PNG borders.
4. Optionally generates an index file (`src/ui/index.ts`) that re‑exports all wrappers for easy import.

The skill can be invoked with a list of component names and optional border PNG paths, e.g.:
```
Create wrappers for Button, Card with borders at assets/borders/button.png and assets/borders/card.png
```