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
      answer: `On the common 90/80/70/60 scale you can miss ${allowParts[0]}. For the other letters you can miss ${allowParts.slice(1).join(', ')}. Your teacher’s scale may use different cutoffs, so check the syllabus.`,
    },
    {
      question: `What grade is ${faqWrong} wrong out of ${n}?`,
      answer: `${plural(faqWrong, 'wrong answer', 'wrong answers')} leaves ${n - faqWrong} correct, which is ${fq.formattedPercentage}%. That is a ${fq.letter} on the standard A–F scale and a ${plusLetter(fq.rawPercentage)} on the plus/minus scale.`,
    },
    {
      question: `Can I give partial credit on a ${n}-question test?`,
      answer: half
        ? `Yes. Turn on half points in the Quick Grade calculator and a half-credit answer counts as ${fmt(p / 2, 3)}% instead of ${fmt(p, 3)}%. The chart on this page uses whole questions only.`
        : 'Use a points-based calculation for partial credit: add the points earned on every question, divide by the points possible and multiply by 100.',
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
    title: 'Grading Scale Charts: 5 to 100 Questions | Easy Grade Tool',
    metaDescription: `Pick your test size, from ${GRADING_SCALE_SIZES[0]} to ${GRADING_SCALE_SIZES[GRADING_SCALE_SIZES.length - 1]} questions, and get the percentage and letter grade for every possible score.`,
    badge: 'Score charts',
    intro: 'Choose the number of questions on your test to open a ready-made score chart. Each chart lists the percentage and letter grade for every number of wrong answers, on the standard and plus/minus scales.',
    keywords: ['grading scale by number of questions', 'test score chart', 'quiz grading scale', 'grading scale chart'],
    featureList: ['Charts for 17 common test sizes', 'Standard and plus/minus letter grades', 'Printable, free, no sign-up'],
    sections: [
      {
        heading: 'How these charts work',
        paragraphs: [
          'Every chart uses the same rule: percentage = correct answers ÷ total questions × 100, then the letter grade is read from the scale. The standard scale is A 90, B 80, C 70, D 60. The plus/minus scale splits each letter into thirds.',
          'Short quizzes swing the most: on a 10-question quiz one wrong answer is 10 points, while on a 100-question exam it is 1 point.',
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
    title: 'Average Grade Calculator: Mean, Median & Letter Grade',
    metaDescription: 'Paste your scores to get the average grade, the median, the highest and lowest score, and the letter grade. Works for tests, quizzes and assignments.',
    badge: 'Mean and median',
    intro: 'Enter your scores separated by commas, spaces or new lines. You get the average percentage, the median, the highest and lowest score and the letter grade on your chosen scale.',
    keywords: ['average grade calculator', 'calculate average grade', 'mean of test scores', 'class average calculator'],
    featureList: ['Mean, median, highest and lowest score', 'Letter grade on standard or plus/minus scale', 'Flags values it cannot read instead of ignoring them'],
    sections: [
      {
        heading: 'How to calculate an average grade',
        paragraphs: [
          'Add up all the scores and divide by how many there are: average = sum of scores ÷ number of scores. This is the arithmetic mean, and it treats every score as equally important.',
          'If your categories have different weights, such as exams worth more than homework, a plain average is not your course grade. Use the weighted grade calculator for that.',
        ],
      },
      {
        heading: 'Mean, median and why both matter',
        paragraphs: [
          'The median is the middle score when the list is sorted. One very low or very high score pulls the mean but barely moves the median, so comparing them shows whether a single outlier is driving your average.',
          'Scores out of different totals should be converted to percentages first. A 9 out of 10 and a 45 out of 50 are both 90%, but averaging 9 and 45 gives a meaningless 27.',
        ],
      },
      {
        heading: 'Step by step: from a list of scores to a letter grade',
        paragraphs: [
          'The calculator follows the same short routine you would use on paper, so you can check any result by hand.',
        ],
        bullets: [
          'List every score you want included, one per test, quiz or assignment, using the same maximum for all of them.',
          'Add the scores together to get the sum, then divide the sum by how many scores you entered. The result is the mean.',
          'Sort the scores from lowest to highest and pick the middle one. With an even number of scores, take the midpoint of the two middle values. That is the median.',
          'Divide the mean by the maximum score and multiply by 100 to get a percentage, then read the letter from your grading scale.',
        ],
      },
      {
        heading: 'What each result on the calculator tells you',
        paragraphs: [
          'The mean is your overall level across all the work entered. The median shows what a typical score looks like once extremes are set aside. The highest and lowest scores show your range, which tells you how consistent you have been.',
          'A narrow range, such as 84 to 95, means the average describes your performance well. A wide range, such as 40 to 100, means the average hides a lot of variation, and it is worth asking which assignments dragged the score down and whether they can be repeated or made up.',
        ],
      },
      {
        heading: 'When a plain average can mislead you',
        paragraphs: [
          'A single zero for a missed assignment can pull a mean down by many points, while the median stays almost unchanged. If your teacher drops the lowest score, remove it from the list before you calculate, otherwise the result will be lower than your real standing.',
          'Averages also hide trends. Scores of 70, 80, 90 and 100 average to 85, exactly the same as 100, 90, 80 and 70, even though the first student is improving and the second is slipping. Looking at the order of your scores is as useful as the number itself.',
          'Finally, remember rounding. An average of 89.6 is a B on the standard scale even though it rounds to 90 when written as a whole number. Always use the exact value your school uses for its cutoffs.',
        ],
      },
      {
        heading: 'Average grade, weighted grade and GPA are different measures',
        paragraphs: [
          'An average grade treats every score as equal, so it fits a set of tests of the same size. A weighted grade gives each category its own share of the course, for example homework 20% and exams 50%, and needs the weighted grade calculator. A GPA does not average percentages at all: it converts each course to grade points and combines them by credit hours.',
          'Use the average grade calculator for questions such as how you are doing across five quizzes or what the class mean was on a unit test. Use the other tools when your syllabus assigns weights or when you need a semester GPA.',
        ],
      },
      {
        heading: 'Tips for entering your scores',
        paragraphs: ['A few habits keep the result accurate:'],
        bullets: [
          'Convert every score to the same scale first. If one quiz was out of 20 and another out of 50, enter percentages instead of raw points.',
          'Use commas, spaces or line breaks between values. Do not type a percent sign or letters next to the numbers.',
          'Keep extra credit as part of the score if your teacher counts it, and change the out-of value if scores can go above 100.',
          'Check the warnings under the box. Any value the calculator could not read is listed there with the reason, so nothing is silently skipped.',
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
    ],
    related: [
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Categories with different weights.' },
      { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Points earned out of points possible.' },
      { path: '/grade-curve-calculator/', label: 'Grade curve calculator', blurb: 'See how a curve changes the class average.' },
      { path: '/grading-scale/', label: 'Grading scale charts', blurb: 'Score charts for 5 to 100 questions.' },
    ],
  };
}
