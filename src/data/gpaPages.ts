import type { ToolPageEntry } from './toolPages';
import { SCALE_PLUS_MINUS, SCALE_STANDARD, roundTo } from '../utils/academicMath';
import { DEFAULT_BONUS, WeightedCourse, calculateWeightedGpa, pointsForLetter } from '../utils/gpaMath';
import { buildMissTable, maxWrongForMinPercent } from '../utils/missMath';

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
  const letters = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
  const pointsRows = letters.map((l) => {
    const p = pointsForLetter(l) ?? 0;
    const earns = p > 0;
    return [l, p.toFixed(1), (p + (earns ? DEFAULT_BONUS.honors : 0)).toFixed(1), (p + (earns ? DEFAULT_BONUS.ap : 0)).toFixed(1)];
  });
  const halfCredit = calculateWeightedGpa(
    [
      { letter: 'A', credits: 1, level: 'ap' },
      { letter: 'C', credits: 0.5, level: 'honors' },
    ],
    DEFAULT_BONUS
  )!;
  const withBio = calculateWeightedGpa([...EXAMPLE_COURSES, { name: 'AP Biology', letter: 'B', credits: 1, level: 'ap' }], DEFAULT_BONUS)!;
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
    lookupTables: [
      {
        heading: 'Points one course earns by grade and level',
        intro: `Grade points on the 4.0 scale, with an honors bonus of ${DEFAULT_BONUS.honors} and an AP/IB bonus of ${DEFAULT_BONUS.ap.toFixed(1)} added to any passing grade. Change the bonus fields above and the calculator updates, but this table shows the starting values.`,
        columns: ['Grade', 'Regular course', 'Honors course', 'AP / IB course'],
        rows: pointsRows,
      },
    ],
    sections: [
      {
        heading: 'How to calculate a weighted GPA',
        paragraphs: [
          'Think of it as an ordinary GPA with a head start for tougher classes. Each course earns grade points, advanced courses get their bonus on top, every result is multiplied by the course credits, and the total is divided by all credits taken. As a formula: sum of (points + bonus) × credits ÷ total credits.',
        ],
        bullets: [
          'Convert every letter to points: an A is worth 4.0, an A- 3.7, a B+ 3.3 and a B 3.0, continuing down the scale.',
          'Add your school’s bonus if the course is honors, AP or IB.',
          'Multiply the result by the course credits.',
          'Add those products together and divide by the total credits.',
        ],
      },
      {
        heading: 'Which bonus points should you use?',
        paragraphs: [
          'Look in your school’s grading policy or course catalog for the exact numbers. The fields start at a half point for honors and a full point for AP or IB because many schools work that way, but they are only placeholders. Other schools use smaller bonuses, limit them to certain courses or grades, or do not weight at all.',
          'This calculator gives no bonus to a course graded F, because a bonus on a failing grade would reward a failed course. If your school handles that differently, your official GPA will differ from the result here.',
        ],
      },
      {
        heading: 'How credit values change the average',
        paragraphs: [
          `Courses are weighted by credits, so a half-credit course moves your GPA half as much as a full-credit course. Take a one-credit AP course with an A and a half-credit honors course with a C: the weighted GPA is ${halfCredit.weighted.toFixed(2)} and the unweighted GPA is ${halfCredit.unweighted.toFixed(2)}, because the A counts twice as much as the C.`,
          'Use the credit value your school lists on your transcript. If every course is worth the same, leave each at 1.',
        ],
      },
      {
        heading: 'Courses to leave out',
        paragraphs: [
          'Courses that your school does not count toward GPA, such as many pass/fail or audit classes, should not be entered. If a course was retaken, follow your school’s rule on whether the old grade, the new grade or both count.',
          'When in doubt, ask your counselor which courses and which grades feed the official GPA, then enter exactly those here.',
        ],
      },
      {
        heading: 'Plan a schedule with a what-if',
        paragraphs: [
          `Add a course you have not finished yet and enter the grade you expect. With the three example courses, adding AP Biology with a B moves the weighted GPA to ${withBio.weighted.toFixed(2)} and the unweighted GPA to ${withBio.unweighted.toFixed(2)}. Try a lower grade too, to see how much room you have.`,
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
        question: 'How do half-credit courses affect my weighted GPA?',
        answer:
          'A half-credit course counts half as much as a full-credit course in the average. Enter 0.5 in the credits field and the calculator weights that course accordingly, with its bonus applied first.',
      },
      {
        question: 'Why is my result different from my school’s GPA?',
        answer:
          'Schools differ on bonus amounts, which courses qualify, how credits are counted and how the final number is rounded. Match the bonus fields to your school’s published policy and any remaining gap usually comes from rounding or course lists.',
      },
      {
        question: 'Does this calculator save my courses?',
        answer: 'No. Everything is calculated in your browser and nothing you enter is uploaded or stored.',
      },
    ],
    related: [
      { path: '/weighted-vs-unweighted-gpa/', label: 'Weighted vs unweighted GPA', blurb: 'Plain-language definitions and a full-year schedule worked through.' },
      { path: '/gpa-calculator/', label: 'GPA calculator', blurb: 'Term-by-term and running GPA without any bonus points.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Look up the letter and grade points for any percentage.' },
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Combine homework, quizzes and exams into one course percentage.' },
    ],
  };
}

