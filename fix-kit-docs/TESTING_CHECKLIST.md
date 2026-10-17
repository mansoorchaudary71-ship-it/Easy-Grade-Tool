# TESTING_CHECKLIST: how to verify each fix

I could not open a browser, so everything marked **BROWSER** has not been tested by me.

## A. Automated (run locally, all passed on my side)
- [ ] `npx tsc --noEmit` prints nothing.
- [ ] `npx tsx scripts/verify-academic-math.ts` ends with "all checks passed" (12 new weighted-GPA and wrong-answers checks).
- [ ] `npm run build` ends with "All 17 pre-launch regression checks PASSED".
- [ ] `dist/sitemap.xml` has 38 `<loc>` entries and includes `/weighted-gpa-calculator/`, `/weighted-vs-unweighted-gpa/`, `/how-many-questions-can-i-miss/`.
- [ ] `dist/_redirects` exists (only used if you move to Cloudflare Pages or Netlify).

## B. Page by page (BROWSER: `npm run dev`, then production after deploy)
| Check | Pass condition | Fixes |
|---|---|---|
| `/` | H1 reads "EZ Grader Chart & Easy Grade Calculator"; subline mentions "EZ grader chart online"; FAQ has "Is this the same as EZGrader or an EZ grader online?" | P1 #1 |
| `/` Download PDF | Click **Download PDF** (settings panel and chart header): a PDF of the chart downloads. Click **Print chart**: the print dialog opens. Try on a phone. | P6 #1 |
| `/` on a phone | "Jump to the chart" link appears under the buttons and scrolls to the chart; the keyboard-shortcut line is hidden | P6 #2, #8 |
| Chart table | The correct column shows `44/60` style values | P3 |
| `/weighted-gpa-calculator/` | Defaults show Weighted 4.17 and Unweighted 3.67. Change a grade, a level, a credit and the bonus: both numbers update. Enter `0` credits or `abc`: an error appears and the result excludes that course. Bonus above 2: error. | P1 #3 |
| `/how-many-questions-can-i-miss/` | 25 questions, A: "miss up to 2" (92%); B: 5; C: 7; D: 10. Switch to Plus / minus and Custom percentage. Enter `0` or `abc` questions: an error appears. | P3 |
| `/weighted-vs-unweighted-gpa/` | Side-by-side table shows 3.67 and 4.17, no calculator box | P1 #3 |
| `/letter-grade-calculator/` | "What grade is 75 percent?" says C on both scales; the percent table runs 100% to 60% | P3 |
| `/test-grade-calculator/` | "What grade is 44 out of 60?" says 73.3% | P3 |
| `/grading-scale/` | A–F and plus/minus tables appear above the size list | P3 |
| `/grading-scale/25-questions/` | First paragraph states the per-question value and the most you can miss | P3 |
| `/final-exam-grade-calculator/` | New FAQ "If my final is worth 20 percent…" appears | P3 |
| Keyboard | Tab through the home page and the two new tools: every control reachable, visible focus ring, errors announced | P6 #3 |
| Footer | One "Average Grade" link only; Share button still copies or shares the URL | P1 #13 |

## C. Structured data
- [ ] Google Rich Results Test (search.google.com/test/rich-results) on `/`, `/weighted-gpa-calculator/`, `/weighted-vs-unweighted-gpa/` and `/about/`: FAQ and breadcrumb valid, no errors.
- [ ] Schema.org validator (validator.schema.org) on `/about/`: type is `AboutPage` and there is no `offers` or `applicationCategory`.
- [ ] `/weighted-vs-unweighted-gpa/` is a `WebPage`; the calculator pages are `WebApplication`.
- [ ] Person author on tool pages shows "Muhammad Mansoor Haidar".

## D. Speed and accessibility
- [ ] PageSpeed Insights (pagespeed.web.dev), mobile, on `/`, `/grade-calculator/`, `/weighted-gpa-calculator/`: record LCP, INP, CLS before and after.
- [ ] Lighthouse accessibility score and an axe scan on `/` and the two new tools. The `text-slate-400` label fixes should remove the contrast failures.

## E. Search Console (after the deploy)
- [ ] URL Inspection on the 3 new URLs and on `/`: "URL is available to Google" after you request indexing.
- [ ] Sitemaps report: `https://www.easygradetool.com/sitemap.xml` reads 38 discovered URLs.
- [ ] URL Inspection on `/grading-scale/12-questions/`, `/15-questions/`, `/16-questions/`, `/35-questions/`, `/75-questions/`: user-declared canonical equals Google-selected canonical.
- [ ] `npm run check:live` reports the live GPA page matches the repo.
