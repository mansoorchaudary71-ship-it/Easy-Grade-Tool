# Easy Grade Tool — Audit Fixes (2026-10-24)

Implements the fixes from the full technical + content audit of 2026-10-24 against your top-10 competitors.
**This package contains ONLY the changed and new files** (33 files), each in its correct repo-relative path.
Extract over your repo root, review the diff in GitHub Desktop / VS Code, commit, and deploy as usual
(`npm run build` — the build regenerates `public/sitemap.xml`, which is also included here already updated).

**Verification done before packaging:** `npm ci` + `npm run build` on this exact code —
all math checks pass, all page checks pass, and the post-build launch audit passes **17/17 (CHK-01…CHK-17)**.
One pre-existing TypeScript error in `src/utils/toolPreloader.ts` exists in your original code too
(your build does not run `tsc`, so it does not block anything) — left untouched.

---

## What changed, gap by gap

### 1. /for-schools/ embed programme — NEW (audit gap #1, highest ROI)
- `src/data/forSchoolsPage.ts` (new), `src/components/tools/ForSchoolsEmbedTool.tsx` (new):
  page with a working configurator (5 calculators × width × school name) that generates embed code,
  plus a poster text and newsletter blurb with copy buttons, the plain-language free licence
  (credit line stays), and a privacy section.
- Embed mode: `src/App.tsx` now supports `?embed=1` — header, footer and update prompt are not rendered,
  a small "Free grading tools by Easy Grade Tool" credit bar shows inside the frame, and `src/index.css`
  gained `.embed-mode` rules that hide everything on a tool page except the tool itself.
- Note: embeds work on GitHub Pages as-is. If you later put Cloudflare in front with `public/_headers`,
  change `frame-ancestors 'self'` or embeds will be blocked.

### 2. Weighted GPA page depth (audit gap #2) — 1,014 → ~2,020 words
`src/data/gpaPages.ts`: added a full six-course worked example (all numbers computed by the site's own
`calculateWeightedGpa`, so they can never drift), a complete grade-points table by course level
(regular / honors / AP-IB), a "straight A's by schedule" table, a "how many AP classes for a 4.5" section,
a common-mistakes section, and a 5.0-ceiling section; +4 FAQs. Bonus-table numbers are generated, not typed.
`weighted-vs-unweighted-gpa` also expanded (~830 → ~1,230 words): transcript/application guidance,
weighted→unweighted conversion explained, +2 FAQs.

### 3. New calculator pages (audit gap #3)
- `/semester-gpa-calculator/` — `src/components/tools/SemesterGpaTool.tsx` (new) + page content in
  `gpaPages.ts`. Course rows, quality points shown, pass/fail guidance.
- `/cumulative-gpa-calculator/` — `src/components/tools/CumulativeGpaTool.tsx` (new) + content.
  Combines previous GPA/credits with this semester, plus a "target GPA → semester GPA needed" solver
  that honestly reports when a target needs > 4.0 in one semester.
- Both wired everywhere: routes (`App.tsx`), SEO self-management list (`selfManagedSeo.ts`), preloads
  (`lazyRoutes.ts`), nav + tools menu (`navItems.ts`), footer links (`Footer.tsx`), sitemap (automatic).

### 4. Save-on-device (audit gap #4)
- `WeightedGpaTool.tsx` and the new `SemesterGpaTool.tsx` now persist courses + bonus settings in the
  browser's local storage (this device only, nothing uploaded), with a Reset-to-example button.
  The weighted GPA FAQ that used to say "nothing is stored" was rewritten to match.
  (The homepage Quick Grader already persisted its settings — verified in your code, no change needed.)

### 5. Grade curve: bell curve added (audit gap #6)
- `src/utils/academicMath.ts`: new `bell` method (z-score rescale onto a chosen average + spread,
  rank order preserved), with validation. `GradeCurveTool.tsx`: Bell curve option + average/spread inputs.
- Copy updated honestly everywhere it claimed "four methods / never lowers a score"
  (`src/data/toolPages.ts`, `src/data/toolGuideContent.ts`): four methods never lower a score;
  the bell curve can, and the copy now says so.
- (Square-root curve already existed in your code — verified, no change needed.)

### 6. 7-point scale preset (audit gap #5)
- `src/utils/academicMath.ts`: `SCALE_SEVEN_POINT` (A 93 / B 86 / C 79 / D 72).
- `src/types.ts` (`GradingScaleType` now includes `'seven'`), `src/data/constants.ts`
  (`GRADING_SCALES.seven`), `QuickGrader.tsx` (third option in Advanced → Grading scale, persisted
  like the others, correct label in results), `src/utils/pdfExport.ts` (PDF headers handle the new scale).

### 7. Author byline + updated date on every tool page (audit gap #8)
- `src/components/ToolPage.tsx`: visible byline under each page heading —
  "By Muhammad Mansoor Haidar, owner and developer · Last updated October 24, 2026"
  (your pages already had a small print footer credit; it is now prominent at the top too).
- `src/data/siteIdentity.ts`: `CONTENT_REVIEWED_ON` bumped to 2026-10-24 (the build's math
  verification re-checked every formula as part of this work).

### 8. Blog / content hub (audit gap #7) — NEW
- `/blog/` index + two full guides as prerendered pages (`src/data/blogPages.ts`, new):
  "How to Grade a Stack of 30 Tests in 15 Minutes" (your campaign guest post, expanded for your own
  domain — it now builds YOUR authority instead of Telegraph's) and "When to Curve Grades"
  (all example numbers computed by `applyCurve` at build time).
- Linked from the footer (every page), the For Schools page, and each other.

### 9. Homepage Quick Answers (audit quick win)
- `src/components/HomeSections.tsx`: new top section with the four most-searched lookups
  (17/20 = 85% B, 44/60 = 73.3% C, 9/10 = 90% A, 23/25 = 92% A), each linking to the tool that checks any score.

### 10. Sitemap + OG cards
- `public/sitemap.xml` + `scripts/sitemap-hashes.json`: regenerated by the build — 6 new URLs included.
- 6 new files in `public/og-cards/`: **placeholder copies** of existing cards so social shares resolve.
  Run your `scripts/generate_og_cards.py` when convenient to replace them with branded cards.

## Already in your code (audit corrections — no change made)
- CSV export on the homepage grader already existed (plus PDF export) — audit gap #9 does not apply to Quick Grade.
- Off-topic tools (tip/loan/mortgage/password) are already visually separated into a "utility" group in
  nav and menus by your earlier fixes. Fully removing them from the homepage Tools menu is a bigger
  design call — left for you; the internal separation already limits topical dilution.

## Not in this package (next steps, in audit order)
- GPA ↔ letter programmatic conversion pages and HS/college GPA landing pages (cluster expansion).
- A multi-class final-exam planner.
- A short explainer video for the homepage / YouTube.
- Save-on-device for the main `/gpa-calculator/` page (its state model is larger; the weighted,
  semester and homepage tools now persist, which covers the most-used flows).