export function buildWeightedVsUnweightedPage(): ToolPageEntry {
  const year: (WeightedCourse & { name: string })[] = [
    { name: 'AP English Language', letter: 'B+', credits: 1, level: 'ap' },
    { name: 'Honors Chemistry', letter: 'A-', credits: 1, level: 'honors' },
    { name: 'Algebra II', letter: 'B', credits: 1, level: 'regular' },
    { name: 'World History', letter: 'A', credits: 1, level: 'regular' },
    { name: 'Spanish III', letter: 'B-', credits: 1, level: 'regular' },
    { name: 'Physical Education', letter: 'A', credits: 0.5, level: 'regular' },
  ];
  const yearResult = calculateWeightedGpa(year, DEFAULT_BONUS)!;
  const yearRows = year.map((c) => {
    const pts = pointsForLetter(c.letter) ?? 0;
    return [c.name, String(c.credits), c.letter, levelLabel(c.level), pts.toFixed(1), (pts + bonusOf(c.level)).toFixed(1)];
  });
  yearRows.push(['Credit-weighted GPA', String(yearResult.totalCredits), '', '', yearResult.unweighted.toFixed(2), yearResult.weighted.toFixed(2)]);
  const guideNames = ['AP Physics', 'Honors Literature', 'Geography'];
  const rows = EXAMPLE_COURSES.map((c, i) => {
    const pts = pointsForLetter(c.letter) ?? 0;
    return [guideNames[i], c.letter, levelLabel(c.level), pts.toFixed(1), (pts + bonusOf(c.level)).toFixed(1)];
  });
  rows.push(['Average of the three', '', '', exampleResult.unweighted.toFixed(2), exampleResult.weighted.toFixed(2)]);
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
    intro: `Two ways of averaging the same grades: unweighted treats every class alike on a 4.0 scale, while weighted gives harder classes such as honors, AP and IB a little extra, so the same report card produces a bigger number. Take one A in an AP course, one B in an honors course and one A in a standard course: unweighted that is ${exampleResult.unweighted.toFixed(2)}, weighted it is ${exampleResult.weighted.toFixed(2)}.`,
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
          'An unweighted GPA ignores how demanding a class is. The scale is identical for every course, so a 4.0 means an A whether it came from gym or from AP Physics. With 4.0 as the ceiling, unweighted numbers are simple to compare across students and schools.',
        ],
      },
      {
        heading: 'What weighted GPA means',
        paragraphs: [
          'A weighted GPA rewards advanced coursework. Before averaging, the school adds a bonus (often called a weight) to the points of each honors, AP or IB course. Since the bonus sits on top of the usual points, the result can pass 4.0.',
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
        heading: 'Common mix-ups',
        paragraphs: [
          'A weighted GPA is not a measure of how much someone learned: it mostly reflects which courses a school gives bonus points for. Two students with the same grades can have different weighted GPAs if their schools weight courses differently.',
          'Cumulative GPA is a different idea again. Cumulative means every term added together, and it can be weighted or unweighted. Semester GPA is the same calculation for a single term.',
          `You cannot get an unweighted GPA by subtracting a fixed amount from a weighted one, because the bonus only applies to some courses. Recalculate from the plain grade points instead. In the schedule above the weighted GPA is ${yearResult.weighted.toFixed(2)} and the unweighted GPA is ${yearResult.unweighted.toFixed(2)}.`,
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
        heading: 'A full schedule, weighted and unweighted',
        intro: `Six courses with different credits. The bonus values (honors ${DEFAULT_BONUS.honors}, AP/IB ${DEFAULT_BONUS.ap.toFixed(1)}) are only an example, and the result is a credit-weighted average, not a simple average of the grade points.`,
        columns: ['Course', 'Credits', 'Grade', 'Level', 'Unweighted points', 'Weighted points'],
        rows: yearRows,
      },
      {
        heading: 'Side-by-side example',
        intro: `Three equal-credit classes, using ${DEFAULT_BONUS.honors} extra points for honors and ${DEFAULT_BONUS.ap.toFixed(1)} for AP or IB purely as an illustration. Your school’s numbers may differ.`,
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
        question: 'How do I convert a weighted GPA to an unweighted GPA?',
        answer:
          'List each course with its letter grade, turn the letters into plain 4.0-scale points with no bonus, and take the credit-weighted average. The weighted number alone does not contain enough information to work backwards.',
      },
      {
        question: 'Does the AP bonus apply to every grade?',
        answer:
          'That depends on the school. Some give the bonus for any passing grade, some only for a C or better, and some cap the total. Check your school’s published weighting policy.',
      },
      {
        question: 'Is a weighted GPA better than an unweighted GPA?',
        answer:
          'Neither is better. A weighted GPA rewards taking harder courses, while an unweighted GPA is easier to compare across schools.',
      },
    ],
    related: [
      { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'Type in your own courses and the bonus your school gives.' },
      { path: '/gpa-calculator/', label: 'GPA calculator', blurb: 'Average your grades for a term or for every term so far.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'See what a percentage is worth in letters and points.' },
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Turn category weights into a single course grade.' },
    ],
  };
}

