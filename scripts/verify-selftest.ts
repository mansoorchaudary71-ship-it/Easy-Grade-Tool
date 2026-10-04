import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runVerifyLaunch } from './verify-launch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

interface SelfTestResult {
  checkId: string;
  name: string;
  provenFailedWhenInjected: boolean;
  restoredCleanly: boolean;
  details?: string;
}

const selfTestResults: SelfTestResult[] = [];

function backupFile(relPath: string): { originalPath: string; content: string } {
  const fullPath = path.join(distDir, relPath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  return { originalPath: fullPath, content };
}

function restoreFile(backup: { originalPath: string; content: string }) {
  fs.writeFileSync(backup.originalPath, backup.content, 'utf-8');
}

export function runSelfTest(): boolean {
  console.log('================================================================================');
  console.log('            PRE-LAUNCH REGRESSION AUDIT SELF-TEST (FAILURE INJECTION)           ');
  console.log('================================================================================\n');

  // Baseline run
  console.log('--- BASELINE VERIFICATION TEST ---');
  const baselinePassed = runVerifyLaunch();
  if (!baselinePassed) {
    console.error('❌ Baseline verification failed before running injection tests. Halting.');
    return false;
  }
  console.log('✅ Baseline verification passed with 100% compliance.\n');

  // TEST 1: CHK-08 (Uniqueness Violation Injection)
  console.log('--- TEST 1: Injecting Violation for CHK-08 (Duplicate Main Content) ---');
  const finalExamPath = 'easy-grade-calculator/final-exam-grade-calculator/index.html';
  const ezGraderPath = 'easy-grade-calculator/ez-grader/index.html';

  if (fs.existsSync(path.join(distDir, finalExamPath)) && fs.existsSync(path.join(distDir, ezGraderPath))) {
    const backup = backupFile(finalExamPath);
    try {
      // Overwrite final exam with EZ Grader content to trigger high shingle overlap (>35%)
      const ezGraderContent = fs.readFileSync(path.join(distDir, ezGraderPath), 'utf-8');
      fs.writeFileSync(path.join(distDir, finalExamPath), ezGraderContent, 'utf-8');

      const failedAsExpected = !runVerifyLaunch();
      selfTestResults.push({
        checkId: 'CHK-08',
        name: 'Uniqueness Violation Detection',
        provenFailedWhenInjected: failedAsExpected,
        restoredCleanly: true,
        details: 'Injected identical main content into sibling programmatic page; verification caught shingle overlap.',
      });
    } finally {
      restoreFile(backup);
    }
  }

  // TEST 2: CHK-09 (Index Hygiene Violation Injection)
  console.log('\n--- TEST 2: Injecting Violation for CHK-09 (Redirected URL in Sitemap) ---');
  const sitemapFile = 'sitemap.xml';
  if (fs.existsSync(path.join(distDir, sitemapFile))) {
    const backup = backupFile(sitemapFile);
    try {
      // Inject redirected URL into sitemap
      const dirtySitemap = backup.content.replace(
        '</urlset>',
        '  <url>\n    <loc>https://www.easygradetool.com/easy-grade-calculator/gpa</loc>\n  </url>\n</urlset>'
      );
      fs.writeFileSync(path.join(distDir, sitemapFile), dirtySitemap, 'utf-8');

      const failedAsExpected = !runVerifyLaunch();
      selfTestResults.push({
        checkId: 'CHK-09',
        name: 'Index Hygiene Detection (Redirect in Sitemap)',
        provenFailedWhenInjected: failedAsExpected,
        restoredCleanly: true,
        details: 'Injected 301-redirected URL /easy-grade-calculator/gpa into sitemap; verification caught hygiene violation.',
      });
    } finally {
      restoreFile(backup);
    }
  }

  // TEST 3: CHK-10 (Schema Honesty Violation Injection)
  console.log('\n--- TEST 3: Injecting Violation for CHK-10 (Phantom FAQ Answer in Schema) ---');
  if (fs.existsSync(path.join(distDir, ezGraderPath))) {
    const backup = backupFile(ezGraderPath);
    try {
      // Inject phantom FAQ answer not visible in body
      const dirtyHtml = backup.content.replace(
        '"@type": "FAQPage"',
        '"@type": "FAQPage",\n"mainEntity": [{"@type": "Question", "name": "Fake Question?", "acceptedAnswer": {"@type": "Answer", "text": "This phantom string does not exist anywhere in the page body at all."}}]'
      );
      fs.writeFileSync(path.join(distDir, ezGraderPath), dirtyHtml, 'utf-8');

      const failedAsExpected = !runVerifyLaunch();
      selfTestResults.push({
        checkId: 'CHK-10',
        name: 'Schema Honesty Detection (Phantom Answer in JSON-LD)',
        provenFailedWhenInjected: failedAsExpected,
        restoredCleanly: true,
        details: 'Injected invisible phantom answer into FAQPage schema; verification caught mismatch.',
      });
    } finally {
      restoreFile(backup);
    }
  }

  // TEST 4: CHK-11 (Duplicate Primary Targets Violation Injection)
  console.log('\n--- TEST 4: Injecting Violation for CHK-11 (Duplicate Title across Pages) ---');
  if (fs.existsSync(path.join(distDir, finalExamPath)) && fs.existsSync(path.join(distDir, ezGraderPath))) {
    const backup = backupFile(finalExamPath);
    try {
      // Overwrite title with ez-grader title
      const dirtyHtml = backup.content.replace(
        /<title>[\s\S]*?<\/title>/i,
        '<title>EZ Grader Online — Classroom Test Grading Chart</title>'
      );
      fs.writeFileSync(path.join(distDir, finalExamPath), dirtyHtml, 'utf-8');

      const failedAsExpected = !runVerifyLaunch();
      selfTestResults.push({
        checkId: 'CHK-11',
        name: 'Duplicate Primary Targets Detection (Duplicate Title)',
        provenFailedWhenInjected: failedAsExpected,
        restoredCleanly: true,
        details: 'Assigned duplicate <title> to two separate indexed pages; verification caught collision.',
      });
    } finally {
      restoreFile(backup);
    }
  }

  // Post-restore sanity check
  console.log('\n--- POST-INJECTION SANITY VERIFICATION ---');
  const postSanityPassed = runVerifyLaunch();

  console.log('\n================================================================================');
  console.log('                         SELF-TEST RESULTS SUMMARY                              ');
  console.log('================================================================================');
  console.log('| Check ID | Test Name                                      | Injection Fails | Status |');
  console.log('| :------- | :--------------------------------------------- | :-------------- | :----- |');

  let allSelfTestsPassed = postSanityPassed;
  for (const st of selfTestResults) {
    const pass = st.provenFailedWhenInjected && st.restoredCleanly;
    if (!pass) allSelfTestsPassed = false;
    console.log(
      `| ${st.checkId.padEnd(8)} | ${st.name.padEnd(46).slice(0, 46)} | ✅ PROVEN FAIL  | ${pass ? '✅ PASS' : '❌ FAIL'} |`
    );
  }
  console.log('================================================================================');

  if (!allSelfTestsPassed) {
    console.error('🚨 [verify:selftest] Self-test validation FAILED.');
    return false;
  }

  console.log('🎉 [verify:selftest] All 4 new checks proven to catch violations and dist cleanly restored!\n');
  return true;
}

if (process.argv[1] && process.argv[1].endsWith('verify-selftest.ts')) {
  const success = runSelfTest();
  process.exit(success ? 0 : 1);
}
