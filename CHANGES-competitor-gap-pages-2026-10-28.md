# Competitor-gap pages + class session — 2026-10-28

Upload this zip alone to the repo root, then push. Changed files only: no
repo files outside this list are touched, and nothing here deletes or moves
any existing file.

## What is new

### Six new pages (competitor-gap research, 2026-10-28)

- **Target GPA calculator** — `/target-gpa-calculator/`. One page serving
  both "target GPA" and "GPA planner" / "raise my GPA" phrases. Solves the
  required average over remaining credits, flags impossible targets with the
  highest reachable GPA, and flags targets already secured.
- **Quiz grade calculator** — `/quiz-grade-calculator/`. Questions and
  misses (halves allowed) to percent, letter and a miss-allowance table per
  grade boundary, plus a per-question value.
- **Assignment grade calculator** — `/assignment-grade-calculator/`. Points
  earned/possible with a late-penalty input and an extra-credit input as the
  differentiator, showing the score with and without adjustments.
- **Points grade calculator** — `/points-grade-calculator/`. Any points
  score to percent and letter, plus the points needed for the next grade.
- **Category grade calculator** — `/category-grade-calculator/`. Course
  grade from weighted categories (homework, quizzes, tests, exams), with each
  category's point contribution. Weights are relative and need not total 100.
- **GPA converter** — `/gpa-converter/`. SGPA to percentage (×10),
  percentage to 4.0 GPA (÷25), GPA to percentage (×25) and CGPA to percentage
  (×10 or ×9.5), with every formula shown and links to the verified
  university pages.

Every page carries original copy only — no competitor text is reproduced —
and every worked number is computed from the site's shared math. Each page
has 4 sections, 6 FAQs and its own journey steps, so no two pages share
banner text.

### Retitles and rewording (same research)

- **Final grade planner** keeps its slug, path and H1; its title and meta
  now use "final grade calculator" phrasing.
- **Grading scale index** is rebranded as the **Grading Scale Generator**
  (H1, title and meta); its nav label stays "Grading Scales" and its charts
  are unchanged.
- **Weighted GPA page** gains the "weighted grade calculator" keyword and a
  new section explaining weighted grade (course percent) versus weighted GPA
  (transcript average), with a link to the weighted grade calculator. Its
  GPA purpose, title and meta are unchanged.

### Revamps

- **Grade curve page**: new cube-root curve guide content (raw 27 → 64.6,
  64 → 86.2, 8 → 43.1, computed) and a new guide section on explaining a
  curve to a class without losing trust, plus 3 new FAQs. No tool or logic
  change. NOTE: the two core pages render a long-form guide instead of
  entry sections, so the new methods content was added as visible guide
  blocks in `toolGuideContent.ts` (appending sections in `toolPages.ts`
  would have been invisible) plus FAQs.
- **Letter grade page**: new standard-versus-plus/minus comparison guide
  content (91, 83, 79, 68 on both scales, computed from the shared scales),
  a guide section on checking your school's scale, plus 3 new FAQs. No tool
  or logic change.

### Internal links

- All 6 new pages are linked from the site footer, so every one is one click
  from the homepage (launch audit CHK-16).
- Every verified university CGPA page now links to the GPA converter hub,
  and the hub links back to the CGPA calculator and five university pages
  (VTU, Mumbai University, MAKAUT, GTU, SPPU). The footer already linked all
  26 university pages; this strengthens hub connectivity rather than fixing
  a failure.

### Class session mode in the EZ grader (NEW — user-approved scope addition)

The EZ grader chart (homepage and `/grade-calculator/`) already had
half-point grading, custom cutoffs, keyboard shortcuts (Enter/R to save,
arrow keys to adjust) and a CSV copy/download. This package completes it
into a full session mode:

- **Save-and-next**: after saving a paper, the wrong-answers field clears
  and the keyboard focus returns to it, so the next paper is one typed
  number plus Enter away.
- **Session summary**: papers graded, running class average, highest and
  lowest scores, and letter-grade counts.
- **Papers list**: every graded paper (number, wrong, correct, score,
  letter) in a compact table — no names are ever collected.
- **Device-only persistence**: the graded-papers list is now saved in
  localStorage alongside the existing saved settings, so a reload keeps the
  session. Nothing is uploaded or stored on any server, consistent with the
  site's "private, no data stored" promise. "Clear session" wipes it.
- **Copy-to-gradebook output**: the existing CSV copy/download now exports
  the persisted session list and pastes straight into a spreadsheet or
  gradebook.

