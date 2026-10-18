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

**Why Screaming Frog still flags these.** The audit checks real HTTP response headers. GitHub Pages cannot send custom headers and ignores `public/_headers`, so these four findings stay on all 53 URLs until the headers come from a CDN or a host that supports them:

| Screaming Frog finding | Header to send |
| --- | --- |
| Missing X-Frame-Options | `X-Frame-Options: SAMEORIGIN` |
| Missing X-Content-Type-Options | `X-Content-Type-Options: nosniff` |
| Missing Secure Referrer-Policy | `Referrer-Policy: strict-origin-when-cross-origin` |
| Missing Content-Security-Policy | the policy in `public/_headers` |

A `<meta>` tag cannot replace them: browsers ignore `X-Frame-Options` and `frame-ancestors` in meta tags, and crawlers do not read meta tags as headers. (`index.html` already sets `<meta name="referrer">`, which protects visitors but does not clear the audit flag.)

**Option A (free, no hosting change): Cloudflare in front of GitHub Pages**
1. Add the domain to Cloudflare and switch the `www` DNS record to Proxied (orange cloud).
2. Rules > Transform Rules > Modify Response Header > Create rule.
3. Name it `Security headers`. Apply to: All incoming requests (or Hostname equals `www.easygradetool.com`).
4. Under Modify response header, add one "Set static" entry per line below `/*` in `public/_headers` (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Strict-Transport-Security, Content-Security-Policy). Copy the values exactly.
5. Save and deploy.

**Option B: move hosting to Cloudflare Pages or Netlify.** Both read `public/_headers` from the build output automatically, so no rule setup is needed.

**Verify (about a minute after the rule is live):**
```
curl -sI https://www.easygradetool.com/ | grep -iE "x-frame|x-content-type|referrer-policy|content-security-policy"
```
All four lines should appear. Then re-crawl in Screaming Frog; the four Security issues should drop to 0.

**Test the CSP once after enabling it.** Open the home page and each calculator, download a PDF chart, and try the PWA install button. If something is blocked, DevTools > Console shows `Refused to ...` with the directive to loosen. The policy allows only same-origin resources, plus Formspree and Web3Forms for the footer forms. If `VITE_FORM_ENDPOINT` points at another provider, add its host to both `connect-src` and `form-action`. The inline `<style>` block in `Footer.tsx` and React inline styles need `style-src 'unsafe-inline'`; scripts stay strict (`script-src 'self'`).

## Switch to Cloudflare Pages (removes the four security-header findings for good)

GitHub Pages cannot send response headers, so the four Security findings in Screaming Frog cannot be cleared from code while the site stays there. Cloudflare Pages reads `public/_headers` automatically. The workflow `.github/workflows/deploy-cloudflare.yml` is already in the repo and stays off until you switch it on.

1. Cloudflare dashboard > Workers & Pages > Create > Pages > Direct Upload. Name the project `easy-grade-tool` (or set repo variable `CLOUDFLARE_PROJECT_NAME`).
2. Create an API token (Account > API Tokens > "Edit Cloudflare Workers" template, or a custom token with Account > Cloudflare Pages > Edit). Copy the Account ID from the dashboard sidebar.
3. GitHub repo > Settings > Secrets and variables > Actions:
   - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - Variable: `DEPLOY_TARGET` = `cloudflare`
4. Push to `main` (or run the workflow by hand). Check the Pages project deploys and the `*.pages.dev` URL works.
5. In the Pages project > Custom domains, add `www.easygradetool.com`. Cloudflare will tell you to point the `www` CNAME at `<project>.pages.dev`. Change it, wait for the certificate, then disable GitHub Pages in the repo settings.
6. Verify: `curl -sI https://www.easygradetool.com/ | grep -iE "x-frame|x-content-type|referrer-policy|content-security-policy"` shows all four. Re-crawl.

To go back, delete the `DEPLOY_TARGET` variable and point DNS back at GitHub Pages.
Bonus: Cloudflare caches pages at the edge, which makes one-off `503 backend read error` responses from GitHub's CDN much less likely.
