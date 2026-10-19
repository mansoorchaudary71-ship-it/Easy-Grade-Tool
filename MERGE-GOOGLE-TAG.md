# Google tag (G-H9RJ2Q89XF) – merge notes

Files changed (copy over the same paths in the repo root):

- index.html        – Google tag added immediately after <head> (this is the template Vite + prerender use for every route, so all prerendered pages get it)
- public/404.html   – tag added after <head>
- public/500.html   – tag added after <head>
- public/_headers   – CSP updated so the tag is allowed (script-src, img-src, connect-src). Inline snippet allowed via sha256 hash, not 'unsafe-inline'.
- public/sw.js      – service worker now ignores cross-origin requests so it never intercepts Google requests

If you ever edit the inline gtag script (even whitespace), recompute its sha256 and update public/_headers.
Note: _headers is only honoured on Cloudflare Pages / Netlify; GitHub Pages ignores it.
