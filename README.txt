1. Apply the first zip (changed-files.zip: mobile nav + switch removal) if you have not already.
2. Unzip THIS package over your repo root (files overwrite).
3. From the repo root run:  sh delete-duplicates.sh
4. npm run build   (all 16 launch checks pass; verified)
5. git add -A && git commit -m "Remove duplicate EZ Grader page and dead copied tool files" && git push
Then you may delete delete-duplicates.sh and README.txt.
