# All fixes in one ZIP: copy these files into the repo at the same paths

| File | Fixes |
|---|---|
| src/components/TermsOfService.tsx, src/components/PrivacyPolicy.tsx | Content: Readability Difficult (2 URLs) |
| scripts/cloudflare-security-headers.mjs, docs/SECURITY-HEADERS.md | All four Security header findings (53 URLs each): sends the headers from Cloudflare while staying on GitHub Pages |
| .github/workflows/deploy-cloudflare.yml, .github/workflows/deploy.yml, docs/SEO-OPS.md | Same four findings, alternative route: deploy on Cloudflare Pages (set repo variable DEPLOY_TARGET=cloudflare) |

Use ONE header route, not both.
Order: 1) merge and let the site deploy (readability goes live), 2) run the Cloudflare script (headers go live), 3) re-crawl.
H2: Multiple is intentionally unchanged (see chat).
