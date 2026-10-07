#!/usr/bin/env sh
# Run from the repo root, AFTER unzipping this package over the repo.
# Removes the duplicate / copied tool files. Nothing imports them (verified with tsc + full build).
set -e
for p in \
  src/components/QuickGradeCalculator.tsx \
  src/components/GpaToPercentage.tsx \
  quick-grade
do
  if [ -e "$p" ]; then
    git rm -r -q --ignore-unmatch "$p" 2>/dev/null || rm -rf "$p"
    rm -rf "$p"
    echo "deleted $p"
  fi
done
echo "Done. Now run: npm run build"
