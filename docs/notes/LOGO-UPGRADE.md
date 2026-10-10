# Logo upgrade: modern, premium mark + lockup

Copy every file in this zip over the same path in the repo (nothing needs deleting), then commit.

NEW
- src/brand/brand.ts            single source of truth: colours + outlined wordmark paths + lockup geometry

CHANGED
- src/components/Logo.tsx       new mark and lockup. Same `<Logo size iconOnly className />` props, so
                                Navbar, Footer and CommandPalette need no edits. Also exports `BrandMark`, `LogoLockup`.
- scripts/generateIcons.ts      now builds every icon from Logo.tsx. The old script still generated the
                                previous calculator-style icon and would have overwritten the new one.
- index.html                    +1 line: PNG favicon fallback (`/favicon.png`) next to the SVG icon.
- public/icon.svg, icon-maskable.svg, favicon.png, apple-touch-icon.png,
  pwa-192x192.png, pwa-512x512.png, pwa-maskable-512x512.png      regenerated
- public/logo.svg               new horizontal lockup (light backgrounds); logo-dark.svg is new (dark backgrounds)

NOT TOUCHED: public/og-image.* and public/og-cards/* (they do not use the old mark).

## Design
- Deep-emerald squircle, soft light sheen, hairline inner edge
- Bold rounded white "A" with a gold crossbar and a gold "+" (A+)
- Wordmark outlined from Plus Jakarta Sans: "Easy Grade" 800, "Tool" 500 in emerald
  (outlined, so it does not depend on web-font loading)
- apple-touch-icon is now full-bleed (iOS rounds it itself; transparent corners show black on iOS)

## Regenerate after any change to brand.ts / Logo.tsx
    npx tsx scripts/generateIcons.ts

## Verified
`npm run build` passes, including all 17 verify-launch checks (icon links, prerender, PWA).
