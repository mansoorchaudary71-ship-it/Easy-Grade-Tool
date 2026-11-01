# CHANGES — Warm background only — 2026-11-01 (v2 colour correction)

User instruction 2026-11-01 (replaces the Warm Paper / Warm Blend
direction): ONLY the website's background becomes warm — nothing else
changes. Do NOT upload the Warm Paper, Warm Blend, or v1 background
zips; this v2 package supersedes them.

v2 correction: the v1 colour `#FDF8F0` leaned peach (hue 37°) and read
slightly pink. v2 uses `#FDF6E3`, a golden warm cream (hue 44°) with no
pink cast. Nothing else changed between v1 and v2.

## Files in this package (upload to repo root ALONE, then push)

- `src/styles/warm-background.css` — NEW, the entire change (9 lines).
- `src/main.tsx` — one added line: `import './styles/warm-background.css';`
  after the `dribbble-type.css` import. From the user's latest repo
  (`__11__`); it does NOT import warm-paper.css or warm-blend.css, so
  uploading it also removes those themes if they were uploaded before
  (their CSS files would simply sit unused in the repo).
- This changelog.

## What changes (exactly one thing)

- Page backdrop: white `#ffffff` → golden warm cream `#FDF6E3`, on `html` and
  `html body` (the `html body` selector matches the current theme's
  own rule in nova.css, so it wins by import order).

## What does NOT change

Everything else: white cards, white/frosted header, blue `#2457F5`
buttons and links, Mona Sans type, card radius and shadows, amber/blue
accents, SVG rings, grade-tier colours (A–F), per-tool icon hues,
layouts, content, copy, tools, pages, URLs, routes, logic, schema,
sitemap. No new JavaScript, no new images, no new font downloads.
Print is unaffected: the existing print stylesheet already forces a
white background.

## Verification (2026-11-01, from the user's `__11__` repo copy)

- Clean build, exit 0; launch audit **17/17 PASS**.
- Built bundle: warm cream present; Warm Paper tokens, Ivy green,
  Georgia, and blend rules all ABSENT (0 occurrences); blue `#2457F5`
  intact (88 occurrences).
- A live-browser visual check could NOT run: the browser environment
  refuses loopback/localhost URLs (the preview server itself answered
  HTTP 200). Confirm the look on the live site after push.
