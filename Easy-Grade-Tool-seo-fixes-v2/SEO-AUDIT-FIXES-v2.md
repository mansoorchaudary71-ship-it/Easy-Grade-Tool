# Screaming Frog audit fixes (round 2)

Copy these files into the repo at the same paths:
- src/components/TermsOfService.tsx, src/components/PrivacyPolicy.tsx : plain-language rewrite (readability). Your last repo still had the old text, so the live pages are unchanged until this is merged.
- .github/workflows/deploy-cloudflare.yml (new) : deploys to Cloudflare Pages, which sends the headers in public/_headers. Off until repo variable DEPLOY_TARGET=cloudflare.
- .github/workflows/deploy.yml : both jobs get an `if` so GitHub Pages deploy skips when DEPLOY_TARGET=cloudflare. No change in behaviour until you set it.
- docs/SEO-OPS.md : step-by-step switch instructions appended.

Status per finding
- Security headers x4 (52 URLs): cleared only after the Cloudflare switch (GitHub Pages cannot send headers).
- 503 on /grading-scale/100-questions/: one-off GitHub CDN error, page loads fine now, nothing to fix in code. Re-crawl.
- Readability (terms, privacy): fixed by the rewrite once deployed.
- H2: Multiple: not changed. Every page has many H2s (and the footer adds 5), which is valid HTML. Screaming Frog itself says it is not an issue.
