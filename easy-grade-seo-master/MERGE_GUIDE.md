# Master SEO merge (on-page + technical)

16 patches, in order, against the original `main`:
- 0001-0005  on-page fixes (final-exam default, self-link, lang=en-US, title/H1/H2 alignment, draft guide copy)
- 0006-0014  technical fixes (404 head, Node 22 CI, schema @id/logo, footer link, security.txt, server-data untracked, Cloudflare docs, repo cleanup)
- 0015-0016  audit reports

## How the two sets were reconciled
- Both sets fixed the duplicate "Average Grade" footer link on the same line of Footer.tsx. Only the technical version (0010) is kept; the on-page duplicate was dropped.
- Both sets regenerated public/sitemap.xml and scripts/sitemap-hashes.json. Neither regenerated version is included; `npm run build` rebuilds them so lastmod values match the final head.
- No other file is touched by both sets.

## Apply
```
git checkout main && git pull
git branch archive/pre-seo-cleanup
git checkout -b seo-master
git am patches/*.patch
npm ci && npm run build
git add public/sitemap.xml scripts/sitemap-hashes.json && git commit -m "chore: regenerate sitemap after SEO fixes"
git push -u origin seo-master     # then open a PR into main
```
If `git am` stops: `git am --abort`, then `git am -3 patches/*.patch`.
Delete list for the cleanup commit is in DELETED_FILES.txt (already inside patch 0014).

After merge: follow docs/CLOUDFLARE-SETUP.md for 301s/headers, and verify the GitHub Pages deploy is green.
