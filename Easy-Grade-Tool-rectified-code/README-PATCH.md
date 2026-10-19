# Rectified code (patch only)

Contains ONLY the files that were added or changed. Everything else in your project stays as it is.

1. Unzip this archive into the root of your project (overwrite when asked).
2. Run `bash apply-patch.sh` from the project root to delete the obsolete files listed in `FILES-TO-DELETE.txt`.
3. `npm ci && npm run lint && npm run build`

Start with `docs/UI-UX-AUDIT-REPORT.md` and `docs/DESIGN-SYSTEM.md`. `docs/design-system.html` shows every component.
