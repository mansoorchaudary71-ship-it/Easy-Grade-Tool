Copy over the repo (paths match), commit, push to main, wait ~15 min, then re-crawl.
4xx / stale-asset fix
- public/asset-recovery.js (new) + index.html: reload once if a hashed /assets/ file 404s
- scripts/check-live.ts: HEADs every /assets/ file each live page links to; covers the 7 affected URLs
- .github/workflows/deploy.yml: non-blocking verify-live job after deploy
About page mobile fix
- src/components/AboutMethodology.tsx: content column could not shrink below the table width (min-w-0), compact table on phones, wrapping formulas/emails, readable note text in the dark formula box
