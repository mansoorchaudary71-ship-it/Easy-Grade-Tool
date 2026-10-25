import { SCALE_PLUS_MINUS, SCALE_STANDARD } from '../utils/academicMath';
import { calculateWeightedGpa, pointsForLetter } from '../utils/gpaMath';
import type { ToolPageEntry } from './toolPages';

/**
 * GPA <-> letter grade conversion pages. Every number below is computed from
 * the same scales the tools use (SCALE_PLUS_MINUS / SCALE_STANDARD), so the
 * tables, examples and FAQs can never disagree with the converter.
 */

const plusRows = SCALE_PLUS_MINUS.map((b) => [b.letter, b.gpa.toFixed(2)]);
const standardRows = SCALE_STANDARD.map((b) => [b.letter, b.gpa.toFixed(2)]);

const gpaToLetterRelated: ToolPageEntry['related'] = [
  { path: '/letter-grade-to-gpa/', label: 'Letter grade to GPA', blurb: 'The reverse trip: what one letter is worth.' },
  { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Start from a percentage instead of a GPA.' },
  { path: '/college-gpa-calculator/', label: 'College GPA calculator', blurb: 'Where the GPA you are converting came from.' },
  { path: '/high-school-gpa-calculator/', label: 'High school GPA calculator', blurb: 'Weighted and unweighted GPAs, side by side.' },
];

const letterToGpaRelated: ToolPageEntry['related'] = [
  { path: '/gpa-to-letter-grade/', label: 'GPA to letter grade', blurb: 'The reverse trip: what a GPA means as a letter.' },
  { path: '/semester-gpa-calculator/', label: 'Semester GPA calculator', blurb: 'Turn a set of letters into a semester GPA.' },
  { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'Add honors and AP bonuses to the points.' },
  { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Percent to letter on both scales.' },
];

export function buildGpaToLetterPage(): ToolPageEntry {
  const ex = 3.7;
  const exLetter = 'A-';
  const between = 3.85;
  return {
    slug: 'gpa-to-letter-grade',
    path: '/gpa-to-letter-grade/',
    navLabel: 'GPA to letter grade',
    h1: 'GPA to Letter Grade Converter',
    title: 'GPA to Letter Grade Converter — 4.0 Scale',
    metaDescription:
      'Convert any GPA to a letter grade on the 4.0 scale: enter a GPA and see its letter on the A–F and plus/minus scales, with the full conversion table.',
    badge: 'GPA conversion',
    intro: `A GPA is an average of grade points, so converting it back to a letter means finding where it sits on the scale. A ${ex.toFixed(2)} GPA is exactly ${exLetter} on the plus/minus scale, while ${between.toFixed(2)} falls between A- (3.70) and A (4.00). Enter any GPA below and the converter shows its letter — or the two letters it sits between.`,
    keywords: [
      'gpa to letter grade',
      'convert gpa to letter grade',
      'what letter grade is a 3.7 gpa',
      'gpa letter grade converter',
      '4.0 gpa to letter grade',
    ],
    featureList: [
      'GPA to letter on the A–F and plus/minus scales',
      'Exact matches and between-letter results explained',
      'Full conversion table, computed from the same scales',
      'Free, no sign-up, nothing uploaded',
    ],
    sections: [
      {
        heading: 'How GPA to letter grade conversion works',
        paragraphs: [
          'Each letter grade carries grade points: on the plus/minus scale A and A+ are 4.0, A- is 3.7, B+ is 3.3, B is 3.0 and so on down to F at 0.0. A GPA that equals one of those point values converts exactly to that letter. A GPA between two point values does not belong to either letter outright — it sits between them, which is the honest answer for an average.',
          'Whole-letter schools are simpler: A is 4.0, B is 3.0, C is 2.0, D is 1.0 and F is 0.0, so a 3.0 GPA is a B and a 3.5 sits between B and A. Use the A–F tab in the converter for those schools.',
        ],
      },
      {
        heading: 'Why a GPA rarely converts to one clean letter',
        paragraphs: [
          'A GPA averages many courses, so it lands on values like 3.42 or 3.85 that no single letter owns. That is normal, not an error: the letter on a transcript describes one course, while the GPA describes all of them. When a form asks for a letter and you only have a GPA, report the nearest letter and the GPA itself — the number carries more information than the letter.',
        ],
        bullets: [
          'Exact point values (4.0, 3.7, 3.3, 3.0…) convert to one letter.',
          'Values between two points sit between those two letters.',
          'Some schools value A+ at 4.33; on the scales used here A+ is 4.0, so check your school’s scale for official use.',
        ],
      },
      {
        heading: 'When a form asks for a letter and you only have a GPA',
        paragraphs: [
          'Give both: the nearest letter and the GPA itself. A form that forces one letter loses information — a 3.85 and a 3.70 are both "between A- and A" on the plus/minus scale, but they are not the same record. Where the form allows a decimal, the GPA alone is the better answer; where it allows only a letter, pick the nearest one and attach the GPA in a note or transcript if you can.',
        ],
      },
      {
        heading: 'GPA scales beyond 4.0',
        paragraphs: [
          'Not every GPA lives on the 4.0 scale. Some schools value A+ at 4.33, so a straight-A record reads above 4.0. Weighted high school GPAs run on a 5.0 scale, where AP courses count as 5.0. And CGPA systems in India and elsewhere run on a 10.0 scale with their own conversion formulas per university. Never convert across scales by proportion alone — a 4.0-scale GPA, a 5.0-scale weighted GPA and a 10.0-scale CGPA are different measurements, and each needs its own converter.',
        ],
      },
    ],
    lookupTables: [
      {
        heading: 'GPA to letter grade chart (plus/minus scale)',
        intro: 'Grade points per letter on the 97/93/90/87/83/80/77/73/70/67/63/60 scale.',
        columns: ['Letter', 'Grade points'],
        rows: plusRows,
      },
      {
        heading: 'GPA to letter grade chart (A–F scale)',
        intro: 'Whole-letter schools use five point values only.',
        columns: ['Letter', 'Grade points'],
        rows: standardRows,
      },
    ],
    example: {
      heading: 'Worked example: what letter is a 3.7 GPA?',
      scenario: 'A student with a 3.70 GPA asks what letter that is.',
      rows: [
        { label: 'GPA entered', value: '3.70' },
        { label: 'Plus/minus scale', value: 'A- (3.70 points)' },
        { label: 'A–F scale', value: 'Between B (3.00) and A (4.00)' },
        { label: 'Nearest whole letter', value: 'A' },
      ],
      takeaway:
        'On the plus/minus scale 3.70 is exactly A-. On a whole-letter scale the same GPA sits between B and A, closer to A.',
    },
    faqs: [
      {
        question: 'What letter grade is a 3.5 GPA?',
        answer:
          'On the plus/minus scale a 3.5 GPA sits between B+ (3.30) and A- (3.70). On the whole-letter A–F scale it sits exactly halfway between B (3.00) and A (4.00). Neither scale gives it a single letter.',
      },
      {
        question: 'What letter grade is a 4.0 GPA?',
        answer:
          'A 4.0 GPA is an A — and on the plus/minus scale it is also A+, since both carry 4.0 points on the scales used here. Some schools value A+ at 4.33, in which case a 4.0 GPA is still an A.',
      },
      {
        question: 'What letter grade is a 2.0 GPA?',
        answer:
          'A 2.0 GPA is a C on both the plus/minus and the A–F scales. It is the usual threshold for good academic standing at many schools, though the exact rule is set by each institution.',
      },
      {
        question: 'Can I convert a GPA to a letter grade exactly?',
        answer:
          'Only when the GPA equals a letter’s point value (for example 3.70 = A-, 3.00 = B). Most GPAs fall between two point values, and then the honest conversion is the interval, not a forced single letter.',
      },
      {
        question: 'What letter grade is a 3.85 GPA?',
        answer:
          'Between A- (3.70) and A (4.00) on the plus/minus scale — closer to A, but not an A. On the whole-letter scale the same GPA is also between B and A. Report the interval alongside the GPA rather than rounding it to a letter it does not equal.',
      },
      {
        question: 'Do employers convert a GPA to a letter grade?',
        answer:
          'Rarely. Employers and hiring systems normally screen on the GPA number itself — a cutoff such as 3.0 or 3.5 — rather than converting it to a letter. The letter conversion matters mainly on forms that only accept a letter, on transcripts from schools that report letters, and when a job application asks for a grade equivalent alongside the GPA.',
      },
    ],
    faqHeading: {
      eyebrow: 'GPA conversion FAQs',
      title: 'GPA to letter grade questions',
      description: 'How a GPA maps to letters, and where the conversion stops being exact.',
      ctaText: 'Convert a GPA',
    },
    related: gpaToLetterRelated,
  };
}

export function buildLetterToGpaPage(): ToolPageEntry {
  const exLetter = 'B+';
  const exPoints = pointsForLetter(exLetter) ?? 3.3;
  // One-letter effect, computed: a 15-credit semester at 3.60, with the
  // 2-credit A swapped for a B+.
  const swapBase = calculateWeightedGpa(
    [
      { letter: 'A', credits: 4, level: 'regular' },
      { letter: 'A-', credits: 3, level: 'regular' },
      { letter: 'B+', credits: 3, level: 'regular' },
      { letter: 'B', credits: 3, level: 'regular' },
      { letter: 'A', credits: 2, level: 'regular' },
    ],
    { honors: 0, ap: 0 },
  )!;
  const swapAfter = calculateWeightedGpa(
    [
      { letter: 'A', credits: 4, level: 'regular' },
      { letter: 'A-', credits: 3, level: 'regular' },
      { letter: 'B+', credits: 3, level: 'regular' },
      { letter: 'B', credits: 3, level: 'regular' },
      { letter: 'B+', credits: 2, level: 'regular' },
    ],
    { honors: 0, ap: 0 },
  )!;
  return {
    slug: 'letter-grade-to-gpa',
    path: '/letter-grade-to-gpa/',
    navLabel: 'Letter grade to GPA',
    h1: 'Letter Grade to GPA Converter',
    title: 'Letter Grade to GPA Converter — What GPA Is Each Letter?',
    metaDescription:
      'Convert any letter grade to GPA points: pick a letter and see its grade points on the A–F and plus/minus scales, with the full conversion table.',
    badge: 'GPA conversion',
    intro: `One letter grade is worth a fixed number of grade points: ${exLetter} is ${exPoints.toFixed(2)} points on the plus/minus scale. Pick any letter below and the converter shows its points on both scales — the same points the GPA calculators use when they multiply by credits.`,
    keywords: [
      'letter grade to gpa',
      'convert letter grade to gpa',
      'what gpa is a b+',
      'letter grade gpa converter',
      'grade points per letter',
    ],
    featureList: [
      'Letter to GPA points on the A–F and plus/minus scales',
      'Full conversion table, computed from the same scales',
      'Explains how points become a GPA with credits',
      'Free, no sign-up, nothing uploaded',
    ],
    sections: [
      {
        heading: 'How letter grades become GPA points',
        paragraphs: [
          'A GPA is built from grade points: each course’s letter is worth points (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0 on whole-letter scales), those points are multiplied by the course credits to give quality points, and quality points divided by total credits give the GPA. The converter answers the first step — what one letter is worth.',
          'Plus/minus scales split each letter: A- is 3.7, B+ is 3.3, B- is 2.7 and so on. That is why two students with the same whole letters can have different GPAs when one school uses plus/minus and the other does not.',
        ],
      },
      {
        heading: 'From one letter to a whole GPA',
        paragraphs: [
          'One letter alone does not make a GPA — credits decide how much it counts. An A in a 4-credit course contributes 16.0 quality points, while an A in a 1-credit course contributes 4.0. To turn a set of letters into a GPA, use the semester GPA calculator with each course’s letter and credits.',
        ],
        bullets: [
          'Letter → points: pick the letter, read its points on your school’s scale.',
          'Points × credits = quality points for that course.',
          'Total quality points ÷ total credits = GPA.',
        ],
      },
      {
        heading: 'Plus/minus vs whole letters: why two students differ',
        paragraphs: [
          'On a whole-letter scale, a 91% and a 99% are both an A at 4.0 points. On a plus/minus scale, the 91% is an A- at 3.7 and the 99% is an A+ at 4.0. Over a semester, that split adds up: two students with the same whole letters can hold different GPAs purely because one school splits letters and the other does not. When comparing GPAs across schools, ask which scale produced each one.',
        ],
      },
      {
        heading: 'How much one letter moves a GPA',
        paragraphs: [
          `Less than students expect, and credits decide how much less. Take a 15-credit semester at ${swapBase.unweighted.toFixed(2)}: swapping just the 2-credit A for a B+ moves it to ${swapAfter.unweighted.toFixed(2)} — a change of ${(swapBase.unweighted - swapAfter.unweighted).toFixed(2)}. The same swap in a 4-credit course would move it roughly twice as far. Single letters matter most in high-credit courses and in short records; in a 120-credit degree, one letter is a rounding error.`,
        ],
      },
      {
        heading: 'Why the same letter is worth different points at different schools',
        paragraphs: [
          'Grade-point tables are institutional, not universal. The converter uses the common 4.0 table — A 4.0, A- 3.7, B+ 3.3, B 3.0, down to F 0.0 — but real tables diverge in three places: the A+ value (4.0 here, 4.33 at some schools), the plus/minus steps (a few schools use 3.5 for B+ or 3.67 for A-), and whether plus/minus letters exist at all. Two transcripts can therefore show identical letters with different GPAs, and neither is wrong. For anything official — a scholarship, an application, a transfer evaluation — recompute from your own school’s published table, and treat this converter as the common-case answer.',
        ],
      },
    ],
    lookupTables: [
      {
        heading: 'Letter grade to GPA chart (plus/minus scale)',
        intro: 'Grade points per letter on the 97/93/90/87/83/80/77/73/70/67/63/60 scale.',
        columns: ['Letter', 'Grade points'],
        rows: plusRows,
      },
      {
        heading: 'Letter grade to GPA chart (A–F scale)',
        intro: 'Whole-letter schools use five point values only.',
        columns: ['Letter', 'Grade points'],
        rows: standardRows,
      },
    ],
    example: {
      heading: 'Worked example: what GPA is a B+?',
      scenario: 'A student asks what one B+ is worth before averaging it with other courses.',
      rows: [
        { label: 'Letter entered', value: exLetter },
        { label: 'Plus/minus scale', value: `${exPoints.toFixed(2)} grade points` },
        { label: 'A–F scale', value: 'B = 3.00 grade points (plus/minus ignored)' },
        { label: 'In a 3-credit course', value: `${(exPoints * 3).toFixed(2)} quality points` },
      ],
      takeaway:
        'A B+ is 3.30 points on the plus/minus scale. In a 3-credit course it contributes 9.90 quality points toward the GPA.',
    },
    faqs: [
      {
        question: 'What GPA is an A?',
        answer:
          'An A is 4.0 grade points on both the plus/minus and the A–F scales used here. On the plus/minus scale A+ is also 4.0 points.',
      },
      {
        question: 'What GPA is a B+?',
        answer:
          'A B+ is 3.30 grade points on the plus/minus scale. On a whole-letter scale there is no B+ — the course counts as a B at 3.00 points.',
      },
      {
        question: 'What GPA is an F?',
        answer:
          'An F is 0.0 grade points on every scale, and its credits still count in the GPA denominator unless your school excludes it under a retake or forgiveness policy.',
      },
      {
        question: 'Does an A+ count as more than 4.0?',
        answer:
          'On the scales used here, no: A+ is 4.0. Some schools value A+ at 4.33, which can lift a GPA above 4.0 — check your school’s scale before using a 4.33 value officially.',
      },
      {
        question: 'Is a B+ worth 3.3 everywhere?',
        answer:
          'On most 4.0 scales, yes, but not all. A minority of schools use 3.5 for B+ or round to two decimals differently (3.33), and some whole-letter schools have no B+ at all. The converter uses 3.30, the common value — for an official transcript figure, use your own school’s table.',
      },
      {
        question: 'Can I use this for graduate school applications?',
        answer:
          'As a starting point, yes, but graduate admissions often recompute. Many programs look at the GPA of your last 60 credits, or at a major-field GPA, rather than the overall figure. Convert your letters here to understand your standing, then check whether the program asks for an overall, major or last-60-credits GPA before submitting.',
      },
      {
        question: 'What if my school uses percentages instead of letters?',
        answer:
          'Convert each percentage to a letter first — the letter grade calculator maps any percentage to its letter and points on both scales — then convert those letters to points here. If your school publishes a percentage-to-points table of its own, use that table directly instead of passing through letters.',
      },
    ],
    faqHeading: {
      eyebrow: 'GPA conversion FAQs',
      title: 'Letter grade to GPA questions',
      description: 'What each letter is worth, and how points become a GPA.',
      ctaText: 'Convert a letter',
    },
    related: letterToGpaRelated,
  };
}
