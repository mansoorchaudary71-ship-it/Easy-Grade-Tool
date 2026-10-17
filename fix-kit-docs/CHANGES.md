# CHANGES: Easy Grade Tool SEO fix kit

Every file in this kit mirrors your repo path. **OVERWRITES** = replaces an existing file (your copy is replaced, so merge with `git diff` before committing). **NEW** = does not exist in your repo today.
Issue labels: `P1` = On-Page audit, `P2` = Technical audit, `P3` = Search Intent audit, `P4` = Content/Authority audit, `P5` = Off-Page audit, `P6` = UI/UX audit. `#n` is the issue number in that report.

Verification done on a clean copy of your zip with this kit applied: `npx tsc --noEmit` passes, `npx tsx scripts/verify-academic-math.ts` passes (new checks included), and `npm run build` passes all 17 `verify-launch` checks. Sitemap now has 38 URLs (35 + 3 new). I could not run a browser, so on-screen behaviour (button clicks, mobile layout, PDF download) is not tested: see TESTING_CHECKLIST.md.

## New pages (all NEW files; routes, sitemap, prerender, OG card and nav are wired)

| File | Purpose | Fixes |
|---|---|---|
| `src/data/gpaPages.ts` NEW | Page data for the 3 new pages. Every number in the copy is computed from the same helpers the tools use. | P1 #3, P3 (weighted GPA cluster), P4 pillar/supporting pages |
| `src/components/tools/WeightedGpaTool.tsx` NEW | Weighted GPA calculator: courses, grade, level, credits, your own honors/AP bonus. Labels, `aria-invalid`, `role="alert"`, numeric keyboard. | P1 #3, P3 |
| `src/components/tools/MissCalculatorTool.tsx` NEW | "How many questions can I miss?" for any test size 1 to 1000, A–F or plus/minus, custom target. | P3 (one tool instead of thin per-N pages) |
| `src/utils/gpaMath.ts` NEW | `calculateWeightedGpa` (credit-weighted, F gets no bonus). | P1 #3 |
| `src/utils/missMath.ts` NEW | `maxWrongForMinPercent`, `buildMissTable`; same rounding rule as the chart. | P3 |
| `public/og-cards/weighted-gpa-calculator-1200x630.png` NEW | Share card (CHK-01 requires one per page). | P2 social tags |
| `public/og-cards/weighted-vs-unweighted-gpa-1200x630.png` NEW | Share card. | P2 |
| `public/og-cards/how-many-questions-can-i-miss-1200x630.png` NEW | Share card. | P2 |

New URLs: `/weighted-gpa-calculator/`, `/weighted-vs-unweighted-gpa/` (guide, schema type `WebPage`), `/how-many-questions-can-i-miss/`.

## Existing files changed (all OVERWRITES)