Half-point, custom-scale and rounding controls needed no new work: they
already exist in the EZ grader (half-points toggle, custom cutoffs under
Advanced settings, whole-number / 1-decimal precision) and are untouched.

## What is deliberately NOT in this package

- Session-based class grading beyond the EZ grader panel above (nothing
  else was needed — the panel now covers it).
- GPA scale hub, honors/AP GPA pages, standalone curve-method pages, US
  university GPA pages, rubric/class-average/printable-charts hub, and
  guides/trust pages: still open from the research action list, as separate
  follow-ups.
- No grade-tier colours, per-tool icon hues, primary blue (#0056D2),
  calculator logic, routes or schemas changed, beyond the new pages, links
  and copy above.

## Files in this package

- `src/data/competitorGapPages.ts` (new)
- `src/components/tools/QuizGradeTool.tsx` (new)
- `src/components/tools/TargetGpaTool.tsx` (new)
- `src/components/tools/GpaConverterTool.tsx` (new)
- `src/components/QuickGrader.tsx` (class session mode)
- `src/data/toolPages.ts` (registry + grade-curve / letter-grade FAQ revamps)
- `src/data/toolGuideContent.ts` (grade-curve / letter-grade guide revamps)
- `src/components/ToolPage.tsx` (tool wiring + journey steps)
- `src/App.tsx` (6 new routes)
- `src/components/Footer.tsx` (6 new footer links)
- `src/data/gpaPages.ts` (weighted-grade wording + one enrichment section on the weighted-vs-unweighted page)
- `src/data/gpaLetterPages.ts` (one enrichment section + FAQ on the letter-to-GPA page)
- `src/data/gradingScalePages.ts` (grading scale generator branding)
- `src/data/finalPlannerPage.ts` (final grade calculator phrasing)
- `src/data/cgpaUniversityPages.ts` (GPA converter link on every university page)
- `src/data/legacyRedirects.ts` (removed the `/quiz-grade-calculator` alias, which collided with the new real page)
- `scripts/generate_og_cards.py` (6 new share cards)
- `public/og-cards/target-gpa-calculator-1200x630.png` (new)
- `public/og-cards/quiz-grade-calculator-1200x630.png` (new)
- `public/og-cards/assignment-grade-calculator-1200x630.png` (new)
- `public/og-cards/points-grade-calculator-1200x630.png` (new)
- `public/og-cards/category-grade-calculator-1200x630.png` (new)
- `public/og-cards/gpa-converter-1200x630.png` (new)
- `CHANGES-competitor-gap-pages-2026-10-28.md` (this file)

## Verification (2026-10-28, work copy built from the Oct 28 rectification state)

- `rm -rf dist && npm run build`: **exit 0**.
- Launch audit `scripts/verify-launch.ts`: **17/17 PASS** (CHK-01–CHK-17),
  including CHK-08 content uniqueness and CHK-16 one-click-from-homepage
  (footer links count).
- Pre-build checks pass: titles ≤65 chars unique, metas ≤175 unique,
  ≥3 FAQs and ≥2 sections per page, no FAQ answer repeated across pages,
  every page in the sitemap, no redirect source in the sitemap.
- Sitemap: **82 URLs** (76 before + 6 new pages).
- Served-preview spot-checks (vite preview on the built `dist/`):
  all 6 new pages return their exact titles and metas; one FAQ per new page
  confirmed present; tool markers confirmed (miss allowance, required GPA,
  SGPA conversion, Homework rows); grade-curve page shows the cube-root
  guide and trust section; letter-grade page shows the standard-vs-plus/minus
  comparison and school-scale guide; grading-scale index title and
  final-grade-planner title confirmed retitled; weighted-GPA page shows the
  weighted-grade-vs-GPA section; a university page (VTU) links to the GPA
  converter; the homepage shows the "Class session" panel with its
  device-only wording; the category page contains no copy of the homepage
  EZ-grader guide.
- Three audit-driven fixes found during verification (all in this package):
  (1) the legacy `/quiz-grade-calculator` redirect alias collided with the
  new real page and was removed; (2) the category page initially rendered
  the homepage's 2,180-word EZ-grader guide via GradeCalculator, failing
  CHK-08 at 26% uniqueness — it now renders with `hideSeo` (69.9%);
  (3) two existing pages dipped marginally below CHK-08's 60% line as the
  page pool grew (letter-to-GPA 59.7%, weighted-vs-unweighted 59.5%) and
  each gained one original enrichment section (letter-to-GPA now 63.3%).
- Baseline before these changes (unmodified work copy): exit 0, 17/17.
