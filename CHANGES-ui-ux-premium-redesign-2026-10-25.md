# Premium redesign — Dribbble type + full component rebuild (2026-10-25)

Upload these files to the repo root (same top-level layout as the repo),
commit, push. This package is CUMULATIVE over your zip __8__ base: upload
this zip alone — it includes the violet rebrand files, updated, plus
everything new below. It supersedes both earlier UI packages.

This time the work is component-level, not token-level. All 7 reference
sites were re-checked on inner pages too (Dribbble shots, Canva/Typeform
templates, Intercom pricing, Calendly/Asana features, ClassDojo homepage).

## 1. Type — Dribbble's font style (the headline change)

- **Mona Sans is now the site's sole typeface** — body, UI, and headlines.
  It is the geometric humanist sans Dribbble's product UI is built on
  (their script logo font is a different, trademarked face and was NOT
  copied). Mona Sans is open-licensed (SIL OFL 1.1, licence shipped in
  `public/fonts/MonaSans-OFL.txt`), self-hosted as one 101 KB latin-subset
  variable font (`public/fonts/MonaSans.woff2`, weight 200–900). Inter
  stays in the stack as fallback and still covers non-latin glyphs.
- Display scale, Dribbble-style: banner titles 36–56px at weight 800 with
  −0.03em tracking and 1.05 line height; section H2s 28–40px at 800;
  tool-page hero titles at 800; result numbers (`.tool-big-number`) in
  Mona Sans at 700 with tabular numerals. Micro-labels (eyebrows) are now
  11px, weight 700, 0.12em tracking — Dribbble/Asana/Calendly style.
- The serif display headlines from the violet rebrand are RETIRED: the
  user asked for Dribbble's font style, and Dribbble uses one sans
  everywhere. (Typeform's serif was therefore also deliberately NOT
  copied, even though it is beautiful — it would fight the Dribbble type.)

## 2. The "only 5%" bug, found and fixed

The violet rebrand missed the colours that actually paint the tool pages:

- **Tool theme tokens** (`--tool-primary` etc., used 153 times) were still
  indigo-blue (hue 226). They are now violet in light, dark, and every
  per-tool theme — so every calculator's accents, result bars, and
  toggles finally match the header.
- **Result panels** across GPA, percentage, loan, CGPA, curve, and other
  tools still used light-blue `bg-[#DBEAFE]` with a blue glow. They are
  now violet-100 (`#EDE9FE`) with a violet glow.
- **premium.css / ux-refactor.css** still shipped old blues (preset-chip
  hover, hero badges, button gradients, teal-scale variables). All
  re-pointed at violet. The footer's title-accent gradient had a blue
  middle stop — now violet.
- Verified in the BUILT CSS this time (not just source): zero old-blue
  hex values remain. Two colour systems were deliberately LEFT alone
  because they are meaning, not brand: grade-tier colours
  (emerald/amber/orange/rose/indigo) and the command-palette's per-tool
  icon hues (each tool keeps its own colour there, as designed).

## 3. Components — what actually changed on screen

- **Banners:** bigger (36–56px titles, 3rem padding on desktop), soft
  violet gradient wash instead of flat tint, a violet aurora halo
  (Typeform's disciplined glow, echoed by the footer orbs), and a gentle
  fade-up entrance (disabled for reduced-motion users).
- **Cards:** category cards get 20px radius, circular pastel icon badges
  (ClassDojo), and restrained hover — violet border + soft shadow, NO
  lift (Canva gallery restraint), with the link arrow sliding and now
  riding in a small tinted disc (Asana circular-arrow cards).
- **Fields:** all tool inputs move from pill shape to 12px rounded
  rectangles with white fill, slate border, and violet focus ring
  (Dribbble/Calendly field shape). Buttons stay pills.
- **Buttons:** primary buttons lift 1px with a violet shadow on hover and
  press to 97% on click (Canva/Asana micro-interaction), on both the
  homepage buttons and the tool buttons.
- **Tabs:** active section tabs are now a soft violet tint pill with dark
  text and a light shadow (Dribbble "Discover" / Asana hero tabs),
  instead of a solid violet block. Dark mode uses a violet-tinted pill
  with pale text (a previous dark-mode rule that would have made this
  unreadable was removed).
- **Header:** the sticky header now gains a soft shadow once you scroll
  (Calendly floating-nav feel). Structure, nav, and the scroll search
  pill are unchanged.
- **Footer:** the dark plum footer is now an inset rounded panel (28px
  radius, side + bottom margins — Calendly/Asana inset dark bands)
  instead of a full-bleed strip. Contents unchanged.
- **Sections:** desktop section rhythm widened to 6rem (96px) — in the
  Canva/Asana airy range — so pages breathe instead of stacking dense.
- **FAQ:** the chevron now rotates 180° when a question opens
  (Intercom/Asana accordion affordance). FAQ layout and schema untouched.
- **Result numbers:** bigger Mona Sans figures with tabular numerals
  (Intercom pricing numerals).

## 4. Speed (kept honest)

- One 101 KB variable font replaces nothing else — Inter files still
  ship but are only downloaded if Mona Sans fails. No new external
  requests, no webfont service.
- All motion is transform/opacity-only (compositor-friendly); no
  backdrop-blur was added anywhere new; shadows stay shallow.

## Files in this zip (35)

- `src/styles/mona-sans.css` (NEW), `src/main.tsx` (font import),
  `src/index.css` (Mona Sans tokens, violet tool themes, 12px fields,
  FAQ chevron rotation, big-number type), `src/styles/coursera.css`
  (banner, cards, tabs, buttons, sections, header shadow, halo),
  `src/styles/premium.css`, `src/styles/ux-refactor.css` (blue remnants),
  `src/styles/a11y-touch.css`, `src/components/SiteHeader.tsx`
  (scroll shadow), `src/components/Footer.tsx` (inset panel, gradient),
  `src/components/Navbar.tsx`, `src/components/MobileNavDrawer.tsx`,
  `src/components/ToolNavBar.tsx`, `src/components/ToolsMenu.tsx`,
  `src/components/ProgrammaticCalculatorView.tsx`,
  `src/components/Logo.tsx`, plus the tool components whose result
  panels were blue (GpaCalculator, GpaToPercentage, CgpaToPercentage,
  PercentageCalculator, LoanCalculator, MortgageCalculator,
  QuickGradeCalculator, GradeCurveTool, AverageGradeTool, TipCalculator,
  CutoffFields, GradeScaleModal, GradeVisualProgressBar,
  PasswordGenerator, SmartCalculatorInput, tools/ui.ts,
  ui/SegmentedControl.tsx), `public/fonts/MonaSans.woff2`,
  `public/fonts/MonaSans-OFL.txt`, `scripts/sitemap-hashes.json`.

## After upload, spot-check (3 minutes)

1. Homepage: Mona Sans everywhere, big tight headlines, violet banner
   with halo, category cards with round icon badges + disc arrows.
2. Any tool page: violet accents and result panels (no light blue
   anywhere), 12px rectangular inputs, pill buttons that press.
3. Scroll: header gains a shadow; footer is a rounded dark panel with
   margins, not edge-to-edge.
4. Dark mode + one phone screen.
