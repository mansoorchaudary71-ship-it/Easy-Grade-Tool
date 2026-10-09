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
  parseScoreListDetailed,
  parseStrictNumber,
  validateCurveParams,
  validateCutoffs,
  letterForDisplayed,
  mapLetterToScale,
} from '../src/utils/academicMath';
import { solveFinalExam } from '../src/utils/finalExam';
import {
  buildQuickChart,
  calculateMultiAssessmentGrade,
  validateQuestionCount,
  validateWrongCount,
} from '../src/utils/gradeCalculations';
import { GRADING_SCALES, GRADE_POINT_MAP, getToolKeyFromPath } from '../src/data/constants';

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

// ---------------------------------------------------------------------------
// Audit fixes (B1-B13)
// ---------------------------------------------------------------------------

// B1: letter always agrees with the displayed percentage
eq('89.96 shows 90.0 and is A-', letterForDisplayed(89.96, SCALE_PLUS_MINUS, 1).letter, 'A-');
eq('89.5 with 0 decimals shows 90 and is A', letterForDisplayed(89.5, SCALE_STANDARD, 0).letter, 'A');
eq('89.5 with 1 decimal stays B', letterForDisplayed(89.5, SCALE_STANDARD, 1).letter, 'B');
const q200 = buildQuickChart({ total: 200, decimals: 0, bands: SCALE_STANDARD }).find((r) => r.wrong === 21)!;
eq('200 questions, 21 wrong: 90% is A', [q200.formattedPercentage, q200.letter], ['90', 'A']);
const wm = calculateMultiAssessmentGrade(
  [{ id: 1, name: 'x', score: '8996', max: '10000', weight: '100' }], 'weighted', { scale: 'plus-minus', decimalPrecision: 1 });
eq('multi-assessment 89.96 -> 90.0% A-', [wm.formattedPercentage, wm.letterGrade], ['90.0', 'A-']);

// B2: strict parsing
eq('decimal comma', parseScoreList('88,5 92,5').scores, [88.5, 92.5]);
eq('comma separators still work', parseScoreList('70,80,90').scores, [70, 80, 90]);
eq('comma + space separators', parseScoreList('88, 92, 75').scores, [88, 92, 75]);
eq('lone % rejected', parseScoreList('%').rejected, ['%']);
eq('hex rejected', parseScoreList('0x1F').scores, []);
eq('exponent rejected', parseScoreList('1e2').scores, []);
eq('above max rejected', parseScoreListDetailed('150 90', 100).rejected.map((t) => t.token), ['150']);
eq('decimal comma note', parseScoreListDetailed('88,5 92,5').notes.length, 1);
eq('parseStrictNumber blank', parseStrictNumber(''), null);
eq('parseStrictNumber 12,5', parseStrictNumber('12,5'), 12.5);

// B3 / B4: curve validation and maxScore
eq('empty target is invalid', validateCurveParams([60, 70, 80], { method: 'linear-target' }) !== null, true);
eq('target above max is invalid', validateCurveParams([60], { method: 'linear-target', targetAverage: 120 }) !== null, true);
eq('maxScore 0 is invalid', validateCurveParams([60], { method: 'flat', flatPoints: 5, maxScore: 0 }) !== null, true);
eq('maxScore 0 gives no NaN', applyCurve([60], { method: 'sqrt', maxScore: 0 }), [60]);
eq('50-point test scale-top', applyCurve([40, 45], { method: 'scale-top', maxScore: 50 }), [45, 50]);
eq('50-point test sqrt', applyCurve([32], { method: 'sqrt', maxScore: 50 }), [40]);
eq('valid linear-target accepted', validateCurveParams([60, 70, 80], { method: 'linear-target', targetAverage: 75 }), null);

