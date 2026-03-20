---
name: project_design_system
description: ОРБИТА design system — two parallel CSS files, token naming, font stack, component classes
type: project
---

Two CSS token files exist and are NOT the same palette:

1. `design-system/tokens.css` — Orbitron + Exo 2, light-mode-first (blue/cosmic palette, --color-primary-500:#03A9F4)
2. `design-system.css` — Orbitron + Exo 2, dark-mode-first (violet=light blue #4FC3F7, teal=#00D4B4, pink=#FF2D8A, dark=#03080F)

Most active pages use **design-system.css** (or inline :root redefining the same vars). `tokens.css` is loaded via `nav.js` but its token names (`--color-primary-500` etc.) are NOT used in any page CSS — they are dead.

Pages do NOT load `design-system.css` directly except: council.html, framework-lite.html, rwb-product-os-v3.html, rwb-product-os-v12.html, strategy.html, Бизнесу/index.html.

Every page except the above redefines ALL tokens inline via `<style>` — no single source of truth.

**Why:** Incremental build — each page was created standalone before the design system was formalized.
**How to apply:** Any new page MUST use design-system.css. Existing pages need CSS extraction sprint.

Theme switching: `css/theme-vars.css` loaded by nav.js — overrides all page-level vars for light/dark.

Font stack: Orbitron (headings) + Exo 2 (body). Tracker page uses Manrope (inconsistency).
