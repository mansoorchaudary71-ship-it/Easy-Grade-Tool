# Coursera-style redesign: merge notes

Copy the `src/` folder from this zip over your repo (same paths). 11 files, nothing deleted, no new dependencies.

| File | Change |
|---|---|
| src/styles/coursera.css | NEW. Design system: Coursera blue #0056D2, white canvas, pale-blue bands, 8px buttons/fields, 16px cards, hairline borders, dark-mode equivalents |
| src/main.tsx | imports coursera.css last (after typography.css) |
| src/components/SiteHeader.tsx | utility bar (For Teachers / Students / Everyone) + header |
| src/components/Navbar.tsx | one row: logo, Explore, big search, About, blue primary button, theme switch |
| src/components/ToolNavBar.tsx | three dropdowns replaced by one "Explore" button |
| src/components/ToolsMenu.tsx | becomes a 3-column mega menu when given several groups |
| src/components/MobileNavDrawer.tsx | recoloured only |
| src/components/ToolHeading.tsx | pale-blue left-aligned page banner on every tool page; new optional `children` slot |
| src/components/GradeCalculator.tsx | home page only: banner buttons + facts, then HomeSections |
| src/components/HomeSections.tsx | NEW. Category cards, "What brings you here today?" tabs, "Why people choose" tiles |
| src/components/Footer.tsx | pale-blue newsletter band + clean multi-column footer. Forms, modals, links unchanged |

Safe by design: exactly one <h1> per page (new sections start at h2), all links use the trailing-slash form via SlashLink,
every footer link kept (CHK-16), calculators and maths untouched, new sections are SSR-safe for the prerender.

Before pushing run: `npm install && npm run lint && npm run build` (I could not run these offline; files were syntax-checked only).
Font stays Inter (already self-hosted). Coursera uses its own typeface; adding Source Sans 3 would need new font files.
To roll back: delete coursera.css, remove its import line in main.tsx, restore the other files from git.
