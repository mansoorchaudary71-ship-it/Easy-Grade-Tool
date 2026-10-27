import type { ToolPageEntry, ToolPageFaq, ToolPageSection, ToolPageTable } from './toolPages';
import { SEO_KEYWORDS_BY_PATH } from './seoKeywordMap';
import { aOrAn } from './gradingScaleSizes';
import { SCALE_PLUS_MINUS, SCALE_STANDARD, percentToLetter, roundTo } from '../utils/academicMath';

/**
 * SEO content round 2026-10-26: competitor-gap sections, keyword-mapped FAQs and lookup tables.
 *
 * Rules this module follows:
 *  - Every number is computed here from the same academicMath helpers the calculators use.
 *  - A keyword is only placed on the page it is mapped to (see seoKeywordMap.ts).
 *  - Each keyword is written at most once per page by this module; the audit script
 *    (scripts/seo-keyword-audit.py) checks the finished pages against a hard cap of 2.
 *  - Near-duplicate phrasings of the same question are merged into one answer instead of
 *    repeating the same text under several headings.
 */

export interface SeoExtra {
  sections?: ToolPageSection[];
  tables?: ToolPageTable[];
  faqs?: ToolPageFaq[];
}

/* ---------- small helpers ---------- */

const pct = (x: number, n: number): number => (x / n) * 100;
const f1 = (v: number): string => String(roundTo(v, 1));
const f2 = (v: number): string => String(roundTo(v, 2));
const std = (p: number): string => percentToLetter(roundTo(p, 1), SCALE_STANDARD).letter;
const pm = (p: number): string => percentToLetter(roundTo(p, 1), SCALE_PLUS_MINUS).letter;
const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
const art = (n: number): string => aOrAn(Math.floor(n));
const Art = (n: number): string => aOrAn(Math.floor(n), true);
const letterArt = (l: string): string => (l.startsWith('A') || l.startsWith('F') ? 'an' : 'a');
/** Correct answers needed to reach a target percentage on an n-question test. */
const needed = (n: number, target: number): number => Math.ceil((target * n) / 100 - 1e-9);
const qMark = (s: string): string => (/you miss \d+$/.test(s) ? `${cap(s)}, what is the grade?` : `${cap(s)}?`);
const joinList = (xs: string[]): string => (xs.length < 3 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const scoreLead = (x: number, kw: string): string => (/(grade|score)$/.test(kw) ? `${cap(art(x))} ${kw}` : cap(kw));
const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;

const kwFor = (path: string): string[] => SEO_KEYWORDS_BY_PATH[path] ?? [];

/* ======================================================================================
 * /grading-scale/N-questions/ pages
 * ==================================================================================== */

/** Number of correct answers a keyword refers to on an n-question test, or null when it names no score. */
function parseCorrect(kw: string, n: number): number | null {
  let m = new RegExp(`^(?:what is )?(\\d+(?:\\.\\d+)?) wrong out of ${n}\\b`).exec(kw);
  if (m) return n - Number(m[1]);
  m = new RegExp(`${n} questions (\\d+) wrong`).exec(kw);
  if (m) return n - Number(m[1]);
  m = /and you miss (\d+)/.exec(kw);
  if (m) return n - Number(m[1]);
  m = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*/\\s*${n}\\b`).exec(kw);
  if (m) return Number(m[1]);
  m = new RegExp(`(\\d+(?:\\.\\d+)?) out of ${n}\\b`).exec(kw);
  if (m) return Number(m[1]);
  return null;
}

const isQuestionForm = (kw: string): boolean => /^(what|whats|if|is|how|on a|out of)\b/.test(kw);

function scoreAnswer(x: number, n: number): string {
  const p = pct(x, n);
  const wrong = n - x;
  return `${x} out of ${n} is ${f1(p)}%, which is ${letterArt(std(p))} ${std(p)} on the standard A–F scale and ${letterArt(pm(p))} ${pm(p)} on the plus/minus scale. That is ${plural(roundTo(wrong, 2), 'wrong answer', 'wrong answers')}.`;
}

export function scaleExtras(n: number, path: string): SeoExtra {
  const kws = kwFor(path);
  if (!kws.length) return {};
  const used = new Set<string>();
  const take = (k: string) => {
    used.add(k);
    return k;
  };
  const per = 100 / n;
  const faqs: ToolPageFaq[] = [];
  const bullets: string[] = [];
  const paras: string[] = [];

  /* 1. scale phrasings: first one becomes the heading, two more are woven into prose */
  const scaleKws = kws.filter((k) => /scale|chart/.test(k));
  const heading = scaleKws.length ? `${cap(take(scaleKws[0]))}: Letter Grade Cutoffs` : `Letter grade cutoffs for ${n} questions`;
  if (scaleKws[1]) {
    paras.push(
      `Anyone hunting for a ${take(scaleKws[1])} will find every cutoff in the chart above: the percentage and the letter for each possible number of wrong answers, from a perfect paper down to zero correct.`
    );
  }
  const moreScale = scaleKws.slice(3, 5).map((k) => `Another common way to ask is “${cap(take(k))}”, and the answer is the same chart.`);
  if (scaleKws[2]) {
    paras.push(
      `The ${take(scaleKws[2])} follows one rule on both letter scales: correct answers divided by ${n}, times 100, then compared with the cutoffs. Teachers who use plus/minus grades can switch the scale in the calculator without changing anything else.`
    );
  }

  /* 2. points-per-question questions (merged into one FAQ) */
  const eachKws = kws.filter((k) => /(each|points each)/.test(k) && !/miss|wrong/.test(k));
  if (eachKws.length) {
    const [first, ...rest] = eachKws;
    const variants = rest.slice(0, 4).map((v) => `“${cap(take(v))}”`);
    const pts100 = f2(100 / n);
    const pts = n <= 50 ? ` On a ${n * 2}-point test with ${n} equal questions each answer is worth 2 points; on a ${n}-point test it is worth 1 point.` : '';
    faqs.push({
      question: isQuestionForm(first) ? qMark(take(first)) : `${cap(take(first))}?`,
      answer: `With ${n} equal questions, each one is worth 100 ÷ ${n} = ${f2(per)}% of the grade, which is ${pts100} points on a 100-point test.${pts}${
        variants.length ? ` The same answer covers ${joinList(variants)}.` : ''
      }`,
    });
  }

  /* 3. "how many can I miss" questions, grouped by target percentage */
  const missKws = kws.filter(
    (k) => /(miss|wrong)/.test(k) && /(how many|can i|can you)/.test(k) && parseCorrect(k, n) === null && !/\beach\b/.test(k)
  );
  const byTarget = new Map<string, string[]>();
  for (const k of missKws) {
    const t = /to get (?:an? )?(\d+)/.exec(k)?.[1] ?? 'any';
    byTarget.set(t, [...(byTarget.get(t) ?? []), k]);
  }
  for (const [t, list] of byTarget) {
    const [first, ...rest] = list;
    const variants = rest.slice(0, 2).map((v) => `“${cap(take(v))}”`);
    let answer: string;
    if (t === 'any') {
      const a = n - needed(n, 90);
      const b = n - needed(n, 80);
      const c = n - needed(n, 70);
      const d = n - needed(n, 60);
      answer = `On the common 90/80/70/60 scale you can miss ${a} to keep an A, ${b} for a B, ${c} for a C and ${d} for a D. Miss more than ${d} and the paper falls below 60%.`;
    } else {
      const target = Number(t);
      const w = n - needed(n, target);
      answer = `You can miss ${plural(w, 'question', 'questions')}. That leaves ${n - w} correct, which is ${f1(pct(n - w, n))}%, enough for ${target}%. One more miss drops the score to ${f1(pct(n - w - 1, n))}%.`;
    }
    faqs.push({
      question: qMark(take(first)),
      answer: answer + (variants.length ? ` The same answer covers ${joinList(variants)}.` : ''),
    });
  }

  /* 4. specific scores: question-form ones become FAQs, the rest become short lookup bullets */
  const scoreKws = kws.filter((k) => !used.has(k) && parseCorrect(k, n) !== null);
  const groups = new Map<number, string[]>();
  for (const k of scoreKws) {
    const x = parseCorrect(k, n)!;
    groups.set(x, [...(groups.get(x) ?? []), k]);
  }
  for (const [x, list] of groups) {
    if (x < 0 || x > n) continue;
    const questions = list.filter(isQuestionForm);
    const plain = list.filter((k) => !isQuestionForm(k));
    if (questions.length) {
      const [first, ...more] = questions;
      const extra = more.slice(0, 1).map((v) => ` The same score also turns up as “${qMark(take(v))}” and the answer does not change.`).join('');
      faqs.push({ question: qMark(take(first)), answer: scoreAnswer(x, n) + extra });
      for (const k of plain.slice(0, 2)) {
        bullets.push(`${scoreLead(x, take(k))} works out to ${f1(pct(x, n))}% (${std(pct(x, n))}).`);
      }
    } else {
      for (const k of plain.slice(0, 3)) {
        bullets.push(`${scoreLead(x, take(k))} works out to ${f1(pct(x, n))}% (${std(pct(x, n))} on the standard scale, ${pm(pct(x, n))} on plus/minus).`);
      }
    }
  }

  /* 5. passing score, percentage-of and verdict questions */
  for (const k of kws) {
    if (used.has(k)) continue;
    if (/passing score/.test(k)) {
      faqs.push({
        question: qMark(take(k)),
        answer: `Many schools treat 60% as the lowest passing grade, which means ${needed(n, 60)} correct answers out of ${n}. Others set the pass mark at 70%, which is ${needed(n, 70)} out of ${n}. The syllabus has the final say.`,
      });
    } else if (/^\d+% of/.test(k)) {
      const target = Number(/^(\d+)%/.exec(k)![1]);
      faqs.push({
        question: `How many answers is ${take(k)}?`,
        answer: `${target}% of ${n} questions is ${f2((target * n) / 100)}, so a student needs ${needed(n, target)} correct answers to reach ${target}%.`,
      });
    } else if (/^\d+ on a \d+ question test/.test(k)) {
      const target = Number(/^(\d+)/.exec(k)![1]);
      paras.push(
        `Aiming for ${take(k)} means getting at least ${needed(n, target)} questions right, so no more than ${n - needed(n, target)} can be wrong.`
      );
    } else if (/^if (there are|you have) \d+ questions( on a test)?$/.test(k)) {
      faqs.push({
        question: `${cap(take(k))}, how is the grade worked out?`,
        answer: `Divide the number of correct answers by ${n} and multiply by 100. Each question moves the grade by ${f2(per)} percentage points, so 1 wrong answer scores ${f1(pct(n - 1, n))}% and 2 wrong answers score ${f1(pct(n - 2, n))}%.`,
      });
    } else if (/^\d+ question exam( percentage)?$/.test(k)) {
      paras.push(
        `${cap(art(n))} ${take(k)} is scored like any other equal-weight paper: ${n} questions, ${f2(per)}% each, and a percentage that drops by that amount with every miss.`
      );
    } else if (/^(grading|grades) for \d+ questions$/.test(k)) {
      paras.push(
        `${cap(take(k))} is quick once the chart is printed: count the wrong answers, find that row, and write the percentage and letter at the top of the paper.`
      );
    } else if (/^grade out of \d+$/.test(k)) {
      paras.push(
        `A ${take(k)} is converted the same way as any score: divide the points earned by ${n} and multiply by 100. One point on this scale is worth ${f2(per)}%.`
      );
    }
  }

  paras.push(...moreScale);
  const sections: ToolPageSection[] = [];
  if (paras.length || scaleKws.length) {
    sections.push({ heading, paragraphs: paras.length ? paras : [`Every percentage and letter for ${n} questions is listed in the chart above.`] });
  }
  if (bullets.length) {
    sections.push({
      heading: 'Scores people look up most often',
      paragraphs: ['These are the scores students and teachers search for most on this test size, worked out with the same formula as the chart.'],
      bullets,
    });
  }
  return { sections, faqs };
}

/* ======================================================================================
 * Hand-written extras for the other mapped pages
 * ==================================================================================== */

const faq = (question: string, answer: string): ToolPageFaq => ({ question, answer });

/* ---------- /grading-scale/ ---------- */
function gradingScaleIndexExtras(): SeoExtra {
  const marks20 = [20, 18, 16, 14, 12, 10, 8].map((m) => [`${m} / 20`, `${f1(pct(m, 20))}%`, std(pct(m, 20)), pm(pct(m, 20))]);
  const marks50 = [50, 45, 40, 35, 30, 25].map((m) => [`${m} / 50`, `${f1(pct(m, 50))}%`, std(pct(m, 50)), pm(pct(m, 50))]);
  return {
    sections: [
      {
        heading: 'Grading Scales Compared: Which One Does a School Use?',
        paragraphs: [
          'Not every classroom reads a score the same way. Most US schools publish a letter scale in the syllabus, usually 90/80/70/60 for A to D, sometimes with plus and minus steps. A grade chart is simply that scale laid out as a table, so a student can look up a percentage and see the letter beside it.',
          'The same idea has a few common names. A grading scale chart, a grade table and a score scale all describe a percentage-to-letter lookup, and a teacher grading scale is the version one teacher or department has chosen. Where a department publishes a different teacher grader scale from the school default, the department version wins for that class.',
        ],
      },
      {
        heading: 'Grading Scale for Teachers: Printable, Online and Ready to Use',
        paragraphs: [
          'A grading scale for teachers has one job: make a stack of papers quick to mark without redoing the arithmetic for every student. The charts on this site are generated for the test size, so a teacher only counts wrong answers and reads the result.',
          'An online grading scale has two advantages over a laminated card. It can be set to custom cutoffs, and it prints cleanly as a single page. Anyone who prefers to look things up on screen can open the grading scale online for any of the common test sizes listed above.',
          'The classic cardboard EZ grader slide chart works by sliding a window to the number of questions and reading the percentage beside each wrong-answer count. The digital version does the same thing: an EZ grader chart for any whole number of questions, plus an EZ grader scale that can be switched between standard and plus/minus letters. The Quick Grade calculator is the easy grader chart for sizes that do not have a page of their own.',
        ],
      },
      {
        heading: '20-Point Grading Scale and Grading Scale for 50 Marks',
        paragraphs: [
          'Plenty of quizzes are marked out of 20 or 50 rather than 100. A 20 point grading scale is just the percentage scale with each mark worth 5%, and a grading scale 20 points wide works out the same way on any size: divide the mark by the total and multiply by 100.',
          'Marks out of 50 are even simpler because each mark is worth 2%. The grading scale for 50 marks below uses the common 90/80/70/60 cutoffs; a school with different cutoffs only changes the letter column.',
        ],
      },
      {
        heading: 'Percentage Charts for Students: Grade Percentage, Score Lists and Lookups',
        paragraphs: [
          'Students tend to want the same thing in different words. A percentage chart for grades answers “what letter is this score?”, a grade percentage chart answers “what percent is this letter?”, and a percentage wise grade chart shows both columns side by side. A grading percentage chart and a grading score chart are variations on the same table.',
          'For homework and revision, a grade list with percentage is the quickest way to see where each letter starts. A grading chart for students works best when the cutoffs match the class syllabus, so the plus/minus table above is worth checking against the course handout.',
          'The Quick Grade calculator works as a grading scale calculator for any test length. A short quiz shows the effect clearly: on an 8 question grading scale each answer is worth 12.5%, so a single miss drops a perfect paper to 87.5%, a B on the standard scale.',
        ],
      },
      {
        heading: 'Other Grading Systems at a Glance',
        paragraphs: [
          'A US letter scale is only one of many. Typical conventions elsewhere include UK degree classes (first at 70% and above, upper second 60–69%, lower second 50–59%, third 40–49%), German school marks from 1 (very good) to 6 (insufficient), and the 10-point CGPA scales used by many Indian universities, which the CGPA to percentage calculator converts. Individual institutions can differ, so the official regulations are the final word.',
        ],
      },
    ],
    tables: [
      { heading: 'Marks out of 20 (20-point scale)', intro: 'Each mark is worth 5%.', columns: ['Marks', 'Percent', 'Standard', 'Plus/minus'], rows: marks20 },
      { heading: 'Marks out of 50', intro: 'Each mark is worth 2%.', columns: ['Marks', 'Percent', 'Standard', 'Plus/minus'], rows: marks50 },
    ],
    faqs: [
      faq('Which letter scale is the most common in US schools?', 'The 90/80/70/60 scale for A, B, C and D is the most widely printed, with plus and minus steps added by many high schools and colleges. Because schools differ, the syllabus is the reference to follow.'),
      faq('How is a score out of 20 or 50 turned into a letter grade?', 'Divide the marks earned by the total marks and multiply by 100, then read the letter from the scale. 18 out of 20 is 90% and 45 out of 50 is 90%, both an A on the standard scale.'),
    ],
  };
}

/* ---------- /test-grade-calculator/ ---------- */
function testGradeExtras(): SeoExtra {
  const row = (x: number, n: number, label?: string) => [label ?? `${x}/${n}`, `${f1(pct(x, n))}%`, std(pct(x, n)), pm(pct(x, n))];
  const g = (x: number, n: number) => `${f1(pct(x, n))}% (${std(pct(x, n))} standard, ${pm(pct(x, n))} plus/minus)`;
  return {
    sections: [
      {
        heading: 'Scores Out of Unusual Totals',
        paragraphs: [
          'Quizzes are rarely a tidy 10 or 100 points. A pop quiz might have 14 questions, a unit test 28, a final project 200 points, and an unusual test such as a 51 question exam is graded with exactly the same formula: points earned ÷ points possible × 100. The table below shows how a handful of awkward totals land, including scores with decimals from half-point and quarter-point marking.',
          `A 160/200 grade is exactly ${f1(pct(160, 200))}%, the same as 16 out of 20. Combining two results works the same way: 74 plus 80 is 154 points, which across two 100-point tests is an average of ${f1((74 + 80) / 2)}%.`,
          `Counting mistakes instead of points gives the same answer. With 8 questions wrong out of 50 a student has 42 right, which is ${g(42, 50)}. A student who missed 7 questions out of 50 earns ${f1(pct(43, 50))}%, and 6 questions wrong out of 30 lands on ${f1(pct(24, 30))}%.`,
        ],
      },
      {
        heading: 'Ways to Use the Test Grade Calculator',
        paragraphs: [
          'The tool adapts to the way a teacher or student already works. As a quiz grade calculator it takes the points from a short check-in; as a paper grading calculator it turns marks on a printed exam into a percentage; and teachers who want a paper grader calculator for a whole class can pair it with the Quick Grade chart on the home page.',
          'Anyone who has just handed in a test can use it as a grade after test calculator: enter the points the paper was worth and the points the teacher gave. If the question is only how many were missed, a questions wrong calculator such as the Quick Grade chart is quicker, because it lists the grade for every wrong-answer count.',
          'The result also works as a good score calculator in the practical sense: 80% and above is a B or better on the standard scale, and 90% and above is an A. To grade questions on a quiz fairly, give every question the same value unless the paper states otherwise, and use points rather than question counts when marks differ.',
        ],
      },
    ],
    tables: [
      {
        heading: 'Quick answers for unusual test totals',
        intro: 'Percent and letter for common awkward scores, including decimal marks.',
        columns: ['Score', 'Percent', 'Standard', 'Plus/minus'],
        rows: [row(20, 28), row(12, 14), row(11, 14), row(8.33, 12, '8.33/12'), row(42.75, 45, '42.75/45'), row(32.25, 35, '32.25/35'), row(31.5, 35, '31.5/35'), row(50.5, 60, '50.5/60')],
      },
    ],
    faqs: [
      faq('What grade is a 20 out of 28?', `20 out of 28 is ${g(20, 28)}. Divide 20 by 28 and multiply by 100; the letter then depends on the scale the teacher uses.`),
      faq('If I got 12 out of 14 what is my grade?', `12 out of 14 is ${g(12, 14)}. Each question on a 14-question quiz is worth ${f2(100 / 14)}%.`),
      faq('What is my grade if I got 11 out of 14?', `11 out of 14 is ${g(11, 14)}, one question short of the 12 out of 14 above.`),
      faq('If you miss 3 questions out of 16 what is your grade?', `Missing 3 leaves 13 correct, and 13 out of 16 is ${g(13, 16)}. The 16-question grading scale page lists every other score for that test size.`),
    ],
  };
}

/* ---------- /average-grade-calculator/ ---------- */
function averageGradeExtras(): SeoExtra {
  const klass = [72, 85, 90, 64, 78];
  const classAvg = klass.reduce((a, b) => a + b, 0) / klass.length;
  const letters = [4.0, 3.3, 2.7, 3.7];
  const letterAvg = letters.reduce((a, b) => a + b, 0) / letters.length;
  return {
    sections: [
      {
        heading: 'Class Average Calculator: One Class, One Number',
        paragraphs: [
          `Teachers use a class average calculator to see how a whole test went, not just one student. Add every student’s score and divide by the number of students: scores of ${klass.join(', ')} give a class average of ${f1(classAvg)}%. Comparing that figure with the median shows whether a few very low or very high papers are pulling it.`,
          'Students can turn the idea around. A single student’s own mean across several tests, set against the figure the teacher reports for the whole room, shows whether a recent grade was an outlier or a trend.',
        ],
      },
      {
        heading: 'Averaging Letter Grades',
        paragraphs: [
          `Letters cannot be averaged directly, so each one is converted to grade points first. A, B+, B− and A− are ${letters.join(', ')} points; the mean is ${f2(letterAvg)}, which sits between a B+ (3.3) and an A− (3.7). A grade average calculator letter workflow ends with the GPA to letter grade converter, which explains how to read a value between two letters.`,
          'The same page also acts as a letter grade average calculator when every score is entered as a percentage: the average percentage is converted to a letter on the chosen scale.',
        ],
      },
      {
        heading: 'Many Names, One Average Grade Calculator',
        paragraphs: [
          'The calculator goes by many names, and all of them describe the same job. People look for a grade average calculator, an average score calculator, an average mark calculator or a test average calculator when they have a list of results and want one number. The same tool is an average test scores calculator and an average test grade calculator for a set of quizzes, an averaging grades calculator for a term, and an average of grades calculator for a report card.',
          'Other searches add small variations: an average calculator grades tool, a grades calculator average, or simply a quick way to see the mean and the middle value side by side. The page above handles all of them with the same input: one score per line, commas or spaces.',
        ],
      },
    ],
    faqs: [
      faq('How to calculate your average grade?', 'Add every score and divide by how many scores there are. Averaging grades that come from different totals means turning each into a percentage first, so that a 9 out of 10 and a 45 out of 50 count equally.'),
      faq('How to calculate average grade percentage?', 'Convert each result to a percentage, add the percentages and divide by the number of results. Weighted courses need the weighted grade calculator instead, because categories count for different amounts.'),
      faq('How to get the average of your grades?', 'List the grades as numbers, add them and divide by the count. Letter grades are converted to grade points first, then averaged.'),
      faq('How do you find out your average for grades?', 'Collect every score for the period, make sure they use the same total, then divide the sum by the number of scores. The calculator above does this as soon as the scores are pasted in.'),
      faq('What is the average of 79 and 100?', `Add them and divide by two: (79 + 100) ÷ 2 = ${f1((79 + 100) / 2)}. A 95 and a 100 give a ${f1((95 + 100) / 2)} average in the same way, which is a 95 100 average of ${f1((95 + 100) / 2)}%.`),
      faq('How to calculate average grade?', 'The recipe never changes: total of the scores ÷ number of scores. Use percentages for a percentage result, or with grade points for a GPA-style result.'),
      faq('What is the median grade?', 'It is the middle score once the list is sorted from lowest to highest. With an even number of scores it is the mean of the two middle ones. It resists outliers better than the average does.'),
    ],
  };
}

/* ---------- /letter-grade-calculator/ ---------- */
function letterGradeExtras(): SeoExtra {
  const e = (p: number) => `${p}% is ${letterArt(std(p))} ${std(p)} on the standard A–F scale and ${letterArt(pm(p))} ${pm(p)} on the plus/minus scale`;
  return {
    sections: [
      {
        heading: 'Borderline Scores: 60, 70 and 80',
        paragraphs: [
          `A 60 letter grade is a D on the 90/80/70/60 scale, and a 60 score is the lowest passing mark at many schools; others set the pass line higher, so a 60 can be an F in some syllabi. At 70 the grade becomes a C, and 80 as a letter grade reads as a B. On a plus/minus scale the same three numbers sit at the very bottom of D−, C− and B−.`,
          'A sample grade calculation shows the steps. A student has 87 out of 100: 87% is a B on the standard scale and a B+ on the plus/minus scale, worth 3.0 or 3.3 grade points. The calculator above does the same lookup instantly for any percentage.',
        ],
      },
    ],
    faqs: [
      faq('What is a 75 in grades?', `${cap(e(75))}. The usual GPA value for a C is 2.0.`),
      faq('Is 80 a good grade?', `${cap(e(80))}. Whether it is good depends on the goal: it is a solid pass and above most class averages, but a student aiming for an A needs 90% or more.`),
      faq('What grade is a 60?', `${cap(e(60))}. At schools where the lowest pass mark is higher than 60%, the same score counts as an F.`),
    ],
  };
}

/* ---------- /grade-curve-calculator/ ---------- */
function curveExtras(): SeoExtra {
  const raw = [55, 62, 70, 78, 85];
  const avg = raw.reduce((a, b) => a + b, 0) / raw.length;
  const target = 78;
  const shift = target - avg;
  return {
    sections: [
      {
        heading: 'Grade Curve Calculator Using Average: Shifting a Class to a Target Mean',
        paragraphs: [
          `The simplest curve moves every score by the same amount until the class average reaches a target. Scores of ${raw.join(', ')} average ${f1(avg)}. To bring that to ${target}, every paper gains ${f1(shift)} points, giving ${raw.map((r) => f1(r + shift)).join(', ')}. The spread between students stays the same; only the starting line moves.`,
          'This is the method most people mean by a curve grade calculator: it rewards the whole class equally and it never changes the order of results.',
        ],
      },
      {
        heading: 'Ranked Curves and Grading Scale Curves',
        paragraphs: [
          'A ranked curve gives letters by class position instead of by raw percentage. In ranked curve calculator grading, a teacher might award an A to the top 10% of a class of 20 (two students) and a B to the next 20% (four students). It is common in large courses, but it makes a student’s letter depend on classmates, so it is worth confirming that the syllabus allows it.',
          'A grading scale curve calculator works in the other direction: the percentages stay as they are and the cutoffs move, for example an A starting at 85 instead of 90. Teachers who want a class curve calculator for either approach can compare the methods side by side above and keep whichever fits the policy.',
        ],
      },
    ],
  };
}

/* ---------- GPA family ---------- */
function gpaToLetterExtras(): SeoExtra {
  const pts = (4 * 4.0 + 3 * 3.0) / 7;
  return {
    sections: [
      {
        heading: 'GPA Quality Points Chart',
        paragraphs: [
          'Every letter carries grade points, and multiplying those points by the credit hours gives quality points. A GPA quality points chart is the lookup behind every GPA calculation: A is 4.0, B is 3.0, C is 2.0, D is 1.0 and F is 0.0, with 0.3 or 0.33 steps for plus and minus.',
          `A 4A 3B GPA is a good example. Seven equal-credit courses with four As and three Bs add up to ${4 * 4 + 3 * 3} quality points, and ${4 * 4 + 3 * 3} ÷ 7 = ${f2(pts)}. Someone looking for a GPA to grades calculator is usually after this reverse reading: a GPA of ${f2(pts)} sits between a B+ (3.3) and an A− (3.7).`,
        ],
      },
    ],
    faqs: [
      faq('What GPA is a 73?', `A 73% is ${letterArt(std(73))} ${std(73)} on the standard scale and ${letterArt(pm(73))} ${pm(73)} on the plus/minus scale, so the usual GPA value is 2.0.`),
      faq('What would your GPA be with all B’s?', 'A student with all B’s has a 3.0 GPA on the common 4.0 scale, no matter how many courses there are, as long as each B counts 3.0. Mixing in B+ or B− courses moves it a little either way.'),
    ],
  };
}

function cumulativeExtras(): SeoExtra {
  return {
    sections: [
      {
        heading: 'How to Calculate Cumulative GPA, Step by Step',
        paragraphs: [
          'To calculate cumulative GPA, add up the quality points from every course taken so far (grade points × credits) and divide by the total credits attempted. A cumulative GPA is not the average of semester GPAs unless every semester has the same number of credits.',
          'A student with 60 credits at a 3.20 GPA holds 192 quality points. Adding 15 credits at a 3.80 adds 57 more, for 249 points over 75 credits, a cumulative GPA of 3.32. That is why a strong semester moves the total less as the credit count grows.',
        ],
      },
    ],
    faqs: [
      faq('How do you calculate your cumulative GPA?', 'Multiply each course’s grade points by its credits, add all the quality points, then divide by the total credits. The cumulative GPA calculator above does the arithmetic for any number of courses.'),
      faq('Can a student calculate your cumulative GPA without a transcript?', 'Yes. List every course with its credits and letter, enter them once, and the total updates as courses are added. A transcript is only needed to confirm the figures against the school’s record.'),
      faq('How to figure your cumulative GPA?', 'Use total quality points ÷ total credits. A transcript often lists both numbers, so the figure can be checked against the registrar’s record.'),
      faq('How to determine cumulative GPA after a repeated course?', 'Policies differ: some schools replace the old grade, others average both attempts. The school’s repeat policy decides, so the calculator lets a course be edited or removed.'),
      faq('What is an overall GPA calculator?', 'An overall GPA calculator combines every semester into one number, which is the same thing as the cumulative GPA. Enter each term’s credits and GPA, or the individual courses.'),
    ],
  };
}

function semesterExtras(): SeoExtra {
  const cur = { gpa: 3.2, credits: 60 };
  const sem = { gpa: 4.0, credits: 15 };
  const next = (cur.gpa * cur.credits + sem.gpa * sem.credits) / (cur.credits + sem.credits);
  return {
    sections: [
      {
        heading: 'Projected GPA: What a Strong Semester Can Do',
        paragraphs: [
          `A projected GPA calculator answers a planning question: what happens to the cumulative GPA if the next term goes a certain way. With 60 credits at ${cur.gpa.toFixed(2)}, a perfect 4.0 over 15 more credits gives (${f1(cur.gpa * cur.credits)} + ${f1(sem.gpa * sem.credits)}) ÷ ${cur.credits + sem.credits} = ${f2(next)}. Students who want to predict GPA before grades post can run a few what-if semesters this way.`,
          'The earlier the stage, the bigger the move. A first-year student with 15 credits can change the cumulative GPA much more than a senior with 100.',
        ],
      },
    ],
    faqs: [
      faq('If I get a 4.0 this semester what will my GPA be?', `It depends on the credits already earned. A 4.0 over 15 credits lifts a 3.20 GPA on 60 credits to ${f2(next)}, as worked out above. Enter the existing credits and GPA and the calculator gives the exact figure.`),
      faq('How is calculating semester GPA different from cumulative GPA?', 'Calculating semester GPA only uses that term’s courses. The cumulative figure adds every term’s quality points and credits together.'),
    ],
  };
}

function collegeExtras(): SeoExtra {
  return {
    faqs: [
      faq('How to calculate college GPA?', 'Multiply each course’s grade points by its credit hours, add the results and divide by the total credit hours. A 4-credit A (16 points) counts twice as much as a 2-credit A (8 points).'),
      faq('What is a collegiate GPA calculator?', 'It is a GPA calculator built for credit-hour courses, with semester and cumulative results. Collegiate calculators normally use the unweighted 4.0 scale with optional plus/minus steps.'),
      faq('Is there a college grade calculator GPA tool for a single course?', 'Yes. The weighted grade calculator gives the percentage and letter for one course, and the grade points from that letter feed this GPA calculator.'),
    ],
  };
}

function highSchoolExtras(): SeoExtra {
  return {
    faqs: [
      faq('Is there a GPA calculator for school courses with honors and AP classes?', 'Yes. A gpa calculator school tool needs a level for each course: regular, honors or AP. Many districts add 0.5 or 1.0, but the school’s own table is the one to follow.'),
      faq('How does a GPA class calculator treat credits?', 'A gpa class calculator multiplies each class’s grade points by its credit weight and divides by the total credits. Most high schools count every full-year class equally, so the credit step often changes nothing.'),
    ],
  };
}

const MANUAL: Record<string, () => SeoExtra> = {
  '/grading-scale/': gradingScaleIndexExtras,
  '/test-grade-calculator/': testGradeExtras,
  '/average-grade-calculator/': averageGradeExtras,
  '/letter-grade-calculator/': letterGradeExtras,
  '/grade-curve-calculator/': curveExtras,
  '/gpa-to-letter-grade/': gpaToLetterExtras,
  '/cumulative-gpa-calculator/': cumulativeExtras,
  '/semester-gpa-calculator/': semesterExtras,
  '/college-gpa-calculator/': collegeExtras,
  '/high-school-gpa-calculator/': highSchoolExtras,
};

/** Merge the extras into the finished page registry. Call once, before OG images are assigned. */
export function applySeoExtras(pages: Record<string, ToolPageEntry>): void {
  for (const entry of Object.values(pages)) {
    const extra = entry.questions ? scaleExtras(entry.questions, entry.path) : MANUAL[entry.path]?.();
    if (!extra) continue;
    if (extra.sections?.length) entry.sections = [...entry.sections, ...extra.sections];
    if (extra.tables?.length) entry.lookupTables = [...(entry.lookupTables ?? []), ...extra.tables];
    if (extra.faqs?.length) entry.faqs = [...entry.faqs, ...extra.faqs];
  }
}
