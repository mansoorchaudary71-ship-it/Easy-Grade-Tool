# CHANGES — GSC rectification, built on the latest repo (2026-10-28)

## Base
Built on the repo zip sent 2026-10-28, which already contains: NOVA II +
dribbble-type (imported last, correct order), the MobileDock removal, and the
2026-10-26 keyword SEO round (seoKeywordMap + seoExtras: per-size FAQs and
sections built from real Search Console queries). This package does NOT redo
any of that — it only strengthens the grading-scale template on top of it.

## Files changed (1)
- `src/data/gradingScalePages.ts` — only this file.

## What changed (template-wide, all 17 grading-scale size pages)
1. **Titles** — now use the phrasing people actually search:
   `Grading Scale for 16 Questions: Percent & Letter Chart`
   (was: `16-Question Test Grading Scale & Score Chart`). All titles stay
   under 65 characters and unique per page.
2. **Meta descriptions** — now end with the computed example plus
   "Printable, free", e.g. for 16 questions:
   "16-question grading scale: each answer is worth 6.25%. Percentage and
   letter grade for every score, e.g. 2 wrong = 87.5%. Printable, free."
   All descriptions stay under 175 characters and unique per page.
3. **Internal links** — the "Related grade calculators" block grows from 5 to 7
   links with size-specific blurbs: added `/grade-curve-calculator/` and
   `/letter-grade-calculator/` alongside the existing neighbour sizes, index,
   Quick Grade and test-grade links.
4. **New section** — "Minimum correct answers on a/an N-question test": the
   lowest correct count that still earns each letter, computed from the same
   chart math (e.g. 16 questions: A needs at least 15 correct, 93.8%; pass
   starts at 10 correct, 62.5%). This ladder does not duplicate anything the
   keyword round adds — it adds the achieved percentages.
5. **New FAQ, conditional** — "What score do I need to pass a/an N-question
   test?" with the computed pass mark per size, added on every size EXCEPT
   60 and 20 questions, where the keyword round already adds a passing-score
   FAQ. Adding a second one there would have duplicated it, so the template
   checks the keyword map and skips those two sizes.

## What was deliberately NOT changed, and why (from the fresh GSC report)
- **Other high-impression pages were not churned.** Final-exam (355
  impressions @ 30.78), average-grade (257 @ 32.98), grade-calculator
  (159 @ 28.51), gpa-calculator (178 @ 18.71) and the grading-scale index
  (126 @ 51.06) sit at positions 18–51. Their titles are already
  keyword-strong (final-exam title checked: "Final Exam Grade Calculator —
  What Score Do You Need?"). Those positions are an authority/competition
  problem, not a title defect, so changing their titles would be churn
  without evidence. The boundary pages at positions 7–11 are where title +
  depth + links can actually move the needle, and they are all covered by
  this template change.
- **No noindex anywhere.** Checked against Google's 2026-10-26 guidance
  ("only index content meant for search"): every sitemap page earns
  impressions, and nothing on the site is link-shared user-generated content,
  so no page qualifies for removal from the index.
- **No invented numbers.** Every new number is computed from the same chart
  functions the calculators use.

## What the fresh GSC report actually showed
- The daily chart in the new export is IDENTICAL to the previous one:
  Oct 4–25 only, 5,390 impressions / 17 clicks. Oct 26–27 data has still not
  landed (Search Console lags ~2 days), so whether the Oct 24–25 dip
  rebounded is STILL unanswered — the next export should show it.
- The full page table (3-month view) confirms the boundary cluster is wider
  than the top 5: 15 questions 213 @ 9.71, 75 questions 201 @ 9.64,
  30 questions 81 @ 9.94, 50 questions 245 @ 11.09, 60 questions 237 @ 10.03,
  100 questions 183 @ 10.27, 40 questions 16 @ 7.69, 12 questions 128 @ 7.79 —
  all covered by this template change.
- The query table confirms the title choice: "grading scale for 16
  questions" (12 @ 8.83) is now matched exactly by the new title, and the
  "how many can I miss / how much is each question worth" queries are
  already answered by the keyword-round FAQs on those pages.

## Verification (2026-10-28, on the sent repo copy)
- The sent repo copy builds clean here (exit 0, launch audit 17/17) BEFORE
  this change — see the deploy note below.
- After this change: clean build exit 0, launch audit 17/17 PASS, including
  CHK-03 (page SEO), CHK-08 (content uniqueness), CHK-10 (FAQ schema matches
  visible text) and CHK-11 (no duplicate titles). The pre-build scale-page
  check (no FAQ answer repeated across pages) also passes.
- Built-page spot-checks: 16 questions shows the new title, meta, section,
  pass FAQ and curve link; 35 questions shows the new title and pass FAQ;
  60 and 20 questions show the new section and the keyword round's own
  passing-score FAQ, with this package's pass FAQ correctly ABSENT (0 matches).

## Upload
Upload THIS zip alone to the repo root, then push. Do NOT also upload the
earlier strengthen zip from today (egt-strengthen-top-pages-...): it contains
an older version of this same file with an unconditional pass FAQ, which
would reintroduce a duplicate pass FAQ on the 60- and 20-question pages.

## Deploy-failure note (important)
This repo copy builds perfectly here, so the 2026-10-27 build failures
(commits 9516a55 and fa14199) are NOT caused by anything in these files.
The failure came from files added after this copy, or from the upload
itself. If your GitHub HEAD is newer than this copy, send a fresh download
(or the build-log error lines) and the failure can be diagnosed exactly.
Uploading this package does not by itself resolve that failure.

## No ranking guarantee
This gives the boundary pages a better shot at holding page 1; movement, if
any, takes days to weeks and shows up in Search Console, not overnight.
