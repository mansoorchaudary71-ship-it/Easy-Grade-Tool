# NOVA — Full UI/UX Overhaul (2026-10-26)

**Upload this zip alone to the repo root** (folders are already at the top level).
It is cumulative over the current live site (premium redesign included). No file
outside this zip needs to change. Nothing here touches calculator logic, copy
(except the three homepage category blurbs, noted below), routes, or schema.

## Why this one is different

The last three redesigns layered new styles on top of old ones (violet vs blue,
Inter vs Mona Sans, grey vs warm canvas), so the site never felt like one new
product. NOVA ends that: **one design system, imported last, that is the final
word everywhere.** The old layers still exist underneath but no longer win.

## The system

- **Primary returns to brand blue #0056D2** (deep #00419E), the site's original
  primary. Violet appears only as a faint aurora wash inside banners — never for
  buttons, links, or text. All 247 hardcoded violet values across 27 files were
  remapped to blue (dark mode uses lighter blues #2E7CF6 / #6EA8FF).
- **Mona Sans everywhere.** Body and headings still used Inter in places; that
  inconsistency is overridden — one typeface, tight tracking, 800-weight display
  type.
- **Canvas:** true white with #F6F7F9 section washes (the grey #F3F4F6 and warm
  sand layers are gone). Ink #0B1220, muted #5B6472, hairline borders #E7E9EE.
- **Cards:** white, 20px radius, soft layered shadow, lift on hover.
- **Inputs:** white with hairline border, blue focus ring. **Buttons:** blue pill
  primary with blue shadow; quiet white secondary. **Results:** pale-blue panel
  with large tabular numerals. **Segmented controls:** soft grey track, white
  sliding pill. Grade-tier colours (A–F) and per-tool icon hues are untouched —
  they are semantic, not decoration.
- **Header:** clean white bar, no bottom border, bold plain nav, blue pill CTA,
  grey search pill on scroll (Dribbble pattern, kept). **Footer:** blue-wash
  newsletter panel, quiet link columns.
- **Motion:** gentle rise-in on banners/cards/panels, honoring reduced-motion.
- **Dark mode:** full parallel system (canvas #0B1220, surfaces #131C2E).

## New interactive layer (from a fresh read of the 7 reference sites)

These are structural patterns, rendered in EGT's own identity — no brand colours,
logos, or illustrations copied from any reference site:

- **Journey stepper on every calculator banner** (Calendly): Enter → See →
  Keep, with page-specific wording per tool (ToolPage passes its own steps).
  Page-specific wording is deliberate: identical banner text on every tool page
  tripped the launch audit's uniqueness check (college GPA fell to 58.3%); with
  distinct steps it passes again (see Verification).
- **Outcome ticker under the homepage hero** (Calendly): scrolling strip of
  verified results and facts only (85% = B example, 3.60 GPA example, 0 sign-ups,
  0 student data stored, print/PDF, 76 free pages).
- **"From scores to a plan" flow strip** (Asana/Typeform): four linked steps —
  test grade → grading scale → GPA → final-grade planner.
- **"What's new" feed** (ClassDojo): dated October 2026 items, all real and
  linking to real pages (final-grade planner, HS/college GPA, 25 per-university
  CGPA converters).
- **Pain-first category blurbs** (Typeform): the three homepage category blurbs
  now lead with the frustration ("Sunday-night grade math, done in 30 seconds")
  while keeping every functional keyword.
- **Guide + FAQ shells** restyled as white cards with the same radius/shadow.

## Deliberately NOT done

- No invented testimonials, quotes, or usage statistics (Intercom/ClassDojo
  metric walls need real quotes — none are verified, so none were fabricated).
- No count-up stats (no verified "grades computed" figure exists).
- No live tool-preview tab switcher (Asana) — the persona tabs already cover
  journey switching; a second switcher would duplicate them.
- Canva and Dribbble homepages could not be read in this pass (client blocks);
  no patterns were guessed from them. Dribbble's header findings from the
  earlier live check still stand and are kept.

## Files changed (38: 37 code/data files + this changelog)

- `src/styles/nova.css` (new — the whole system, imported last in `main.tsx`)
- `src/main.tsx` (nova import), `src/components/tools/ui.ts` (blue tokens)
- `src/components/ToolHeading.tsx` (stepper), `src/components/ToolPage.tsx`
  (per-page steps), `src/components/HomeSections.tsx` (ticker, flow strip,
  what's-new, blurbs), `src/components/AboutMethodology.tsx`,
  `src/components/PrivacyPolicy.tsx`, `src/components/TermsOfService.tsx`
  (stepper hidden on info pages)
- Violet→blue remap across: `Navbar`, `ToolNavBar`, `ToolsMenu`,
  `MobileNavDrawer`, `Logo`, `Footer`, `CutoffFields`, `GradeScaleModal`,
  `SmartCalculatorInput`, `ProgrammaticCalculatorView`, `GpaCalculator`,
  `GpaToPercentage`, `CgpaToPercentage`, `LoanCalculator`, `MortgageCalculator`,
  `PasswordGenerator`, `PercentageCalculator`, `QuickGradeCalculator`,
  `TipCalculator`, `tools/AverageGradeTool`, `tools/GradeCurveTool`,
  `ui/SegmentedControl`, `index.css`, `styles/coursera.css`,
  `styles/premium.css`, `styles/ux-refactor.css`, `styles/a11y-touch.css`
- `scripts/sitemap-hashes.json` (regenerated: all 76 URLs, lastmod 2026-10-26)

## Verification (before packaging)

- Clean build from an empty `dist/` (a stale `dist/` was found to resurrect
  old violet utilities via Tailwind's content scan — always build clean):
  `npm run build` exits 0, **launch audit 17/17 PASS**, including CHK-08
  uniqueness (college GPA back above 60% with page-specific steps).
- Built CSS: **0 occurrences of the old violet hex**, 93 of #0056D2; the only
  violet left is the intentional faint banner aurora.
- Served preview spot-checks: homepage serves ticker + flow + what's-new;
  college page serves its own stepper; test-grade page serves its own steps;
  tool pages, blog, and for-schools all serve the new banner.
- MonaSans.woff2 ships in `dist/fonts` (already in the repo's `public/fonts`).

## After you upload + push

Check these live: homepage (ticker, flow, what's-new, blue buttons), one tool
page (stepper in the banner, blue inputs/results), dark mode toggle, and mobile
(menu drawer + tool page). If anything looks off, tell me the page and what you
see — the system lives in one file (`src/styles/nova.css`), so fixes are fast.
