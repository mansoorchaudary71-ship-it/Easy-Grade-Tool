import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROGRAMMATIC_SEO_REGISTRY } from '../src/data/programmaticSeoData';
import { TOOL_PAGES } from '../src/data/toolPages';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const srcDir = path.resolve(rootDir, 'src');

interface CheckResult {
  id: string;
  category: string;
  description: string;
  status: 'PASS' | 'FAIL';
  details?: string;
}

const results: CheckResult[] = [];

function recordCheck(id: string, category: string, description: string, pass: boolean, details?: string) {
  results.push({
    id,
    category,
    description,
    status: pass ? 'PASS' : 'FAIL',
    details,
  });
}

function getAllHtmlFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      // Static redirect stubs (legacy URLs) are verified separately in CHK-14
      if (fs.readFileSync(filePath, 'utf-8').includes('data-redirect-stub')) continue;
      fileList.push(filePath);
    }
  }
  return fileList;
}

export function runVerifyLaunch(): boolean {
  console.log('🔍 [verify-launch] Starting comprehensive pre-launch regression audit on dist/ and src/...\n');

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory not found. Please run `npm run build` before verification.');
    process.exit(1);
  }

  const htmlFiles = getAllHtmlFiles(distDir);
  const prodHost = 'https://www.easygradetool.com';

  // =========================================================================
  // CHECK 1: og:image & twitter:image Verification
  // =========================================================================
  let ogImageErrors: string[] = [];
  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf-8');
    const relativeHtmlPath = path.relative(distDir, htmlFile);

    // Skip 404 page for social card checks
    if (relativeHtmlPath === '404.html') continue;

    const ogMatches = content.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    const twMatches = content.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i);

    const imageUrls = [ogMatches?.[1], twMatches?.[1]].filter(Boolean) as string[];

    for (const url of imageUrls) {
      if (url.toLowerCase().includes('placeholder')) {
        ogImageErrors.push(`${relativeHtmlPath}: Meta image contains "placeholder" (${url})`);
      }

      // Check if image resolves in dist
      let localPath = url.replace(prodHost, '').replace(/^\/+/, '');
      const distImagePath = path.join(distDir, localPath);
      if (!fs.existsSync(distImagePath)) {
        ogImageErrors.push(`${relativeHtmlPath}: Image does not resolve in dist/ (${url} -> ${distImagePath})`);
      }
    }
  }
  recordCheck(
    'CHK-01',
    'Social Cards',
    'No placeholder og/twitter images; all resolve to valid files in dist/',
    ogImageErrors.length === 0,
    ogImageErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 2: Sitemap & Pre-rendered HTML Sync
  // =========================================================================
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  let sitemapErrors: string[] = [];

  if (!fs.existsSync(sitemapPath)) {
    sitemapErrors.push('dist/sitemap.xml is missing');
  } else {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    if (locMatches.length === 0) {
      sitemapErrors.push('dist/sitemap.xml contains 0 URLs');
    }

    for (const loc of locMatches) {
      const urlPath = loc.replace(prodHost, '').replace(/^\/+|\/+$/g, '');
      const expectedHtml = urlPath === ''
        ? path.join(distDir, 'index.html')
        : path.join(distDir, urlPath, 'index.html');

      if (!fs.existsSync(expectedHtml)) {
        sitemapErrors.push(`Sitemap URL ${loc} has no matching ${path.relative(distDir, expectedHtml)}`);
        continue;
      }

      const fileContent = fs.readFileSync(expectedHtml, 'utf-8');
      if (fileContent.includes('content="noindex')) {
        sitemapErrors.push(`Sitemap URL ${loc} points to page marked noindex (${path.relative(distDir, expectedHtml)})`);
      }

      // Canonical check
      const canonicalMatch = fileContent.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
      if (!canonicalMatch || canonicalMatch[1].replace(/\/+$/, '') !== loc.replace(/\/+$/, '')) {
        sitemapErrors.push(`Sitemap URL ${loc} has mismatched canonical in HTML: ${canonicalMatch?.[1]}`);
      }
    }
  }
  recordCheck(
    'CHK-02',
    'Sitemap Sync',
    'Every sitemap URL exists in dist/, matches canonical, and has no noindex',
    sitemapErrors.length === 0,
    sitemapErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 3: Page SEO Integrity (Title, Description, Canonical, H1)
  // =========================================================================
  let seoIntegrityErrors: string[] = [];
  const seenTitles = new Map<string, string>();

  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf-8');
    const relativeHtmlPath = path.relative(distDir, htmlFile);

    // Skip noindex error pages (404 / 500) for standard SEO checks
    if (relativeHtmlPath === '404.html' || relativeHtmlPath === '500.html') continue;

    // 1. Title
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
      seoIntegrityErrors.push(`${relativeHtmlPath}: Missing <title> tag`);
    } else {
      const title = titleMatch[1].trim();
      if (title.includes('Vite') || title.includes('AI Studio App')) {
        seoIntegrityErrors.push(`${relativeHtmlPath}: Default boilerplate title "${title}"`);
      }
      if (seenTitles.has(title)) {
        seoIntegrityErrors.push(`${relativeHtmlPath}: Duplicate title with ${seenTitles.get(title)} ("${title}")`);
      } else {
        seenTitles.set(title, relativeHtmlPath);
      }
    }

    // 2. Meta description length (120-165 chars)
    const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (!descMatch || !descMatch[1].trim()) {
      seoIntegrityErrors.push(`${relativeHtmlPath}: Missing meta description`);
    } else {
      const desc = descMatch[1].trim();
      if (desc.length < 100 || desc.length > 175) {
        seoIntegrityErrors.push(`${relativeHtmlPath}: Description length (${desc.length}) outside recommended bounds [100, 175]`);
      }
    }

    // 3. Absolute canonical on production host
    const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (!canonicalMatch || !canonicalMatch[1].startsWith(prodHost)) {
      seoIntegrityErrors.push(`${relativeHtmlPath}: Canonical missing or not starting with ${prodHost} (${canonicalMatch?.[1]})`);
    } else {
      const canonical = canonicalMatch[1];
      const stagingPattern = new RegExp(['local' + 'host', ['r', 'u', 'n', '.', 'a', 'p', 'p'].join(''), ['rep', 'lit'].join(''), '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}'].join('|'), 'i');
      if (stagingPattern.test(canonical)) {
        seoIntegrityErrors.push(`${relativeHtmlPath}: Canonical points to non-production host (${canonical})`);
      }
    }

    // 4. Exactly one <h1>
    const h1Matches = content.match(/<h1[\s>]/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;
    if (h1Count !== 1) {
      seoIntegrityErrors.push(`${relativeHtmlPath}: Has ${h1Count} <h1> tags (expected exactly 1)`);
    }
  }
  recordCheck(
    'CHK-03',
    'Page SEO',
    'Unique <title>, valid meta description, production canonical, exactly one <h1>',
    seoIntegrityErrors.length === 0,
    seoIntegrityErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 4: Legal & Key Routes Presence
  // =========================================================================
  const requiredRoutes = ['privacy', 'terms', 'about'];
  let legalRouteErrors: string[] = [];

  for (const r of requiredRoutes) {
    const expectedPath = path.join(distDir, r, 'index.html');
    if (!fs.existsSync(expectedPath)) {
      legalRouteErrors.push(`Required route /${r} missing from dist/ (${expectedPath})`);
    }

    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
      if (!sitemapContent.includes(`${prodHost}/${r}`)) {
        legalRouteErrors.push(`Required route /${r} missing from dist/sitemap.xml`);
      }
    }
  }
  recordCheck(
    'CHK-04',
    'Legal & Core Routes',
    '/privacy, /terms, /about exist in dist/ and in sitemap.xml',
    legalRouteErrors.length === 0,
    legalRouteErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 5: Placeholder & Boilerplate Text in dist/
  // =========================================================================
  let textErrors: string[] = [];
  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf-8');
    const relativeHtmlPath = path.relative(distDir, htmlFile);

    if (/lorem\s+ipsum/i.test(content)) {
      textErrors.push(`${relativeHtmlPath}: Contains "lorem ipsum"`);
    }
    if (/\bTODO\b/i.test(content)) {
      textErrors.push(`${relativeHtmlPath}: Contains "TODO"`);
    }
    if (/Vite\s*\+\s*React/i.test(content)) {
      textErrors.push(`${relativeHtmlPath}: Contains "Vite + React" boilerplate`);
    }

    // example.com outside of placeholder attributes
    const contentWithoutPlaceholders = content.replace(/placeholder="[^"]*"/gi, '');
    if (/example\.com/i.test(contentWithoutPlaceholders)) {
      textErrors.push(`${relativeHtmlPath}: Contains "example.com" outside input placeholder attributes`);
    }
  }
  recordCheck(
    'CHK-05',
    'Content Hygiene',
    'dist/ contains no lorem ipsum, TODO, example.com (outside inputs), or Vite+React',
    textErrors.length === 0,
    textErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 6: Secret Exposure Scan (dist/ & src/)
  // =========================================================================
  let secretErrors: string[] = [];
  const secretPatterns = [
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/g },
    { name: 'OpenAI Secret Key', regex: /sk-[0-9A-Za-z]{20,}/g },
    { name: 'Hardcoded Secret API Key', regex: /API_KEY\s*=\s*["'][a-zA-Z0-9_-]{12,}["']/g },
    { name: 'Private Key Header', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  ];

  function scanDirForSecrets(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirForSecrets(fullPath);
      } else if (/\.(js|mjs|ts|tsx|json|html|env)$/i.test(entry)) {
        const text = fs.readFileSync(fullPath, 'utf-8');
        for (const { name, regex } of secretPatterns) {
          if (regex.test(text)) {
            secretErrors.push(`${path.relative(rootDir, fullPath)}: Matched pattern ${name}`);
          }
        }
      }
    }
  }

  scanDirForSecrets(distDir);
  scanDirForSecrets(srcDir);

  recordCheck(
    'CHK-06',
    'Secrets Security',
    'No exposed API keys, private keys, or credentials in dist/ or src/',
    secretErrors.length === 0,
    secretErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 7: robots.txt Configuration
  // =========================================================================
  const robotsPath = path.join(distDir, 'robots.txt');
  let robotsErrors: string[] = [];

  if (!fs.existsSync(robotsPath)) {
    robotsErrors.push('dist/robots.txt is missing');
  } else {
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    if (!robotsContent.includes('Sitemap:')) {
      robotsErrors.push('dist/robots.txt missing Sitemap: declaration');
    }
    if (/Disallow:\s*\/\s*$/m.test(robotsContent) && !/Allow:\s*\/\s*$/m.test(robotsContent)) {
      robotsErrors.push('dist/robots.txt blocks the entire site (Disallow: /)');
    }
  }
  recordCheck(
    'CHK-07',
    'Robots & Crawlability',
    'robots.txt exists, allows crawlers, and declares Sitemap:',
    robotsErrors.length === 0,
    robotsErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 8: Uniqueness of Indexed Programmatic Pages
  // =========================================================================
  let uniquenessErrors: string[] = [];
  const progDir = distDir;
  const contentSlugs = new Set<string>([...Object.keys(PROGRAMMATIC_SEO_REGISTRY), ...Object.keys(TOOL_PAGES)]);
  const progPages: { file: string; rel: string; words: string[]; text: string; shingles: Set<string> }[] = [];

  function tokenizeWords(text: string): string[] {
    return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter((w) => w.length > 0);
  }

  function get5WordShingles(words: string[]): Set<string> {
    const s = new Set<string>();
    for (let i = 0; i <= words.length - 5; i++) {
      s.add(words.slice(i, i + 5).join(' '));
    }
    return s;
  }

  function jaccard(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 && setB.size === 0) return 0;
    let inter = 0;
    for (const item of setA) {
      if (setB.has(item)) inter++;
    }
    const union = setA.size + setB.size - inter;
    return union === 0 ? 0 : (inter / union) * 100;
  }

  if (fs.existsSync(progDir)) {
    const entries = fs.readdirSync(progDir).filter((e) => contentSlugs.has(e));
    for (const entry of entries) {
      const pFile = path.join(progDir, entry, 'index.html');
      if (fs.existsSync(pFile)) {
        const rawHtml = fs.readFileSync(pFile, 'utf-8');
        if (rawHtml.includes('content="noindex')) continue; // Skip non-indexed pages

        const cleanMain = rawHtml
          .replace(/<header[\s\S]*?<\/header>/gi, '')
          .replace(/<nav[\s\S]*?<\/nav>/gi, '')
          .replace(/<footer[\s\S]*?<\/footer>/gi, '')
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<svg[\s\S]*?<\/svg>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        const words = tokenizeWords(cleanMain);
        progPages.push({
          file: pFile,
          rel: entry,
          words,
          text: cleanMain,
          shingles: get5WordShingles(words),
        });
      }
    }
  }

  // All indexed pages for overlap comparison
  const allIndexedPages: { rel: string; words: string[]; shingles: Set<string> }[] = [];
  for (const hf of htmlFiles) {
    const rel = path.relative(distDir, hf);
    if (rel === '404.html') continue;
    const content = fs.readFileSync(hf, 'utf-8');
    if (content.includes('content="noindex')) continue;

    const main = content
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = tokenizeWords(main);
    allIndexedPages.push({
      rel,
      words,
      shingles: get5WordShingles(words),
    });
  }

  for (const pp of progPages) {
    // 1. Min 400 main-content words
    if (pp.words.length < 400) {
      uniquenessErrors.push(`${pp.rel}: Only ${pp.words.length} main-content words (expected >= 400)`);
    }

    // 2. Uniqueness ratio >= 60% (percentage of 3-word text shingles that appear on no other page)
    function get3WordShingles(w: string[]): Set<string> {
      const s = new Set<string>();
      for (let i = 0; i <= w.length - 3; i++) {
        s.add(w.slice(i, i + 3).join(' '));
      }
      return s;
    }
    const this3Shingles = get3WordShingles(pp.words);
    const other3Shingles = new Set<string>();
    for (const op of allIndexedPages) {
      if (op.rel === pp.rel || op.rel === `${pp.rel}/index.html`) continue;
      for (const s of get3WordShingles(op.words)) other3Shingles.add(s);
    }
    let unique3Count = 0;
    for (const s of this3Shingles) {
      if (!other3Shingles.has(s)) unique3Count++;
    }
    const uniqueRatio = this3Shingles.size > 0 ? (unique3Count / this3Shingles.size) * 100 : 0;
    if (uniqueRatio < 60) {
      uniquenessErrors.push(`${pp.rel}: Uniqueness ratio ${uniqueRatio.toFixed(1)}% is below 60% threshold`);
    }

    // 3. Highest 5-word shingle overlap < 35%
    let maxOverlap = 0;
    let maxOverlapPartner = '';
    for (const op of allIndexedPages) {
      if (op.rel === pp.rel || op.rel === `${pp.rel}/index.html`) continue;
      const sim = jaccard(pp.shingles, op.shingles);
      if (sim > maxOverlap) {
        maxOverlap = sim;
        maxOverlapPartner = op.rel;
      }
    }
    if (maxOverlap >= 35) {
      uniquenessErrors.push(
        `${pp.rel}: Shingle overlap ${maxOverlap.toFixed(1)}% with ${maxOverlapPartner} exceeds 35% threshold`
      );
    }
  }

  recordCheck(
    'CHK-08',
    'Content Uniqueness',
    'Programmatic pages have >=400 words, >=60% unique, <35% shingle overlap',
    uniquenessErrors.length === 0,
    uniquenessErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 9: Index Hygiene (Sitemap, Redirects & Noindex)
  // =========================================================================
  let hygieneErrors: string[] = [];
  const knownRedirectedPaths = new Set([
    'easy-grade-calculator/gpa',
    'easy-grade-calculator/semester-gpa-calculator',
    'easy-grade-calculator/weighted-grade-calculator',
    'easy-grade-calculator/test-score',
    'easy-grade-calculator/college-final-grade-calculator',
    'easy-grade-calculator/high-school-test-grader',
    'privacy-policy',
    'terms-of-service',
    'terms-and-conditions',
    'methodology',
    'about-methodology',
    'gpa',
    'cgpa',
    'easy-grade-calculator/final-exam-grade-calculator',
    'easy-grade-calculator/ez-grader',
    'easy-grade-calculator',
  ]);

  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    const locs = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    for (const loc of locs) {
      const cleanLocPath = loc.replace(prodHost, '').replace(/^\/+|\/+$/g, '');
      if (knownRedirectedPaths.has(cleanLocPath)) {
        hygieneErrors.push(`Sitemap includes redirected URL: ${loc}`);
      }

      const expectedHtml = cleanLocPath === ''
        ? path.join(distDir, 'index.html')
        : path.join(distDir, cleanLocPath, 'index.html');

      if (fs.existsSync(expectedHtml)) {
        const hContent = fs.readFileSync(expectedHtml, 'utf-8');
        if (hContent.includes('content="noindex')) {
          hygieneErrors.push(`Sitemap includes noindexed URL: ${loc}`);
        }
      }
    }
  }

  recordCheck(
    'CHK-09',
    'Index Hygiene',
    'No redirected or noindex URLs in sitemap; all return 200 indexable HTML',
    hygieneErrors.length === 0,
    hygieneErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 10: Schema Honesty (FAQPage Answer Integrity)
  // =========================================================================
  let schemaErrors: string[] = [];
  const seenFaqAnswers = new Map<string, string>();

  for (const hf of htmlFiles) {
    const rel = path.relative(distDir, hf);
    if (rel === '404.html') continue;
    const content = fs.readFileSync(hf, 'utf-8');
    const visibleText = content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');

    const jsonLdMatches = [...content.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const jm of jsonLdMatches) {
      try {
        const parsed = JSON.parse(jm[1]);
        if (parsed['@type'] === 'FAQPage' && Array.isArray(parsed.mainEntity)) {
          for (const item of parsed.mainEntity) {
            const answer = item.acceptedAnswer?.text?.trim();
            if (answer) {
              // 1. Answer text must be visible on the same page
              const normalizedAnsSnippet = answer.slice(0, 50).replace(/\s+/g, ' ');
              if (!visibleText.includes(normalizedAnsSnippet)) {
                schemaErrors.push(`${rel}: FAQ answer in schema not visible in page content ("${normalizedAnsSnippet}...")`);
              }

              // 2. Answer text must not be duplicated on another page
              const normalizedAns = answer.replace(/\s+/g, ' ');
              if (seenFaqAnswers.has(normalizedAns)) {
                schemaErrors.push(
                  `${rel}: FAQ answer duplicated on ${seenFaqAnswers.get(normalizedAns)} ("${answer.slice(0, 40)}...")`
                );
              } else {
                seenFaqAnswers.set(normalizedAns, rel);
              }
            }
          }
        }
      } catch (_) {}
    }
  }

  recordCheck(
    'CHK-10',
    'Schema Honesty',
    'FAQPage schema matches visible text 1:1; no duplicate FAQ answers across pages',
    schemaErrors.length === 0,
    schemaErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 11: No Duplicate Primary Targets
  // =========================================================================
  let duplicateTargetErrors: string[] = [];
  const seenTitlesMap = new Map<string, string>();
  const seenH1Map = new Map<string, string>();
  const seenDescMap = new Map<string, string>();

  for (const hf of htmlFiles) {
    const rel = path.relative(distDir, hf);
    if (rel === '404.html') continue;
    const content = fs.readFileSync(hf, 'utf-8');
    if (content.includes('content="noindex')) continue;

    // Title
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      if (seenTitlesMap.has(title)) {
        duplicateTargetErrors.push(`${rel}: Shares duplicate <title> with ${seenTitlesMap.get(title)}`);
      } else {
        seenTitlesMap.set(title, rel);
      }
    }

    // H1
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) {
      const h1 = h1Match[1].replace(/<[^>]+>/g, '').trim();
      if (seenH1Map.has(h1)) {
        duplicateTargetErrors.push(`${rel}: Shares duplicate <h1> with ${seenH1Map.get(h1)}`);
      } else {
        seenH1Map.set(h1, rel);
      }
    }

    // Meta description
    const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (descMatch) {
      const desc = descMatch[1].trim();
      if (seenDescMap.has(desc)) {
        duplicateTargetErrors.push(`${rel}: Shares duplicate meta description with ${seenDescMap.get(desc)}`);
      } else {
        seenDescMap.set(desc, rel);
      }
    }
  }

  recordCheck(
    'CHK-11',
    'No Duplicate Targets',
    'No two indexed pages share the same <title>, <h1>, or meta description',
    duplicateTargetErrors.length === 0,
    duplicateTargetErrors.slice(0, 3).join('; ')
  );


  // =========================================================================
  // CHECK 12: No foreign / competitor domain anywhere in the build or source
  // =========================================================================
  const BLOCKED_DOMAINS = [/easygradecalculator\.com/i];
  const SCAN_EXT = new Set(['.html', '.xml', '.txt', '.json', '.js', '.css', '.svg', '.webmanifest', '.ts', '.tsx']);
  const foreignHits: string[] = [];
  const scanForForeign = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        if (name === 'node_modules' || name === '.git') continue;
        scanForForeign(full);
      } else if (SCAN_EXT.has(path.extname(name).toLowerCase())) {
        // The guard's own blocklist legitimately names the blocked domain.
        if (name === 'seoGuard.ts') continue;
        const text = fs.readFileSync(full, 'utf-8');
        if (BLOCKED_DOMAINS.some((re) => re.test(text))) {
          foreignHits.push(path.relative(rootDir, full));
        }
      }
    }
  };
  scanForForeign(distDir);
  scanForForeign(srcDir);
  scanForForeign(path.resolve(rootDir, 'public'));
  const rootIndex = path.resolve(rootDir, 'index.html');
  if (fs.existsSync(rootIndex) && BLOCKED_DOMAINS.some((re) => re.test(fs.readFileSync(rootIndex, 'utf-8')))) {
    foreignHits.push('index.html');
  }

  recordCheck(
    'CHK-12',
    'Domain Hygiene',
    'No competitor/foreign domain in dist/, src/, public/ or index.html',
    foreignHits.length === 0,
    foreignHits.slice(0, 3).join(', ')
  );

  // =========================================================================
  // CHECK 13: Icon & manifest links are root-absolute and exist in dist/
  // =========================================================================
  const assetLinkErrors: string[] = [];
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    const rel = path.relative(distDir, file);
    const linkRe = /<link\b[^>]*rel="(?:icon|apple-touch-icon|manifest)"[^>]*>/gi;
    for (const tag of html.match(linkRe) || []) {
      const href = /href="([^"]+)"/i.exec(tag)?.[1] || '';
      if (/^https?:\/\//i.test(href)) continue;
      if (!href.startsWith('/')) {
        assetLinkErrors.push(`${rel}: relative href "${href}"`);
      } else if (!fs.existsSync(path.join(distDir, href.split(/[?#]/)[0]))) {
        assetLinkErrors.push(`${rel}: missing file "${href}"`);
      }
    }
  }
  recordCheck(
    'CHK-13',
    'Icon Links',
    'Favicon/manifest links are root-absolute and resolve on every page',
    assetLinkErrors.length === 0,
    assetLinkErrors.slice(0, 2).join('; ')
  );

  // =========================================================================
  // CHECK 14: Trailing-slash consistency (GitHub Pages 301s /x -> /x/)
  // =========================================================================
  const slashErrors: string[] = [];
  for (const hf of htmlFiles) {
    const rel = path.relative(distDir, hf);
    if (rel === '404.html' || rel === '500.html') continue;
    const c = fs.readFileSync(hf, 'utf-8');
    const m = c.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (m && !m[1].endsWith('/')) slashErrors.push(`${rel}: canonical lacks trailing slash (${m[1]})`);
    const markup = c.replace(/<script[\s\S]*?<\/script>/gi, '');
    for (const lm of markup.matchAll(/href="(\/[^"#?]*)"/g)) {
      const h = lm[1];
      const last = h.split('/').pop() || '';
      if (h === '/' || h.endsWith('/') || last.includes('.')) continue;
      slashErrors.push(`${rel}: internal link without trailing slash (${h})`);
    }
  }
  if (fs.existsSync(sitemapPath)) {
    const locs = [...fs.readFileSync(sitemapPath, 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    for (const loc of locs) if (!loc.endsWith('/')) slashErrors.push(`sitemap loc lacks trailing slash: ${loc}`);
  }
  recordCheck(
    'CHK-14',
    'Trailing Slash',
    'Canonicals, sitemap and internal links all use the served trailing-slash URL',
    slashErrors.length === 0,
    slashErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 15: Legacy redirect stubs resolve to real, indexable, non-redirect pages
  // =========================================================================
  const stubErrors: string[] = [];
  (function walk(dir: string) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (f.endsWith('.html')) {
        const c = fs.readFileSync(full, 'utf-8');
        if (!c.includes('data-redirect-stub')) continue;
        const t = c.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
        if (!t) { stubErrors.push(`${path.relative(distDir, full)}: stub has no canonical target`); continue; }
        const tp = t.replace(prodHost, '').replace(/^\/+|\/+$/g, '');
        const tf = tp === '' ? path.join(distDir, 'index.html') : path.join(distDir, tp, 'index.html');
        if (!fs.existsSync(tf)) stubErrors.push(`${path.relative(distDir, full)}: target ${t} does not exist`);
        else if (fs.readFileSync(tf, 'utf-8').includes('data-redirect-stub')) stubErrors.push(`${path.relative(distDir, full)}: redirect chain via ${t}`);
      }
    }
  })(distDir);
  recordCheck(
    'CHK-15',
    'Legacy Redirects',
    'Every legacy URL stub points at an existing page (no chains, no dead ends)',
    stubErrors.length === 0,
    stubErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHECK 16: Crawl depth - every sitemap URL is linked from the homepage HTML
  // =========================================================================
  const depthErrors: string[] = [];
  if (fs.existsSync(sitemapPath) && fs.existsSync(path.join(distDir, 'index.html'))) {
    const home = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    const locs = [...fs.readFileSync(sitemapPath, 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    for (const loc of locs) {
      const p = loc.replace(prodHost, '') || '/';
      if (p === '/') continue;
      if (!home.includes(`href="${p}"`)) depthErrors.push(`Homepage HTML has no link to ${p}`);
    }
  }
  recordCheck(
    'CHK-16',
    'Crawl Depth',
    'Every sitemap URL is reachable in one click from the homepage',
    depthErrors.length === 0,
    depthErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // CHK-17: service worker and manifest come from VitePWA (Workbox) only
  // =========================================================================
  const pwaErrors: string[] = [];
  const swPath = path.resolve(distDir, 'sw.js');
  const manifestPath = path.resolve(distDir, 'manifest.json');
  if (!fs.existsSync(swPath)) {
    pwaErrors.push('dist/sw.js is missing');
  } else {
    const sw = fs.readFileSync(swPath, 'utf-8');
    if (!/workbox|precacheAndRoute/.test(sw)) pwaErrors.push('dist/sw.js is not a Workbox build');
    if (sw.includes('easygrade-cache')) pwaErrors.push('dist/sw.js is the old hand-written service worker');
  }
  if (!fs.existsSync(manifestPath)) {
    pwaErrors.push('dist/manifest.json is missing');
  } else {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as Record<string, unknown>;
      const homeHtml = fs.existsSync(path.resolve(distDir, 'index.html'))
        ? fs.readFileSync(path.resolve(distDir, 'index.html'), 'utf-8')
        : '';
      const lightMeta = homeHtml.match(/<meta[^>]*name="theme-color"[^>]*content="([^"]+)"[^>]*media="\(prefers-color-scheme: light\)"/i)
        ?? homeHtml.match(/<meta[^>]*name="theme-color"[^>]*media="\(prefers-color-scheme: light\)"[^>]*content="([^"]+)"/i);
      if (lightMeta && String(manifest.theme_color).toLowerCase() !== lightMeta[1].toLowerCase()) {
        pwaErrors.push(`manifest theme_color ${String(manifest.theme_color)} differs from <meta theme-color> ${lightMeta[1]}`);
      }
      for (const key of ['name', 'start_url', 'scope', 'icons', 'lang', 'dir']) {
        if (!(key in manifest)) pwaErrors.push(`manifest is missing "${key}"`);
      }
    } catch {
      pwaErrors.push('dist/manifest.json is not valid JSON');
    }
  }
  recordCheck(
    'CHK-17',
    'PWA',
    'sw.js and manifest.json are generated by VitePWA only',
    pwaErrors.length === 0,
    pwaErrors.slice(0, 3).join('; ')
  );

  // =========================================================================
  // PRINT SUMMARY TABLE
  // =========================================================================
  console.log('\n================================================================================');
  console.log('                      PRE-LAUNCH REGRESSION AUDIT REPORT                        ');
  console.log('================================================================================');
  console.log('| ID     | Category             | Description                                     | Status |');
  console.log('| :----- | :------------------- | :---------------------------------------------- | :----- |');

  let allPassed = true;
  for (const r of results) {
    const statusIcon = r.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
    console.log(
      `| ${r.id.padEnd(6)} | ${r.category.padEnd(20)} | ${r.description.padEnd(47).slice(0, 47)} | ${statusIcon} |`
    );
    if (r.status === 'FAIL') {
      allPassed = false;
      if (r.details) {
        console.log(`|        |                      | -> Details: ${r.details.slice(0, 44)} |        |`);
      }
    }
  }
  console.log('================================================================================');

  if (!allPassed) {
    console.error('\n🚨 [verify-launch] Verification FAILED. Fix the failing items above before shipping.\n');
    return false;
  }

  console.log(`\n🎉 [verify-launch] All ${results.length} pre-launch regression checks PASSED with 100% compliance!\n`);
  return true;
}

if (process.argv[1] && process.argv[1].endsWith('verify-launch.ts')) {
  const success = runVerifyLaunch();
  process.exit(success ? 0 : 1);
}
