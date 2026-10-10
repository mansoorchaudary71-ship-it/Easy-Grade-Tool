#!/usr/bin/env sh
# Run from the repo root.
set -e
while read -r p; do
  [ -n "$p" ] && git rm -r -q --ignore-unmatch -- "$p"
done < DELETIONS.txt
echo "Deletions applied."
