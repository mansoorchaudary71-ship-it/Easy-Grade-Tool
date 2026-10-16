# Stark chrome redesign: merge notes

Unzip over the repo root (paths match). 8 files:

- src/components/ChromeAccents.tsx   NEW. Shared geometric accents (green curve, orange ring, pale-blue tile) in 3 placements: header, bar, footer
- src/components/SiteHeader.tsx      uses ChromeAccents
- src/components/Navbar.tsx          Install App button removed; white 100% Private pill (text from xl)
- src/components/ToolNavBar.tsx      centred links, sentence case 14px, short pill underline for the active link
- src/components/ToolHeading.tsx     the tool NAME BAR: stark surface + accents (every tool and info page uses this one component)
- src/components/Footer.tsx          stark surface + accents; newsletter now sits on the footer instead of a dark gradient card
- src/styles/premium.css             old slate banner / wave-contour / glass-strip rules removed; fluid heading classes added
- src/styles/ux-refactor.css         One UI layer: pure white fields in light mode

Unchanged: all calculation logic, routing, SEO, subscribe/report/contact handlers, Ctrl/Cmd+K search, theme cycle, mobile drawer.

Optional clean-up (no longer referenced):
- src/assets/header-contours.svg
- src/components/PWAInstallButton.tsx  (usePWAInstall hook can stay)

Then: npm run lint && npm run build
