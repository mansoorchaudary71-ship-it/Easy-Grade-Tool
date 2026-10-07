import { BASE_CANONICAL_ORIGIN } from './constants';
import { SCALE_PLUS_MINUS, SCALE_STANDARD, applyCurve, calculateTestGrade, computeStats, percentToLetter, roundTo } from '../utils/academicMath';

/**
 * Registry for the dedicated academic calculators that are NOT programmatic variants of the
 * weighted-grade tool. Each page has its own interactive tool, its own worked example (generated
 * from the same math the tool uses) and its own FAQ, so every URL serves one distinct search intent.
 */

export type ToolPageSlug = 'test-grade-calculator' | 'grade-curve-calculator' | 'letter-grade-calculator';

export interface ToolPageFaq {
  question: string;
  answer: string;
}

export interface ToolPageSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ToolPageRelated {
  path: string;
  label: string;
  blurb: string;
}

export interface ToolPageEntry {
  slug: ToolPageSlug;
  path: string;
  navLabel: string;
  h1: string;
  title: string;
  metaDescription: string;
  badge: string;
  intro: string;
  keywords: string[];
  featureList: string[];
  sections: ToolPageSection[];
  example: {
    heading: string;
    scenario: string;
    rows: { label: string; value: string }[];
    takeaway: string;
  };
  faqs: ToolPageFaq[];
  related: ToolPageRelated[];
}

/* ---------- worked examples are computed, never typed by hand ---------- */

const testEx = calculateTestGrade({ earned: 42, possible: 50, bonus: 2 });
const testExLetter = percentToLetter(testEx.percent, SCALE_STANDARD).letter;
const testExPlain = calculateTestGrade({ earned: 42, possible: 50 });

const curveRaw = [55, 62, 70, 78, 85];
const curveStatsBefore = computeStats(curveRaw);
const curveFlat = applyCurve(curveRaw, { method: 'flat', flatPoints: 5 });
const curveTop = applyCurve(curveRaw, { method: 'scale-top' });
const curveSqrt = applyCurve(curveRaw, { method: 'sqrt' });
const curveTarget = applyCurve(curveRaw, { method: 'linear-target', targetAverage: 78, capAtMax: false });

const fmtList = (xs: number[]) => xs.map((x) => roundTo(x, 1)).join(', ');

