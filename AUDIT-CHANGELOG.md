# Audit changelog (partial remediation)

**Scope of this pass: Phases 1, 2 and part of 3 only. Most of the audit is NOT done (see "Not done").**

## Verification environment

The sandbox has no network, so `npm ci` could not run and there is no `node_modules`. `npm run build`, `npm run lint` and `npm run verify:selftest` were **not run**. What was run:

- `tsx scripts/verify-academic-math.ts` and `tsx scripts/verify-scale-pages.ts`, with a throwaway stub for `lucide-react` kept outside the repo. Both pass, including the new assertions below.
- A TypeScript syntax check (`transpileModule`) of every edited `.ts`/`.tsx` file. This catches syntax errors only, not type errors.

Which CHK check failed in your GitHub Action (A1) is therefore **unknown**. Please paste the failing log line.

## Changed

| ID | What changed | Files | Evidence |
|---|---|---|---|
| A2 | Workflow uses `npm ci`, npm cache, Node from `.nvmrc` (22), `configure-pages`. `engines` added. `legacy-peer-deps` kept (cannot test removal offline). | `.github/workflows/deploy.yml`, `.nvmrc`, `package.json` | Static only |
| A3 | Scratch folders, patches, notes and old scripts removed; two design notes archived to `docs/notes/`; real `README.md` added; `tsconfig` exclude list simplified. | see `DELETIONS.txt`, `README.md` | Each deleted source file had no importers (grep) |
| A4 | Deleted `src/assets/images` (5.8 MB, no imports). | `DELETIONS.txt` | grep: zero references |
| A5 (partial) | Removed stale Gemini/AI-Studio entries from `.env.example`. **`@google/genai` is still in `package.json`**: editing dependencies by hand would desync `package-lock.json`. Run `npm uninstall @google/genai` locally and commit the lockfile. | `.env.example` | grep: no imports of `@google/genai` |
| A6 (partial) | Removed `experimentalDecorators`, `useDefineForClassFields`, `allowJs`. **`strict` NOT enabled**: cannot see the resulting type errors offline. | `tsconfig.json` | Static only |
| A7 | Deleted 7 unused components and `useOnlineStatus`. | `DELETIONS.txt` | grep: no importers in `src/`, `scripts/`, `server.ts`, `index.html` |
| A10 | `start` uses `tsx`; `clean` is cross-platform. | `package.json` | Static only |
| B1 | Removed the `window.fetch` patch, restructured `start()`, hydration mismatches logged in dev only. | `src/main.tsx` | Syntax check only |
| B2 | Route preload is raced against a 1.5 s timeout. | `src/main.tsx` | Syntax check only |
| B5 | `SEOHead` renders nothing for paths it has no config for; `NotFound` strips any inherited canonical and `og:url`. **No test added to `scripts/test-site-qa.ts` yet.** | `SEOHead.tsx`, `NotFound.tsx` | Reasoned from source; needs a browser check |
| B8 | Programmatic-route check uses segment-boundary matching. | `src/App.tsx` | Syntax check only |
| B9 | `activeTool` derived with `useMemo`, no state mirror. | `src/App.tsx` | Syntax check only |
| B14 | Real defect: `gradeOneStudent(0, …)` returned `NaN` and `"NaN"`, and `wrong > total` gave negative `correct`. Fixed and guarded. 14 new assertions. | `gradeCalculations.ts`, `verify-academic-math.ts` | Script run: all pass |
| C1 | Deleted `public/sw.js` and `public/manifest.json`; `lang`/`dir` moved into the VitePWA manifest. New **CHK-17** checks that `dist/sw.js` is Workbox, `dist/manifest.json` is valid and its `theme_color` equals the light `<meta theme-color>`. | `vite.config.ts`, `verify-launch.ts` | CHK-17 not yet run against a real `dist/` |
| C2 / F4 | `globIgnores` for `og-cards`, `images`, `grading-scale`, error pages. Removed the JS/CSS stale-while-revalidate rule. Font and image runtime rules are same-origin only. | `vite.config.ts` | Static only |
| C6 | Documented the missing-headers problem and options. | `docs/SEO-OPS.md` | n/a |
| C13 | Removed duplicate `public/security.txt`; `.well-known/` copy stays. | `DELETIONS.txt` | `serverApp.ts` serves both paths for the server variant |

## Audit claims that did not hold (no change made)

- **B3**: `preloadAllTools()` already skips Data Saver and 2G, and warms only `gpa`, `cgpa`, `percentage` and the command palette on idle. It does not download every calculator. Navbar and Footer already preload on hover/focus/touch.
- **B4**: the redirect flow is not dead. `scripts/prerender.ts` (about line 226) writes `dist/404.html` with the script that sets `spa_redirect_target`. The `App.tsx` block is its other half and was left in place.

## Not done

A1 root cause, A8, A9, B6, B7, B10 to B13, C3 to C5, C7 to C12, C14, C15 (needs your decision), all of D, E, F1 to F3, F5 to F7, G, the §4 second-pass line-by-line review, and the §5 checklist (bundle report, contrast report, keyboard walkthrough, per-page head/JSON-LD audit). Items that need a real build or browser were not attempted.

## Decisions for you

1. Run `npm uninstall @google/genai` locally (A5) so the lockfile stays consistent.
2. Keep or drop the four off-topic tools (tip, loan, mortgage, password) (C15).
3. Form backend and persistence (B11, B12) are unreviewed.
