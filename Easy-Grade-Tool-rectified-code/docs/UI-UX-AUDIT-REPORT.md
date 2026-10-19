# Easy Grade Tool: UI/UX audit and redesign report

Scope: every page and shared component of the site (header, footer, 15 calculators and guides, legal pages, 404, dialogs, menus, command palette). Method: read all source, measure inconsistency with scripts, then fix it and re-measure with the same scripts.

## 1. Summary

The site had been restyled several times by stacking patches on top of each other. Each pass added a new look (warm sand, slate and blue, "premium" glass, a UX refactor) without removing the last one, so the live interface was a mix of at least four design directions. The brand assets (logo, app icon, `brand.ts`) say **indigo-slate `#4C5985` with a gold accent**, but the interface used blue buttons, a sand-brown header and a navy/violet animated footer.

The fix is one design system: a single token file, one definition per component, one page structure, and a deleted pile of dead code. Measured results are in section 2.

**What could and could not be verified.** The project's dependencies (Vite, Tailwind v4, React Router, Lucide) are not installable offline, so I could not run `npm run build`. Instead I (a) parsed every changed file, (b) checked every colour class against the palette and tokens, (c) bundled the real header, footer, dialogs, FAQ, privacy page and progress bar with only third-party libraries stubbed and ran them in a real browser (no runtime errors, correct focus trap, Escape, validation, mobile drawer, no horizontal overflow at 390px), and (d) rendered the style guide in light, dark and mobile. Please run `npm ci && npm run lint && npm run build` once on your machine: `lint` is the TypeScript check (which I could not run), and `build` runs the math checks, Vite, prerender, sitemap and `verify-launch`.

## 2. Scorecard (same scripts, before and after)

| Measure | Before | After |
| --- | --- | --- |
| Unique hex colours in TS/TSX | 121 | 16 (brand source, logo SVG, PDF export, server-rendered pages) |
| Neutral palettes in use (slate / gray / stone) | 3 | 1 (slate) |
| Accent palettes in use (teal / blue / indigo / ...) | 4 | 0 (one brand ramp) |
| `gray-*` and `stone-*` class uses | 358 | 0 |
| Border-radius variants | 13 | 5 (xl, 2xl, full, lg, none; the script also counts the word "rounded" in copy as a sixth) |
| Shadow variants | 30 | 5 |
| Arbitrary font sizes (`text-[13px]` etc.) | 8 | 0 |
| Text smaller than 12px | 36 | 0 |
| `font-mono` uses (numbers set in monospace) | 212 | 2 (generated password, code) |
| Uppercase / wide-tracked labels | 237 | 8 (password options copy, one FAQ label) |
| Gradient, backdrop blur, hover-lift uses | 82 | 1 |
| Distinct focus-style variants | 35 | 7 |
| Hand-built solid button looks | 11 | 3 |
| Typefaces loaded / font files / size | 2 / 11 / 271 KB | 1 / 4 / 57 KB |
| CSS lines across all stylesheets | 7,759 | 1,390 |
| `!important` in CSS | 222 | 45 (41 in the print stylesheet) |
| Stylesheets imported by `main.tsx` | 4 | 1 |
| `Footer.tsx` | 1,409 lines | 306 lines + shared dialog |
| Files and folders at repo root | 57 | 17 |
| Colour contrast pairs failing WCAG AA | not tracked | 0 of 42 (light and dark) |

## 3. Findings and resolutions

### 3.1 Colour and brand

**Findings**

* Four competing directions. Buttons were blue `#2563EB`; the header used sand-browns (`#A68A6D`, `#5E4A36`, `#7A6149`); the footer used navy, violet `#7C5CE0` and coral; the logo and manifest used `#4C5985`.
* `teal-*` was remapped twice. `index.css` pointed it at `#4c5985`, then `premium.css` (loaded later, unlayered) pointed the same variables at blue. Code said "teal", the screen showed blue. `slate-800/900` were also shifted in the same file, so `slate-900` was not slate-900.
* Neutrals came from three families. Mortgage alone used `gray` 156 times while every other page used `slate`.
* Light/dark pairs were written by hand 1,975 times in 229 different combinations, including five near-identical grey text tints.
* Three different values for the page background: `#F3F4F6` (HTML meta), `#FAF9F7` (CSS body), `#4c5985` (a stale `public/manifest.json`).
* The same letter grade had different colours in different components. B was emerald in `gradeTone.ts`, indigo in the progress bar and teal in `constants.ts`. D was rose in one place and orange in another.

