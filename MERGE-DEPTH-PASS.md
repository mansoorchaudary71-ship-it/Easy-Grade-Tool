# Depth and elevation pass: merge notes

Unzip over the repo root (paths match). 8 source files + 2 notes. This zip REPLACES the earlier stark-chrome-redesign.zip: it contains the same files, updated, so merge only this one.

- src/styles/premium.css             NEW elevation system: .elev-chrome (header), .elev-card (name bar), .elev-footer, .elev-pill (+ --ok): faint gradients, 1px low-opacity edges, 3-4 stacked shadows, blue bloom on hover/focus; dark-mode variants
- src/components/ChromeAccents.tsx   curves rebuilt in 3 layers (blurred glow, gradient stroke fading to its tail, drop shadow); name-bar art fades out toward the text
- src/components/SiteHeader.tsx      uses .elev-chrome
- src/components/Navbar.tsx          pill controls, wider search that no longer clips its placeholder, emerald lifted "100% Private" pill
- src/components/ToolNavBar.tsx      stronger links, hover tint, active link gets a glowing gradient pill underline
- src/components/ToolHeading.tsx     name bar uses .elev-card
- src/components/Footer.tsx          uses .elev-footer; pills, chips, newsletter field and button share the same lighting
- src/styles/ux-refactor.css         fields: pure white + fine edge + contact shadow; every large card inside <main> gets the same edge and layered shadow
- MERGE-STARK-CHROME.md              (from round 1, still valid)

Tune in one place: shadows and edges are the --el-* variables and the .elev-* classes in premium.css.
Then: npm run lint && npm run build