// B5 / B11: final exam solver
eq('blank weight is invalid', solveFinalExam({ current: '84', target: '90', weight: '' }).status, 'invalid');
eq('weight 0 is invalid', solveFinalExam({ current: '84', target: '90', weight: '0' }).status, 'invalid');
eq('blank current is invalid', solveFinalExam({ current: '', target: '90', weight: '25' }).status, 'invalid');
const f100 = solveFinalExam({ current: '0', target: '90', weight: '100' });
eq('100% weight works', [f100.status, (f100 as any).required], ['ok', 90]);
eq('already secured', solveFinalExam({ current: '99', target: '90', weight: '5' }).status, 'secured');
eq('unreachable', solveFinalExam({ current: '50', target: '95', weight: '10' }).status, 'unreachable');
const f25 = solveFinalExam({ current: '84', target: '90', weight: '25' });
near('84 -> 90 with 25% final needs 108', (f25 as any).required, 108);
eq('84 -> 90 with 25% final is unreachable', f25.status, 'unreachable');
near('exact current grade used', (solveFinalExam({ current: 89.96, target: 90, weight: 20 }) as any).required, (90 - 89.96 * 0.8) / 0.2, 1e-9);

// B6: one scale everywhere
eq('plus scale has A+', GRADING_SCALES.plus[0].letter, 'A+');
eq('plus scale has D+/D/D-', GRADING_SCALES.plus.map((g) => g.letter).filter((l) => l.startsWith('D')), ['D+', 'D', 'D-']);
eq('plus scale A starts at 93', GRADING_SCALES.plus.find((g) => g.letter === 'A')!.min, 93);
eq('GPA map has both minus spellings', [GRADE_POINT_MAP['B-'], GRADE_POINT_MAP['B\u2212']], [2.7, 2.7]);
for (const pct of [98, 96.5, 93, 92.9, 90, 89.9, 68, 66.9, 63, 61, 60, 59.9, 0]) {
  const a = GRADING_SCALES.plus.find((g) => pct >= g.min)!.letter;
  const b = SCALE_PLUS_MINUS.find((g) => pct >= g.min)!.letter;
  eq(`one letter for ${pct}%`, a, b);
}

// B10: letter mapping across scales
eq('B+ maps to B on A-F', mapLetterToScale('B+', SCALE_STANDARD), 'B');
eq('B stays B on plus/minus', mapLetterToScale('B', SCALE_PLUS_MINUS), 'B');

// B12: test grade warnings
eq('earned above possible warns', calculateTestGrade({ earned: 60, possible: 50 }).warnings.length, 1);
eq('bonus suppresses that warning', calculateTestGrade({ earned: 60, possible: 50, bonus: 1 }).warnings.length, 0);
eq('oversized penalty warns', calculateTestGrade({ earned: 3, possible: 10, penalty: 9 }).warnings.length, 1);

// B13: quick grade input checks
eq('blank questions is an error', validateQuestionCount('').error !== null, true);
eq('0 questions is an error', validateQuestionCount('0').error !== null, true);
eq('-5 questions is an error', validateQuestionCount('-5').error !== null, true);
eq('12.5 questions is an error', validateQuestionCount('12.5').error !== null, true);
eq('1001 questions is an error', validateQuestionCount('1001').error !== null, true);
eq('25 questions ok', validateQuestionCount('25').value, 25);
eq('2.5 wrong needs half points', validateWrongCount('2.5', 10, false).error !== null, true);
eq('2.5 wrong ok with half points', validateWrongCount('2.5', 10, true).value, 2.5);
eq('wrong above total is an error', validateWrongCount('11', 10, false).error !== null, true);
const half = buildQuickChart({ total: 10, decimals: 1, halfPoints: true, bands: SCALE_STANDARD });
eq('half-point chart has 21 rows', half.length, 21);
eq('half-point row 0.5 wrong = 95%', half[1].formattedPercentage, '95.0');

// Cutoffs
eq('valid cutoffs', validateCutoffs({ A: 90, B: 80, C: 70, D: 60 }), null);
eq('A not above B is an error', validateCutoffs({ A: 80, B: 80, C: 70, D: 60 }) !== null, true);

// L3: tool theme matching is exact
eq('gpa path', getToolKeyFromPath('/gpa-calculator/'), 'gpa');
eq('cgpa path', getToolKeyFromPath('/cgpa-to-percentage-calculator/'), 'cgpa');
eq('weighted path stays quick', getToolKeyFromPath('/grade-calculator/'), 'quick');
eq('future slug not mis-themed', getToolKeyFromPath('/multiple-choice-grader/'), 'quick');
eq('tip path', getToolKeyFromPath('/tip-calculator'), 'tip');

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\n🎉 academicMath: all checks passed');