**Resolution**

* `src/styles/tokens.css` is now the only place colours are decided. Brand `#4C5985` plus slate neutrals, with adaptive tokens (`surface`, `canvas`, `sunken`, `line`, `ink`, `ink-2`, `ink-3`, `brand`, `brand-soft`) that switch to their dark values automatically. Components no longer write `dark:` pairs.
* A codemod rewrote every class string in the project (58 files): palette families collapsed, 257 arbitrary hex classes mapped to tokens, about 1,900 light/dark pairs collapsed to a single token class.
* Grade colours: `gradeTone.ts` (A/B good, C fair, D/F poor) is the single source. `GradeVisualProgressBar` was rewritten on it and `constants.ts` letter colours were aligned.
* The stale `public/manifest.json` was removed (the README already said not to have it; VitePWA generates the real one). The meta theme colour and the generated manifest now use the same value, which `verify-launch` requires.
* Contrast is verified by `scripts/check-contrast.py`, which now reads the real token values: 42 pairs, all pass. Muted text was darkened (to `#55637A`, 6.1:1 on white) and field borders strengthened (3.5:1) because the old values failed on the tinted canvas.

### 3.2 Typography

**Findings**

* Plus Jakarta Sans was the body font, but guide and FAQ titles were set in Inter. Inter's seven files (about 218 KB) were still loaded and one was preloaded on every page.
* Numbers were monospace in some calculators (212 uses) and proportional in others.
* 13 different `h2` styles and 14 different `h3` styles. 36 places used text between 9px and 11.5px. 237 uppercase or wide-tracked eyebrow labels.
* Guide body text was 14px while the rest of the site was 16px.

**Resolution**

* One typeface. `fonts.css` now declares only Plus Jakarta Sans (variable weight, four subsets). Inter, its preload and its files are gone (271 KB to 57 KB).
* One type scale in `base.css` (h1 28-36px, h2 20-24px, h3 17px, h4 15px, body 16px, small 14px, minimum 12px). The codemod removed 771 per-heading size, weight and colour overrides so headings inherit the scale.
* Numbers use tabular figures (`tabular-nums`). Monospace remains only for the generated password and code.
* Labels are sentence case. Guide text is 16px with a 44rem measure.

### 3.3 Shape, elevation and spacing

**Findings**

* 13 radius variants including custom 20, 24, 28, 32 and 36px. The main panel was 32px, inner panels 24px, legal pages 24px, guides 20px, dialogs 16px or 32px.
* 30 shadow variants, including coloured shadows.
* Vertical rhythm differed per page (`space-y-8`, `10`, `12`, `16`, guide margins of 5rem and 3rem). Calculator columns were 1024px, legal pages 896px, guides 896px centred, so left edges did not line up.
* Six pages put single-column content inside `.tool-layout`, a legacy two-column grid, so they used only about 60% of the width. On `GpaCalculator` the calculator, guide and FAQ were three cells of that two-column grid.

**Resolution**

* Three radii: 12px (fields, tiles, menus), 16px (cards, dialogs), pill (buttons, chips). Two elevations: none at rest, one floating shadow for menus, dialogs and toasts.
* Every route renders inside one `.page` column (`App.tsx`): one width (64rem), one gap (32px on phones, 40px from 640px). Per-page `max-w-*`, `mx-auto` and outer margins were removed. Reading pages (About, Privacy, Terms) use a narrower left-aligned column on the same edge.
* `.tool-layout` is kept only for the five genuinely two-pane calculators.
* Outer boxes are `.card`; tiles inside are `.panel`. Cards contain panels, never the reverse, so nesting no longer repeats the same radius.

### 3.4 Components

