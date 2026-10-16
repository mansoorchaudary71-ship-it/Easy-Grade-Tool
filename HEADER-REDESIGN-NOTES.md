# Header redesign: merge notes

Extract this zip into the repo root; it overwrites 4 files (paths match the repo):

- src/components/SiteHeader.tsx    stark white / near-black surface, hairline edge, geometric accents (green arc, orange ring, blue tile)
- src/components/Navbar.tsx        3-column layout: logo left | links centred | search, privacy, theme, install right
- src/components/ToolNavBar.tsx    refined centred links (small tracked capitals, hairline active underline)
- src/components/PWAInstallButton.tsx  sleek dark pill (nav variant only; install logic untouched)

No CSS files changed. The old `.avura-chrome`, `.avura-lines`, `.avura-menu` rules in premium.css and
src/assets/header-contours.svg are no longer used; delete them whenever you like (optional).

Behaviour kept: Ctrl/Cmd+K search, 100% Private badge, System/Light/Dark cycle, PWA install, Tools dropdown, mobile drawer.
Responsive: search is an icon below 1280px; the Private badge is a shield chip from 1024px and shows its text from 1536px.
