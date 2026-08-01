# Plazir-15 Fan Codex

Unofficial, non-commercial fan documentation site for the *Star Wars* canon planet **Plazir-15** (Outer Rim / New Territories). Design homage to the bright bio-dome utopia seen in *The Mandalorian* — not an official Lucasfilm or Disney product.

## Live

- **GitHub repo:** https://github.com/VeigaPunk/plazir-15-site  
- **GitHub Pages (after Actions deploy):** https://veigapunk.github.io/plazir-15-site/  
- Deploy: push to `main` runs `.github/workflows/pages.yml` (GitHub Pages via Actions).

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

- Skip link, semantic landmarks, keyboard focus styles
- Mobile nav with `aria-expanded` / Escape to close
- Ballot demo uses live region status updates