| Element | Before | After |
| --- | --- | --- |
| Primary button | 11 looks: blue pill, indigo `rounded-xl`, emerald, `rounded-lg`... | `btn btn-primary` (brand, pill, 44px, 48px on touch) |
| Secondary / icon buttons | Re-declared per file (`BTN_SOFT`, `BTN_OUTLINE`, `REMOVE_BTN`, `STEP_BTN`...) | `btn btn-secondary`, `btn-ghost`, `btn-icon` |
| Inputs | Five looks (`#F0F2F5` pill, `#F4F6F9` 20px, `#F7F4EF` 16px, white pill, 24px) | One `.field`: 48px, 12px radius, 3:1 border, one focus ring |
| Selected chip / segmented | Near-black, brown or blue depending on page | `chip is-active`, brand |
| Focus ring | 34 variants; taupe, brown, blue, teal and white | One 2px brand outline from `:focus-visible` |
| Cards | Per-file `rounded-[32px]`, gradients, glass blur | `.card`, `.panel` |
| Dialogs | Three near-identical 170-line modals in the footer, different radii | One `FeedbackDialog` with the shared focus-trap hook |
| Stacking | z-index 50, 9000, 9999, 10000 | header 40, menus 60, dialogs 70, toast 80 |
| FAQ controls | Expand/Collapse buttons about 32px tall | Standard `btn`, 44px |

A real bug surfaced during this work: `SmartCalculatorInput` used shadcn-style classes (`border-destructive`, `bg-secondary`, `accent-primary`) that were never defined in the theme, so they rendered nothing. The component was unused and has been deleted with the other orphans.

### 3.5 Decoration

Ambient blurred orbs on 12 pages, a corner sheen on the header, hero and cards, a hero card with a grid and wave texture, and a footer with animated orbs, a shine sweep, twinkling sparkles and gradient text. The footer also defined the SVG gradient id `fnScreen` twice. All removed. Pages now open with a flat title and one line of context. Remaining motion is a 160ms colour transition and the menu and dialog fades, all disabled under `prefers-reduced-motion`.

### 3.6 Page structure and navigation

* Header and footer now describe the same structure. Both use the three groups defined once in `navItems.ts` (Grade tools, GPA and percentages, Everyday tools). Previously the header had three groups and the footer two.
* Every nav item has its own icon (BookOpen was used for both GPA and Weighted GPA, Calculator for both Weighted Grade and CGPA to %).
* The header is one row: logo, Quick Grade, Tools menu, search, theme. The "100% Private" pill moved to the footer so the header holds only navigation.
* The footer is three rows: brand and newsletter, link columns, legal. All 15 tool links and the 3 guides stay in the HTML (checked: the set of linked paths is identical to the old footer, which keeps the crawl-depth launch check valid). The "More" expander that hid links was removed.
* Scroll offset now derives from the header height (it was 132px in one stylesheet and 92px in another against an 80px header).
* The 404 page and the static 404 markup used by prerender and the server are now identical.

### 3.7 Accessibility

* Contrast: 0 of 42 pairs fail (section 3.1). Text under 12px removed. Touch targets: the shared button, chip, field and nav classes use the 44px token (48px on coarse pointers); the old modal close button was about 28px.
* One visible keyboard focus ring; skip link; `aria-current` on active nav and footer links; reduced-motion and forced-colours rules.
* Dialogs use the existing `useDialogA11y` hook (focus trap, Escape, scroll lock, inert background, focus return). Verified in a browser.
* The footer's old hand-written focus trap was a duplicate of that hook and is gone.

### 3.8 Code structure

* `index.css` was 7,054 lines, 74% of its class selectors were dead (384 of 515), it had 181 `!important`, and three overlay stylesheets (`premium.css`, `ux-refactor.css`, `a11y-touch.css`) fought it. `ux-refactor.css` even restyled components by matching Tailwind class strings (`[class*="rounded-[32px]"]`) and contradicted its own notes. Now: `tokens.css`, `base.css`, `components.css`, `tools.css` (824 lines, no raw hex, no dead rules), `print.css`, imported by a 13-line `index.css`. Base and component styles sit in Tailwind layers, so a utility class always wins over a component class.
* Ten components were never imported anywhere: ToolLayout, QuickGradeCalculator, GpaToPercentage, GradeScaleModal, GuideArticle, MoreToolsMenu, MoreToolsSheet, NumericKeypad, OfflineIndicator and PWAInstallButton. Four more became orphans after the header, decoration and dead-component removals (ChromeAccents, AmbientAura, SmartCalculatorInput, AnimatedCounter), and two hooks (`useOnlineStatus`, `usePWAInstall`) only served them. All removed (64 component files down to 51, including the new `FeedbackDialog`).
* **Print.** The three overlay stylesheets also held print rules (notably for the Quick Chart table). Those were carried into `print.css` and retargeted at the new class names, and printing from dark mode now forces the light token values so dark surfaces never reach paper. (I initially dropped the chart-table rules with the old file and restored them during final QA.)
* Repo root: about 40 stale items removed (copies of source files in `fix/`, `glass-update/`, `quick-grade/` and others, 20+ `MERGE-*.md` notes, patch and delete scripts, a root-level `GradeCalculator.tsx` that differed from the real one). None were referenced by the build.