export const TOOL_PAGES: Record<ToolPageSlug, ToolPageEntry> = {
  'test-grade-calculator': {
    slug: 'test-grade-calculator',
    path: '/test-grade-calculator/',
    navLabel: 'Test Grade',
    h1: 'Test Grade Calculator',
    title: 'Test Grade Calculator — Score, Percent & Letter Grade',
    metaDescription:
      'Enter points earned and points possible to get your test percentage and letter grade. Add bonus points or penalties and see the score needed for a target grade.',
    badge: 'Single test or quiz',
    intro:
      'Type the points you earned and the points the test was worth. You get the percentage, the letter grade on your chosen scale, and the points you would have needed for the next grade up.',
    keywords: [
      'test grade calculator',
      'quiz grade calculator',
      'test score percentage calculator',
      'points earned out of possible',
      'extra credit test grade',
    ],
    featureList: [
      'Percentage and letter grade from points earned and points possible',
      'Bonus points and late-penalty adjustments',
      'Points needed for A, B, C and D on any test size',
      'Standard and plus/minus letter scales',
    ],
    sections: [
      {
        heading: 'How a test grade is calculated',
        paragraphs: [
          'A test grade is the share of the available points you earned: percentage = points earned ÷ points possible × 100. If a test is worth 50 points and you scored 42, the result is 42 ÷ 50 = 0.84, or 84%.',
          'The letter comes from the grading scale your teacher or school uses, not from the math itself. On the common 10-point scale 84% is a B; on a plus/minus scale it is a B. The same 89.6% can be a B+ on one scale and a B on another, which is why this calculator lets you switch scales.',
        ],
      },
      {
        heading: 'Extra credit and late penalties',
        paragraphs: [
          'Most teachers add extra-credit points to the points you earned and leave the points possible unchanged, so a student can finish above 100%. Others cap the result at 100%. This calculator adds bonus points to the numerator and shows the uncapped percentage, so you can see both outcomes and apply your teacher’s rule.',
          'Penalties work the other way. A late-work deduction of 5 points is subtracted from the points earned before dividing. If your teacher takes a percentage off instead, subtract that percentage from the final result.',
        ],
      },
      {
        heading: 'What score do I need on the next test?',
        paragraphs: [
          'Multiply the target percentage by the points possible. To reach 90% on a 35-point quiz you need 0.90 × 35 = 31.5 points. Because teachers award whole or half points, you would round up to 32 in practice. The “points needed” table under the calculator does this for every grade boundary at once.',
          'A single test is only one part of a course grade. To see how it moves your overall average, enter it as an assessment in the weighted grade calculator, or work backwards from your target with the final exam calculator.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: 42 out of 50 with 2 bonus points',
      scenario:
        'A student earns 42 points on a 50-point chemistry test and receives 2 bonus points for a correct extra-credit question.',
      rows: [
        { label: 'Percentage without bonus', value: `${roundTo(testExPlain.percent, 1)}%` },
        { label: 'Points after bonus', value: `${testEx.adjustedEarned} of 50` },
        { label: 'Percentage with bonus', value: `${roundTo(testEx.percent, 1)}%` },
        { label: 'Letter grade (10-point scale)', value: testExLetter },
      ],
      takeaway:
        'Two bonus points lift the score from 84% to 88%, which is still a B. One more point (45 of 50) would have reached the 90% cutoff for an A.',
    },
    faqs: [
      {
        question: 'How do I calculate my test grade?',
        answer:
          'Divide the points you earned by the points the test was worth and multiply by 100. For example, 42 out of 50 is 84%. Then compare the percentage with your teacher’s grading scale to get the letter.',
      },
      {
        question: 'How do I add extra credit to a test grade?',
        answer:
          'Add the bonus points to the points you earned, keep the points possible the same, and divide. 42 + 2 bonus on a 50-point test is 44 ÷ 50 = 88%. Some teachers cap the result at 100%, so check your syllabus.',
      },
      {
        question: 'Can a test grade be higher than 100%?',
        answer:
          'Yes, if extra credit is added without raising the points possible. Whether the gradebook keeps the value above 100% or caps it is a teacher or school policy.',
      },
      {
        question: 'How many questions can I miss and still get a B?',
        answer:
          'Multiply the points possible by 0.20 and round down. On a 25-question test worth one point each you can miss up to 5 questions and keep 80%, the usual B cutoff. The points-needed table shows this for any test size.',
      },
      {
        question: 'Is this the same as the Quick Grade chart?',
        answer:
          'The Quick Grade chart lists the score for every possible number of wrong answers so a teacher can grade a whole stack from one printed sheet. This calculator grades one result at a time and handles bonus points and penalties.',
      },
      {
        question: 'What is a passing grade on a test?',
        answer:
          'On the common 10-point scale 60% is the lowest passing mark (a D) and anything under 60% is an F. Some schools and programs set the pass mark at 70%, and some instructors set their own cutoff for a single test, so the syllabus decides.',
      },
      {
        question: 'How do I apply a late penalty to a test score?',
        answer:
          'If the penalty is in points, subtract it from the points earned before dividing: 42 earned minus a 5-point penalty is 37 out of 50, or 74%. If the penalty is a percentage, calculate the score first and then take that many percentage points off the result.',
      },
      {
        question: 'How do I turn a score out of 20, 25 or 30 into a percentage?',
        answer:
          'Divide the points you earned by the points possible and multiply by 100. A 17 out of 20 is 85%, a 22 out of 25 is 88%, and a 26 out of 30 is 86.7%. The calculator does this for any test size and shows the letter grade next to it.',
      },
    ],
    related: [
      { path: '/', label: 'Quick Grade chart', blurb: 'Printable score for every number of wrong answers.' },
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Combine tests, homework and projects into a course grade.' },
      { path: '/final-exam-grade-calculator/', label: 'Final exam calculator', blurb: 'Find the exam score you need for your target grade.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Percent, letter and GPA points on common scales.' },
    ],
  },

  'grade-curve-calculator': {
    slug: 'grade-curve-calculator',
    path: '/grade-curve-calculator/',
    navLabel: 'Grade Curve',
    h1: 'Grade Curve Calculator',
    title: 'Grade Curve Calculator — 4 Curving Methods Compared',
    metaDescription:
      'Paste class test scores and curve them four ways: add flat points, lift the top score to 100, square-root curve, or move the class average to a target.',
    badge: 'For teachers and TAs',
    intro:
      'Paste the raw scores, choose a curving method and compare before and after: every score, the class mean and median, and the letter grade each student ends up with.',
    keywords: [
      'grade curve calculator',
      'test curve calculator',
      'square root curve',
      'curve grades calculator',
      'how to curve a test',
    ],
    featureList: [
      'Flat-points, top-score, square-root and target-average curves',
      'Before and after table with class mean and median',
      'Standard and plus/minus letter grades for each score',
      'Optional cap at 100 and printable results',
    ],
    sections: [
      {
        heading: 'The four curving methods',
        paragraphs: [
          'Curving means adjusting raw scores with a rule that is applied to everyone. These are the four most common rules, and the calculator applies each exactly as written.',
        ],
        bullets: [
          'Flat points: curved score = raw score + k. Everyone gains the same number of points, so gaps between students do not change.',
          'Top score to 100: curved score = raw score + (100 − highest raw score). The best score becomes 100 and everyone shifts up by the same amount.',
          'Square-root curve: curved score = 10 × √raw score (for a 100-point test). Low scores gain more than high scores, so the spread narrows.',
          'Target average: curved score = raw score + (target mean − current mean). The class average lands exactly on the value you choose.',
        ],
      },
      {
        heading: 'Which method fits which situation',
        paragraphs: [
          'Use flat points when a single question was ambiguous or a topic was not taught: it is easy to explain and fair to every student. Use top score to 100 when the test was harder than intended and no one reached full marks.',
          'The square-root curve helps most when many scores are low, but it changes the ranking of gaps: a 36 becomes 60 (+24) while an 81 becomes 90 (+9). Use the target-average method when your department expects a particular class mean, for example 78%.',
        ],
      },
      {
        heading: 'Things to check before you publish curved grades',
        paragraphs: [
          'Capping at 100 compresses the top of the class: two students at 97 and 99 can both become 100 after a flat +5 curve. Turn the cap off to see the uncapped values, then decide what your gradebook should record.',
          'A curve is an instructor decision. Students use this tool to estimate where a curve might put them; the official result is whatever your instructor or syllabus applies.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: five scores, four methods',
      scenario: `A small quiz returns the raw scores ${curveRaw.join(', ')} (mean ${roundTo(curveStatsBefore.mean, 1)}, median ${roundTo(curveStatsBefore.median, 1)}).`,
      rows: [
        { label: 'Flat +5', value: fmtList(curveFlat) },
        { label: 'Top score to 100 (+15)', value: fmtList(curveTop) },
        { label: 'Square-root curve', value: fmtList(curveSqrt) },
        { label: 'Target average 78', value: fmtList(curveTarget) },
      ],
      takeaway:
        'The target-average curve adds 8 points to everyone so the mean moves from 70 to 78. The square-root curve lifts the lowest score the most (55 becomes 74.2) and the highest the least (85 becomes 92.2).',
    },
    faqs: [
      {
        question: 'How do you curve a test?',
        answer:
          'Pick one rule and apply it to every score: add the same points to everyone, raise the top score to 100, take the square root, or shift scores so the class average hits a target. Paste the scores above to compare the results.',
      },
      {
        question: 'What is a square root curve?',
        answer:
          'For a 100-point test the curved score is 10 times the square root of the raw score. A 64 becomes 80 and a 49 becomes 70. Lower scores are raised more than higher ones.',
      },
      {
        question: 'Does curving lower anyone’s grade?',
        answer:
          'The four methods here never lower a score. Curving that lowers grades, such as ranking-based bell curves, is a different policy and is not what this calculator does.',
      },
      {
        question: 'Should curved scores be capped at 100?',
        answer:
          'That is a policy choice. Many instructors cap at 100 so no score exceeds the maximum. The cap is on by default here and can be switched off to see raw curved values.',
      },
      {
        question: 'Can students curve their own grade?',
        answer:
          'Only the instructor decides whether and how a curve is applied. Students can paste the class scores they know about to estimate the effect, but the official grade is the instructor’s.',
      },
      {
        question: 'What is the difference between these curves and a bell curve?',
        answer:
          'The four methods here move every score by one fixed rule, so the order of students and the gaps between them stay recognisable. A bell-curve policy assigns letters by rank or by distance from the class mean, which can leave some students lower than their raw score suggests. Ask your instructor which policy applies.',
      },
      {
        question: 'How do I find the class mean and median before curving?',
        answer:
          'The mean is the sum of all scores divided by the number of scores, and the median is the middle score once they are sorted. For 55, 62, 70, 78 and 85 the sum is 350, so the mean is 70 and the median is 70. The calculator shows both before and after the curve.',
      },
      {
        question: 'How many points should I add to curve a test?',
        answer:
          'There is no single right number, because it depends on your goal. To bring the class average from 70 up to 78 you add 8 points, and to make an 85 the top score of 100 you add 15. Try each method on your own scores and compare the results before deciding.',
      },
    ],
    related: [
      { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Percentage and letter for one test, with bonus points.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'See the cutoffs behind each letter.' },
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Turn curved scores into a course grade.' },
      { path: '/', label: 'Quick Grade chart', blurb: 'Print a score chart for a stack of tests.' },
    ],
  },

  'letter-grade-calculator': {
    slug: 'letter-grade-calculator',
    path: '/letter-grade-calculator/',
    navLabel: 'Letter Grade',
    h1: 'Letter Grade Calculator',
    title: 'Letter Grade Calculator — Percent to Letter & GPA Points',
    metaDescription:
      'Convert any percentage to a letter grade and 4.0 GPA points, or look up the percentage range for each letter on the standard A–F and plus/minus scales.',
    badge: 'Percent ↔ letter',
    intro:
      'Enter a percentage to see its letter grade and GPA points, or pick a letter to see the percentage range and midpoint. Switch between the standard A–F scale and the common plus/minus scale.',
    keywords: [
      'letter grade calculator',
      'percent to letter grade',
      'percentage to gpa',
      'grade scale chart',
      'a-f grading scale',
    ],
    featureList: [
      'Percent to letter grade and 4.0 GPA points',
      'Letter to percentage range and midpoint',
      'Standard and plus/minus scales with full cutoff tables',
      'Printable grade scale reference',
    ],
    sections: [
      {
        heading: 'The two scales most US classes use',
        paragraphs: [
          'The standard scale has five letters with 10-point bands: A 90–100, B 80–89, C 70–79, D 60–69, F below 60. The plus/minus scale splits each band into thirds: for example B+ starts at 87, B at 83 and B- at 80.',
          'Both tables below are generated from the same data the calculator uses, so what you read is what you get. The cutoffs shown are the most common ones, not a universal law.',
        ],
      },
      {
        heading: 'Why your school’s cutoffs may differ',
        paragraphs: [
          'Schools set their own scales. Some start an A at 93 instead of 90, some treat 89.5 as 90 after rounding, and some give an A+ a higher value than an A (4.3 instead of 4.0). If the syllabus lists cutoffs, those override everything on this page.',
          'Two practical checks avoid surprises: ask whether the percentage is rounded before the letter is assigned, and whether the plus/minus scale applies to final course grades or only to individual assignments.',
        ],
      },
      {
        heading: 'From letter grade to GPA points',
        paragraphs: [
          'GPA points come from the letter, not the percentage: on the common 4.0 scale A is 4.0, A- is 3.7, B+ is 3.3 and so on down to F at 0.0. A course’s contribution to GPA is its points multiplied by its credit hours.',
          'To combine several courses, take the letters you calculated here to the GPA calculator. To convert a CGPA from a 10-point system into a percentage, use the CGPA to percentage converter, which follows each university’s own formula.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: 89.5% on both scales',
      scenario: 'A final course average of 89.5% earns a different letter and different GPA points depending on which scale the school uses.',
      rows: [
        { label: 'Standard A–F scale', value: `${percentToLetter(89.5, SCALE_STANDARD).letter} (${percentToLetter(89.5, SCALE_STANDARD).gpa.toFixed(1)} GPA points)` },
        { label: 'Plus/minus scale', value: `${percentToLetter(89.5, SCALE_PLUS_MINUS).letter} (${percentToLetter(89.5, SCALE_PLUS_MINUS).gpa.toFixed(1)} GPA points)` },
        { label: 'Percentage points short of an A (standard) or A- (plus/minus)', value: `${roundTo(90 - 89.5, 1)}` },
      ],
      takeaway:
        'The same 89.5% is a B (3.0) on the standard scale and a B+ (3.3) on the plus/minus scale, and half a point from the next letter on both. Whether it rounds up to 90 depends on your school’s rounding rule.',
    },
    faqs: [
      {
        question: 'What percentage is an A, B, C, D and F?',
        answer:
          'On the common 10-point scale an A is 90–100%, a B is 80–89%, a C is 70–79%, a D is 60–69% and anything below 60% is an F. Some schools use 93, 83, 73 and 63 as the lower limits instead.',
      },
      {
        question: 'What is an A- on the percentage scale?',
        answer:
          'On the common plus/minus scale an A- covers 90 to 92.99%, an A covers 93 to 96.99% and an A+ starts at 97%. Check your syllabus because schools differ.',
      },
      {
        question: 'How do I convert a letter grade to a percentage?',
        answer:
          'Use the range for that letter on your scale. If you need a single number, the midpoint is the usual choice: 85 for a B on the standard scale. The calculator shows both.',
      },
      {
        question: 'Is an A+ worth more than an A in GPA?',
        answer:
          'On most 4.0 scales both are 4.0. Some schools use 4.3 for an A+. Your registrar’s scale decides.',
      },
      {
        question: 'Does 89.5% round up to an A?',
        answer:
          'Only if your instructor rounds before assigning the letter. This calculator does not round for you: it uses the exact value you type, so you can see which side of the cutoff you are on.',
      },
      {
        question: 'What is the lowest passing letter grade?',
        answer:
          'On most scales a D (60%) is the lowest passing grade, and a D- on the plus/minus scale. Many colleges require a C or better for major courses and prerequisites, so a D may pass the course without counting toward your program.',
      },
      {
        question: 'What percentage is a B+?',
        answer:
          'On the common plus/minus scale a B+ covers 87% to 89.99%, a B covers 83% to 86.99% and a B- covers 80% to 82.99%. On the standard A–F scale there is no B+, so the same 88% is simply a B.',
      },
      {
        question: 'How many GPA points does each letter grade earn?',
        answer:
          'On the common 4.0 scale an A is 4.0, A- 3.7, B+ 3.3, B 3.0, B- 2.7, C+ 2.3, C 2.0, C- 1.7, D+ 1.3, D 1.0, D- 0.7 and F 0.0. Your registrar may use a different table, so check the official scale.',
      },
    ],
    related: [
      { path: '/gpa-calculator/', label: 'GPA calculator', blurb: 'Combine letters and credits into semester and cumulative GPA.' },
      { path: '/cgpa-to-percentage-calculator/', label: 'CGPA to percentage', blurb: '10-point, 5-point and 4-point conversions by university.' },
      { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Get the percentage first, then the letter.' },
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Build the course percentage from every assessment.' },
    ],
  },
};

export const TOOL_PAGE_LIST: ToolPageEntry[] = Object.values(TOOL_PAGES);

export function getToolPageByPath(rawPath: string): ToolPageEntry | undefined {
  const clean = (rawPath.split(/[?#]/)[0].replace(/\/+$/, '') || '/').toLowerCase();
  return TOOL_PAGE_LIST.find((p) => p.path.replace(/\/+$/, '') === clean);
}

export function toolPageCanonical(entry: ToolPageEntry): string {
  return `${BASE_CANONICAL_ORIGIN}${entry.path}`;
}
