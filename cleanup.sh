#!/usr/bin/env sh
# Removes dead copies, relics and unused files. Run from the repo root AFTER merging website_fixes.zip.
# Every path below was checked: nothing in src/, scripts/, index.html or vite.config.ts references it.
# Review with `git status` before committing. Safe to re-run.
set -e
for p in \
  GradeCalculator.tsx QuickGradeGuide.tsx \
  quick-grade-updated-files fixed-2-files-v2 quick-grade nav seo offline \
  docs/INTEGRATION.md delete-duplicates.sh DELETE.txt README.txt \
  MERGE.md MERGE-AUDIT-PATCH.md MERGE-REMOVE-SWITCH.md remove-switch.diff CHANGES.md \
  src/components/GradeScaleModal.tsx \
  src/components/GpaToPercentage.tsx src/components/GuideArticle.tsx src/components/NumericKeypad.tsx \
  src/components/OfflineIndicator.tsx src/components/QuickGradeCalculator.tsx src/components/ToolLayout.tsx \
  src/hooks/useOnlineStatus.ts \
  src/assets/images
do
  if [ -e "$p" ]; then
    git rm -r -q --ignore-unmatch "$p" 2>/dev/null || true
    rm -rf "$p"
    echo "removed $p"
  fi
done
echo
echo "NOT removed on purpose (your call):"
echo "  public/sw.js and public/manifest.json: VitePWA generates both. Delete them once you have confirmed that"
echo "  dist/sw.js and dist/manifest.json exist after 'npm run build'."
echo "  bun.lock: keep ONE lockfile. The CI workflow uses npm, so 'git rm bun.lock' unless you build with bun."
echo "  server.ts, src/server/, server-data/, metadata.json and the express/@google/genai dependencies are AI Studio"
echo "  leftovers that GitHub Pages never runs. Remove them together with: npm uninstall @google/genai express"
echo "  compression dotenv express-rate-limit helmet @types/express @types/compression  (and change the dev script to 'vite')."