## 4. Page by page

| Page | Main inconsistencies found | Result |
| --- | --- | --- |
| Home / Quick Grade | Blue and sand mixed; five input looks; 24-32px radii | Shared card, field and button; tone colours; one column |
| Weighted Grade | Pill inputs `#F0F2F5`, solid button blue, remove button 48px square | `ROW_INPUT`, `BTN_*` point at shared classes |
| GPA / CGPA to % | Teal buttons, guide in grid column 2 (GPA) | Brand buttons, single column |
| Tip / Percentage / Loan | Different panel radii and tints; result box blue | `.card`, `.panel`, `tone-brand` |
| Mortgage | `gray` palette (156 uses) | Slate and tokens |
| Password | Monospace and uppercase labels throughout | Mono only for the generated password |
| About / Privacy / Terms | Gradients, backdrop blur, 24px radii, 896px column | Flat `.card`, reading column |
| Tool pages (final exam, curve, letter, scales...) | Own wrapper widths and margins | Inherit `.page` rhythm |
| 404 | Rounded-square button; text differed from static 404 | Pill button; same markup in all three places |
| Header / menus / drawer | Sand-brown, glass, 9999 z-index, privacy pill | Single `.site-header`, `.menu`, shared nav links |
| Footer | 1,409 lines, animated gradient banner, three modals | Three quiet rows, one dialog |
| Command palette | Own palette and radii in legacy CSS | Tokenised, on the dialog layer |

## 5. Decisions you may want to review

1. **Brand colour is now the interface colour.** Primary buttons changed from blue to indigo-slate `#4C5985` so the UI matches the logo. Gold `#F5A524` is used only in the logo.
2. **Inputs are rounded rectangles (12px), not pills.** Pill fields mixed badly with multi-line and select fields. Buttons stay pills.
3. **"100% Private" moved from the header to the footer.** Easy to bring back as a line under the page title if it is a conversion feature.
4. **Eyebrow badges were dropped** from page headers. `ToolHeading` still accepts `badge` and `eyebrow` props so existing calls compile.
5. **Wording not changed (SEO-sensitive).** The nav says "Quick Grade", the page title says "EZ Grader Chart & Easy Grade Calculator", and `/` and `/grade-calculator/` render the same component. These are content decisions, so I left them; aligning them would remove the last naming mismatch.

## 6. What is not finished

* **`tools.css`** still holds about 824 lines of calculator-internal styling (Quick Grader chart, score tables, steppers, command palette). It is tokenised and dead-rule free but not yet replaced by `.btn`, `.field` and `.card` in the markup. `node scripts/check-unused-css.cjs` lists rules to delete as markup migrates.
* **`public/404.html`, `500.html`, `offline/offline.html`** are standalone and already use the brand colour, but use the system font because they do not load the web font.
* **Dark mode of `CgpaEducationalGuide` and `ManualGradeHowTo`** was converted mechanically; they deserve a visual pass in the real app.
* Tailwind v4 was not available here, so utility generation (for example `aria-[current=page]:` and opacity on token colours such as `bg-surface/80`) was reasoned about, not run. `npm run build` will surface any problem, and `npm run lint` any type error in the files I changed.

## 7. How to verify

```bash
npm ci
npm run lint                       # tsc --noEmit (type-check)
npm run build                      # math checks, vite build, prerender, sitemap, verify-launch
python3 scripts/check-contrast.py  # 42 colour pairs, light and dark
open docs/design-system.html       # every component, rendered from src/styles
```

Then open `/`, a calculator, a guide page and `/privacy` in light and dark mode at about 390px and 1280px wide, open the Tools menu and the footer's Contact dialog, and press Tab through each page once.
