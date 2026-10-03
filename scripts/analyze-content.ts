import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

interface PageAnalysis {
  path: string;
  relativePath: string;
  totalBytes: number;
  byteBreakdown: {
    visibleTextBytes: number;
    scriptBytes: number;
    styleBytes: number;
    svgBytes: number;
    markupBytes: number;
  };
  mainContentText: string;
  mainContentWords: number;
  uniqueWordsRatio: number;
  highestOverlapPartner: string;
  highestOverlapPercentage: number;
  title: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  canonical: string;
  faqQuestions: string[];
  jsonLdTypes: string[];
  faqAnswers: string[];
  duplicatedFaqAnswersCount: number;
  nearDuplicateFlag: string | null;
}

const IN_SCOPE_PATHS = [
  'easy-grade-calculator/college-final-grade-calculator/index.html',
  'easy-grade-calculator/high-school-test-grader/index.html',
  'easy-grade-calculator/gpa/index.html',
  'easy-grade-calculator/test-score/index.html',
  'easy-grade-calculator/weighted-grade-calculator/index.html',
  'easy-grade-calculator/final-exam-grade-calculator/index.html',
  'easy-grade-calculator/semester-gpa-calculator/index.html',
  'easy-grade-calculator/ez-grader/index.html',
];

const COMPARISON_PATHS = [
  'index.html',
  'grade-calculator/index.html',
  'gpa-calculator/index.html',
  'cgpa-to-percentage-calculator/index.html',
];

const ALL_PATHS = [...IN_SCOPE_PATHS, ...COMPARISON_PATHS];

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function tokenizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function get5WordShingles(words: string[]): Set<string> {
  const shingles = new Set<string>();
  if (words.length < 5) {
    if (words.length > 0) shingles.add(words.join(' '));
    return shingles;
  }
  for (let i = 0; i <= words.length - 5; i++) {
    shingles.add(words.slice(i, i + 5).join(' '));
  }
  return shingles;
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : (intersection / union) * 100;
}

