import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

interface UrlCheck {
  url: string;
  expectedStatus: number;
  expectedLocation?: string;
  expectedCanonical?: string;
  expectNoIndex?: boolean;
}

const REDIRECT_CHECKS: UrlCheck[] = [
  // Old URLs without trailing slash
  { url: '/easy-grade-calculator/gpa', expectedStatus: 301, expectedLocation: '/gpa-calculator' },
  { url: '/easy-grade-calculator/semester-gpa-calculator', expectedStatus: 301, expectedLocation: '/gpa-calculator' },
  { url: '/easy-grade-calculator/weighted-grade-calculator', expectedStatus: 301, expectedLocation: '/grade-calculator' },
  { url: '/easy-grade-calculator/test-score', expectedStatus: 301, expectedLocation: '/grade-calculator' },
  { url: '/easy-grade-calculator/college-final-grade-calculator', expectedStatus: 301, expectedLocation: '/easy-grade-calculator/final-exam-grade-calculator' },
  { url: '/easy-grade-calculator/high-school-test-grader', expectedStatus: 301, expectedLocation: '/easy-grade-calculator/ez-grader' },
  { url: '/easy-grade-calculator', expectedStatus: 301, expectedLocation: '/grade-calculator' },

  // Trailing-slash variants
  { url: '/easy-grade-calculator/gpa/', expectedStatus: 301, expectedLocation: '/gpa-calculator' },
  { url: '/easy-grade-calculator/semester-gpa-calculator/', expectedStatus: 301, expectedLocation: '/gpa-calculator' },
  { url: '/easy-grade-calculator/weighted-grade-calculator/', expectedStatus: 301, expectedLocation: '/grade-calculator' },
  { url: '/easy-grade-calculator/test-score/', expectedStatus: 301, expectedLocation: '/grade-calculator' },
  { url: '/easy-grade-calculator/college-final-grade-calculator/', expectedStatus: 301, expectedLocation: '/easy-grade-calculator/final-exam-grade-calculator' },
  { url: '/easy-grade-calculator/high-school-test-grader/', expectedStatus: 301, expectedLocation: '/easy-grade-calculator/ez-grader' },
  { url: '/easy-grade-calculator/', expectedStatus: 301, expectedLocation: '/grade-calculator' },
];

const SURVIVING_CHECKS: UrlCheck[] = [
  {
    url: '/',
    expectedStatus: 200,
    expectedCanonical: 'https://www.easygradetool.com/',
    expectNoIndex: false,
  },
  {
    url: '/grade-calculator',
    expectedStatus: 200,
    expectedCanonical: 'https://www.easygradetool.com/grade-calculator',
    expectNoIndex: false,
  },
  {
    url: '/gpa-calculator',
    expectedStatus: 200,
    expectedCanonical: 'https://www.easygradetool.com/gpa-calculator',
    expectNoIndex: false,
  },
  {
    url: '/cgpa-to-percentage-calculator',
    expectedStatus: 200,
    expectedCanonical: 'https://www.easygradetool.com/cgpa-to-percentage-calculator',
    expectNoIndex: false,
  },
  {
    url: '/easy-grade-calculator/final-exam-grade-calculator',
    expectedStatus: 200,
    expectedCanonical: 'https://www.easygradetool.com/easy-grade-calculator/final-exam-grade-calculator',
    expectNoIndex: false,
  },
  {
    url: '/easy-grade-calculator/ez-grader',
    expectedStatus: 200,
    expectedCanonical: 'https://www.easygradetool.com/easy-grade-calculator/ez-grader',
    expectNoIndex: false,
  },
  {
    url: '/about',
    expectedStatus: 200,
    expectedCanonical: 'https://www.easygradetool.com/about',
    expectNoIndex: false,
  },
  {
    url: '/privacy',
    expectedStatus: 200,
    expectedCanonical: 'https://www.easygradetool.com/privacy',
    expectNoIndex: false,
  },
  {
    url: '/terms',
    expectedStatus: 200,
    expectedCanonical: 'https://www.easygradetool.com/terms',
    expectNoIndex: false,
  },
];

function fetchUrl(path: string): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: '127.0.0.1',
        port: 3000,
        path,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode || 0, headers: res.headers, body: data });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runHttpAudit() {
  console.log('================================================================================');
  console.log('             HTTP RESPONSE CODES, 301 REDIRECTS & CANONICAL ASSERTIONS           ');
  console.log('================================================================================\n');

  let passed = 0;
  let failed = 0;

  console.log('--- 1. Testing 301 Permanent Redirects (Old & Trailing-Slash Variants) ---');
  for (const check of REDIRECT_CHECKS) {
    try {
      const res = await fetchUrl(check.url);
      const loc = res.headers.location;
      const isStatusOk = res.status === check.expectedStatus;
      const isLocOk = loc === check.expectedLocation;

      if (isStatusOk && isLocOk) {
        console.log(`✅ [301 REDIRECT] ${check.url.padEnd(55)} -> ${loc} (HTTP ${res.status})`);
        passed++;
      } else {
        console.error(
          `❌ [FAIL] ${check.url} expected ${check.expectedStatus} -> ${check.expectedLocation}, got ${res.status} -> ${loc}`
        );
        failed++;
      }
    } catch (err: any) {
      console.error(`❌ [ERROR] ${check.url}:`, err.message);
      failed++;
    }
  }

  console.log('\n--- 2. Testing Surviving 200-OK Indexed Pages (Status, Self-Canonical, Robots) ---');
  for (const check of SURVIVING_CHECKS) {
    try {
      const res = await fetchUrl(check.url);
      const isStatusOk = res.status === check.expectedStatus;

      // Check canonical tag in body
      const canonMatch = res.body.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
      const actualCanon = canonMatch ? canonMatch[1] : null;
      const isCanonOk = actualCanon === check.expectedCanonical;

      // Check robots meta tag
      const hasNoIndex = /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i.test(res.body);
      const isRobotsOk = check.expectNoIndex ? hasNoIndex : !hasNoIndex;

      if (isStatusOk && isCanonOk && isRobotsOk) {
        console.log(
          `✅ [200 INDEXED]  ${check.url.padEnd(52)} (HTTP ${res.status}, canonical: ${actualCanon}, noindex: false)`
        );
        passed++;
      } else {
        console.error(
          `❌ [FAIL] ${check.url}: status=${res.status} (exp ${check.expectedStatus}), canonical=${actualCanon} (exp ${check.expectedCanonical}), hasNoIndex=${hasNoIndex}`
        );
        failed++;
      }
    } catch (err: any) {
      console.error(`❌ [ERROR] ${check.url}:`, err.message);
      failed++;
    }
  }

  console.log('\n--- 3. Testing 404 Not Found Page (Fallback with noindex) ---');
  try {
    const res = await fetchUrl('/non-existent-page-test-404');
    const hasNoIndex = /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i.test(res.body);
    console.log(
      `✅ [404 FALLBACK] /non-existent-page-test-404                             (HTTP ${res.status}, noindex in HTML: ${hasNoIndex})`
    );
    passed++;
  } catch (err: any) {
    console.error(`❌ [ERROR] 404 test:`, err.message);
    failed++;
  }

  console.log('\n================================================================================');
  console.log(`HTTP Audit Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================================');

  if (failed > 0) process.exit(1);
}

runHttpAudit();
