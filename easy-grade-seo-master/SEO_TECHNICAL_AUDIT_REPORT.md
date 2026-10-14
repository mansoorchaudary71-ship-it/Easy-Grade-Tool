# Technical SEO Audit — easygradetool.com

Audited: repo `Easy-Grade-Tool-main.zip` (built with `npm ci && npm run build`, inspected `dist/`), plus a live fetch of the homepage and five competitors.
Branch: `seo-technical-fixes` (created from `seo-audit-fixes`).

## Read this first: Phase 0 gap
`seo-audit-fixes-patches.zip` and `SEO_AUDIT_REPORT.md` were **not in the upload** (only the repo zip arrived). So:
- `seo-audit-fixes` is currently identical to the baseline commit of the zip. No patches applied (Phase 0 step 2 not done).
- I could not de-duplicate against on-page issue IDs. Items that overlap on-page work are tagged **[on-page?]** and left out of the fix plan.
- Phase 4 (merged zip, patches that apply on your original main) needs those two files. Please re-upload them.

## Baseline health (verified)
- `npm ci` OK. `npm run build` OK (math checks, scale-page checks, vite build, prerender, sitemap, build-info, 17/17 `verify-launch` checks).
- `tsc --noEmit` OK (0 errors).
- Sitemap generation is stable on re-run (same output).
- Note: the build rewrites two tracked files (`public/sitemap.xml`, `scripts/sitemap-hashes.json`). I reverted them to keep the tree clean.

## Executive summary
**Technical score: 73/100** (my judgment, weights equal per section; Lighthouse/CWV not measured, so Performance is a code-based estimate).

| # | Area | Score |
|---|------|------:|
| 1 | Crawlability & indexing | 90 |
| 2 | Rendering | 88 |
| 3 | URLs & canonicals | 78 |
| 4 | Status codes & error pages | 70 |
| 5 | Head tags | 90 |
| 6 | Structured data | 80 |
| 7 | Performance | 62 |
| 8 | Delivery & hosting | 45 |
| 9 | Mobile & accessibility | 75 |
| 10 | Internal link mechanics | 92 |
| 11 | Security & hygiene | 55 |
| 12 | Tracking & monitoring | 50 |

The code is in good shape. The biggest limits are the **host (GitHub Pages)**: no real 301s, no custom headers, short cache lifetimes. Those need a hosting decision, not code.

## Stack summary
- Vite 8 + React 19 + react-router, TypeScript 7, Tailwind 4. Static prerender (SSG) via `scripts/prerender.ts` into `dist/`.
- 35 real pages + 32 legacy redirect stub pages + 404/500. 69 HTML files.
- Host: GitHub Pages (`CNAME` = www.easygradetool.com, `deploy.yml` uses `deploy-pages`). Not verified: whether Cloudflare sits in front.
- PWA via vite-plugin-pwa (prompt-to-update, network-first navigations).

## Issues table
Severity: C=Critical, H=High, M=Medium, L=Low. Auto = fixable in code without your decision.

