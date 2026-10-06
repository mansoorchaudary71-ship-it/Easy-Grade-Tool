# Audit patch: how to apply

1. Unzip over your repo root (two files: `src/data/navItems.ts` is replaced, `docs/AUDIT-2026-10-06.md` is added).
2. Run `npm install && npm run build`. The build runs your math tests and 16-check launch audit.
3. Push to `main`.

Only change: removes the duplicate "EZ Grader" tab from the nav. The `/ez-grader/` URL stays live.
Read `docs/AUDIT-2026-10-06.md` for the full audit and the staged plan for everything else.
