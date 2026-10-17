# MERGE_GUIDE: how to apply the kit and deploy

The zip mirrors your repo. Everything outside `fix-kit-docs/` is a file that goes into your repo. `fix-kit-docs/` is documentation only.

## 1. Branch first (so you can undo everything)
```bash
cd Easy-Grade-Tool            # your local clone, up to date with main
git checkout main && git pull
git checkout -b seo-fix-kit
```

## 2. Extract the kit over the repo
```bash
unzip -o /path/to/easygradetool-fix-kit.zip -d .
mv fix-kit-docs ../fix-kit-docs        # keep the docs out of the repo
git status                             # should list 44 changed or new files
```
If a file in `git status` is one you edited after the zip you sent me, do not accept it blindly:
```bash
git diff path/to/file                  # look at what the kit changed
git checkout -p path/to/file           # or take hunks one by one
```
Files most likely to conflict with your own recent edits: `src/data/seoConfig.ts`, `src/data/toolPages.ts`, `src/components/QuickGrader.tsx`, `src/components/Footer.tsx`.

## 3. Check it locally
```bash
npm install
npx tsc --noEmit                            # must print nothing
npx tsx scripts/verify-academic-math.ts     # must end with "all checks passed"
npm run build                               # runs prerender, sitemap and the 17 launch checks
npm run dev                                 # then walk TESTING_CHECKLIST.md
```
`npm run build` must end with "All 17 pre-launch regression checks PASSED". If one fails, the message names the page and the check.

## 4. Optional secrets (so the newsletter and contact forms can deliver)
In GitHub: Settings, Secrets and variables, Actions, add `VITE_FORM_ENDPOINT` (and `VITE_FORM_ACCESS_KEY` if your relay needs one). Without them the build still works; the forms just keep failing as they do today.

## 5. Commit, push and deploy
```bash
git add -A
git commit -m "SEO fix kit: weighted GPA pages, miss calculator, EZ grader intent, schema and a11y fixes"
git push -u origin seo-fix-kit
```
Open a pull request into `main`, wait for the build to pass, then merge. The "Deploy static content to Pages" workflow publishes from `main`; watch the Actions tab until it is green.

## 6. After the deploy
```bash
npm run check:live        # compares the live site with the repo
```
Then do MANUAL_TODO.md (Search Console sitemap and indexing requests).

## Roll back
```bash
git revert <merge-commit>      # or: git checkout main && git branch -D seo-fix-kit before merging
```
