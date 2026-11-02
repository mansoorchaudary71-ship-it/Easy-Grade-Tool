# CHANGES — Homepage SEO tasks completed (2026-11-02)

Upload ONLY this zip's contents to the repo root (folder paths preserved), then push.
No other package is needed for this task. This repo copy already contains the
v5 white background, so nothing here conflicts with it.

## Correction to the earlier audit report (please read first)

The audit report said the homepage FAQ and the Article schema were "not done".
That was wrong, and re-checking the code proved it:

- **FAQ: already done, no change made here.** The homepage renders a visible FAQ
  section (20 questions from `HOME_FAQS`) at the bottom of the guide, via
  `GradeCalculator → EducationalGuide → QuickGradeGuide`. The emitted FAQPage
  schema matches that visible text 1:1 (launch audit CHK-10 passes). Adding a
  second FAQ section would have duplicated content, so none was added.
- **Article schema: already existed, but only in the browser.** `EducationalGuide`
  injected it with JavaScript after page load, so crawlers that do not run
  JavaScript could not see it in the served HTML. That gap is now closed (see 4).

## What changed

1. **Title — exact keyword first** (`src/data/seoConfig.ts`)
   - Was: `EZ Grader Chart & Easy Grade Calculator | Easy Grade Tool`
   - Now: `Easy Grade Calculator & EZ Grader Chart | Easy Grade Tool`

2. **H1 — exact keyword first** (`src/components/GradeCalculator.tsx`)
   - Was: `EZ Grader Chart & Easy Grade Calculator`
   - Now: `Easy Grade Calculator & EZ Grader Chart`
   - Weighted-calculator H1/title untouched (different keyword).

3. **First paragraph — exact keyword added** (`src/components/GradeCalculator.tsx`)
   - The paragraph under the H1 now reads: "This easy grade calculator and EZ
     grader chart online: enter the number of questions to see the percentage
     and letter grade for every number of wrong answers, then print the chart
     or save it as a PDF."
   - Previously that paragraph had no exact-phrase match; the only exact-phrase
     paragraph was far down the page inside the guide.

4. **Article schema — now in the served HTML** (3 files)
   - NEW `src/utils/guideArticleSchema.ts`: the existing Article schema moved
     here verbatim as a pure module (no React), so one definition serves both
     the browser and the prerender step.
   - `src/components/EducationalGuide.tsx`: imports it (and re-exports it, so
     existing imports keep working). No visible change.
   - `src/utils/seoHtmlInjector.ts`: emits the same Article JSON-LD into the
     prerendered HTML for `/` and `/grade-calculator` only, under the same tag
     id (`schema-org-guide-article`) the browser sync already uses — verified:
     exactly one such tag in the built homepage, no duplicates.

5. **Images — 1 → 4 on the homepage** (`src/components/QuickGradeGuide.tsx`)
   - Added 3 figures using the site's existing guide photos (no new images,
     no stock photos), all lazy-loaded through the existing responsive
     `SemanticGuideImage` component:
     - Test-grade photo, alt: "Multiple-choice test score card with marked
       answers beside a result showing 42 out of 50, equal to 84 percent and
       grade B" (in "Easy Grader vs. Manual Grading").
     - GPA photo, alt: "Graduation cap and diploma beside an official
       university transcript, calculator and pen on a desk" (in "Best Free
       Grading Tools for Teachers").
     - Final-exam photo, alt: "Final exam checklist beside a gauge showing
       the score needed to get an A" (in "How Grades Connect Across Tools").
   - Plus the existing guide image at the top (study desk alt text) = 4 content
     images, within the requested 3–5.

## Already done, verified, no change

- **FAQ section**: visible on the homepage, 20 questions, schema matches 1:1.
- **Internal links**: homepage links to /test-grade-calculator/, /grading-scale/,
  /gpa-calculator/, /final-exam-grade-calculator/, /grade-calculator/ and more
  (verified in the built HTML).
- **The 13 other exact-phrase keyword variants** (e.g. "easy grade calculator
  free", "easy grader calculator online") were deliberately NOT forced into the
  homepage copy — stuffing every variant into one page reads unnaturally and
  risks harming the page. Several variants are covered by their own dedicated
  pages (e.g. /test-grade-calculator/ for "test grade calculator"), and the
  concepts (free, online) already appear naturally in the copy.

## Verification (before packaging)

- Clean build: exit 0 (`rm -rf dist` first).
- Pre-launch audit: 17/17 PASS, including CHK-10 schema honesty.
- Built homepage checked directly: new title, new H1, first paragraph with the
  exact keyword, one Article script tag, one visible FAQ question set, 4 images
  with descriptive alt text, internal links present. Built weighted page checked:
  Article script with the weighted headline present.
- No tools, pages, links, calculations or routes changed. No content removed.

## Added later the same evening: transparent website header

This zip supersedes the earlier `egt-seo-homepage-tasks-UPLOAD-TO-REPO-ROOT.zip`
— it contains everything from that package plus the header change below, so
upload THIS zip only.

- The site header is the single sticky bar rendered by `SiteHeader` (in
  `App.tsx`) around `Navbar`. Its visible surface came from one rule, not from
  the header component itself: `.elev-chrome` in `src/styles/premium.css`
  (solid white + hairline). The old frosted-bar rules in `src/styles/lumen.css`
  are dead code — that stylesheet is never imported — so nothing there needed
  changing.
- `src/styles/premium.css`: `.elev-chrome` is now `background-color:
  transparent; background-image: none; border-bottom: none; box-shadow: none`.
- `src/styles/coursera.css`: `.elev-chrome.is-scrolled` shadow removed
  (`box-shadow: none`), so the bar does not regain a floating shadow on scroll.
- Unchanged on purpose: header layout, logo, nav links, the grey search pill,
  the blue call-to-action pill, and the sticky behaviour. The hairline-colour
  rule left in `src/styles/typography.css` is now inert (it colours a border
  that no longer exists).
- Please note: the header is still sticky, so when you scroll, page content
  passes underneath the now see-through bar. That is what a fully transparent
  sticky header does. If you would rather have it turn solid once you scroll,
  say so and that variant is a one-rule change.
- Verification: clean build, 17/17 audit, and the built stylesheet checked
  directly — `.elev-chrome` compiles to transparent with no border and no
  shadow, in both normal and scrolled states.

