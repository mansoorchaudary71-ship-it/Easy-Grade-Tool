# Audit fixes, 12 Oct 2026

Audited repo at commit dd308eb (build, 17 launch checks, tsc, 68 built pages).
The site was already clean on on-page SEO, canonicals, sitemap, schema and robots.

Fixed in this patch:
1. `.github/workflows/deploy.yml`: CI used Node 20 but package.json requires >=22.12 (Vite 8). Now Node 22, npm cache, and `npm ci`.
2. `package-lock.json`: out of sync with package.json, so `npm ci` failed. Regenerated.
3. `src/data/gradingScalePages.ts`: /grading-scale/ meta description was 111 chars; now 147.

Not changed (needs you): GitHub Pages ignores `public/_headers`, so HSTS and the other security headers only apply behind Cloudflare. Root of the repo holds many old patch folders and MERGE-*.md notes; safe to delete from GitHub when you want.
