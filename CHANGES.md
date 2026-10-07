# Content purge patch

Unzip over the repo root, then delete the removed files:

    git rm -r --ignore-unmatch src/components/GuideArticle.tsx src/components/QuickGradeCalculator.tsx src/components/GpaToPercentage.tsx quick-grade nav seo offline docs/INTEGRATION.md

Then `npm install && npm run build` (runs the 16-check launch audit) and push.

## What changed
- GuideArticle.tsx deleted: keyword-spun copy (5 articles) that repeated what toolPages.ts / programmaticSeoData.ts already say properly. Removed from the final-exam, test-grade, grade-curve, letter-grade and weighted pages.
- ToolHeading.tsx: the badge/eyebrow line above every H1 is gone.
- ToolPage.tsx: breadcrumb + badge above the H1 removed (BreadcrumbList JSON-LD in SEO.tsx is untouched).
- ProgrammaticCalculatorView.tsx: breadcrumb + badge chips above the H1 removed.
- CgpaEducationalGuide.tsx: "Complete Academic Reference Guide" kicker above the guide heading removed.
- Dead, unimported files deleted: QuickGradeCalculator.tsx, GpaToPercentage.tsx, quick-grade/, nav/, seo/, offline/, docs/INTEGRATION.md.
