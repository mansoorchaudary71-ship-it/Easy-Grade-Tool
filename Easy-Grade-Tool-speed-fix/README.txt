Speed fix patch - copy these 3 files over your repo (same paths), then commit and deploy:
  index.html        -> theme applied before first paint (no dark-mode flash)
  vite.config.ts    -> service worker no longer precaches ~3 MB of images/fonts/OG cards
  src/main.tsx      -> service worker registers after the page has loaded
Nothing else was changed.
