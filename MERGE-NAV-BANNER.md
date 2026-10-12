# Nav + banner fix

Copy `src/` over the repo (same paths). No new files, no dependency changes.

1. Duplicate tool bar removed: Navbar.tsx no longer contains its own tool row. ToolNavBar.tsx (mounted once by SiteHeader) is the only one,
   a single horizontally scrolling row on mobile and desktop. Two rows shared the "toolbar-active-pill" layoutId, which made the blue pill jump to the wrapped second row.
2. Glass: `.glass-bar` in premium.css (rgba(30,41,59,.75), blur 16px, 1px white/10 border). SiteHeader is the sticky wrapper for both bars.
3. Slate banner (ToolHeading) now also on ToolPage.tsx (Test Grade, Grade Curve, Letter Grade, Average Grade, grading-scale pages) and ProgrammaticCalculatorView.tsx (Final Exam).