export function runAnalysis() {
  console.log('================================================================================');
  console.log('              TECHNICAL SEO DUPLICATE CONTENT & CANNIBALIZATION AUDIT           ');
  console.log('================================================================================\n');

  // Verify all files exist
  const existingAllPaths = ALL_PATHS.filter((p) => fs.existsSync(path.join(distDir, p)));
  if (existingAllPaths.length < ALL_PATHS.length) {
    console.warn('⚠️ Some paths were not found in dist/. Running on available pages.');
  }

  // Raw HTML content store
  const rawHtmlMap = new Map<string, string>();
  for (const p of existingAllPaths) {
    rawHtmlMap.set(p, fs.readFileSync(path.join(distDir, p), 'utf-8'));
  }

  // 1. Identify shared text blocks across 3 or more pages (to strip repeated headers, footers, shared modals, shared how-to)
  // We collect paragraph and block level texts
  const blockCounts = new Map<string, number>();
  for (const [_, html] of rawHtmlMap) {
    const blocks = html.match(/<(p|li|div|section|article)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
    const seenOnThisPage = new Set<string>();
    for (const b of blocks) {
      const stripped = cleanText(b.replace(/<[^>]+>/g, ' '));
      if (stripped.length > 60) {
        seenOnThisPage.add(stripped);
      }
    }
    for (const b of seenOnThisPage) {
      blockCounts.set(b, (blockCounts.get(b) || 0) + 1);
    }
  }

  const sharedRepeatedBlocks = new Set<string>();
  for (const [block, count] of blockCounts.entries()) {
    if (count >= 3) {
      sharedRepeatedBlocks.add(block);
    }
  }

  // Store page extraction data
  const pageMap = new Map<string, PageAnalysis>();

  for (const p of existingAllPaths) {
    const html = rawHtmlMap.get(p)!;
    const totalBytes = Buffer.byteLength(html, 'utf-8');

    // 1. Byte Breakdown
    let scriptBytes = 0;
    const scriptMatches = html.match(/<script[\s\S]*?<\/script>/gi) || [];
    for (const s of scriptMatches) scriptBytes += Buffer.byteLength(s, 'utf-8');

    let styleBytes = 0;
    const styleMatches = html.match(/<style[\s\S]*?<\/style>/gi) || [];
    for (const s of styleMatches) styleBytes += Buffer.byteLength(s, 'utf-8');

    let svgBytes = 0;
    const svgMatches = html.match(/<svg[\s\S]*?<\/svg>/gi) || [];
    for (const s of svgMatches) svgBytes += Buffer.byteLength(s, 'utf-8');

    // Strip script, style, svg to calculate text vs markup
    const noEmbeds = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '');

    // Visible text
    const visibleText = cleanText(noEmbeds.replace(/<[^>]+>/g, ' '));
    const visibleTextBytes = Buffer.byteLength(visibleText, 'utf-8');

    // Markup is remainder
    const markupBytes = Math.max(0, totalBytes - (scriptBytes + styleBytes + svgBytes + visibleTextBytes));

    // 2. Extract Main Content
    // Strip header, nav, footer
    let mainHtml = html
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '');

    // Extract text from mainHtml
    let mainContentRaw = cleanText(mainHtml.replace(/<[^>]+>/g, ' '));

    // Strip blocks that appear on 3 or more pages verbatim
    for (const repeated of sharedRepeatedBlocks) {
      if (mainContentRaw.includes(repeated)) {
        mainContentRaw = mainContentRaw.replaceAll(repeated, ' ');
      }
    }
    const mainContentClean = cleanText(mainContentRaw);
    const mainWords = tokenizeWords(mainContentClean);

    // 3. Metadata Extraction
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? cleanText(titleMatch[1]) : '';

    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    const metaDescription = descMatch ? cleanText(descMatch[1]) : '';

    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1 = h1Match ? cleanText(h1Match[1].replace(/<[^>]+>/g, '')) : '';

    const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
      cleanText(m[1].replace(/<[^>]+>/g, ''))
    );

    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
    const canonical = canonicalMatch ? cleanText(canonicalMatch[1]) : '';

    // FAQ and JSON-LD
    const jsonLdTypes: string[] = [];
    const faqQuestions: string[] = [];
    const faqAnswers: string[] = [];

    const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const jm of jsonLdMatches) {
      try {
        const parsed = JSON.parse(jm[1]);
        if (parsed['@type']) jsonLdTypes.push(parsed['@type']);
        if (parsed['@type'] === 'FAQPage' && Array.isArray(parsed.mainEntity)) {
          for (const item of parsed.mainEntity) {
            if (item.name) faqQuestions.push(cleanText(item.name));
            if (item.acceptedAnswer?.text) faqAnswers.push(cleanText(item.acceptedAnswer.text));
          }
        }
      } catch (_) {}
    }

    pageMap.set(p, {
      path: p,
      relativePath: p.replace(/\/index\.html$/, ''),
      totalBytes,
      byteBreakdown: {
        visibleTextBytes,
        scriptBytes,
        styleBytes,
        svgBytes,
        markupBytes,
      },
      mainContentText: mainContentClean,
      mainContentWords: mainWords.length,
      uniqueWordsRatio: 0,
      highestOverlapPartner: '',
      highestOverlapPercentage: 0,
      title,
      metaDescription,
      h1,
      h2s: h2Matches,
      canonical,
      faqQuestions,
      jsonLdTypes,
      faqAnswers,
      duplicatedFaqAnswersCount: 0,
      nearDuplicateFlag: null,
    });
  }

  // 4. Calculate pairwise 5-word shingle overlaps & unique text ratios
  for (const pageA of pageMap.values()) {
    const wordsA = tokenizeWords(pageA.mainContentText);
    const shinglesA = get5WordShingles(wordsA);
    const wordSetA = new Set(wordsA);

    let maxOverlap = 0;
    let maxPartner = 'none';

    for (const pageB of pageMap.values()) {
      if (pageA.path === pageB.path) continue;
      const wordsB = tokenizeWords(pageB.mainContentText);
      const shinglesB = get5WordShingles(wordsB);
      const sim = jaccardSimilarity(shinglesA, shinglesB);
      if (sim > maxOverlap) {
        maxOverlap = sim;
        maxPartner = pageB.relativePath;
      }
    }

    pageA.highestOverlapPercentage = Math.round(maxOverlap * 10) / 10;
    pageA.highestOverlapPartner = maxPartner;

    // Check unique words (words that appear on NO other page)
    const otherWordsSet = new Set<string>();
    for (const pageB of pageMap.values()) {
      if (pageA.path === pageB.path) continue;
      for (const w of tokenizeWords(pageB.mainContentText)) {
        otherWordsSet.add(w);
      }
    }

    let uniqueWordCount = 0;
    for (const w of wordSetA) {
      if (!otherWordsSet.has(w)) uniqueWordCount++;
    }
    pageA.uniqueWordsRatio = wordSetA.size > 0 ? Math.round((uniqueWordCount / wordSetA.size) * 100) : 0;

    // Check duplicate FAQ answers
    let dupFaqs = 0;
    for (const ans of pageA.faqAnswers) {
      for (const pageB of pageMap.values()) {
        if (pageA.path === pageB.path) continue;
        if (pageB.faqAnswers.includes(ans)) {
          dupFaqs++;
          break;
        }
      }
    }
    pageA.duplicatedFaqAnswersCount = dupFaqs;

    // Near duplicate checks
    const kw = pageA.h1.toLowerCase();
    if (pageA.relativePath.includes('gpa') && (pageA.title.toLowerCase().includes('gpa') || kw.includes('gpa'))) {
      if (pageA.relativePath !== 'gpa-calculator' && pageA.highestOverlapPartner.includes('gpa')) {
        pageA.nearDuplicateFlag = 'Cannibalizes /gpa-calculator';
      }
    }
  }

  // PRINT TABLE 1: BYTE BREAKDOWN
  console.log('### 1. HTML Byte Breakdown Table');
  console.log('| Page Path | Total Bytes | Text Bytes (%) | Script / JSON (%) | Style (%) | SVG (%) | Markup (%) |');
  console.log('| :--- | :--- | :--- | :--- | :--- | :--- | :--- |');
  for (const inScope of IN_SCOPE_PATHS) {
    const p = pageMap.get(inScope);
    if (!p) continue;
    const b = p.byteBreakdown;
    const pct = (n: number) => `${Math.round((n / p.totalBytes) * 100)}%`;
    console.log(
      `| \`${p.relativePath}\` | ${(p.totalBytes / 1024).toFixed(1)} KB | ${b.visibleTextBytes} (${pct(b.visibleTextBytes)}) | ${b.scriptBytes} (${pct(b.scriptBytes)}) | ${b.styleBytes} (${pct(b.styleBytes)}) | ${b.svgBytes} (${pct(b.svgBytes)}) | ${b.markupBytes} (${pct(b.markupBytes)}) |`
    );
  }

  // PRINT TABLE 2: MAIN CONTENT & SHINGLE OVERLAP
  console.log('\n### 2. Main-Content Word Count, Uniqueness & 5-Word Shingle Overlap');
  console.log('| Page Path | Main Words | Unique Word % | Highest Overlap Partner | 5-Word Overlap % | Duplicate FAQ Answers |');
  console.log('| :--- | :--- | :--- | :--- | :--- | :--- |');
  for (const inScope of IN_SCOPE_PATHS) {
    const p = pageMap.get(inScope);
    if (!p) continue;
    console.log(
      `| \`${p.relativePath}\` | ${p.mainContentWords} words | ${p.uniqueWordsRatio}% | \`${p.highestOverlapPartner}\` | ${p.highestOverlapPercentage}% | ${p.duplicatedFaqAnswersCount} / ${p.faqAnswers.length} |`
    );
  }

  // PRINT TABLE 2B: FULL PAIRWISE OVERLAP MATRIX
  console.log('\n### 2B. Full Pairwise 5-Word Shingle Overlap Matrix (Jaccard %)');
  const shortNames = existingAllPaths.map((p) => p.replace(/\/index\.html$/, '').replace('easy-grade-calculator/', 'egc/'));
  const headerRow = '| Page | ' + shortNames.map((n) => n.slice(0, 10)).join(' | ') + ' |';
  const sepRow = '| :--- | ' + shortNames.map(() => ':---').join(' | ') + ' |';
  console.log(headerRow);
  console.log(sepRow);

  for (let i = 0; i < existingAllPaths.length; i++) {
    const pA = existingAllPaths[i];
    const wordsA = tokenizeWords(pageMap.get(pA)!.mainContentText);
    const shinglesA = get5WordShingles(wordsA);
    const row = [shortNames[i]];
    for (let j = 0; j < existingAllPaths.length; j++) {
      if (i === j) {
        row.push('100%');
      } else {
        const pB = existingAllPaths[j];
        const wordsB = tokenizeWords(pageMap.get(pB)!.mainContentText);
        const shinglesB = get5WordShingles(wordsB);
        const sim = Math.round(jaccardSimilarity(shinglesA, shinglesB) * 10) / 10;
        row.push(`${sim}%`);
      }
    }
    console.log('| ' + row.join(' | ') + ' |');
  }

  // PRINT TABLE 3: METADATA, HEADINGS & SCHEMAS
  console.log('\n### 3. Metadata, Headings, Schemas & FAQ Overview');
  for (const inScope of IN_SCOPE_PATHS) {
    const p = pageMap.get(inScope);
    if (!p) continue;
    console.log(`\n#### Page: \`${p.relativePath}\``);
    console.log(`- **Title**: "${p.title}" (${p.title.length} chars)`);
    console.log(`- **Meta Description**: "${p.metaDescription}" (${p.metaDescription.length} chars)`);
    console.log(`- **H1**: "${p.h1}"`);
    console.log(`- **H2s**: ${p.h2s.slice(0, 4).join('; ')}`);
    console.log(`- **Canonical**: \`${p.canonical}\``);
    console.log(`- **JSON-LD Types**: ${p.jsonLdTypes.join(', ')}`);
    console.log(`- **FAQ Questions (${p.faqQuestions.length})**:`);
    for (const q of p.faqQuestions) {
      console.log(`  - ${q}`);
    }
  }

  return pageMap;
}

if (process.argv[1] && process.argv[1].endsWith('analyze-content.ts')) {
  runAnalysis();
}
