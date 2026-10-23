# Mobile audit fix (Lighthouse, Moto G Power, slow 4G)

Copy the `src/` folder over your repo's `src/` (4 files changed), commit, push. GitHub Actions rebuilds.

| Audit finding | Cause in the repo | Fix |
|---|---|---|
| Performance score missing, LCP = NO_LCP, TBT error, FCP 2.6 s, blank first frames | `<main>` content was wrapped in `.tool-transition-container`, which fades from opacity 0 on the FIRST load, so the whole pre-rendered page (h1 included) was invisible at first paint | `src/App.tsx`: wrapper class only applied after a client-side navigation. `src/index.css`: removed `will-change: opacity` |
| Popular chips cut off ("Percentage" clipped, sideways scroll) | `.cs-popular-row` was a horizontal scroller | `src/styles/coursera.css`: wrapping rows of pills, 44px targets |
| Long main-thread tasks / late interactivity | Hydration waited up to 1.5 s for the route chunk; service worker registered during startup | `src/main.tsx`: wait capped at 0.6 s, SW registered on window load |

Not fixable in code (hosting): "Use efficient cache lifetimes (10m)". GitHub Pages fixes `Cache-Control: max-age=600` and ignores `public/_headers`. Put Cloudflare (free) in front and add a Cache Rule: `/assets/*` and `/fonts/*` -> Edge TTL + Browser TTL 1 year. Hashed files are safe to cache that long.
