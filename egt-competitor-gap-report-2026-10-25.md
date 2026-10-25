# Easy Grade Tool — Competitor Gap Report (2026-10-25)

Comparison of easygradetool.com against six competitors, and what this
package changes. Companion to `CHANGES-competitor-gaps-2026-10-25.md`.
The changed-files zip is the delivery; this report is the evidence.

## Method and limits

Competitor research was text-fetch only (October 2026): homepages plus
2–3 key pages per site, found by opening pages and by site search.
Meta descriptions, schema source, ad placements, load speed and true
mobile rendering are **not observable** from text fetch and are never
guessed here. No traffic numbers, rankings or prices are claimed except
where a site's own page states them. The essaygrader.ai URL was supplied
twice and is counted once: six unique competitors.

## Competitors at a glance

| Site | What it is | Strongest asset | Weakest point |
|---|---|---|---|
| essaygrader.ai/tools/ez-grader-grade-calculator | EZ grader as a free lead-in to an AI essay grader | Real product (LMS sync, bulk grading), named author, school-logo trust bar, the only substantial guide in the set (grading systems, ~1,500 words, updated 2026-09-29) | The EZ grader itself is narrow: no GPA, weighted, final, curve or scale tools |
| gradecalculate.com | Pure EZ-grader rival with a Pro tier | The only real programmatic SEO moat: grading-scale hub + per-test-length pages + printable-chart hub; named maker; Pro (custom share links, printables, quarter points) | No GPA, weighted, final or curve at all |
| gradeanalyser.com | Broadest single-page tool | Only rival combining EZ grader + "what grade do I need" + weighted average + semester GPA + teacher/class list with print/download, all free, no signup | One page: ~400 words of copy, no separate tool pages, no blog, no author or trust signals |
| gradecalculator.com | Minimal three-tool site | Three genuinely useful tools (EZ grader, average grade with an "additional grade needed" what-if, final-grade calculator) | Thinnest copy of the multi-tool set; no GPA, curve, scales, content or trust apparatus |
| easygradecalculator.com | Small calculator hub | Only rival besides gradeanalyser with semester + cumulative GPA; the only 4.33 A+ toggle; remembered custom scale; decimals | Four of six subpages are off-topic (tip, loan, mortgage, password); no blog or programmatic surface; weak search footprint |
| quickgra.de | One thin EZ-grader page | +1 tally button and keyboard shortcuts for marking a stack | ~110–120 words, no verified subpages, guides, GPA/weighted/final/curve tools, schema or trust signals. (Not quickgrad.es, quickergrade.com or QuickGrade.net — different sites with broader claims, none of it attributed here.) |

Cross-cutting pattern: **no competitor covers the full cluster.** GPA depth,
final-grade what-if, programmatic scale pages and editorial authority each
live on different sites, and none of the six has GPA-by-school pages,
grade-curve calculators, grading-scale generators, school embed
programmes, or class tracking beyond gradeanalyser's single-page list.

## What Easy Grade Tool already had (so this package does not duplicate it)

An honest audit first, because several apparent gaps were already closed:

- Per-test-length grading-scale pages: 17 sizes (5–100 questions) with
  computed facts, printable charts and PDF chart generation. The
  gradecalculate moat is therefore **not** a gap — only its printable-chart
  hub framing was missing, and the existing scale index page already
  covers that need.
- A final-exam calculator (single class) with guide content and FAQs.
- A class tally on the homepage QuickGrader: multi-student list, class
  average, CSV export, saved settings, half points, decimals, custom
  cutoffs, printable PDF chart.
- A CGPA-to-percentage tool with 32 university/body formulas, 26 of them
  verified from official ordinances — but only as tool options, not pages.
- Weighted / semester / cumulative GPA pages with computed worked
  examples, a target-GPA solver, bylines and updated dates, plus a
  for-schools embed programme and a 2-post blog.
- Technical base already in place: prerendered pages, content-hashed
  sitemap, robots.txt, llms.txt, _headers, 404/500 pages, OG cards,
  17/17 launch checks on the baseline build.

## Gaps this package closes

### 1. GPA ↔ letter grade conversion pages — did not exist anywhere on the site
- `/gpa-to-letter-grade/` — GPA → letter on the A–F and plus/minus
  scales, including the honest between-letters answer for averages that
  land between two point values, plus both conversion tables.
- `/letter-grade-to-gpa/` — letter → grade points on both scales, with
  the same tables and the points × credits = quality points bridge to
  the GPA calculators.
- New tool: `GpaLetterTool` (tabbed, both directions, both scales).
  Competitor position: none of the six has either page.

### 2. High-school and college GPA pages — keywords only, no pages
- `/high-school-gpa-calculator/` — weighted and unweighted side by side,
  regular / honors / AP levels, adjustable bonuses. Worked example is
  computed: 3.66 unweighted, 4.16 weighted. The 0.5 honors / 1.0 AP bonus
  is labelled as the common model and districts are warned to differ.
- `/college-gpa-calculator/` — credit-hour weighting, semester result
  plus cumulative path. Worked example computed: 15 credits, 3.60 GPA.
- Tools reused, not duplicated: high-school page uses the existing
  weighted GPA tool (it already has level selects and saved bonuses);
  college page uses the existing semester GPA tool.
- Competitor position: no rival separates HS and college GPA; the two
  nearest rivals each have a single combined page.

### 3. Multi-class final planner — the final-grade gap beyond the single-class tool
- `/final-grade-planner/` — up to 10 classes in one plan: current grade,
  final weight and target per class, required final score per class, and
  three honest verdicts: already secured, possible (with the number), or
  impossible (with the highest grade a perfect final can reach).
