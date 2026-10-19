# Design system

One palette, three radii, one typeface, one definition per component. Open `docs/design-system.html` in a browser to see every
piece rendered from the real stylesheets (light and dark).

## Where things live

| File | Job |
| --- | --- |
| `src/styles/tokens.css` | **The only place values are decided**: colours (light + dark), radii, shadows, layout sizes, motion. |
| `src/styles/base.css` | Element defaults: type scale, focus ring, form-field defaults, reduced motion. |
| `src/styles/components.css` | `.btn` `.field` `.card` `.panel` `.chip` `.menu` `.dialog` `.page` `.page-header` `.site-header` `.site-footer` `.toast` `.tone-*` and the guide/FAQ text styles. |
| `src/styles/tools.css` | Calculator internals not yet migrated (Quick Grader chart, tables, steppers, command palette). Only shrinks. |
| `src/styles/print.css` | Print stylesheet. The only place raw colours are allowed. |
| `src/index.css` | Imports the above in order. Nothing else. |

Layout (flex, grid, gap, padding, width) stays in Tailwind utilities. **Look** (colour, radius, shadow, type) comes from tokens and component classes.

## Rules

1. **No raw colours.** Use a token utility (`bg-surface`, `text-ink-2`, `border-line`, `bg-brand`) or a component class. A hex value in a `.tsx` file is a bug (the brand source `brand/brand.ts`, the logo SVG and the PDF export are the only exceptions).
2. **Tokens adapt to dark mode by themselves.** Do not write `bg-white dark:bg-slate-900`; write `bg-surface`.
3. **Palette:** brand `#4C5985` (the logo colour) plus the slate neutrals. Do not use `gray-*`, `stone-*`, `teal-*`, `blue-*` or `indigo-*`.
4. **Three radii:** `rounded-xl` (12px: fields, tiles, menus), `rounded-2xl` (16px: cards, dialogs), `rounded-full` (buttons, chips). `rounded-lg` (8px) only for tiny controls.
5. **Two elevations:** nothing at rest (borders carry the structure) and `shadow-lg` for floating layers (menus, dialogs, toasts).
6. **One typeface** (Plus Jakarta Sans). Numbers use tabular figures (`tabular-nums`), not a monospace face. Monospace is only for the generated password and `<code>`.
7. **Type scale:** headings take their size from the `h1`-`h4` rules in `base.css`. Do not add `text-2xl font-bold` to a heading. Smallest text is 12px (`text-xs`).
8. **Labels are sentence case.** No uppercase, no wide letter-spacing.
9. **Grade colours come from one place:** `src/utils/gradeTone.ts` (A/B good, C fair, D/F poor). Never pick emerald/amber/rose for a grade by hand.
10. **Page structure:** every route renders inside `<div className="page">` (App.tsx): header, then blocks separated by one fixed gap. A page component returns a fragment: `ToolHeading` first, then cards/sections. Do not add your own `max-w-*`, `mx-auto` or outer margins.
11. **Buttons are `btn btn-primary|secondary|ghost`.** One primary action per view. 44px minimum height (48px on touch).
12. **Stacking order:** header 40, menus/drawers 60-70, dialogs 70, toast 80, skip link 100.

## Changing the look

* A new brand colour or dark-mode value: edit `tokens.css` (`--c-*`, and the `--color-brand-*` ramp). Run `python3 scripts/check-contrast.py`; it reads the file and fails if any text or border pair drops below WCAG AA.
* A different corner radius for all buttons: `.btn` in `components.css`.

## Checks

```bash
python3 scripts/check-contrast.py              # 42 colour pairs, light + dark, WCAG AA
node scripts/check-unused-css.cjs              # classes in tools.css that no markup uses any more
npm run lint                                   # tsc --noEmit
npm run build                                  # math checks, vite build, prerender, verify-launch
```

## Layer order

Tailwind v4 declares `theme, base, components, utilities`. `base.css` and `components.css` are written inside those layers, so a Tailwind
utility on an element always wins over a component class (for example `rounded-xl` on a `.btn`). `tools.css` and `print.css` are unlayered
legacy and override both; keep them small.
