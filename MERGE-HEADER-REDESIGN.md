# Header redesign + clean type style

Copy these files over the same paths in the repo (folder structure is preserved). Nothing needs deleting.

## Changed
- src/components/Navbar.tsx          new header layout (logo | search pill | grouped menus | About | dark pill | theme)
- src/components/ToolNavBar.tsx      three dropdown triggers with chevrons (Grade tools, GPA & percent, Everyday tools)
- src/components/ToolsMenu.tsx       dropdown restyled, now opens one group at a time
- src/components/MobileNavDrawer.tsx drawer restyled, About link added
- src/components/SiteHeader.tsx      decorative sheen removed from the header
- src/components/ToolHeading.tsx     comment only
- src/main.tsx                       imports the new typography.css (last)
- src/index.css, src/styles/premium.css   Inter replaces Plus Jakarta Sans as the lead font; headings use ink #0D0C22
- index.html                         removed the Plus Jakarta Sans preload (no longer used above the fold)

## New
- src/styles/typography.css          site-wide text style: Inter, semibold labels, tight tracking, no 800/900 weights, sentence-case banner badge

## Colours taken from the reference
ink #0D0C22 | field grey #F3F3F6 | secondary text #6E6D7A | accent: your existing blue #2563EB (replaces the reference pink)

Verified: `npm run build` passes, including prerender and all 17 verify-launch checks.
