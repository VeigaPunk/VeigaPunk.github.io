# Plazir-15 Fan Codex

Unofficial, non-commercial fan documentation site for the *Star Wars* canon planet **Plazir-15** (Outer Rim / New Territories). Design homage to the bright bio-dome utopia seen in *The Mandalorian* — not an official Lucasfilm or Disney product.

## Live

| Host | URL |
|------|-----|
| **Primary (user GitHub Pages)** | https://veigapunk.github.io/ |
| Source repo | https://github.com/VeigaPunk/plazir-15-site |
| User-site mirror repo | https://github.com/VeigaPunk/VeigaPunk.github.io |

`main` is pushed to **both** remotes. The `username.github.io` repo is the unblock path when project-site Actions Pages needs a one-time Settings enable.

### Project-site Pages (optional mirror)

`.github/workflows/pages.yml` deploys project Pages at  
https://veigapunk.github.io/plazir-15-site/ after **Settings → Pages → Source → GitHub Actions**.  
See [Issue #1](https://github.com/VeigaPunk/plazir-15-site/issues/1).

## Open locally

**Option A — static open**

```bash
# From this directory
xdg-open index.html   # Linux
# or open index.html in your browser
```

**Option B — local server (recommended for clean asset paths)**

```bash
python3 -m http.server 8765
# then visit http://127.0.0.1:8765/
```

**Deploy (dual remote)**

```bash
./scripts/deploy.sh
# pushes main → origin (plazir-15-site) and pages-user (VeigaPunk.github.io)
```

**Smoke (local-first)**

```bash
./scripts/smoke.sh          # files + content + local HTTP
SMOKE_LIVE=1 ./scripts/smoke.sh   # also hit https://veigapunk.github.io/
```

Files:

| Path | Role |
|------|------|
| `index.html` | Single-page site |
| `styles.css` | Art direction (domed utopia / chrome + tropical green) |
| `main.js` | Nav + charter ballot demo (client-only) |
| `assets/*.svg` | Icon placeholders (dome, droid, hyperloop, landing, ballot) |

## Fan disclaimer

This project is a **fan-made informational site**. *Star Wars* and related names, characters, and settings are trademarks and copyright of **Lucasfilm Ltd. / Disney**. No ownership is claimed; this is not endorsed by the rightsholders. Content is for non-commercial documentation and design homage only.

## Sources (dual)

1. **Wookieepedia (primary — planet stats)**  
   [Plazir-15](https://starwars.fandom.com/wiki/Plazir-15)  
   Cite on site: **Source: Wookieepedia (CC-BY-SA fan summary)**

2. **Grokipedia (secondary — Season 3 / episode context)**  
   - [The Mandalorian Season 3](https://grokipedia.com/page/the_mandalorian_season_3) (Plazir-15 / S3 framing)  
   - [Grokipedia hub](https://grokipedia.com/)  
   Cite on site: **Source: Grokipedia (secondary / episode context)**

**On-screen appearance:** *Star Wars: The Mandalorian* — **Chapter 22: Guns for Hire** (Season 3; series chapter 22). Official title is **Guns for Hire**, not “Gunslingers.”

Wookieepedia articles are generally available under Creative Commons Attribution-ShareAlike; this site is a short original fan summary and UI, not a full article dump. Prefer Wookieepedia for planet data; Grokipedia for S3/episode framing when available.

## Accessibility notes

- Skip link focuses `#main` (`tabindex="-1"`); keyboard focus rings on `:focus-visible`
- Semantic landmarks, table `scope`, labeled radiogroup, ballot `aria-live` + `aria-atomic`
- Mobile nav: `aria-expanded` / `aria-hidden` / `tabindex` sync, Escape + outside click, Tab cycle, body scroll lock
- `prefers-reduced-motion` and `prefers-contrast: more` supported
- Decorative images `alt=""`; brand name exposed via `aria-label` on home link
