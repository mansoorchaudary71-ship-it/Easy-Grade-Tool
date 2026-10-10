Copy these 3 files over your repo (same paths), commit and deploy. Includes the earlier speed fixes.
  index.html      -> reload always opens Home (Quick Grade); theme applied before first paint
  vite.config.ts  -> service worker only falls back to the home shell for "/", not every page; no 3 MB precache
  src/main.tsx    -> service worker registers after page load
After deploying, open the site once, close all its tabs (or tap "Reload" in the update banner) so the new service worker takes over.