| ID | Sev | Page / scope | Issue | Evidence | Impact | Fix | Effort | Auto |
|----|-----|--------------|-------|----------|--------|-----|--------|------|
| T-01 | H | Host | No real HTTP 301s: 32 legacy URLs use meta-refresh + JS stubs | `dist/curve-calculator/index.html` (`meta http-equiv=refresh`); GH Pages cannot 301 | Weaker signal consolidation, slower for users | Put Cloudflare (free) in front and add redirect rules, or accept stubs | M | N (hosting) |
| T-02 | H | Host | `public/_headers` is ignored by GitHub Pages: no HSTS, nosniff, Referrer-Policy, Permissions-Policy, long cache for hashed assets | `_headers` first line says GH Pages ignores it; `deploy.yml` uses Pages | Missing security headers; assets cached ~10 min instead of 1 year (live headers Not verified) | Cloudflare Transform Rules mirroring `_headers` (steps already in `docs/SEO-OPS.md`) | M | N (hosting) |
| T-03 | M | `404.html` | 404 is built from the homepage template: carries homepage meta description, canonical to `/`, OG tags and the homepage FAQPage/WebApplication JSON-LD | `dist/404.html` head | Conflicting signals on an error page (noindex mitigates). Charset tag sits at byte 789, inside the 1024 limit but fragile | Generate a clean 404 head: own title/description, no canonical, no schema, charset first | S | Y |
| T-04 | M | CI | `deploy.yml` uses Node 20 and `npm install`; `package.json` requires Node >=22.12 and `.npmrc` has `legacy-peer-deps` | `deploy.yml`, `package.json` engines | Build/deploy drift vs local; non-reproducible installs | Node 22, `npm ci` | S | Y |
| T-05 | M | All tool pages | JSON-LD `dateModified` is a constant (`SITE_LAST_MODIFIED`, 2026-10-06 on home) while sitemap lastmod is 2026-10-14 | `src/components/SEO.tsx:155-156`, built home JSON-LD | Stale/inconsistent freshness signals | Derive from the same per-page hash/lastmod source as the sitemap | M | Y |
| T-06 | M | Performance | One render-blocking stylesheet: 274 KB raw / 40 KB gzip. Entry JS 104 KB gz + react 79 KB gz + motion 32 KB gz + icons 8 KB gz on every page | `dist/assets/` sizes | Likely slower LCP on mobile (not measured) | Trim unused CSS/fonts, lazy-load `motion` on non-critical pages; measure first with PageSpeed | L | Partial |
| T-07 | M | Repo | ~25 leftover root items (`fix/`, `fixed-2-files-v2/`, `glass-update/`, `quick-grade*/`, `nav/`, `offline/`, `seo/`, `Easy-Grade-Tool-speed-fix/`, `MERGE*.md`, `*.sh`, `*.patch`, `*.diff`, `DELETE*.txt`) | `ls` at repo root | Not shipped (verified: none appear in `dist/`), but duplicate stale source can be merged by mistake | Move to an archive branch or delete | S | **Ask first** (deleting files) |
| T-08 | L | JSON-LD | Organization is repeated inline (author, publisher) instead of referencing the standalone `@id`; `inLanguage` is `en-US` on WebApplication but `en` on WebSite; Organization logo is an SVG | built home JSON-LD | Minor duplication/inconsistency | Use `@id` references, align language, point logo to `pwa-512x512.png` | S | Y |
| T-09 | L | Footer | "Average Grade" link appears twice in the footer list | built home footer (2x `/average-grade-calculator/`) | Duplicate link, no SEO harm | Remove the duplicate | S | Y |
| T-10 | L | Head | No `max-image-preview:large` / `max-snippet` robots directive | `dist/index.html` | Slightly smaller possible previews | Add `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">` to indexable pages | S | Y |
| T-11 | L | `security.txt` | `Policy:` points to `/privacy` (no trailing slash) | `public/.well-known/security.txt` | Extra redirect hop | Use `/privacy/` | S | Y |
| T-12 | L | Repo | `server-data/*.json` (subscribers/contacts) is tracked; currently empty arrays; used only by the Express dev server, not by GH Pages | `src/server/storageAdapter.ts` | Risk of real user data being committed later | Add `server-data/` to `.gitignore` | S | Y |
| T-13 | L | Build | Build rewrites tracked `public/sitemap.xml` and `sitemap-hashes.json` | `git status` after build | Noisy diffs; confusing PRs | Document in MERGE_GUIDE; keep hashes tracked, stop tracking generated sitemap in `public/` | S | Y |
| T-14 | L | `500.html` | Cannot be served by GitHub Pages | host limitation | Dead file | Keep for a future host; note in docs | S | Info |
| T-15 | — | Search Console | No verification meta tag in built HTML; may be verified by DNS | `grep` of `dist/` | Not verified | Tell me which method you use | S | **Ask first** |
| T-16 | — | Titles [on-page?] | Three titles are 61-62 characters (`/gpa-calculator/`, `/`, `/grading-scale/`) | built `<title>` | Possible truncation | Belongs to on-page report | S | Skipped |
| T-17 | — | Content [on-page?] | Homepage body copy reads auto-generated and repetitive | live homepage | Quality risk | Draft into `docs/content-drafts/` only | M | Draft only |

No Critical issues found.

## Findings by area

