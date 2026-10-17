# MANUAL_TODO: things code cannot fix

## Do right after deploying
1. **Search Console: submit the sitemap.** Property for `https://www.easygradetool.com/`, Sitemaps, add `sitemap.xml`. It should show 38 URLs.
2. **Request indexing** (URL Inspection, then Request Indexing) for `/`, `/weighted-gpa-calculator/`, `/weighted-vs-unweighted-gpa/`, `/how-many-questions-can-i-miss/`, `/grading-scale/`, `/final-exam-grade-calculator/`.
3. **Check canonicals** for the question-count pages that already get impressions (12, 15, 16, 35, 75): user-declared canonical must equal Google-selected canonical.
4. **Fix the live GPA page.** Last I checked, live `/gpa-calculator/` was an older build than your repo. After this deploy run `npm run check:live`. If it is still stale, check the latest "Deploy static content to Pages" run in the Actions tab.
5. **Export Search Console, Links** (Top linking sites, Top linked pages) and send me the files, so the off-page audit can use real data. Verify the site in Ahrefs Webmaster Tools too.

## Decisions only you can make
- **Off-niche pages** (Tip, Loan, Mortgage, Password): noindex them, or keep them? My recommendation is to noindex them and remove them from the sitemap and the nav; I did not do it without your answer. Competitor easygradecalculator.com ships the same tools, so they do not differentiate you.
- **Reviewer.** `ACADEMIC_REVIEWER` is `null` on purpose. Only fill it with a real, named, consenting person.
- **Profiles.** Put real LinkedIn and GitHub URLs into `SITE_OWNER.sameAs` in `src/data/siteIdentity.ts`.
- **CGPA/SGPA pages.** You said the target is the USA, so the existing CGPA page is off-audience. Keep it, noindex it, or leave it alone.

## Host-level work (a zip cannot do these)
- **Real 301 redirects, security headers and CSP.** GitHub Pages ignores `public/_headers` and cannot send 301s. The 32 legacy URLs are meta-refresh stubs. Options: put Cloudflare (free plan) in front with Redirect Rules built from `src/data/legacyRedirects.ts` plus Transform Rules for `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`; or move to Cloudflare Pages, which reads the generated `dist/_redirects` and `public/_headers`. Start CSP in report-only mode before enforcing it.
- **Forms.** Create a Formspree or Web3Forms form and add the repository secrets `VITE_FORM_ENDPOINT` (and `VITE_FORM_ACCESS_KEY`). Without them the newsletter and contact forms cannot deliver.
- **Verify the domain setup.** www versus non-www and "Enforce HTTPS" in the repository's Pages settings.

## Cleanup (needs deletes, which an overlay zip cannot do)
Delete from the repo root after checking `git status`: the patch folders `Easy-Grade-Tool-speed-fix/`, `fix/`, `fixed-2-files-v2/`, `glass-update/`, `nav/`, `offline/`, `quick-grade/`, `quick-grade-updated-files/`, `easy-grade-seo-master/`, the root-level `GradeCalculator.tsx` and `QuickGradeGuide.tsx`, the `*.sh`, `*.patch` and `MERGE*.md` files, `src/components/NumericKeypad.tsx` (nothing imports it) and `public/og-cards/README.md` (it ships to production).

## Content work still open
- Add 3 to 5 outbound links to authoritative sources (a school grading policy page, a registrar page) on About, the weighted GPA pages and the CGPA page. No page on the site links out today.
- Read the new pages once for tone and facts, especially "Some colleges recalculate GPA…" and the bonus-point wording.
- After 4 to 6 weeks of Search Console data: decide which of the 17 question-count pages stay indexed (zero impressions and no distinct content means `noindex, follow` and out of the sitemap).
- Remaining pages from the content plan (see KEYWORD_MAP.md).

## Off-page (all manual, see the Off-Page audit)
Directory submissions (PeerPush, SaaSHub, AlternativeTo, Product Hunt), resource-page outreach to teachers and .edu pages, the printable PDF pack, the embeddable widget, and Google Alerts for "easygradetool.com" and "Easy Grade Tool". Weekly targets are in the 90-day plan.
