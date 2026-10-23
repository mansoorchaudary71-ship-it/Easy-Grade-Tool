# Mobile Lighthouse audit, 23 Oct 2026: what was changed

Report: Moto G Power, slow 4G, Lighthouse 13.5. Scores were 100 / 100 / 100 / SEO 2 of 2, but FCP was 4.7 s, LCP and TBT
returned `NO_LCP`, and the diagnostics listed the items below.

| Finding | Cause found in the repo | Fix |
| --- | --- | --- |
| 1,001 KiB first-party transfer, four ~95 KiB guide photos on the home page | `preloadAllTools()` ran at idle and `preloadTool()` also downloaded the guide photo of every warmed tool (GPA, CGPA, percentage) | Idle warm-up now loads code only (`images: false`) and starts 2.5 s after `load`. Photos still preload on hover, touch or focus |
| Guide photos 1200 px wide on a ~400 px screen | one size per photo | `public/images/*-800.webp` added and `srcset` / `sizes` on `SemanticGuideImage` (about 55% fewer bytes on phones) |
| `vendor-pdf` 240 KiB loaded on first view, legacy JavaScript warning | a forced manual chunk for jspdf, html2canvas, canvg and dompurify | Manual chunk removed. PDF code is only reached through `import()` on an export click, so the bundler keeps it out of the first load. Preload filter widened to match |
| Google Tag Manager 178 KiB, 68 ms forced reflow, 96 ms main thread | `gtag.js` loaded in `<head>` at start | Small inline loader queues the events and injects `gtag.js` on first interaction or 3.5 s after load. CSP hash in `public/_headers` updated |
| Viewport hint | `user-scalable=yes` | Removed (zoom stays enabled, it is the default) |
| Table headers without data cells (Accessibility, Tables and lists) | group header cells used `scope="colgroup"`, which is the wrong scope for a row-group label | `scope="rowgroup"` in `QuickChartTable.tsx`, print CSS selector updated |
| Missing source maps for large first-party JS | `build.sourcemap` off | `build.sourcemap: true` |
| `llms.txt` audit not applicable | no file | `public/llms.txt` added |
| No CSP, HSTS preload/includeSubDomains, COOP, frame control, Trusted Types | GitHub Pages cannot send response headers | `public/_headers` now also sends COOP and HSTS preload. These only reach browsers through Cloudflare or Netlify, see "Security headers" in `docs/SEO-OPS.md`. Trusted Types is left out on purpose: React, Recharts and jsPDF write HTML, so enforcing it would need a tested report-only rollout first |
| Cache TTL 10 min (GitHub Pages) | host sets `max-age=600` | Same as above: `_headers` sets one-year immutable caching for `/assets/*` and `/fonts/*` once a CDN serves them |

`NO_LCP` also zeroes TBT. The page-weight changes above are the part of that problem that is in this repo. Re-run PageSpeed
Insights after deploy and keep the JSON if `NO_LCP` is still reported.

## Logo and favicon

The vector logo (`icon.svg`, `src/brand/brand.ts`) was already the blue "A+" mark, but every raster file was still the old
green one: `favicon.png`, `apple-touch-icon.png`, `pwa-*.png`. Google Search and Bing use the raster files, so they kept the
green logo. Regenerated with `npx tsx scripts/generateIcons.ts`, which now also writes `favicon.ico`, `favicon-48x48.png`
and `favicon-96x96.png` (Google needs a multiple of 48 px; the old file was 64 px). `<link rel="icon">` tags updated in
`index.html`, `404.html` and `500.html`. Organization and WebApplication JSON-LD now point at `pwa-512x512.png`. Social cards
(`og-image.png`, `og-cards/*`) were regenerated with `scripts/generate_og_cards.py` and now carry the logo mark.

Google refreshes favicons on its own schedule (days to weeks). After deploying, request re-indexing of the home page in
Search Console.
