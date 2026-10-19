#!/usr/bin/env bash
# Usage: from your project root:   bash apply-patch.sh
# (1) Unzip this patch over the project root first (it overwrites the changed files and adds the new ones).
# (2) This script then deletes the obsolete files/folders listed in FILES-TO-DELETE.txt.
set -e
while IFS= read -r p; do
  [ -z "$p" ] && continue
  if [ -e "$p" ]; then rm -rf -- "$p"; echo "removed $p"; fi
done < FILES-TO-DELETE.txt
echo "Done. Now run: npm ci && npm run lint && npm run build"
