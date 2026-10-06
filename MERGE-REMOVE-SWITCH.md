# Remove the Quick Grade <-> Weighted switch

1. Unzip over your repo root (replaces `src/components/GradeCalculator.tsx`).
2. `npm install && npm run build`, then push to `main`.

What changed
- Removed the mobile dropdown and the desktop "Quick Grade Chart / Weighted & Final Exam" tab switch.
- The view is now decided only by the URL: `/` = Quick Grade chart, `/grade-calculator/` and `/final-exam-grade-calculator/` = weighted calculator.
- The two in-page buttons ("Weighted Calculator →" and "← Back to Quick Grade Chart") are now normal links to `/grade-calculator/` and `/`, so crawlers can follow them.
- No routes, SEO data or other files were touched. `remove-switch.diff` shows the exact change.
