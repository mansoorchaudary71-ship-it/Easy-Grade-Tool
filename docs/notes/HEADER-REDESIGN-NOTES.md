# Header + menu bar redesign (airy "Avura"-style header)

Reference: Dribbble "Real Estate Property Website Landing Page UI Design" header.

## Files changed / added
| File | Change |
| --- | --- |
| `src/components/SiteHeader.tsx` | Owns the shared gradient canvas + contour-line layer behind BOTH rows |
| `src/components/Navbar.tsx` | Light header: brand logo left; search, 100% Private, Install, theme on the right |
| `src/components/ToolNavBar.tsx` | Minimalist glass menu row: borderless tabs, sliding blue underline + glow (round 2) |
| `src/components/MoreToolsMenu.tsx` | NEW (round 2). Anchored glass "More tools" dropdown for tablet/desktop |
| `src/components/PWAInstallButton.tsx` | `nav` variant is now the dark pill CTA (white pill in dark mode) |
| `src/styles/premium.css` | New `.avura-chrome`, `.avura-lines`, `.avura-pill` rules |
| `src/assets/header-contours.svg` | NEW. Hairline topographic rings + wave lines (used as a CSS mask) |

No new dependencies. Routes, preloading, command palette, theme cycling, "More tools" sheet
and the sliding-pill animation behave exactly as before.

## Palette
- Light: cool grey `#F4F5F8` -> `#EEF1F7` -> pale sky `#E4EDFC`, blue glow `rgba(147,197,253,.55)` top-right
- Dark: `#0F172A` -> `#1B2638` -> `#1E2D52`, royal-blue glow `rgba(37,99,235,.38)`
- Menu row: transparent tabs on a soft glass strip (`.avura-menu`); active = `slate-950` text + blue underline (`#2563EB` -> `#38BDF8`)
- CTA: `#111827` (dark mode: white). Accent: brand blue `#2563EB`

## Tweaking
- Line strength: change `--avura-line` in `.avura-chrome` / `.dark .avura-chrome` (premium.css).
- Remove the lines entirely: delete the `<div className="avura-lines" />` line in SiteHeader.tsx.
- Warmer glow like the reference (pale yellow): swap the first `radial-gradient` colour in
  `.avura-chrome` for `rgba(253, 230, 138, 0.45)`.
- Re-generate different artwork: replace `src/assets/header-contours.svg` (keep viewBox 0 0 1440 140,
  black strokes, `vector-effect="non-scaling-stroke"`).

Old `.slate-bar` / `.tool-nav*` / `.topbar*` CSS is now unused but harmless (`.topbar` is still
referenced by the print stylesheet and scripts/test-site-qa.ts).

## Logo (thin monoline wordmark)
- `src/components/Logo.tsx`: new `ThinWordmark`. `<Logo />` now renders it everywhere (header + footer).
  Hairline geometric capitals "EASY GRADE", blue crossbar on both A's, small tracked "TOOL" + hairline rule.
- Pure stroked vector paths (no font file). Letters follow `currentColor`; accent is `#2563EB`
  (`blue-400` in dark mode). Stroke weight: `strokeWidth={6.5}` on the letters; raise it for a bolder look.
- Size: `LOCKUP_HEIGHT` in Logo.tsx (`md` = h-8 / sm:h-10).
- `LogoLockup`, `BrandMark` and `<Logo iconOnly />` are unchanged, so `scripts/generateIcons.ts`
  and the command-palette icon still work. Favicons / PWA icons / public/logo.svg are NOT regenerated:
  they still show the old squircle "A+" until you run `npx tsx scripts/generateIcons.ts`
  (after updating it to use the new mark).

## Menu bar, round 2 (premium / minimal)
- No container box or heavy border. `.avura-menu` (premium.css) = soft backdrop-blur strip + a hairline that fades out at both edges.
- Tabs: 36px tall (was 40px), same weight in every state (no layout shift), neutral slate that firms up on hover (200ms).
- Active tab: crisp dark text + 2px gradient underline with soft glow that springs between tabs (`layoutId`). Reduced-motion users get an instant move.
- "More tools": ordinary tab with a chevron that rotates. Tablet/desktop opens `MoreToolsMenu` (non-modal glass dropdown;
  Esc / outside click / Tab close it, Up/Down arrows move between tools). Phones keep the existing bottom sheet.
- Contrast: inactive tabs use `slate-600` on the light header (~7:1) and `slate-400` on dark (~6:1); focus rings are visible on every tab.
- Tweak the glow in `renderIndicator()` in ToolNavBar.tsx; tab height via `min-h-9` in `tabBase`.