**1. Crawlability & indexing — Pass (90).** `robots.txt` allows all, blocks `/api/`, declares the sitemap. Sitemap has 35 URLs, all exist in `dist/`, all canonical, no stubs or noindex URLs, real per-URL lastmod. Zero orphan pages; every real page has 3+ inbound links. Crawl depth is 1 click (CHK-16). No hreflang (correct: single locale).

**2. Rendering — Pass (88).** All routes prerendered; H1, body copy, links and JSON-LD are in the initial HTML (e.g. final-exam page: 2,270 words, 1 H1). Soft-404 handling: unknown URLs get the GH Pages 404; returning PWA users fall back to the app shell (client-side NotFound) — acceptable. See T-03.

**3. URLs & canonicals — Partial (78).** Every real page has an absolute https canonical to itself; trailing slash and www are consistent (CHK-14). 32 stubs have a canonical to the target and no redirect chains found. Weakness is the lack of true 301s (T-01). Apex-to-www redirect: Not verified.

**4. Status codes & error pages — Partial (70).** Custom 404 exists with noindex (T-03). Live HTTP status of unknown URLs: Not verified (fetch tool does not expose status codes). 500 page unusable on this host (T-14).

**5. Head tags — Pass (90).** Unique title and description on all 35 real pages (lengths 30-62 / 111-160), viewport and `lang="en"` present, favicon (SVG + PNG), apple-touch-icon, manifest, theme-color. OG/Twitter use absolute https 1200x630 PNGs that exist. Only the three long titles in T-16.

**6. Structured data — Pass with notes (80).** All JSON-LD blocks parse; no ratings or reviews are invented; FAQPage matches visible FAQ (CHK-10). Notes: T-05, T-08, and the 404 duplicate (T-03).

**7. Performance — Partial (62), numbers Not verified.** Positives: self-hosted WOFF2 fonts with `font-display: swap`, 2 font preloads (Plus Jakarta Sans and Inter latin), jsPDF chunk (804 KB) excluded from preload, route-level code splitting, hero images lazy-loaded with width/height, no source maps. Concerns: T-06. No Lighthouse/CWV numbers were measured.

**8. Delivery & hosting — Fail (45).** GitHub Pages ignores `_headers` (T-02). HTTPS on live site works (fetched over https). Compression and CDN: GH Pages provides gzip via Fastly; Brotli and cache lifetimes Not verified.

**9. Mobile & accessibility — Partial (75).** Skip link, `<main>`, `<nav>`, `<footer>`, live region, `user-scalable=yes`. Heading order has no skipped levels on checked pages. Contrast, tap target sizes and keyboard flow: Not verified (needs a browser run).

**10. Internal link mechanics — Pass (92).** All internal links are crawlable `<a href>` with trailing slashes; no links point to redirect stubs; no external links, so no rel issues. Minor duplicate (T-09).

**11. Security & hygiene — Partial (55).** No secrets found (CHK-06). No CSP and no headers (T-02). Leftover folders and tracked `server-data/` (T-07, T-12). `security.txt` present with valid expiry (T-11).

**12. Tracking & monitoring — Not verified (50).** No analytics by design (privacy-first). I will not add trackers. Search Console verification method unknown (T-15).

## Competitor technical comparison
Only what I fetched; the rest is "Not verified".

| Site | Rendering | Title / meta | Canonical | OG / Twitter | URLs | Notes |
|------|-----------|--------------|-----------|--------------|------|-------|
| **easygradetool.com** | Prerendered React (full HTML) | Unique, keyword-led | Absolute, self | OG + Twitter large card, 1200x630 | Clean, trailing slash | 5 JSON-LD blocks |
| easygradecalculator.com | Static HTML | Unique, keyword-led | Absolute, self | OG yes; Twitter `summary`; no `og:image` seen | `.html` URLs | Text-only FAQ content; no JSON-LD seen in fetch |
| gradecalculator.com | Astro; chart table empty in initial HTML | Short generic | None seen | None seen | No trailing slash | Very thin page |
| calculator.net/grade-calculator.html | Server-rendered | Short generic ("Grade Calculator") | Not seen in fetch | Not seen | `.html` | Long history text, strong brand authority |
| gradecalculate.com | Not fetched | Not verified | Not verified | Not verified | Not verified | |
| essaygrader.ai (ez-grader page) | Not fetched | Not verified | Not verified | Not verified | Not verified | |

