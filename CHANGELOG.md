# Changelog

Unofficial Plazir-15 fan codex. Dates are ship days on `main`.

## 2026-08-01

- Initial single-page fan codex (astrography, world, government, history, ballot demo, sources).
- Dual sources: Wookieepedia (primary) + Grokipedia (S3 context).
- Episode title: *The Mandalorian* **Chapter 22: Guns for Hire**.
- Live host via user GitHub Pages: https://veigapunk.github.io/
- Dual remotes: `plazir-15-site` + `VeigaPunk.github.io`.
- A11y: skip link, mobile nav focus trap, hash focus, contrast preferences.
- No third-party font CDN; system type stacks only.
- Ops: `scripts/smoke.sh`, `scripts/deploy.sh`, `.well-known/security.txt`.
- Schema.org `@graph` (WebSite, Place, WebPage); `prefers-reduced-data` hides hero decoration.
- CI smoke workflow (no Pages dependency); portable smoke without requiring `rg`.
- Progressive share button; charter ballot demo persists in `sessionStorage` only.
- Print control; themed scrollbars; share status auto-clears for AT noise reduction.
