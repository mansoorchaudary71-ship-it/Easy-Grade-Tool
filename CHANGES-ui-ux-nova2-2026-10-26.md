# NOVA II — Structural Overhaul (2026-10-26)

**Upload this zip alone to the repo root** (folders are already at the top level).
Cumulative over the current live site, which already contains the NOVA system —
this package does **not** redo NOVA, it builds the structural layer on top of it.
No calculator logic, route, or schema changes. No new page, no invented content.

## First, an honest audit note

The repository you uploaded already contained the NOVA overhaul (nova.css,
brand-blue system, stepper, ticker, flow strip, what's-new). Re-skinning it
again would have changed nothing. So Phase 2 audited what was actually still
flat compared with the 7 references, and Phase 3 fixed exactly that:

- The homepage **hero was static** (buttons + chips, no interactive content).
- **Explore was a static grid** showing every tool at once — no shelves, no
  switching, nothing to play with.
- There was **no pain–agitation–solution section** and **no bottom escape
  hatch** for visitors who fit no category.
- The **footer had no journey** — just link columns.
- The **navbar was already strong** (Dribbble structure, grouped mega-menu,
  scroll search pill, command palette), so it gets one targeted change, not a
  rewrite. The same applies to the footer columns, newsletter band, and
  feedback forms — kept, not churned.

## 1. What was extracted from the 7 references

| Reference | Element extracted | Where it landed |
|---|---|---|
| Intercom | Calculator embedded in marketing content | Mini final-exam planner inside the home banner |
| Intercom | Dual-view toggle (kept as the existing Quick/Weighted tabs — not duplicated) | Already present; deliberately not rebuilt |
| Calendly | Journey stepper | Already in NOVA (tool banners); reused as the footer journey |
| Typeform | Category shelves, browsable one at a time | Explore section → tabbed shelves |
| Typeform | Pain-first copy | Already in NOVA blurbs; extended by the pain section |
| Typeform | Repeated escape hatch (search prompt top and bottom) | New escape hatch at the bottom of the homepage |
| Asana | Icon-tabbed switcher | Shelf tabs carry each group's icon |
| Asana | Pain–agitation–solution section | New "Why grading eats your Sunday" section |
| Asana | Grouped feature directory | New footer journey band + existing footer columns |
| ClassDojo | What's-new changelog | Already in NOVA; untouched |
| ClassDojo | Privacy trust band | Already in NOVA trust tiles; untouched |
| Dribbble | Bold plain nav, scroll search pill, solid pill CTA | Already in NOVA header; one change below |
| Canva | Template-gallery structure | Covered by the Typeform shelves pattern (Canva's own pages were unobservable this pass — nothing guessed) |

## 2. Global styling configuration (nova2.css, imported after nova.css)

nova.css still owns colour and type (brand blue #0056D2, Mona Sans) — nova2.css
adds **structure only**, under `nova2-*` class names so the two layers cannot
fight:

- **Shelf tabs:** horizontally scrollable pill tabs on mobile, full row on
  desktop; active tab is solid brand blue. Panels animate with a 0.3s rise.
- **Mini planner:** translucent white card over the banner gradient, 20px
  radius, 3 fields stacking to 1 column on phones; blue focus rings.
- **Pain cards:** white 20px cards, 1 → 3 columns; fix band in pale blue
  (#EEF4FF) with a blue primary button.
- **Escape hatch:** pale-wash centred panel, blue primary button.
- **Footer journey:** numbered blue discs (1–4) + blue links, wrapping on mobile.
- **Animations:** one `nova2-rise` keyframe; everything honours
  `prefers-reduced-motion`. Full dark-mode parallels for every new class.

## 3. Refactored components

- **Hero (`GradeCalculator.tsx`)** — new `HomeFinalPlanner` inside the home
  banner, after the popular chips. Three editable fields (current grade 84%,
  final weight 30%, target 85%) with a live answer on first paint
  ("You need 87.3% on the final"). It reuses the verified `solveFinalExam`
  maths, including the honest unreachable case ("even 100% on the final only
  reaches 88.8%") and the secured case — never a faked number. Links to the
  full final-exam calculator. Homepage banner only, hidden in print.
- **Main sections (`HomeSections.tsx`)** — Explore is now tabbed shelves
  (Grade tools / GPA and percentages / Everyday tools) with icon tabs,
  roving-tabindex arrow-key navigation, and the same pain-first blurbs.
  **All three panels are rendered and only hidden**, so no homepage link is
  lost from the prerendered HTML. New pain section (three plain, verifiable
  frustrations + fix line + weighted-calculator CTA). New escape hatch at the
  bottom: a "Search calculators (Ctrl+K)" button that opens the command
  palette, with an anchor fallback to the shelves when no palette handler is
  wired (standalone/prerender use).
- **Navbar (`Navbar.tsx`)** — the For Schools text link now appears from the
  `lg` breakpoint instead of `xl`: the school embed programme is the site's
  link-building asset, so it earns a permanent header slot on more screens.
  Everything else (group menus, scroll pill, pill CTA, theme switcher) kept.
- **Footer (`Footer.tsx`)** — new journey band at the top of the white panel:
  "From scores to a plan" with the same four steps as the homepage flow
  strip, so every page offers the journey, not just a list of links.
- **Wiring (`App.tsx`, `GradeCalculatorProps`)** — `onOpenCommandPalette` is
  now passed to the home and weighted-grade routes and through to
  `HomeSections`. Optional everywhere, so nothing breaks if it is absent.

## Deliberately NOT done (same honesty rules as NOVA)

- No testimonial/community wall and no count-up stats: no verified teacher
  quotes or usage figures exist, so none were invented.
- No live tool-preview tab switcher on the homepage: the persona tabs and the
  new shelf tabs already cover journey switching; a third switcher would
  duplicate them.
- No new copy claims anywhere: the pain section states frustrations, not
  statistics; the planner's example numbers are editable inputs, not claims.

## Files changed (9)

- `src/styles/nova2.css` (new — the whole structural layer)
- `src/main.tsx` (nova2 import, after nova.css)
- `src/components/GradeCalculator.tsx` (hero mini-planner, palette prop)
- `src/components/HomeSections.tsx` (tabbed shelves, pain section, escape hatch)
- `src/App.tsx` (palette prop to home/weighted routes)
- `src/components/Navbar.tsx` (For Schools from lg)
- `src/components/Footer.tsx` (journey band)
- `scripts/sitemap-hashes.json` (regenerated: all 76 URLs, lastmod 2026-10-26)
- `CHANGES-ui-ux-nova2-2026-10-26.md` (this file)

## Verification (before packaging)

- Clean build from an empty `dist/`: `npm run build` exits 0,
  **launch audit 17/17 PASS** (including CHK-08 uniqueness and CHK-16
  one-click reach — the tabbed shelves cost no links, and the footer journey
  adds reach).
- Served preview spot-checks: homepage serves the mini-planner (live 87.3%
  answer for the 84/30/85 example), all three shelf panels, the pain section,
  the escape hatch, and the footer journey band; tool-page steppers intact.
- The `node_modules` symlink used for the build is local only and is NOT in
  this zip.

## After you upload + push

Check live: homepage banner (try changing the planner's target to 90% — you
should see the honest "not possible" message), the Explore shelf tabs, the
pain section, the bottom search button, and the footer journey strip. Then
tell me which surface still feels flat — the system is now layered cleanly
enough that the next pass can be surgical.
