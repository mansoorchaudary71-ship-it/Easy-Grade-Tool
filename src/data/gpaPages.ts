import type { ToolPageEntry } from './toolPages';
import { SCALE_PLUS_MINUS, SCALE_STANDARD, roundTo } from '../utils/academicMath';
import { DEFAULT_BONUS, WeightedCourse, calculateWeightedGpa, pointsForLetter } from '../utils/gpaMath';
import { buildMissTable } from '../utils/missMath';

/**
 * Pages added by the SEO fix kit: the weighted GPA calculator (tool), the weighted vs unweighted GPA guide
 * and the "how many questions can I miss" calculator. Every number in the copy is computed from the same
 * helpers the tools use (utils/gpaMath.ts, utils/missMath.ts), never typed by hand.
 */

const EXAMPLE_COURSES: (WeightedCourse & { name: string })[] = [
  { name: 'AP Calculus', letter: 'A', credits: 1, level: 'ap' },
  { name: 'Honors English', letter: 'B', credits: 1, level: 'honors' },
  { name: 'US History', letter: 'A', credits: 1, level: 'regular' },
];
const exampleResult = calculateWeightedGpa(EXAMPLE_COURSES, DEFAULT_BONUS)!;
const bonusOf = (level: WeightedCourse['level']) => (level === 'honors' ? DEFAULT_BONUS.honors : level === 'ap' ? DEFAULT_BONUS.ap : 0);
const levelLabel = (level: WeightedCourse['level']) => (level === 'honors' ? 'Honors' : level === 'ap' ? 'AP / IB' : 'Regular');
const gap = roundTo(exampleResult.weighted - exampleResult.unweighted, 2).toFixed(2);

