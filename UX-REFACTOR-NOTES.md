# UX refactor: merge notes

Unzip this package over the repo root (files overwrite), then run `sh ux-refactor-deletions.sh`, then `npm ci && npm run build`.
No calculation code, storage keys, service worker or privacy behaviour was touched (`utils/gradeCalculations.ts`, `academicMath.ts`, `finalExam.ts`, `STORAGE_KEY`, offline caching are unchanged).

## What changed, by request

| # | Request | Where |
|---|---------|-------|
| 1 | Hick's Law: Tools dropdown + mobile drawer | `Navbar.tsx`, `ToolNavBar.tsx` (now: Quick Grade link + Tools button), new `ToolsMenu.tsx` (desktop, grouped, arrow-key nav), new `MobileNavDrawer.tsx` (hamburger, focus-trapped), `SiteHeader.tsx` (second tab row removed), `data/navItems.ts` (`TOOL_GROUPS`). Search stays in the header row (Ctrl/Cmd+K, `/`) and is in the drawer too. |
| 2 | Miller's Law: Advanced Settings | `QuickGrader.tsx`. Visible: number of questions and presets. Folded: grading scale, customize cutoffs, decimal precision, half points. The fold shows a one-line summary and opens by itself when saved custom cutoffs are active. |
| 3 | Fitts's Law: 44px targets | Presets, steppers, inputs, nav links, menu rows, tally chips, Clear buttons are 44px+ (most 48px). Fixed the ones that were below: footer social icons (36), How-To icon button (40), CGPA inputs (42), old nav tabs (36), old More-tools rows (40). `SegmentedControl` got `min-w-[44px]`. |
| 4 | Quick Chart table | New `QuickChartTable.tsx`: a real `<table>` with sticky column headers, one header row per letter group, tappable rows. `ScrollableTableContainer.tsx` now shows a left/right edge shadow when the table overflows sideways (and supports a max-height so the sticky header works). Print gets a plain table. |
| 5 | Colour | Canvas slate-50 / slate-900, white and slate cards, one blue-600 accent for primary buttons (`styles/ux-refactor.css`, `premium.css`). Semantic grades in `utils/gradeTone.ts`: A/B emerald, C amber, D/F rose. 40 colour pairs checked, all pass (`docs/UX-CONTRAST-REPORT.md`). |
| 6 | Hierarchy | Input cards are white with a light border; the Quick Chart output card is tinted slate with a larger shadow and a 4px blue top rule. The student result is a tinted panel with a 60-72px grade letter and a 48-60px score. The weighted calculator's result number is larger too. |

## Decisions worth knowing
- **Colour is never the only cue.** Red/green is the most common colour-vision deficiency, so every tone also has its own icon (check / triangle / cross), a word (Strong / Fair / Needs work) and the letter itself.
- **Flat primary buttons.** `premium.css` painted `bg-[#2563EB]` buttons with a gradient starting at #3B82F6, where white text is 3.7:1 (fails AA). `ux-refactor.css` makes them flat blue-600 (5.2:1), hover blue-700 (6.7:1).
- **Input borders** are now 2px slate-500 (4.8:1) because the old light-grey fill on white did not meet the 3:1 rule for UI boundaries.
- **Print Chart** is the filled blue button on the output card. The copy in the setup card is now an outline button so the page has one primary action.
- Grade D moved from orange to rose (per spec), and grade B from indigo to emerald.
- `MoreToolsMenu.tsx` and `MoreToolsSheet.tsx` are replaced by `ToolsMenu.tsx` and `MobileNavDrawer.tsx`; delete the old files with `ux-refactor-deletions.sh`.

## Please check after merging
1. `npm run build`. I could not run Vite or `tsc` against the real dependencies here (no network). I type-checked the changed files for syntax and server-rendered `QuickChartTable` in isolation, but the full build is untested.
2. **CHK-16 (crawl depth)** requires the homepage HTML to link to every sitemap URL. The tool links are now inside a menu that only renders when opened, so the Footer's tool lists must supply those links in the prerendered HTML. They should (the footer maps `NAV_ITEMS`), but the build will confirm.
3. Eyeball the header at 768px (md breakpoint), where logo, two nav items, search and theme share one row.
4. Print a 10-question and a 300-question chart once.
5. Other calculators (GPA, Loan, Tip, etc.) still use their own card styles; they inherit the new canvas, flat buttons and focus ring but were not restyled.
