# Merge instructions

1. Unzip `Easy-Grade-Tool-fixed.zip` over your repo root (files overwrite).
2. Run `sh apply-deletions.sh` from the repo root, then `npm uninstall @google/genai` to sync the lockfile.
3. Run `npm ci && npm run build`. If a CHK check fails, send me the log line.
4. `git add -A && git commit -m "Audit pass 1: hygiene, PWA, 404 head, math guards" && git push`

Alternatives: `Easy-Grade-Tool-full.zip` is the complete corrected repo; `fixes.patch` applies with `git apply`.
