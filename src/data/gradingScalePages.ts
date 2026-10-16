import type { ToolPageEntry, ToolPageFaq, ToolPageRelated } from './toolPages';
import { GRADING_SCALE_SIZES, gradingScalePath, gradingScaleSlug } from './gradingScaleSizes';
import {
  SCALE_PLUS_MINUS,
  SCALE_STANDARD,
  computeStats,
  percentToLetter,
  roundTo,
} from '../utils/academicMath';
import { buildQuickChart } from '../utils/gradeCalculations';

/**
 * Generated, per-size landing pages for /grading-scale/N-questions/, the grading-scale index and the
 * Average Grade calculator. Every number printed on these pages comes from the same math modules the
 * calculators use, so the text can never disagree with the tool. Each size gets different computed
 * numbers, different "how many can I miss" thresholds and size-specific guidance, so the pages are
 * not templated copies of each other.
 */

const fmt = (x: number, d = 2): string => String(Number(x.toFixed(d)));

function chartFor(n: number) {
  return buildQuickChart({ total: n, decimals: 1, bands: SCALE_STANDARD });
}

/** The most wrong answers allowed while still earning each standard letter (null when the letter is out of reach). */
function maxWrongByLetter(n: number): Record<string, number | null> {
  const rows = chartFor(n);
  const out: Record<string, number | null> = {};
  for (const letter of ['A', 'B', 'C', 'D']) {
    const hits = rows.filter((r) => r.letter === letter);
    out[letter] = hits.length ? Math.max(...hits.map((r) => r.wrong)) : null;
  }
  return out;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const article = (letter: string) => (letter === 'A' ? 'an' : 'a');
const missPhrase = (w: number | null, letter: string) =>
  w === null
    ? `${article(letter)} ${letter} is not reachable with whole questions`
    : `${w === 0 ? 'no questions' : `up to ${plural(w, 'question', 'questions')}`} for ${article(letter)} ${letter}`;

function sizeContext(n: number, p: number): string {
  if (n <= 10) {
    return `On a short ${n}-question quiz every single answer matters: one missed question moves the score by ${fmt(p)} percentage points, which is often enough to change the letter grade.`;
  }
  if (n <= 25) {
    return `A ${n}-question test is a common size for unit quizzes and chapter tests. One missed question costs ${fmt(p)} points, so a single slip rarely decides the letter on its own but two or three often do.`;
  }
  if (n <= 50) {
    return `With ${n} questions each answer is worth only ${fmt(p)}%, so the grade is steadier than on a short quiz. This size is typical for midterms and multi-section exams.`;
  }
  return `A ${n}-question exam spreads the risk thinly: each answer is worth just ${fmt(p)}%, so you can miss several questions before the letter grade moves.`;
}

function pickWrongs(n: number): number[] {
  const raw = [0, 1, 2, 3, Math.ceil(n * 0.1), Math.ceil(n * 0.2), Math.ceil(n * 0.3), Math.ceil(n * 0.4)];
  return Array.from(new Set(raw.filter((w) => w >= 0 && w <= n))).sort((a, b) => a - b);
}

export function buildQuestionCountPage(n: number): ToolPageEntry {
  const p = 100 / n;
  const rows = chartFor(n);
  const rowFor = (wrong: number) => rows.find((r) => r.wrong === wrong)!;
  const plusLetter = (percent: number) => percentToLetter(roundTo(percent, 1), SCALE_PLUS_MINUS).letter;
  const maxWrong = maxWrongByLetter(n);
  const exampleWrong = Math.max(1, Math.round(n * 0.12));
  const faqWrong = Math.max(2, Math.ceil(n * 0.15));
  const ex = rowFor(exampleWrong);
  const fq = rowFor(faqWrong);
  const wrongs = pickWrongs(n);
  const half = n <= 200;

  const allowParts: string[] = [];
  for (const letter of ['A', 'B', 'C', 'D']) {
    const w = maxWrong[letter];
    allowParts.push(missPhrase(w, letter));
  }

  const idx = GRADING_SCALE_SIZES.indexOf(n);
  const prev = idx > 0 ? GRADING_SCALE_SIZES[idx - 1] : null;
  const next = idx < GRADING_SCALE_SIZES.length - 1 ? GRADING_SCALE_SIZES[idx + 1] : null;
  const related: ToolPageRelated[] = [];
  if (prev) related.push({ path: gradingScalePath(prev), label: `${prev}-question grading scale`, blurb: `Score chart for a ${prev}-question test.` });
  if (next) related.push({ path: gradingScalePath(next), label: `${next}-question grading scale`, blurb: `Score chart for a ${next}-question test.` });
  related.push(
    { path: '/grading-scale/', label: 'All grading scale charts', blurb: 'Pick any test size from 5 to 100 questions.' },
    { path: '/', label: 'Quick Grade calculator', blurb: 'Grade a whole class and print a chart for any size.' },
    { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Points earned out of points possible, with bonus points.' }
  );

  const faqs: ToolPageFaq[] = [
    {
      question: `How much is each question worth on a ${n}-question test?`,
      answer: `Each question is worth 100 ÷ ${n} = ${fmt(p, 3)}% when every question has the same weight. Missing one question leaves ${fmt(100 - p, 2)}%, and each further miss lowers the score by another ${fmt(p, 3)} points.`,
    },
    {
      question: `How many questions can I get wrong on a ${n}-question test and still get an A?`,
      answer: `On a ${n}-question test with the common 90/80/70/60 scale you can miss ${allowParts[0]}. For the other letters you can miss ${allowParts.slice(1).join(', ')}. Your teacher’s scale may use different cutoffs, so check the syllabus.`,
    },
    {
      question: `What grade is ${faqWrong} wrong out of ${n}?`,
      answer: `${plural(faqWrong, 'wrong answer', 'wrong answers')} leaves ${n - faqWrong} correct, which is ${fq.formattedPercentage}%. That is a ${fq.letter} on the standard A–F scale and a ${plusLetter(fq.rawPercentage)} on the plus/minus scale.`,
    },
    {
      question: `Can I give partial credit on a ${n}-question test?`,
      answer: half
        ? `Yes. On a ${n}-question test, turn on half points in the Quick Grade calculator and a half-credit answer counts as ${fmt(p / 2, 3)}% instead of ${fmt(p, 3)}%. The chart on this page uses whole questions only.`
        : `For partial credit on a ${n}-question test, use a points-based calculation: add the points earned on every question, divide by the points possible and multiply by 100.`,
    },
  ];

  return {
    slug: gradingScaleSlug(n),
    path: gradingScalePath(n),
    navLabel: `${n} Questions`,
    h1: `${n}-Question Grading Scale`,
    title: `${n}-Question Grading Scale: Score Chart for ${n} Questions`,
    metaDescription: `${n}-question grading scale: each answer is worth ${fmt(p, 2)}%. See the percentage and letter grade for every score, for example ${exampleWrong} wrong = ${ex.formattedPercentage}%.`,
    badge: `${n}-question test`,
    intro: `Find the percentage and letter grade for any score on a ${n}-question test. Each question is worth ${fmt(p, 2)}%, and the chart below shows the result for every number of wrong answers from 0 to ${n}.`,
    questions: n,
    keywords: [
      `${n} question grading scale`,
      `${n} question test grade calculator`,
      `grading scale for ${n} questions`,
      `${n} question quiz score chart`,
    ],
    featureList: [
      `Score chart for 0 to ${n} wrong answers`,
      'Standard A–F and plus/minus letter grades',
      'Printable chart with no sign-up',
    ],
    sections: [
      {
        heading: `How a ${n}-question test is scored`,
        paragraphs: [
          `Divide the number of correct answers by ${n} and multiply by 100. With ${n} questions worth the same amount, each one is ${fmt(p, 3)}% of the grade. ${sizeContext(n, p)}`,
          `On the common 90/80/70/60 scale you can miss ${allowParts.join(', ')}. Anything below the D line is an F.`,
        ],
      },
      {
        heading: `Quick reference for ${n} questions`,
        paragraphs: [`These scores come from the same chart you see in the tool above.`],
        bullets: wrongs.map((w) => {
          const r = rowFor(w);
          return `${plural(w, 'wrong answer', 'wrong answers')} (${n - w} correct) = ${r.formattedPercentage}%, grade ${r.letter}`;
        }),
      },
      {
        heading: `Rounding and partial credit on ${n} questions`,
        paragraphs: [
          Number.isInteger(p)
            ? `Because ${n} divides 100 evenly, every score is a whole percentage: no rounding is needed.`
            : `Because ${n} does not divide 100 evenly, scores are rounded. For example, ${exampleWrong} wrong is ${fmt(ex.rawPercentage, 4)}% exactly and shows as ${ex.formattedPercentage}% rounded to one decimal. The letter is chosen from the rounded value that is displayed.`,
          half
            ? `Half points are possible too: one half-credit answer is worth ${fmt(p / 2, 3)}%.`
            : 'For partial credit, use a points-based calculation instead of counting whole questions.',
        ],
      },
    ],
    example: {
      heading: `Worked example: ${exampleWrong} wrong on a ${n}-question test`,
      scenario: `A student misses ${exampleWrong} of ${n} questions.`,
      rows: [
        { label: 'Correct answers', value: `${n - exampleWrong} of ${n}` },
        { label: 'Percentage', value: `${ex.formattedPercentage}%` },
        { label: 'Standard A–F', value: ex.letter },
        { label: 'Plus/minus', value: plusLetter(ex.rawPercentage) },
      ],
      takeaway: `(${n} − ${exampleWrong}) ÷ ${n} × 100 = ${fmt(ex.rawPercentage, 2)}%, so the grade is ${ex.formattedPercentage}% (${ex.letter}).`,
    },
    faqs,
    related,
  };
}

/* ---------- index page ---------- */

export function buildGradingScaleIndexPage(): ToolPageEntry {
  const sample = [10, 20, 25, 50, 100].filter((n) => GRADING_SCALE_SIZES.includes(n));
  return {
    slug: 'grading-scale',
    path: '/grading-scale/',
    navLabel: 'Grading Scales',
    h1: 'Grading Scale Charts by Number of Questions',
    title: 'Grading Scale Chart — Percent & Letter Grade by Test Size',
    metaDescription: `Printable grading chart for any test: pick your size, from ${GRADING_SCALE_SIZES[0]} to ${GRADING_SCALE_SIZES[GRADING_SCALE_SIZES.length - 1]} questions, and get the percent and letter grade for every score. Free, no sign-up.`,
    badge: 'Score charts',
    intro: 'Choose the number of questions on your test to open a ready-made score chart. Each chart lists the percentage and letter grade for every number of wrong answers, on the standard and plus/minus scales.',
    keywords: [
      'grading scale chart',
      'grading scale by questions',
      'printable grading chart',
      'teacher grading chart printable',
      'printable grade scale chart',
      'printable grader chart',
      'test score chart',
      'quiz grading scale',
    ],
    featureList: ['Charts for 17 common test sizes', 'Standard and plus/minus letter grades', 'Printable, free, no sign-up'],
    sections: [
      {
        heading: 'How these charts work',
        paragraphs: [
          'Every chart uses the same rule: percentage = correct answers ÷ total questions × 100, then the letter grade is read from the scale. The standard scale is A 90, B 80, C 70, D 60. The plus/minus scale splits each letter into thirds.',
          'Short quizzes swing the most: on a 10-question quiz one wrong answer is 10 points, while on a 100-question exam it is 1 point.',
          'That is why the grading scale by questions is a separate chart for each test size: the same two misses mean something different on a 10-question quiz than on a 50-question test.',
        ],
      },
      {
        heading: 'Printable grading chart for any test',
        paragraphs: [
          'A printable grading chart saves you from dividing on every paper. Pick the number of questions on your test, open the chart and print it: you get a one-page printable grade scale chart that lists the percentage and letter grade for every number of wrong answers. Teachers who search for a teacher grading chart printable usually want exactly this, a sheet they can keep beside the stack of tests.',
          `The same page works as a printable grader chart for quizzes, unit tests and finals. Charts are ready for ${GRADING_SCALE_SIZES.length} common test sizes, and the Quick Grade calculator on the home page builds one for any whole number of questions from 1 to 1000.`,
        ],
      },
      {
        heading: 'How do I print a grading chart for my class?',
        paragraphs: ['Printing takes four steps:'],
        bullets: [
          'Open the chart for your test size from the list above.',
          'Check that the scale matches your syllabus, or set your own cutoffs in the Quick Grade calculator first.',
          'Use the print button. The printed page contains only the chart, without the site navigation.',
          'Keep the sheet beside the tests, or save the printout as a PDF for your class folder.',
        ],
      },
      {
        heading: 'Printable grading chart vs grading by hand',
        paragraphs: [
          'Grading by hand means subtracting the wrong answers, dividing by the number of questions, multiplying by 100 and looking up the letter, again for every paper. A printable grading chart does that arithmetic once, so every student with the same score gets the same percentage and letter, and you only count wrong answers. Hand grading still fits essays and rubric work, where the score comes from your judgment rather than a count.',
        ],
      },
      {
        heading: 'What is the easiest printable grading tool for teachers?',
        paragraphs: [
          'The easiest printable grading tool is a chart built for your exact test size: no formulas, no account and a layout that fits one page. The charts here do that for common test sizes, and the Quick Grade calculator covers every other size with your own letter cutoffs.',
        ],
      },
      {
        heading: 'What one wrong answer costs',
        paragraphs: ['Points lost per missed question for common test sizes:'],
        bullets: sample.map((n) => `${n} questions: ${fmt(100 / n, 2)}% per question`),
      },
    ],
    example: {
      heading: 'Worked example: the same two misses on different tests',
      scenario: 'Two wrong answers cost very different amounts depending on the test size.',
      rows: sample.map((n) => {
        const r = chartFor(n).find((x) => x.wrong === 2)!;
        return { label: `2 wrong out of ${n}`, value: `${r.formattedPercentage}% (${r.letter})` };
      }),
      takeaway: 'The more questions a test has, the less any single miss matters.',
    },
    faqs: [
      {
        question: 'Which grading scale do these charts use?',
        answer: 'The standard chart uses A 90, B 80, C 70, D 60. The plus/minus chart uses A+ 97, A 93, A- 90, B+ 87, B 83, B- 80, C+ 77, C 73, C- 70, D+ 67, D 63, D- 60. If your teacher uses different cutoffs, set them in the Quick Grade calculator.',
      },
      {
        question: 'My test has a different number of questions. What now?',
        answer: 'Use the Quick Grade calculator on the home page. It builds the same chart for any whole number of questions from 1 to 1000.',
      },
      {
        question: 'Do the charts round the percentage?',
        answer: 'Yes, to one decimal place. The letter grade is chosen from that rounded percentage, so the two always agree.',
      },
      {
        question: 'Can I print a chart?',
        answer: 'Yes. Open a chart and use the print button, or open the Quick Grade calculator for a full printable chart with your own cutoffs.',
      },
      {
        question: 'How do I print a grading chart for my class?',
        answer: 'Open the chart for your test size, check that the scale matches your syllabus and use the print button. The printed page contains only the chart. If you need custom cutoffs, set them in the Quick Grade calculator first and print from there.',
      },
      {
        question: 'What is the easiest printable grading tool for teachers?',
        answer: 'A chart made for your test size is the easiest: you count the wrong answers on a paper and read the percentage and letter straight across. Start with the chart for your number of questions, or use the Quick Grade calculator for any other size.',
      },
      {
        question: 'Is a printable grading chart faster than grading by hand?',
        answer: 'For tests with right and wrong answers, yes. Looking up a row takes seconds, while repeating the division and the letter conversion on every paper takes longer and invites rounding errors. Grade essays and rubric-based work by hand.',
      },
      {
        question: 'Is there a printable grade scale chart for every test size?',
        answer: 'There are ready-made charts for the most common test sizes, and the Quick Grade calculator builds the same chart for any whole number of questions from 1 to 1000, so a printable grade scale chart is always available for your test.',
      },
    ],
    related: [
      { path: '/', label: 'Quick Grade calculator', blurb: 'Any test size, custom cutoffs, class tally.' },
      { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Points earned out of points possible.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Percent to letter and GPA points.' },
      { path: '/average-grade-calculator/', label: 'Average grade calculator', blurb: 'Mean, median and letter for a list of scores.' },
    ],
  };
}

/* ---------- average grade calculator ---------- */

const avgScores = [88, 92, 79, 95, 84];
const avgStats = computeStats(avgScores);
const avgLetter = percentToLetter(roundTo(avgStats.mean, 1), SCALE_STANDARD).letter;
const avgPlus = percentToLetter(roundTo(avgStats.mean, 1), SCALE_PLUS_MINUS).letter;

export function buildAverageGradePage(): ToolPageEntry {
  return {
    slug: 'average-grade-calculator',
    path: '/average-grade-calculator/',
    navLabel: 'Average Grade',
    h1: 'Average Grade Calculator',
    title: 'Free Average Grade Calculator: Mean, Median & Letter Grade',
    metaDescription: 'Free average grade calculator: paste your test, quiz or assignment scores to get your average grade, median, highest and lowest score and letter grade. No weights needed.',
    badge: 'Mean and median',
    intro: 'Enter your scores separated by commas, spaces or new lines. You get the average percentage, the median, the highest and lowest score and the letter grade on the A–F or plus/minus scale. It works for two grades or twenty, for one class or a whole semester.',
    keywords: [
      'average grade calculator',
      'grade average calculator',
      'calculate average grade',
      'overall average grade calculator',
      'average grade calculator without weights',
      'average grade calculator with percentages',
      'average grade calculator with points',
      'average grade calculator with letters',
      'average quiz grade calculator',
      'average test grade calculator',
      'class average calculator',
      'semester average grade calculator',
      'final average grade calculator',
      'average grade needed calculator',
      'average grade calculator for college',
      'average grade calculator for high school',
      'average grade calculator excel',
      'mean of test scores',
    ],
    featureList: [
      'Mean, median, highest and lowest score',
      'Letter grade on standard or plus/minus scale',
      'Any number of scores, with a custom maximum score',
      'Flags values it cannot read instead of ignoring them',
      'Free and private: scores stay in your browser',
    ],
    sections: [
      {
        heading: 'How to calculate an average grade',
        paragraphs: [
          'Add up all the scores and divide by how many there are: average = sum of scores ÷ number of scores. This is the arithmetic mean, and it treats every score as equally important.',
          'Each score is first a percentage of its own total: percentage = points earned ÷ points possible × 100. If your categories have different weights, such as exams worth more than homework, a plain average is not your course grade. Use the weighted grade calculator for that.',
        ],
        bullets: [
          'Step 1: write every score as a percentage of its own total.',
          'Step 2: add the percentages.',
          'Step 3: divide the sum by the number of scores.',
          'Step 4: compare the result with your school’s grading scale to get the letter.',
        ],
      },
      {
        heading: 'How do I calculate my overall average grade?',
        paragraphs: [
          'List every score you want to include, whether they are quizzes, tests or assignments from one class or grades from several classes, and take the mean of the list. For 50, 59 and 71 the sum is 180 and 180 ÷ 3 gives 60%, while the median is 59%.',
          'The same steps work for two, three, four or any number of grades. Paste them into the calculator and it also shows the highest and lowest score, so you can see which result is pulling the average up or down.',
        ],
      },
      {
        heading: 'Average grade calculator with points or percentages',
        paragraphs: [
          'The calculator has one setting, “Each score is out of”, so every score you paste must share that maximum, such as 100 points or 50 points. Scores out of different totals should be converted to percentages first. A 9 out of 10 and a 45 out of 50 are both 90%, but averaging 9 and 45 gives a meaningless 27.',
          'Two ways of averaging can disagree. With 18 out of 20 and 60 out of 100, the average of the percentages is (90 + 60) ÷ 2 = 75%, while total points give 78 ÷ 120 = 65%. Ask your teacher which method the gradebook uses.',
        ],
      },
      {
        heading: 'Average grade calculator without weights, and when to use weights',
        paragraphs: [
          'This is an unweighted average grade calculator: every score counts the same, so no weights or credits are needed. That fits a set of quizzes, a run of tests or a single subject where each assessment is worth the same.',
          'When some grades matter more, use the weighted grade calculator. For module or course credits, enter each credit value as the weight: a 90% in a 3-credit course and a 70% in a 1-credit course give (270 + 70) ÷ 4 = 85%, not the simple average of 80%.',
        ],
      },
      {
        heading: 'Mean, median and why both matter',
        paragraphs: [
          'The median is the middle score when the list is sorted. One very low or very high score pulls the mean but barely moves the median, so comparing them shows whether a single outlier is driving your average.',
          'For a class, add all the students’ scores and divide by the number of students to get the class average, then check the median to see whether most of the class sits above or below it.',
        ],
      },
      {
        heading: 'Average grade for a quiz, test, semester, quarter or year',
        paragraphs: [
          'For quizzes or tests, paste the scores and read the mean. For a semester, term, quarter or report card, average the period grades when each counts equally: four quarter grades of 88, 92, 79 and 95 give 354 ÷ 4 = 88.5%.',
          'If a final exam or a midterm counts for more than the other grades, the period average alone is not the final average. Use the weighted grade calculator, or the final exam calculator to find the score you still need.',
        ],
      },
      {
        heading: 'What average grade do I need on the remaining scores?',
        paragraphs: [
          'Multiply the average you want by the total number of scores, subtract what you have already earned, and divide by the scores left: needed = (target × total count − points so far) ÷ scores left. With four tests of 82, 78, 90 and 85 (335 in total) and a target of 85 across five tests, you need 85 × 5 − 335 = 90 on the last one.',
        ],
      },
      {
        heading: 'What letter grade is my average? Is a C average okay?',
        paragraphs: [
          'On the common A–F scale 90% and up is an A, 80–89% a B, 70–79% a C, 60–69% a D and below 60% an F. On the plus/minus scale 70% is a C- and 77% is a C+, so the same average can carry a different letter at another school.',
          'A C is a passing grade at most schools and is widely treated as the average grade, though some programs require a C or better to count a course toward a major. Grading systems also differ by country, so check your school’s own table.',
        ],
      },
      {
        heading: 'From average grade to GPA',
        paragraphs: [
          'A GPA averages grade points weighted by credits, not percentages. On the common scale an A is 4.0 and a C is 2.0, so a 95% average is normally a 4.0, though some schools score 90–92% as an A-. Use the GPA calculator for the exact figure, and the GPA to percentage page to go the other way.',
        ],
      },
      {
        heading: 'Average grade in Excel or Google Sheets',
        paragraphs: [
          'Put the scores in a column, for example A2:A20. Then =AVERAGE(A2:A20) gives the mean, =MEDIAN(A2:A20) the median, and =MAX(A2:A20) and =MIN(A2:A20) the highest and lowest. This page gives the same results without setup, and it also names the letter grade.',
        ],
      },
      {
        heading: 'Who is this average grade calculator for?',
        paragraphs: [
          'Students in high school and college use it to check where they stand before grades are posted, and teachers use it to find a class average or to average a set of quizzes. It is free, needs no account and runs in your browser, so nothing you type is uploaded.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: five test scores',
      scenario: `A student scores ${avgScores.join(', ')} on five tests.`,
      rows: [
        { label: 'Sum', value: String(avgScores.reduce((a, b) => a + b, 0)) },
        { label: 'Average', value: `${fmt(avgStats.mean, 1)}%` },
        { label: 'Median', value: `${fmt(avgStats.median, 1)}%` },
        { label: 'Letter (standard / plus-minus)', value: `${avgLetter} / ${avgPlus}` },
      ],
      takeaway: `${avgScores.reduce((a, b) => a + b, 0)} ÷ ${avgScores.length} = ${fmt(avgStats.mean, 1)}%, which is a ${avgLetter} on the standard scale.`,
    },
    faqs: [
      {
        question: 'How do I calculate my average grade?',
        answer: 'Add all your scores and divide by the number of scores. If every score is out of 100 this is your average percentage. If scores have different totals, convert each one to a percentage first.',
      },
      {
        question: 'Is the average grade the same as my course grade?',
        answer: 'Only when every assignment counts equally. If your syllabus gives different categories different weights, use the weighted grade calculator instead.',
      },
      {
        question: 'What is the difference between the mean and the median?',
        answer: 'The mean adds everything and divides by the count. The median is the middle value of the sorted list. They differ when a few scores are much higher or lower than the rest.',
      },
      {
        question: 'Why did the calculator leave out one of my values?',
        answer: 'It only accepts plain numbers. Text, negative numbers and values above the maximum score are listed under the input with the reason, so you can fix them.',
      },
      {
        question: 'How do I calculate my overall average grade?',
        answer: 'Take every score you want to include and find the mean of the list. For four quarter grades of 88, 92, 79 and 95 the sum is 354, and 354 ÷ 4 gives 88.5%. If some grades count for more than others, use the weighted grade calculator instead.',
      },
      {
        question: 'What is the average of 50, 59 and 71?',
        answer: 'The sum is 50 + 59 + 71 = 180, and 180 ÷ 3 = 60, so the average is 60%. The median is the middle value, 59. On the common A–F scale an average of 60% is the lowest D.',
      },
      {
        question: 'What is the formula for calculating a grade?',
        answer: 'A single grade is points earned ÷ points possible × 100. An average grade is the sum of all the percentages ÷ the number of scores. For example, 42 out of 50 is 84%, and averaging it with 90% and 78% gives (84 + 90 + 78) ÷ 3 = 84%.',
      },
      {
        question: 'How do I average grades that are out of different totals?',
        answer: 'Convert each score to a percentage and average the percentages, or add all the points earned and divide by all the points possible. With 18 out of 20 and 60 out of 100 the first method gives 75% and the second gives 65%, so follow the method your teacher uses.',
      },
      {
        question: 'Can I calculate an average grade without weights?',
        answer: 'Yes. This calculator is unweighted, so every score counts equally and you only need the scores themselves. Add them, divide by how many there are and read the mean, median and letter grade.',
      },
      {
        question: 'Can I use credits or weights in this average grade calculator?',
        answer: 'No, it treats every score equally. For credits or weights, use the weighted grade calculator and enter each credit value as the weight. A 90% in 3 credits and a 70% in 1 credit average 85% that way, compared with 80% unweighted.',
      },
      {
        question: 'How do I find the average grade for a class?',
        answer: 'Paste every student’s score into the calculator, or add them and divide by the number of students. The mean is the class average and the median shows the middle student. If the class average is lower than you planned, the grade curve calculator can compare ways to adjust it.',
      },
      {
        question: 'What average do I need on my remaining tests?',
        answer: 'Use (target × total number of scores − points so far) ÷ scores left. With four tests totalling 335 and a goal of 85 across five tests, the last test must be 85 × 5 − 335 = 90. Enter the scores you have to see your current average first.',
      },
      {
        question: 'Is 70% a C or a D?',
        answer: 'On the common A–F scale 70% is the lowest C. On a plus/minus scale it is a C-, and some schools set a higher cutoff for a C, so your syllabus decides. Switch the scale in the calculator to see both letters.',
      },
      {
        question: 'Is a C+ an average grade?',
        answer: 'A C+ is slightly above the traditional average. On a plus/minus scale it covers roughly 77% to 79.9%, and a plain C is usually thought of as the average grade. Averages differ by school, so compare yours with your class average.',
      },
      {
        question: 'Is a C a fail?',
        answer: 'No. A C is a passing grade at most schools, and a fail is normally an F, which is below 60% on the common scale. Some majors, scholarships and graduate programs require a C or better, or a B, so check the rule for yours.',
      },
      {
        question: 'Is 95% a 4.0 GPA?',
        answer: 'On the common scale where 90% and up is an A, a 95% average earns a 4.0. Some schools put an A- at 90–92% and give it 3.7, so check your school’s table. The GPA calculator gives the exact result for a list of courses.',
      },
      {
        question: 'Will one C ruin a 4.0 GPA?',
        answer: 'It lowers it, but by an amount that depends on how many courses you have. With equal credits, nine A grades and one C average 3.8, and four A grades and one C average 3.6. The more courses already in your GPA, the smaller the drop.',
      },
      {
        question: 'How do I find an average grade in Excel or Google Sheets?',
        answer: 'Put the scores in a column and use =AVERAGE(A2:A20) for the mean and =MEDIAN(A2:A20) for the median. Use =MAX and =MIN for the highest and lowest. The calculator on this page does the same without any setup and adds the letter grade.',
      },
      {
        question: 'Is this average grade calculator free for students and teachers?',
        answer: 'Yes. It is free, needs no sign-up and runs in your browser, so your scores are not uploaded. Students use it for tests, quizzes and report card averages, and teachers use it for class averages.',
      },
    ],
    related: [
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Categories with different weights.' },
      { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Points earned out of points possible.' },
      { path: '/grade-curve-calculator/', label: 'Grade curve calculator', blurb: 'See how a curve changes the class average.' },
      { path: '/final-exam-grade-calculator/', label: 'Final exam calculator', blurb: 'Find the score you need to reach your target.' },
      { path: '/gpa-calculator/', label: 'GPA calculator', blurb: 'Turn course grades and credits into a GPA.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'See the percentage cutoffs behind each letter.' },
      { path: '/grading-scale/', label: 'Grading scale charts', blurb: 'Score charts for 5 to 100 questions.' },
    ],
  };
}
