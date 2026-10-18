# Screaming Frog audit fixes

## Files changed (drop into the repo at the same paths)
- `src/components/TermsOfService.tsx` - copy rewritten in plain words and shorter sentences (Content: Readability Difficult).
- `src/components/PrivacyPolicy.tsx` - same rewrite. One fact corrected: the page said fonts load from Google's CDN, but `src/fonts.css` serves them from `/fonts/`, so the text now says they are self-hosted.

Headings, links, styling and layout are unchanged. Estimated Flesch score (my own approximation, not Screaming Frog's formula):
Terms 25 -> 70, Privacy 26 -> 62. Re-crawl to confirm the real figures.

## Not fixable in code
Security: Missing X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Content-Security-Policy (53 URLs each)
`public/_headers` already contains all four headers with correct values, but GitHub Pages ignores that file.
Fix = send the headers from Cloudflare (Transform Rule) or host on Cloudflare Pages/Netlify. Steps: `docs/SEO-OPS.md`, "Security headers on GitHub Pages".
The CSP in `_headers` was checked against the repo: fonts are self-hosted, `index.html` has only JSON-LD script blocks, so `script-src 'self'` will not break the page.

## Left as is on purpose
H2: Multiple (38 URLs). Screaming Frog itself says this is not an issue; pages use one H1 and several H2 sections.

## To review
`PrivacyPolicy.tsx` describes a server with `/api/*` endpoints and `server-data/*.json` files. The live site is static GitHub Pages and `docs/SEO-OPS.md` says forms go through Formspree/Web3Forms. Check the policy matches what you actually run. I kept those facts unchanged.
