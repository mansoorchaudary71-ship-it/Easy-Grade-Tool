# How to merge this patch

1. Unzip over your repo root (same folder layout; files overwrite, new files are added).
2. Delete the obsolete files listed in `DELETE.txt` (dead code from earlier integration attempts; nothing imports them):
   `xargs -a DELETE.txt git rm -r --ignore-unmatch`
3. `npm install && npm run build` (runs math tests, SSG, sitemap, and the 16-check launch audit). Then push to `main`.
4. Follow `docs/SEO-OPS.md` (Search Console steps, optional Cloudflare, forms).
5. No personal name is published anywhere (set in `src/data/siteIdentity.ts` if you ever want one).