export function buildMissCalculatorPage(): ToolPageEntry {
  const total = 25;
  const sizeRows = [10, 12, 15, 20, 25, 30, 35, 40, 50, 60, 75, 100].map((n) => {
    const t = buildMissTable(n, SCALE_STANDARD);
    const g = (l: string) => String(t.find((r) => r.letter === l)?.maxWrong ?? 0);
    return [`${n}`, `${roundTo(100 / n, 2)}%`, g('A'), g('B'), g('C'), g('D')];
  });
  const t12 = buildMissTable(12, SCALE_STANDARD);
  const oneMiss12 = roundTo((11 / 12) * 100, 1);
  const twoMiss12 = roundTo((10 / 12) * 100, 1);
  const practiceA = maxWrongForMinPercent(40, 90) ?? 0;
  const practiceNow = roundTo(((40 - 6) / 40) * 100, 1);
  const strict93 = maxWrongForMinPercent(25, 93) ?? 0;
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
    intro: `Type the number of questions and the grade you are aiming for to see how many answers you can afford to get wrong. Take a quiz of ${total} questions graded 90/80/70/60: the limits are ${get('A').maxWrong} wrong for an A, ${get('B').maxWrong} for a B, ${get('C').maxWrong} for a C and ${get('D').maxWrong} for a D.`,
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
    lookupTables: [
      {
        heading: 'Most you can miss by test size',
        intro: 'The most wrong answers that still earn each letter on the common 90/80/70/60 scale when every question counts the same.',
        columns: ['Questions', 'Each question', 'Miss for an A', 'Miss for a B', 'Miss for a C', 'Miss for a D'],
        rows: sizeRows,
      },
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
        heading: 'Why one question can change the letter',
        paragraphs: [
          `Short tests have very little slack. On a 12-question test each question is worth ${roundTo(100 / 12, 2)}%, so missing one leaves ${oneMiss12}% and missing two leaves ${twoMiss12}%. That is the difference between an ${t12[0].letter} and a ${t12[1].letter}, so a single question decides the grade.`,
          'Longer tests spread the same percentage across more questions, so each miss costs less and the allowance for each letter grows with the number of questions.',
        ],
      },
      {
        heading: 'Use a practice test to set a goal',
        paragraphs: [
          `If you miss 6 questions on a 40-question practice test you scored ${practiceNow}%. To reach 90% you need to miss no more than ${practiceA}, so the goal is to cut ${6 - practiceA} misses before the real test.`,
        ],
      },
      {
        heading: 'Which grading scale does it use?',
        paragraphs: [
          'The default is the common 90/80/70/60 scale. Switch to plus/minus to see cutoffs such as A- at 90% and B+ at 87%, or choose a custom percentage if your teacher uses different cutoffs. Your syllabus has the official scale.',
          'If your test is a standard size, the grading scale charts show every score for 5 to 100 questions at a glance.',
        ],
      },
    ],
    example: {
      heading: `Worked example: ${total} questions`,
      scenario: `With ${total} questions every one is worth ${roundTo(100 / total, 2)}%. Below are the limits on the A–F scale, plus the limit for an A- on the plus/minus scale.`,
      rows: [
        ...std.map((r) => ({ label: `${r.letter} (${r.min}% or higher)`, value: `miss up to ${r.maxWrong} (${r.percentAtMax}%)` })),
        { label: `A- on plus/minus (${aMinus.min}% or higher)`, value: `miss up to ${aMinus.maxWrong} (${aMinus.percentAtMax}%)` },
      ],
      takeaway: `Going one question past a limit pushes the score under that letter, so the cushion for an A here is only ${get('A').maxWrong} questions.`,
    },
    faqs: [
      {
        question: `With ${total} questions, how many can I miss and still earn a B?`,
        answer: `Each question is ${roundTo(100 / total, 2)}% of the grade, so ${get('B').maxWrong} misses leave ${get('B').percentAtMax}%, still a B. One more miss leaves ${roundTo(((total - get('B').maxWrong - 1) / total) * 100, 1)}%, a C.`,
      },
      {
        question: 'How do I find how many wrong answers I am allowed for a custom grade?',
        answer:
          'Choose Custom percentage and enter the minimum score your teacher requires. The calculator returns the largest whole number of wrong answers that keeps the rounded score at or above that minimum.',
      },
      {
        question: 'What if my teacher needs 93% for an A?',
        answer: `Choose Custom percentage and enter 93. On a 25-question test you can then miss ${strict93} question${strict93 === 1 ? '' : 's'} and keep ${roundTo(((25 - strict93) / 25) * 100, 1)}%.`,
      },
      {
        question: 'Does this work if some questions are worth more points?',
        answer:
          'Everything here assumes each question counts equally. For a test where some items are worth extra points, enter your points earned and points possible in the test grade calculator.',
      },
    ],
    related: [
      { path: '/grading-scale/', label: 'Grading scale charts', blurb: 'Browse a ready-made chart for common test lengths.' },
      { path: '/grading-scale/25-questions/', label: '25-question grading scale', blurb: 'The full row-by-row chart for a 25-question quiz.' },
      { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Use it when questions carry different point values.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Check which letter any percentage earns.' },
    ],
  };
}
