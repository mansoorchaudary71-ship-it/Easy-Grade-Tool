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
