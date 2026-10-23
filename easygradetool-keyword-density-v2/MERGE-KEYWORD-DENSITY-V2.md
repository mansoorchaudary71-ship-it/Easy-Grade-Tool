# Keyword density v2 (2026-10-23)

Copy these files over the same paths in the repo root, commit, push. Only the live `src/` folder is touched.

## Why the audit reported 239-425 visible words
`.seo-content` and `.faq-section` used `content-visibility: auto`. Off-screen, the browser skips rendering them, so audit tools count only the header, hero, nav and footer. The guides (1,300-1,450 words each) and FAQs were not counted, so boilerplate such as "Easy Grade Tool", "Quick Grade" and "Grade Calculators" made "grade" look like 5-6%.
Fix: those two rules are removed in `src/index.css`. Guide and FAQ text now renders normally.

## Files
- src/index.css - removed content-visibility from .seo-content (both rules) and .faq-section
- src/data/toolGuideContent.ts - final exam: new "Common Final Exam Calculation Mistakes"; grade curve: new "Worked Example: One Class, Four Curves" and "Common Curving Mistakes" (numbers computed from the stated formulas)
- src/data/programmaticSeoData.ts - three near-duplicate "pass" FAQs merged into one (FAQ JSON-LD reads the same data)
- src/components/FAQ.tsx - "Interactive Tools Available" is now a <p>, not an H3 repeated on every page
- src/components/EducationalGuide.tsx - Article @id / mainEntityOfPage use /grade-calculator/ (matches canonical)
- src/components/ManualGradeHowTo.tsx - HowTo URL handles the trailing slash
- src/components/GradeCalculator.tsx - weighted page H1 is now "Weighted Grade Calculator" (matches title tag; final-exam intent stays on its own page)

## Not changed
Calculation logic, FAQ answers other than the merge, footer/nav copy.

## Check after deploy
Run `npm run build` (launch checks) and re-run the on-page audit. The deployed pages in the reports still showed icon.svg as the schema logo; the repo already uses pwa-512x512.png, so that will clear on deploy.
