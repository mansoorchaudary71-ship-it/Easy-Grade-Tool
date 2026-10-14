# Menu bar redesign (tool tabs row)

Copy `src/components/ToolNavBar.tsx` over the same path in the repo. That is the only file changed.

- Header (logo, search, 100% Private, Install App, theme) is untouched.
- Same tabs, links, routes, preloading, "More tools" sheet and sliding-pill animation.
- Exports `ToolNavBar`, `ICON_STROKE`, `headerFocusRing` are kept, so no other import breaks.