| File | What changed | Fixes |
|---|---|---|
| `src/data/seoConfig.ts` | Homepage title `EZ Grader Chart & Easy Grade Calculator \| Easy Grade Tool` and meta (157 chars). `/grade-calculator/` title/meta no longer mention "Final Exam Score" and the keyword `final exam grade calculator` is removed. `/gpa-calculator/` meta trimmed to 130 chars and `weighted vs unweighted gpa` keyword removed (moved to the guide). `schemaType` union extended; About = `AboutPage`, Privacy and Terms = `WebPage`. | P1 #1, #4, #9, #11; P2 #5; P6 #7 |
| `src/utils/seoHtmlInjector.ts` | Application-only schema fields (`applicationCategory`, `offers`, `featureList`, `operatingSystem`, ...) only for application types. Tool pages can declare `schemaType: 'WebPage'`. | P2 #5 |
| `src/components/SEO.tsx` | Same schema fix for client-side navigation; accepts the new types. | P2 #5 |
| `src/components/AboutMethodology.tsx`, `PrivacyPolicy.tsx`, `TermsOfService.tsx` | Pass `schemaType` through. About shows the owner's name. | P2 #5; P4 E-E-A-T |
| `src/data/siteIdentity.ts` | `SITE_OWNER` set to Muhammad Mansoor Haidar (owner and developer), as you confirmed. `sameAs` left empty on purpose. `ACADEMIC_REVIEWER` stays `null`. | P4 E-E-A-T |
| `src/components/ToolPage.tsx` | Footer byline names the owner; renders `lookupTables`; hides the tool section on guide pages; wires the 2 new tools; passes `schemaType`. | P4, P3, P1 #3 |
| `src/data/toolPages.ts` | `ToolPageTable` + `lookupTables` + `schemaType` on the entry type; registers the 3 new pages; adds a percent-to-letter lookup table and "What grade is 75 percent?" to the letter grade page; "What grade is 44 out of 60?" to the test grade page; shortens the test page meta from 162 to 151 chars. | P3 (quick answers), P1 #11 |
| `src/data/gradingScalePages.ts` | Size pages: title `N-Question Test Grading Scale & Score Chart`; intro now leads with the answer (value per question and the most you can miss for A/B/C/D). Hub: adds A–F and plus/minus tables. | P3 (answer-first, hub intent), P1 title pattern |
| `src/data/programmaticSeoData.ts` | Final exam page: title `Final Exam Grade Calculator — What Score Do You Need?` (matches the H1), meta, and a new FAQ for "final worth 20%". | P1 #4, P3 |
| `src/data/homeContent.ts` | New FAQ "Is this the same as EZGrader or an EZ grader online?"; the print FAQ now mentions Download PDF. | P1 #1, P6 #1 |
| `src/components/GradeCalculator.tsx` | Homepage H1 `EZ Grader Chart & Easy Grade Calculator` and an EZ grader subline; size links get crawlable anchor text (`5-question grading scale`, visually still `5`); removed a mismatched `aria-label`. | P1 #1, #6; P6 #7, #3 |
| `src/components/QuickGrader.tsx` | New **Download PDF** button next to Print (both in the settings panel and the chart header); "Jump to the chart" link on phones; keyboard-shortcut hint hidden below `md`; accessible-name mismatches removed. | P6 #1, #2, #3, #8, #9 |
| `src/components/QuickChartTable.tsx` | The score cell reads `44/60` instead of `44`. | P3 (X-out-of-Y queries) |
| `src/components/QuickGradeGuide.tsx` | Text mentions Print chart or Download PDF. | P6 #1 |
| `src/components/GpaCalculator.tsx`, `LoanCalculator.tsx`, `MortgageCalculator.tsx`, `TipCalculator.tsx`, `PasswordGenerator.tsx`, `PercentageCalculator.tsx`, `CgpaToPercentage.tsx`, `GpaToPercentage.tsx`, `QuickGradeCalculator.tsx`, `AboutMethodology.tsx`, `Footer.tsx` | Light-mode label colour `text-slate-400` (2.56:1 on white) changed to `text-slate-600 dark:text-slate-400`; footer close icons to slate-500. GPA and grade print buttons lose a mismatched `aria-label`. | P6 #3, #4 |
| `src/components/Footer.tsx` | Removed the duplicate "Average Grade" link; added the 3 new pages to the footer; removed the `/api/share` call that a static host cannot answer. | P1 #13; P2 #6; P6 #5 |
| `src/data/navItems.ts` | "Weighted GPA" added to the Tools menu (GPA group). | P3, P4 internal links |
| `src/App.tsx`, `src/data/selfManagedSeo.ts`, `src/utils/lazyRoutes.ts` | Routes, self-managed SEO paths and chunk preload for the 3 new pages. | P1 #3 |
| `scripts/prerender.ts` | Also writes `dist/_redirects` (301 lines for every legacy URL). GitHub Pages ignores it; Cloudflare Pages and Netlify honour it. | P2 #2 |
| `scripts/generate_og_cards.py` | Reads the size list from `src/data/gradingScaleSizes.ts`; adds the 3 new cards; new `--missing` flag creates only missing cards. | P2 #8 |
| `scripts/verify-academic-math.ts` | 12 new checks for weighted GPA and wrong-answers-allowed math. | P2 (programmatic safety) |
| `.github/workflows/deploy.yml` | Build step passes optional `VITE_FORM_ENDPOINT` and `VITE_FORM_ACCESS_KEY` secrets so the forms can work on static hosting. | P2 #6; P6 #5 |
| `public/sitemap.xml`, `scripts/sitemap-hashes.json` | Regenerated by the build (38 URLs). CI regenerates them anyway. | P1 #14, P2 #9 |

## Flagged: things I was unsure about (please review)

1. **Homepage title order.** It now starts with "EZ Grader Chart" instead of "Easy Grade Calculator". This favours "ez grader" (13 impressions) and "ez grader chart" (392 volume) over "easy grade calculator" (9 impressions). If rankings for the old phrase drop, revert only `SEO_HOME.title`.
2. **Weighted GPA assumptions.** The tool gives no bonus to an F and starts at +0.5 honors and +1.0 AP/IB. Those are inputs, not claims, but check them against how you want the tool to behave. The page title deliberately does not say "5.0 scale".
3. **Guide wording.** "Some colleges recalculate GPA" is hedged, but no outside source is cited. Add one before you rely on it (see MANUAL_TODO.md).
4. **Sitemap lastmod.** The build uses the machine's date. After you build in CI the dates will be CI's date. That is expected.
5. **Download PDF.** It calls your existing `exportPdf()`. I could not click it in a browser, so test it on a phone and desktop.
6. **Not changed on purpose** (needs your decision or is host-level): noindex for Tip/Loan/Mortgage/Password; real 301s, security headers and CSP (GitHub Pages cannot do them: see MANUAL_TODO.md); removing the one-item homepage BreadcrumbList (low value, schema code is shared); splitting the 3,643-word GPA page; the service-worker silent reload in `src/main.tsx`; deleting `NumericKeypad.tsx` and the stray patch folders in the repo root (a zip overlay cannot delete files).
7. **Not built, by design.** "What grade is X out of Y" pages (thin-page risk at your current demand); standalone "how many can I miss" pages per N (the new calculator covers every N); new test sizes (no demand data).
8. **Not built yet, from the content plan.** how-to guides, 10-point/7-point/plus-minus scale pages, printable PDF hub, percent-to-GPA and extra-credit tools, rubric calculator. They follow the same pattern as `gpaPages.ts`: add an entry, add a tool component if needed, add an OG card, run the build.
