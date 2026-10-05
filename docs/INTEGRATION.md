# Integration guide (≈15 minutes)

These are drop-in files. I could not see your repository, so nothing here overwrites your existing files.
Map them to your framework as below (public/ = static folder: `public/` in Next/Vite/Astro/CRA, `static/` in SvelteKit/Hugo).

| File in this PR | Copy to | Then |
|---|---|---|
| quick-grade/quick-grade.js, quick-grade.css, print.css | `public/` | Reference from the Quick Grade page (see seo/head-snippet.html) |
| quick-grade/quick-grade.html | the Quick Grade page template | Paste above the long SEO text. Wrap the SEO text in `<div class="seo-content">`. Delete old tablist/config UI from the default view (keep as a link “Full test grader” if you want). |
| nav/nav-grouped.html + .css | your header/footer nav component | Replace the flat tool list. Fix the hrefs. |
| seo/faq-schema.html + faq-visible.html | page `<head>` / below tool | Keep visible text identical to the schema text |
| seo/software-schema.html, head-snippet.html | page `<head>` | Keep your existing HowTo schema — do not remove it |
| seo/perf.css | import in global CSS | |
| offline/sw.js, offline.html | `public/` (site ROOT) | |
| offline/register-sw.html | global layout, before `</body>` | |

## Manifest (your existing manifest.json)
Must contain `"start_url": "/"`, `"display": "standalone"`, `name`, `short_name`, `theme_color`, and 192px + 512px icons.
Without a registered service worker the site is NOT truly offline — sw.js fixes that.

## Search-intent split
- Tool H1/title/description target teachers (already written in the snippets).
- Keep the long student-focused copy below the tool for the GPA page; on Quick Grade, trim it to a short “How to use” + the FAQ.

## Test checklist
1. Open /quick-grade: chart is already visible; type 25 → chart updates instantly.
2. Click Print chart → preview shows only the table (no nav, no text).
3. DevTools > Application: service worker “activated”; tick Offline, reload — page works.
4. Lighthouse (mobile): check Performance/SEO/Accessibility.
5. Google Rich Results Test: FAQPage + HowTo valid.

## Things that cannot be fixed by code (do these off-site)
Backlinks and brand authority: submit to teacher-resource directories, write a “printable grading charts” guide, outreach to teacher blogs/.edu resource pages.
Strongest E-E-A-T step: move Loan/Mortgage/Tip/Password tools to a separate domain or subfolder with its own brand. The nav grouping in this PR is the minimum fix.