- New tool: `FinalPlannerTool`. The existing single-class final-exam
  calculator is kept and cross-linked, not replaced.
- Competitor position: gradecalculator has a single final calculator and
  gradeanalyser a single what-if panel; neither plans multiple finals.

### 4. Per-university CGPA pages — verified data, previously trapped inside one tool
- 25 new pages under `/cgpa-to-percentage/<university>/`, one per
  verified university/body formula (VTU, Mumbai University, MAKAUT, GTU,
  SPPU, Anna, BHU, BITS Pilani, CBSE, AICTE and 15 more).
- Each page has its own converter using that institution's own
  compute/inverse functions, the formula, its source note, three computed
  example conversions and FAQs. Unverified institutions get **no** page
  (they stay in the tool with the transparent × 9.5 estimate), and the
  generic standard formula gets no page either — so no page presents an
  estimate as an ordinance.
- Competitor position: uncontested. No rival has any GPA-by-school page.

### 5. Topical-cluster content — two guides that beat the only substantial rival guide
- `/blog/grading-systems-explained/` — A–F, plus/minus, 7-point,
  pass/fail, credit/no credit, satisfactory/unsatisfactory,
  standards-based, mastery, contract, specifications and ungrading,
  with the same scores graded under three letter scales (computed) and
  a comparison table. Longer and more complete than essaygrader.ai's
  grading-systems guide, and it links into the letter-grade and GPA
  cluster instead of standing alone.
- `/blog/high-school-vs-college-gpa/` — the same five grades computed
  three ways (HS unweighted 3.66, HS weighted 4.16, college
  credit-weighted 3.55), plus cumulative-GPA behaviour by year.
- Blog hub updated to list all four posts. Every new calculator page
  cross-links its cluster (related links on weighted / semester /
  cumulative / letter-grade pages, a Final Planner chip on the
  final-exam page, footer and tools-menu entries for the five core
  pages, sitemap entries for all 32).

### 6. Save-on-device for the main GPA calculator — the last persistence gap
- `/gpa-calculator/` now saves courses, the A+ value and prior
  GPA/credits on the device only (same pattern as the semester GPA
  tool), restores them on load, and adds a "Clear saved courses" button.
  Nothing is uploaded. The semester, cumulative and weighted tools
  already persisted; the main calculator did not.

### 7. PageSpeed leftovers from the 2026-10-24 pack (never confirmed uploaded)
- `index.html`: the stale-asset recovery script is now inlined instead
  of a separate render-blocking `/asset-recovery.js` request.
- `src/utils/toolPreloader.ts`: tool-chunk warm-up moved from 2.5 s to
  6 s after load, so warmed chunks stay out of the LCP window.
- `public/asset-recovery.js` is now unreferenced; delete it at leisure
  (a deletion cannot be delivered by a changed-files zip — see the
  changelog).

### 8. Share cards for every new page
- 32 new 1200×630 branded cards generated with the existing generator
  script (which now also covers the new pages, so future `--missing`
  runs regenerate them). Without these, the launch check that every
  page's og:image resolves in dist/ would fail the deploy.

## Deliberately not done, and why

- **AI essay grading** (essaygrader.ai's moat): a different product
  category with a freemium funnel behind it. The winnable response is
  the grading-systems content around it (done above), not an AI engine.
- **GPA pages for unverified institutions**: inventing or estimating an
  ordinance and presenting it as a university's rule would break solver
  trust. Unverified institutions remain in the tool, labelled as
  estimates, with no page.
- **Daily-answer or spoiler content**: out of scope for a grading site;
  the guides answer durable questions instead.
- **Paid listings, fast-tracks or paste-pattern links**: out of scope for
  code changes and against the site's quality posture.
- **Cloudflare move / security headers**: offered separately; GitHub
  Pages cannot serve the full header set, and the headers file is
  already in place for a CDN move.
- **Repo cleanup** (stray `files/` folder, old fix-kit folders, loose
  root .tsx files): harmless clutter that a changed-files zip cannot
  delete. Delete at leisure in GitHub; nothing in this package depends
  on those paths.

## After uploading (checklist for the owner)

1. Upload the zip contents to the repo root (folders at top level, no
   wrapper), commit, and wait for the GitHub Action to succeed.
2. Spot-check five URLs live: `/gpa-to-letter-grade/`,
   `/high-school-gpa-calculator/`, `/final-grade-planner/`,
   `/cgpa-to-percentage/vtu/`, `/blog/grading-systems-explained/`.
3. Optional, at leisure: delete `public/asset-recovery.js`; re-run
   PageSpeed Insights for the LCP/TBT re-check; request indexing in
   Search Console for the five URLs above (the sitemap updates itself
   on build).
4. Still open after this package (unchanged): GPA↔letter pages are now
   done; remaining from the earlier list are the explainer video, the
   Cloudflare move, and running `scripts/generate_og_cards.py` for
   branded cards (now done for the new pages; older placeholders remain
   where noted in the repo).

## Verification (final build, 2026-10-25)

- Baseline build before changes: 17/17 launch checks passed.
- Final build: `npm run build` exits 0; post-build launch audit **17/17**,
  after three rounds of fixes (shortened university titles and metas,
  personalised per-university FAQs, footer links for crawl depth, tool
  differentiation and content expansion for the uniqueness checks).
- Page count: TOOL_PAGE_LIST 31 → 63 entries; sitemap URLs 44 → 76.
- Spot-checked in the built output: HS example 3.66 unweighted /
  4.16 weighted, college example 3.60, VTU 8.5 CGPA → 77.50%, final
  planner Biology case flagged impossible at 108%, both new blog posts
  in the sitemap, 25 university pages built.