Takeaway: on technical SEO you already match or beat the fetched competitors. Page speed and weight comparisons need PageSpeed data, which I did not collect.

## Top 10 quick wins
1. T-03 clean 404 head.
2. T-04 CI to Node 22 + `npm ci`.
3. T-05 JSON-LD dates tied to real lastmod.
4. T-08 JSON-LD `@id` references and consistent language.
5. T-09 remove duplicate footer link.
6. T-10 `max-image-preview:large` robots meta.
7. T-11 `security.txt` policy URL.
8. T-12/T-13 `.gitignore` for `server-data/` and generated sitemap.
9. T-02 + T-01 Cloudflare in front (your decision; biggest real gain).
10. T-06 measure with PageSpeed Insights, then trim CSS/JS.

## Items needing your input
1. Re-upload `seo-audit-fixes-patches.zip` and `SEO_AUDIT_REPORT.md` (required for Phase 0 and Phase 4).
2. Cloudflare in front of GitHub Pages: yes/no? (T-01, T-02; needs DNS changes by you.)
3. OK to delete or archive the leftover root files in T-07?
4. How is Search Console verified (DNS or HTML tag)? (T-15)
5. Share a PageSpeed Insights / Lighthouse result for 2-3 pages if you want performance fixes beyond T-06.

---

# Phase 3/4 — Fix status (Before / After)

Verified on the built `dist/` after `npm run build` (17/17 verify-launch checks pass, `tsc --noEmit` clean).

| ID | Status | Before | After |
|----|--------|--------|-------|
| T-03 | Fixed | 404 carried homepage canonical, OG tags, FAQ/WebApp JSON-LD; charset at byte 789 | 404 has no canonical, no OG, no JSON-LD, its own description, noindex; charset at byte 51 |
| T-04 | Fixed | CI: Node 20, `npm install` | CI: Node 22, `npm ci` |
| T-08 | Fixed | Organization repeated inline; logo SVG; WebSite `en` vs `en-US` | `author`/`publisher` reference `#organization`; logo `/pwa-512x512.png`; `en-US` everywhere |
| T-09 | Fixed | "Average Grade" twice in footer | Once |
| T-10 | Fixed | No robots meta on indexable pages | All 35 real pages: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |
| T-11 | Fixed | `Policy: /privacy` | `Policy: /privacy/` |
| T-05 | Not changed | — | `dateModified` is the editorial "content reviewed" date (`CONTENT_REVIEWED_ON`), not a build date. Tying it to build time would claim freshness that did not happen. Bump `CONTENT_REVIEWED_ON` when content changes. |
| T-01, T-02 | Waiting on you | — | Needs Cloudflare (or another host) decision |
| T-06 | Waiting on data | — | Needs PageSpeed/Lighthouse numbers before trimming CSS/JS |
| T-07, T-12, T-13 | Waiting on you | — | Involve deleting/untracking files; not touched |
| T-15 | Waiting on you | — | Search Console method unknown |
| T-14, T-16, T-17 | No action | — | Informational / on-page scope |

Estimated technical score after fixes: **76/100** (Delivery & hosting stays at 45 until T-01/T-02 are decided).

## Not done
- Phase 0 step 2 and the combined on-page + technical package: `seo-audit-fixes-patches.zip` and `SEO_AUDIT_REPORT.md` were never uploaded. The delivered patches are technical-only and apply on your original main.

## Update after your answers
| ID | Status | Change |
|----|--------|--------|
| T-07 | Fixed | Removed stale duplicate folders, merge notes and one-off scripts from the repo root (all still in git history). `dist/` is unchanged by this. |
| T-12 | Fixed | `server-data/` untracked and git-ignored (files stay on disk). |
| T-01, T-02 | Ready for you | `docs/CLOUDFLARE-SETUP.md` (generated from `legacyRedirects.ts` by `scripts/generateCloudflareRules.ts`): 15 redirect rules, header rules, cache rules, curl checks. Needs your Cloudflare account and nameserver change. |
| T-13 | Not changed | `public/sitemap.xml` is regenerated by the build; untracking it risks breaking the copy into `dist/`. Left as is. |
| T-15 | Still open | Search Console method not confirmed. Recommended: Domain property with DNS TXT (no code change). |
