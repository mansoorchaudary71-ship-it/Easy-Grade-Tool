# SEO & Ops checklist (things code alone cannot do)

## 0. Do this first: indexation (Google Search Console)
1. Add `https://www.easygradetool.com/` as a **URL-prefix** property (and the apex as a Domain property if you control DNS).
2. Sitemaps > submit `https://www.easygradetool.com/sitemap.xml`.
3. URL Inspection > request indexing for: `/`, `/grade-calculator/`, `/final-exam-grade-calculator/`, `/ez-grader/`, `/test-grade-calculator/`, `/grade-curve-calculator/`, `/letter-grade-calculator/`, `/gpa-calculator/`, `/cgpa-to-percentage-calculator/`.
4. After deploy, open Pages > "Page with redirect" and "Duplicate, Google chose different canonical". Both should shrink within 2-4 weeks: every canonical, sitemap URL and internal link now uses the trailing-slash URL that GitHub Pages actually serves.
5. Repo Settings > Pages: tick **Enforce HTTPS**; custom domain `www.easygradetool.com`; make sure the apex `easygradetool.com` redirects to www (4 A records + `www` CNAME to `<user>.github.io`).

## 1. Real 301s and security headers (optional but recommended, free)
GitHub Pages cannot send custom headers or 301s. Put Cloudflare (free) in front:
- Redirect Rules: copy the table in `scripts/redirectStubs.ts` (`LEGACY_REDIRECTS`) as 301s.
- Transform Rules > Response headers: copy the lines in `public/_headers`.
- Cache Rules: `/assets/*` and `/fonts/*` = Edge TTL 1 year, Browser TTL 1 year.
- Speed: enable Brotli, HTTP/3, Early Hints.

## 2. Measure speed (no lab data exists yet)
Run PageSpeed Insights (mobile) on `/`, `/grade-calculator/`, `/gpa-calculator/`, `/test-grade-calculator/`.
Targets: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1. After 28 days check Search Console > Core Web Vitals (field data).

## 3. Authority (the real gap against the incumbent)
- Optional: `src/data/siteIdentity.ts` lets you add a named owner or reviewer later; by default no name is shown. Add an academic reviewer only if a real person agrees to be named.
- Link-worthy assets already on site: printable EZ Grader chart, CGPA university conversion table, grade curve tool, letter grade scale tables. Pitch them to teacher-resource blogs, school-district resource pages, university student-services pages, Reddit r/Teachers / r/college (follow each community's self-promotion rules), and education directories.
- Keep the claim "no ads, no tracking, offline-capable" prominent: it is a genuine differentiator for teachers.
- Do NOT buy links or publish mass AI articles; both audits and Google's guidance agree that is a poor use of effort now.

## 4. Forms
Footer contact/subscribe forms need a relay on static hosting. Create a Formspree or Web3Forms form, then add repo variable `VITE_FORM_ENDPOINT` (and secret `VITE_FORM_ACCESS_KEY` if required). Without it the forms honestly report failure.

## 5. Not built on purpose
- AP / AP World / AP Stats calculators: they need official, yearly-changing score-conversion tables. Add only with a sourced table and a verification date.
- Fake ratings/reviews schema, and FAQ/HowTo "rich result" tricks: Google stopped showing HowTo rich results in 2023 and limits FAQ rich results to a few site types. FAQPage markup is kept (valid, harmless, helps other engines) but do not expect SERP decoration from it.

## Security headers on GitHub Pages (C6)

GitHub Pages does not read `public/_headers`, so the live site sends no Content-Security-Policy, X-Frame-Options or Permissions-Policy header. Two options:

1. Put Cloudflare (or another CDN) in front of the domain and mirror `public/_headers` as response header rules.
2. Add a `<meta http-equiv="Content-Security-Policy">` tag. This covers script, style and connect sources but not `frame-ancestors`, which browsers ignore in meta tags.

The inline `<style>` block in `Footer.tsx` would need `'unsafe-inline'` under a strict policy. Moving it to a stylesheet (finding B13) removes that need.