export function buildWeightedGpaPage(): ToolPageEntry {
  return {
    slug: 'weighted-gpa-calculator',
    path: '/weighted-gpa-calculator/',
    navLabel: 'Weighted GPA calculator',
    h1: 'Weighted GPA Calculator',
    title: 'Weighted GPA Calculator — Honors, AP & IB Bonus Points',
    metaDescription:
      'Free weighted GPA calculator: add your school’s honors, AP and IB bonus points and see weighted and unweighted GPA side by side.',
    badge: 'Weighted GPA',
    intro: `A weighted GPA adds bonus points for harder courses, so an A in an AP class can count above 4.0. Add each course with your school’s bonus and see your weighted and unweighted GPA side by side. Example: an A in AP Calculus, a B in Honors English and an A in US History give a weighted GPA of ${exampleResult.weighted.toFixed(2)} and an unweighted GPA of ${exampleResult.unweighted.toFixed(2)}.`,
    keywords: [
      'weighted gpa calculator',
      'high school gpa calculator',
      'ap gpa calculator',
      'honors gpa calculator',
      'calculate weighted gpa',
    ],
    featureList: [
      'Honors and AP/IB bonus points you set yourself',
      'Weighted and unweighted GPA side by side',
      'Credit-weighted average',
      'Plus/minus letter grades',
      'Runs in your browser, nothing is uploaded',
    ],
    sections: [
      {
        heading: 'How to calculate a weighted GPA',
        paragraphs: [
          'A weighted GPA is a credit-weighted average of grade points, where harder courses get bonus points added first. The formula is: weighted GPA = the sum of (grade points + bonus) × credits, divided by total credits.',
        ],
        bullets: [
          'Turn each letter grade into 4.0-scale points (A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0 and so on).',
          'Add your school’s bonus if the course is honors, AP or IB.',
          'Multiply the result by the course credits.',
          'Add those products together and divide by the total credits.',
        ],
      },
      {
        heading: 'Which bonus points should you use?',
        paragraphs: [
          'Use the numbers your school publishes in its grading policy or course catalog. This calculator starts at 0.5 for honors and 1.0 for AP or IB because many schools use those values, but they are only starting points. Some schools use smaller bonuses, apply them only to certain courses or grades, or do not weight GPA at all.',
          'This calculator gives no bonus to a course graded F, because a bonus on a failing grade would reward a failed course. If your school handles that differently, your official GPA will differ from the result here.',
        ],
      },
      {
        heading: 'Why the number on your transcript may not be the number a college uses',
        paragraphs: [
          'Some colleges recalculate GPA from your transcript with their own rules, for example by using only core academic courses or by removing school-specific bonus points. Check the admissions pages of the colleges you apply to to see which GPA they ask for.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: same grades, two GPAs',
      scenario: `Three one-credit courses with an honors bonus of ${DEFAULT_BONUS.honors} and an AP/IB bonus of ${DEFAULT_BONUS.ap.toFixed(1)}: AP Calculus (A), Honors English (B) and US History (A, regular).`,
      rows: [
        ...EXAMPLE_COURSES.map((c) => ({
          label: `${c.name}: ${c.letter}, ${levelLabel(c.level)}`,
          value: `${((pointsForLetter(c.letter) ?? 0) + bonusOf(c.level)).toFixed(1)} points`,
        })),
        { label: 'Unweighted GPA', value: exampleResult.unweighted.toFixed(2) },
        { label: 'Weighted GPA', value: exampleResult.weighted.toFixed(2) },
      ],
      takeaway: `The same three grades give ${exampleResult.unweighted.toFixed(2)} unweighted and ${exampleResult.weighted.toFixed(2)} weighted, a difference of ${gap} from the bonus points alone.`,
    },
    faqs: [
      {
        question: 'How do I calculate my weighted GPA?',
        answer:
          'Convert each grade to points, add your school’s bonus for honors or AP/IB courses, multiply by the credits, add the results and divide by your total credits. This calculator does those steps for every course you enter.',
      },
      {
        question: 'Can a weighted GPA be higher than 4.0?',
        answer:
          'Yes. Bonus points are added on top of the 4.0-scale points, so a weighted GPA can go above 4.0. With a 1.0 bonus on every AP or IB course the highest possible value is 5.0, but the ceiling depends on your school’s bonus rules.',
      },
      {
        question: 'Do honors and AP classes get a bonus for an F?',
        answer:
          'This calculator adds no bonus to an F. Schools differ on this, so follow your school’s published policy for your official number.',
      },
      {
        question: 'Does this calculator save my courses?',
        answer: 'No. Everything is calculated in your browser and nothing you enter is uploaded or stored.',
      },
    ],
    related: [
      { path: '/weighted-vs-unweighted-gpa/', label: 'Weighted vs unweighted GPA', blurb: 'What each one means, with a side-by-side example.' },
      { path: '/gpa-calculator/', label: 'GPA calculator', blurb: 'Semester and cumulative GPA on the 4.0 scale.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Turn a percentage into a letter and GPA points.' },
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Build a course percentage from every assessment.' },
    ],
  };
}

export function buildWeightedVsUnweightedPage(): ToolPageEntry {
  const rows = EXAMPLE_COURSES.map((c) => {
    const pts = pointsForLetter(c.letter) ?? 0;
    return [c.name, c.letter, levelLabel(c.level), pts.toFixed(1), (pts + bonusOf(c.level)).toFixed(1)];
  });
  rows.push(['GPA (average of the three)', '', '', exampleResult.unweighted.toFixed(2), exampleResult.weighted.toFixed(2)]);
  return {
    slug: 'weighted-vs-unweighted-gpa',
    path: '/weighted-vs-unweighted-gpa/',
    navLabel: 'Weighted vs unweighted GPA',
    h1: 'Weighted vs Unweighted GPA',
    title: 'Weighted vs Unweighted GPA: Differences & Examples',
    metaDescription:
      'Weighted vs unweighted GPA explained: what each one means, how each is calculated, and a worked example with the same grades.',
    badge: 'GPA guide',
    schemaType: 'WebPage',
    intro: `An unweighted GPA counts every class the same on a 4.0 scale. A weighted GPA adds bonus points for harder courses such as honors, AP and IB, so the same grades produce a higher number. With one A in AP, one B in honors and one A in a regular class, the unweighted GPA is ${exampleResult.unweighted.toFixed(2)} and the weighted GPA is ${exampleResult.weighted.toFixed(2)}.`,
    keywords: [
      'weighted vs unweighted gpa',
      'difference between weighted and unweighted gpa',
      'unweighted gpa meaning',
      'what is an unweighted gpa',
      'what is a weighted gpa',
    ],
    featureList: ['Plain-language definitions', 'Side-by-side worked example', 'Link to a weighted GPA calculator'],
    sections: [
      {
        heading: 'What unweighted GPA means',
        paragraphs: [
          'An unweighted GPA ignores how hard a course is. Every course is graded on the same scale, so an A is worth 4.0 in a regular class and in an AP class. On the standard scale the top value is 4.0, which makes unweighted GPAs easy to compare across students and schools.',
        ],
      },
      {
        heading: 'What weighted GPA means',
        paragraphs: [
          'A weighted GPA gives extra points for advanced courses. The school adds a bonus, often called a weight, to the 4.0-scale points of each honors, AP or IB course before averaging. Because the bonus is added on top, a weighted GPA can be higher than 4.0.',
          'The size of the bonus and the courses that qualify are set by each school or district, so two students with identical grades can have different weighted GPAs at different schools.',
        ],
      },
      {
        heading: 'Do colleges use weighted or unweighted GPA?',
        paragraphs: [
          'It varies. Some colleges recalculate GPA from your transcript using their own method, often on core academic courses and sometimes without school-specific bonus points. The admissions page of each college you apply to is the place to check.',
        ],
      },
      {
        heading: 'Which GPA should you look at?',
        paragraphs: [
          'Use your school’s weighted GPA when it is the one used for class rank or honors, and your unweighted GPA when you want a like-for-like number across schools. To see both for your own courses, use the weighted GPA calculator and enter your school’s bonus points.',
        ],
      },
    ],
    lookupTables: [
      {
        heading: 'Side-by-side example',
        intro: `Three one-credit courses with an honors bonus of ${DEFAULT_BONUS.honors} and an AP/IB bonus of ${DEFAULT_BONUS.ap.toFixed(1)}. These bonus values are an example, not a rule.`,
        columns: ['Course', 'Grade', 'Level', 'Unweighted points', 'Weighted points'],
        rows,
      },
    ],
    example: {
      heading: 'Same grades, two GPAs',
      scenario: 'The table above, averaged over three equal-credit courses.',
      rows: [
        { label: 'Unweighted GPA', value: exampleResult.unweighted.toFixed(2) },
        { label: 'Weighted GPA', value: exampleResult.weighted.toFixed(2) },
        { label: 'Difference', value: gap },
      ],
      takeaway: 'The difference comes entirely from the bonus points on the honors and AP courses.',
    },
    faqs: [
      {
        question: 'What is the difference between weighted and unweighted GPA?',
        answer:
          'An unweighted GPA counts every course on the same 4.0 scale. A weighted GPA adds bonus points for honors, AP or IB courses, so a harder class with the same letter grade counts for more.',
      },
      {
        question: 'What does unweighted GPA mean?',
        answer:
          'It is your GPA when no course gets extra points for difficulty. An A is worth the same in every class, and on the usual 4.0 scale the highest possible value is 4.0.',
      },
      {
        question: 'Can an unweighted GPA be above 4.0?',
        answer:
          'Not on a standard 4.0 scale. A few schools give an A+ extra points, so check how your school scores it.',
      },
      {
        question: 'Is a weighted GPA better than an unweighted GPA?',
        answer:
          'Neither is better. A weighted GPA rewards taking harder courses, while an unweighted GPA is easier to compare across schools.',
      },
    ],
    related: [
      { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'Enter your courses and your school’s bonus points.' },
      { path: '/gpa-calculator/', label: 'GPA calculator', blurb: 'Semester and cumulative GPA on the 4.0 scale.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Percent to letter and GPA points.' },
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Build a course percentage from every assessment.' },
    ],
  };
}

export function buildMissCalculatorPage(): ToolPageEntry {
  const total = 25;
  const std = buildMissTable(total, SCALE_STANDARD);
  const get = (l: string) => std.find((r) => r.letter === l)!;
  const plus = buildMissTable(total, SCALE_PLUS_MINUS);
  const aMinus = plus.find((r) => r.letter === 'A-')!;
  return {
    slug: 'how-many-questions-can-i-miss',
    path: '/how-many-questions-can-i-miss/',
    navLabel: 'How many can I miss',
    h1: 'How Many Questions Can I Miss?',
    title: 'How Many Questions Can You Miss? Wrong Answers Calculator',
    metaDescription:
      'Find the most questions you can get wrong on a test and still earn an A, B or C. Enter the number of questions and your target grade.',
    badge: 'Wrong answers allowed',
    intro: `Enter how many questions the test has and the grade you want, and this calculator shows the most you can get wrong. On a ${total}-question test with the common 90/80/70/60 scale you can miss up to ${get('A').maxWrong} for an A, ${get('B').maxWrong} for a B, ${get('C').maxWrong} for a C and ${get('D').maxWrong} for a D.`,
    keywords: [
      'how many questions can you miss',
      'how many questions can you get wrong',
      'how many can i miss on a test',
      'wrong answers allowed calculator',
      'how many wrong for an A',
    ],
    featureList: [
      'Any test size from 1 to 1000 questions',
      'Standard A–F and plus/minus scales',
      'Custom target percentage',
      'Table of the most you can miss for every grade',
    ],
    sections: [
      {
        heading: 'How the calculation works',
        paragraphs: [
          'Each question is worth 100 ÷ (number of questions) percent when every question counts the same. The score is (questions − wrong) ÷ questions × 100, rounded to one decimal place, and that rounded score is compared with the minimum for your target grade. The answer is the largest whole number of wrong answers that still meets the minimum.',
          'Because the answer is a whole number of questions, the score at the limit is usually above the cutoff, not exactly on it.',
        ],
      },
      {
        heading: 'Which grading scale does it use?',
        paragraphs: [
          'The default is the common 90/80/70/60 scale. Switch to plus/minus to see cutoffs such as A- at 90% and B+ at 87%, or choose a custom percentage if your teacher uses different cutoffs. Your syllabus decides your official scale.',
          'If your test is a standard size, the grading scale charts show every score for 5 to 100 questions at a glance.',
        ],
      },
    ],
    example: {
      heading: `Worked example: a ${total}-question test`,
      scenario: `Each question is worth ${roundTo(100 / total, 2)}%. These are the most you can miss on the common 90/80/70/60 scale and on the plus/minus scale for an A-.`,
      rows: [
        ...std.map((r) => ({ label: `${r.letter} (${r.min}% or higher)`, value: `miss up to ${r.maxWrong} (${r.percentAtMax}%)` })),
        { label: `A- on plus/minus (${aMinus.min}% or higher)`, value: `miss up to ${aMinus.maxWrong} (${aMinus.percentAtMax}%)` },
      ],
      takeaway: `One more miss than the limit drops the score below the cutoff, so on this test the margin for an A is just ${get('A').maxWrong} questions.`,
    },
    faqs: [
      {
        question: `How many questions can you miss on a ${total}-question test and still get a B?`,
        answer: `At ${roundTo(100 / total, 2)}% per question you can miss ${get('B').maxWrong} and keep ${get('B').percentAtMax}%, which is still a B on the 90/80/70/60 scale. One more miss leaves ${roundTo(((total - get('B').maxWrong - 1) / total) * 100, 1)}%, a C.`,
      },
      {
        question: 'How do I find how many wrong answers I am allowed for a custom grade?',
        answer:
          'Choose Custom percentage and enter the minimum score your teacher requires. The calculator returns the largest whole number of wrong answers that keeps the rounded score at or above that minimum.',
      },
      {
        question: 'Does this work if some questions are worth more points?',
        answer:
          'This calculator assumes every question counts the same. If questions have different point values, use the test grade calculator with points earned and points possible instead.',
      },
    ],
    related: [
      { path: '/grading-scale/', label: 'Grading scale charts', blurb: 'Score charts for tests of 5 to 100 questions.' },
      { path: '/grading-scale/25-questions/', label: '25-question grading scale', blurb: 'Every score on a 25-question test.' },
      { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Points earned out of points possible.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Percent to letter and GPA points.' },
    ],
  };
}
