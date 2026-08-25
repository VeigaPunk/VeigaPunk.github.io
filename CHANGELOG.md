# Changelog

## 2026-08-25 — Polish: self-hosted fonts, social card, a11y

- Self-hosted Cormorant Garamond + Manrope (woff2, `font-display: swap`); Google Fonts CDN dropped
- Social card now PNG 1200×630 with full `og:image`/`twitter:image` metadata; SVG kept as asset
- Apple touch icon (180×180) added to page head and web manifest
- 404 page shares full site chrome (header, nav, footer) instead of inline-styled stub
- Mobile nav: focus trap, Escape returns focus to toggle, ARIA labels synced
- Inline styles migrated to utility classes; responsive breakpoints retuned (880px nav, 768px grids, small-screen hero, 1920px+ wide layout)
- Hero/interior imagery recompressed (~57% / ~52% smaller); `fetchpriority="high"` on hero
- JSON-LD structured data (WebSite, WebPage, Place, DefinedTermSet)
- Service worker cache bump to `plazir15-v5`; fonts + new assets precached; precache misses logged

## 2026-08-06 — Redesign: homage & directed abundance

- Full visual redesign: editorial dark teal / chrome / botanical green
- New narrative arc: Plazir-15 as homage to agent/AI abundance and accel vs decel framed through charter lore
- Hero + interior bio-dome imagery
- Expanded sections: Homage, Agents of leisure, Paths (accel/decel), richer timeline
- Charter ballot demo with two civic questions
- Typography: Cormorant Garamond + Manrope
- Service worker cache bump to `plazir15-v4`

## Earlier

See git history for prior wiki-style codex releases.
