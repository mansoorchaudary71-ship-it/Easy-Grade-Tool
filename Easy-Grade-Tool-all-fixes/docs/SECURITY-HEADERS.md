# Fixing "Security: Missing X-Frame-Options Header" (and the other three header findings)

**Cause.** The header is already defined in `public/_headers` (`X-Frame-Options: SAMEORIGIN`), but GitHub Pages ignores that file and cannot send custom response headers. Screaming Frog reads the real HTTP response, so it flags all URLs (pages, JS, CSS, images). A `<meta>` tag cannot replace it: browsers ignore X-Frame-Options in meta tags.

**Fix.** Send the header from Cloudflare, in front of GitHub Pages. No hosting move is needed. `scripts/cloudflare-security-headers.mjs` creates the rule from `public/_headers`, so the values stay in one place.

## One-time setup
1. Add `easygradetool.com` to Cloudflare (free plan) and change the nameservers at your registrar to the two Cloudflare gives you.
2. In Cloudflare DNS, make sure the `www` record points to GitHub Pages and is **Proxied** (orange cloud). SSL/TLS mode: **Full**.
3. Create an API token: My Profile > API Tokens > Create Token > Custom. Permissions: `Zone > Transform Rules > Edit` and `Zone > Zone > Read`, scoped to your zone.
4. Copy the Zone ID from the domain's Overview page (right sidebar).

## Apply
```
CLOUDFLARE_API_TOKEN=xxxx CLOUDFLARE_ZONE_ID=yyyy node scripts/cloudflare-security-headers.mjs --dry-run
CLOUDFLARE_API_TOKEN=xxxx CLOUDFLARE_ZONE_ID=yyyy node scripts/cloudflare-security-headers.mjs
```
Only the rule `easygradetool-security-headers` is created or replaced; other rules in that phase are kept. After you change `public/_headers`, run the script again.

## Verify
```
node scripts/cloudflare-security-headers.mjs --check
curl -sI https://www.easygradetool.com/ | grep -i x-frame-options
```
Expect `x-frame-options: SAMEORIGIN`. Then re-crawl in Screaming Frog.

## No Cloudflare API? Manual rule
Cloudflare > Rules > Transform Rules > Modify Response Header > Create rule. Expression: `(http.host eq "www.easygradetool.com")`. Add "Set static" entries for each line under `/*` in `public/_headers`.

## Alternative
Host on Cloudflare Pages or Netlify instead; they read `public/_headers` directly (see `docs/SEO-OPS.md`).

The CSP in `_headers` was checked against the code: fonts are self-hosted and `index.html` has only JSON-LD script blocks, so `script-src 'self'` will not break the site. After enabling, open a few pages and check the browser console for "Refused to ..." messages.
