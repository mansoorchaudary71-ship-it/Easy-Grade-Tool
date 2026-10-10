# Easy Grade Tool: merge notes (batches 1, 2 + CHK-10 fix)

## What failed in CI
`CHK-10 Schema Honesty` failed: identical FAQ answers on different pages.
The "how many can I get wrong ... still get an A?" answer on /grading-scale/N-questions/ pages
did not mention N, so pages with the same cutoffs got word-for-word identical text:
  - 12-questions == 10-questions   (A:1, B:2, C:3, D:4)
  - 16-questions == 15-questions   (A:1, B:3, C:4, D:6)

## Fixes
1. src/data/gradingScalePages.ts: every FAQ answer now includes the question count (answer 2, and the
   partial-credit answer 4 in both branches), so no two pages can share an answer.
2. scripts/verify-scale-pages.ts: new check "no FAQ answer is repeated on another page" so this fails in the
   first build step with a clear message instead of at the end.
3. src/index.css: escaped the `.bg-[#E6F2EE]` style selectors (Vite warned they were invalid and they never matched).

## Merge steps
1. Unzip over the repo root (same paths overwrite).
2. sh cleanup.sh   (optional cleanup of dead files; read it first)
3. npm run lint && npm run build
4. Commit and push.
