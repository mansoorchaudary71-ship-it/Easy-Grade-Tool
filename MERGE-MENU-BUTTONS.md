# Menu buttons: Primary / Secondary redesign

Copy the three files in `src/components/` over the same paths in the repo, then commit. Nothing else changes.

    src/components/ToolNavBar.tsx      menu bar tabs (+ "More tools" button)
    src/components/MoreToolsMenu.tsx   "More tools" dropdown (tablet / desktop)
    src/components/MoreToolsSheet.tsx  "More tools" bottom sheet (phones)

No new files, no new dependencies, no CSS edits, routes / preloading / keyboard handling / a11y untouched.

## What changed
- Current page = **Primary**: solid indigo (#4D63DA family), white bold text, soft coloured shadow, top highlight.
  The fill is the existing sliding pill (same `layoutId`), so it still glides between tabs.
- Every other tool = **Secondary**: white fill, 1.5px indigo outline, indigo bold text.
  Hover: outline firms up, faint tint, 1px lift. Press: the existing global tap-scale in premium.css.
- "More tools": Secondary; tinted while its menu is open; Primary (showing the tool name) when a general tool is the current page.
- Dropdown and phone sheet use the same buttons (teal removed from the sheet).
- Dark mode has its own lighter indigo set. Same size, radius, border and weight in every state, so nothing shifts when the active tab changes.
- Tabs are 40px tall (was 36px), row spacing 6px, nav max width 1400px so the row still fits on desktop.

## Retheme
Search the three files for `4D63DA`, `5A6FE6`, `4157CC` (light) and `8B9CFF`, `6E82F5`, `4A5FDB` (dark).
