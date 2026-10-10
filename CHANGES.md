# FAQ + footer patch (fixed)

Unzip over the repo root, then `npm run build`.

Fixes the 4 failing launch checks (CHK-03, CHK-08, CHK-10, CHK-16):
- ToolPage.tsx: the previous version only knew test-grade, grade-curve and letter-grade, so
  /average-grade-calculator/, /grading-scale/ and all /grading-scale/N-questions/ pages rendered an
  undefined tool ("type is invalid") with no H1, FAQs or content. It now renders the right tool for every
  slug plus each page's sections, worked example, FAQ and related links.
- Footer.tsx: adds crawlable "Average Grade" and "Grading Scales" links to the Grade Calculators column
  so the homepage links to every sitemap URL (CHK-16).
- FAQ.tsx: adds FAQ headings for the average-grade and grading-scale pages (same UI as the other tools).
- All other files are unchanged from the earlier patch.

## Footer update (subscribe banner + expandable tool lists)
- Footer.tsx: premium newsletter banner (animated gradient + floating glow orbs, subtle grid, floating/twinkling
  illustration, gradient headline accent, glass input with focus glow, shimmering gradient Subscribe button with
  arrow, trust chips, animated success/error message). Submit logic is unchanged.
- Grade Calculators, More Tools and Support are now expandable groups (native <details>, collapsed by default,
  count badge, animated chevron, icon rows with hover motion). All links stay in the prerendered HTML, so the
  crawl-depth check (CHK-16) still passes.
- All animation is disabled under prefers-reduced-motion. Styles live inside Footer.tsx, so index.css is unchanged.
