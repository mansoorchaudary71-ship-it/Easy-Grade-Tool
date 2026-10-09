# Easy Grade Tool: merge notes (batch 1)

Copy the files in this zip over the repo (same paths), then run the deletions below.

## Delete (git rm)
- src/components/GradeScaleModal.tsx  (replaced by the inline cutoff editor in QuickGrader + CutoffFields.tsx)

## Then run
    npm run lint
    npm run verify:math
    npm run build && npm run verify

## Needs a human decision / not in this batch
See the chat summary for the full list (Navbar, N-question pages, Average Grade page, vite.config, package.json,
sitemap, images, repo clean-up, hosting).
