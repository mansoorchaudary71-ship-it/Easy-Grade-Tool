/**
 * Unit checks for src/utils/academicMath.ts. Run: npx tsx scripts/verify-academic-math.ts
 * Exits non-zero on failure so it can gate the build.
 */
import {
  calculateTestGrade,
  applyCurve,
  computeStats,
  parseScoreList,
  percentToLetter,
  bandRanges,
  letterToMidpoint,
  SCALE_STANDARD,
  SCALE_PLUS_MINUS,
  pointsNeededForTarget,
} from '../src/utils/academicMath';

let failed = 0;
function eq(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failed++;
    console.error(`❌ ${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  } else {
    console.log(`✅ ${name}`);
  }
}
function near(name: string, actual: number, expected: number, tol = 1e-9) {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) {
    failed++;
    console.error(`❌ ${name}: expected ${expected}, got ${actual}`);
  } else console.log(`✅ ${name}`);
}

// Test grade
near('18/20 = 90%', calculateTestGrade({ earned: 18, possible: 20 }).percent, 90);
near('42/50 + 2 bonus = 88%', calculateTestGrade({ earned: 42, possible: 50, bonus: 2 }).percent, 88);
eq('possible 0 invalid', calculateTestGrade({ earned: 5, possible: 0 }).valid, false);
near('penalty floor at 0', calculateTestGrade({ earned: 3, possible: 10, penalty: 9 }).percent, 0);
near('points for 90% of 35', pointsNeededForTarget(35, 90), 31.5);

// Curve
const raw = [55, 62, 70, 78, 85];
eq('flat +5', applyCurve(raw, { method: 'flat', flatPoints: 5 }), [60, 67, 75, 83, 90]);
eq('flat cap at 100', applyCurve([98, 50], { method: 'flat', flatPoints: 5 }), [100, 55]);
eq('scale-top (+15)', applyCurve(raw, { method: 'scale-top' }), [70, 77, 85, 93, 100]);
near('sqrt 64 -> 80', applyCurve([64], { method: 'sqrt' })[0], 80);
near('sqrt 49 -> 70', applyCurve([49], { method: 'sqrt' })[0], 70);
const lt = applyCurve(raw, { method: 'linear-target', targetAverage: 80, capAtMax: false });
near('linear target mean 80', computeStats(lt).mean, 80, 1e-9);
near('stats mean', computeStats(raw).mean, 70);
near('stats median odd', computeStats(raw).median, 70);
near('stats median even', computeStats([1, 2, 3, 4]).median, 2.5);
eq('parse list', parseScoreList('88, 92 75\n60;71%').scores, [88, 92, 75, 60, 71]);
eq('parse rejects junk', parseScoreList('88 abc -5').rejected, ['abc', '-5']);

// Letter grade
eq('89.99 -> B (standard)', percentToLetter(89.99, SCALE_STANDARD).letter, 'B');
eq('90 -> A (standard)', percentToLetter(90, SCALE_STANDARD).letter, 'A');
eq('87 -> B+ (plus/minus)', percentToLetter(87, SCALE_PLUS_MINUS).letter, 'B+');
eq('59.9 -> F', percentToLetter(59.9, SCALE_PLUS_MINUS).letter, 'F');
eq('96.5 -> A (plus/minus)', percentToLetter(96.5, SCALE_PLUS_MINUS).letter, 'A');
eq('97 -> A+ (plus/minus)', percentToLetter(97, SCALE_PLUS_MINUS).letter, 'A+');
const r = bandRanges(SCALE_STANDARD);
eq('A range', [r[0].from, r[0].to], [90, 100]);
eq('B range', [r[1].from, r[1].to], [80, 89.99]);
near('B midpoint', letterToMidpoint('B', SCALE_STANDARD) as number, 85);
eq('unknown letter', letterToMidpoint('Z', SCALE_STANDARD), null);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\n🎉 academicMath: all checks passed');
