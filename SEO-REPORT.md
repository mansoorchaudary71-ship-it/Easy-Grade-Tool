# Easy Grade Tool: SEO content round (2026-10-27)

Copy the files in `src/` over the same paths in the repo, run `npm run build`, push.
`SEO-keyword-map.xlsx` lists all 500 keywords with page, status and reason.

## Files changed
- `src/data/seoExtras.ts` (new): sections, lookup tables and FAQs for 17 `/grading-scale/N-questions/` pages, the scale index, test grade, average grade, letter grade, curve, GPA-to-letter, cumulative, semester, college and high-school GPA pages. Every number is computed from `academicMath`.
- `src/data/seoKeywordMap.ts` (new): keyword -> page map (data only).
- `src/data/toolPages.ts`: 2 lines (import + `applySeoExtras(TOOL_PAGES)`).
- `src/data/programmaticSeoData.ts`: 11 final-exam FAQs. `src/data/toolGuideContent.ts`: 2 sections in the final-exam guide.
- `src/data/homeContent.ts`: 7 homepage FAQs. `src/components/FAQ.tsx`: FAQs for GPA, CGPA, tip, password, loan, percentage and weighted pages.
FAQ JSON-LD is generated from the same arrays, so schema and visible text stay identical.

## Things you need to know first
1. **The keyword file has no maximum-frequency column** (only Query, Clicks, Impressions). I applied my own cap: each keyword is written once by me, and at most twice on its page. Send the real caps if you have them.
2. **I could not open the 7 competitor sites.** The fetch tool only opens URLs that appear in search results, and none did. The gap analysis therefore uses the competitor report already in your repo (`egt-competitor-gap-report-2026-10-25.md`) plus search-result evidence (miss-count tables, points per question, odd totals, half points, 20-point and 50-mark scales, needed-score formulas). No competitor was read line by line.
3. **Nothing was built or type-checked.** `node_modules` and network were unavailable. Each changed file was syntax-checked with esbuild and the page registry loaded and dumped. Run `npm run build` (it includes your math and scale verifiers) before merging.
4. Wording is third person in all new copy. Existing "you" copy was left alone.

## Coverage
455 keywords were mapped to a page and 431 are on it. 45 more could not be placed (see below); 6 more were dropped before mapping.

## Omission and compliance report
**Omitted, not a real query or a third-party name (7):** the `"srmist" -site:...` operator string; `84.45`; `210 points score improvement` (no intent); `average rating` (product ratings); `activecalculator`; `rapidtables final grade calculator` (competitor); `college board gpa calculator` (would imply an affiliation).

**Misspellings, not printed (39):** e.g. grading sclae, gradeing chart, calucate gpa, final exam caluclator, final exam calcultor, final grade calcu, quick garde, quick gade, easy garder, esay grader, easy graer, essy grader, eazy grader, eazygrader, exgrader, ex grader, cgrade calc, quick grad, grade easy, grader grader, grader easy, easier grader, ez grader.com, final.exam.calculator, final exam cal, final test calc, final exam calc, e z grader online, e z grader calculator, e-z grader online, ezgraderonline, ez graders, speed grader calculator (Canvas product name), calculating gpa calculator, gpa calculator gpa, how to you average your test average, grade quick, quickgrades, quick grades.

**Could not be used naturally (23):** 40 questions one score; 79.50 .75 (ambiguous); 16 wrong; 14 16 test grade; 12 18 score; if there is 16 questions; if there is 14 questions on a test (ungrammatical); random password generate; weighted average calculator grades; grade calculator 12 questions; grading scale for 16 question test; grading scale 16 questions; three "how many points is each question ... 15 question test" word-order variants (merged into one answer, not repeated); test calculator final; final exam test calculator; final grade calculator weighted (already above cap); calculate grade average; grade calculator 4.0 scale; convert cgpa to percentage on 10 point scale (placed with an added "a"); easy grader online free (word-order variants used); what do i need on my final to pass (existing FAQ answers it).

**Placed in the exact searched form even where the grammar is loose** (e.g. "What is a 11/16 grade?"). Edit these by hand if you prefer correct grammar.

**Head terms already above 2 uses in your original copy (not added to):** ez grader, easy grader, grading scale, grading chart, grade scale, weighted grade calculator, exam grade calculator, average grade, final grade calculator, final exam score. The counter marks 3 terms +1 (quick grade, 80 questions, grading tool); this is a counting artefact for quick grade and one extra mention for the other two.

## Sections not fully written / for you to finish
- Weighted-grade guide (`toolGuideContent.ts`) got FAQs only, no new section.
- Homepage got FAQs only, no new H2 section.
- Titles, meta descriptions, H1s and sitemap were not touched.
- CGPA answers use the common x 9.5 rule; check them against your 26 verified university formulas. SRM (x 10) is from your own data file.
- Tip, password and loan pages got 1 to 4 FAQs each, no extended guide.
- No Academic reviewer is listed; nothing was invented.
