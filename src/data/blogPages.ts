import type { ToolPageEntry } from './toolPages';
import { applyCurve, computeStats, roundTo } from '../utils/academicMath';

/**
 * /blog/ — the on-site content hub. Posts are ToolPage entries with schemaType 'WebPage' and no tool,
 * so they prerender, join the sitemap and cross-link exactly like the calculator pages.
 */

const curveRaw = [55, 62, 70, 78, 85];
const curveMean = roundTo(computeStats(curveRaw).mean, 1);
const curveFlat = applyCurve(curveRaw, { method: 'flat', flatPoints: 5 }).map((x) => roundTo(x, 1)).join(', ');
const curveBell = applyCurve(curveRaw, { method: 'bell', bellMean: 75, bellSd: 10 }).map((x) => roundTo(x, 1)).join(', ');

export function buildBlogIndexPage(): ToolPageEntry {
  return {
    slug: 'blog',
    path: '/blog/',
    navLabel: 'Blog',
    h1: 'Grading Guides & Articles',
    title: 'Blog — Grading Guides & Teacher Tips | Easy Grade Tool',
    metaDescription:
      'Practical guides: grade a stack of tests in 15 minutes, decide when to curve grades, and understand weighted GPA, semester GPA and grade scales.',
    badge: 'Blog',
    schemaType: 'WebPage',
    intro:
      'Short, practical articles about the maths behind the calculators: how to grade faster without errors, when a curve is fair, and how GPA really works. Every number in every article is produced by the same code as the tools.',
    keywords: ['grading guides', 'teacher tips', 'how to grade tests', 'grade curve guide', 'gpa explained'],
    featureList: ['Written by the developer of Easy Grade Tool', 'Worked examples with real numbers', 'New guides added as the tools grow'],
    sections: [
      {
        heading: 'Start with the most-read guides',
        paragraphs: [
          '“How to Grade a Stack of 30 Tests in 15 Minutes” is the workflow teachers ask about most: build the chart once, then grade by lookup instead of redoing the same division thirty times.',
          '“When to Curve Grades” walks through the five curving methods, the signs that a test actually needs one, and the fairness checks to run before curved grades are posted.',
        ],
      },
      {
        heading: 'Prefer the tool to the article?',
        paragraphs: [
          'Every guide ends at the calculator it describes. The EZ Grader chart, weighted GPA calculator, grade curve calculator and the rest of the suite are free, need no sign-up, and run entirely in your browser.',
        ],
      },
    ],
    example: {
      heading: 'From the latest guide',
      scenario: 'Five raw scores — 55, 62, 70, 78, 85 — curved two different ways.',
      rows: [
        { label: 'Class mean before', value: String(curveMean) },
        { label: 'Flat +5 curve', value: curveFlat },
        { label: 'Bell curve (average 75)', value: curveBell },
      ],
      takeaway: 'Same class, two defensible answers. The guide explains how to choose between them.',
    },
    faqs: [
      {
        question: 'Who writes the Easy Grade Tool blog?',
        answer:
          'Muhammad Mansoor Haidar, the owner and developer of Easy Grade Tool. Articles are checked against the same verified maths the calculators use, and corrections are published under the methodology and corrections policy on the About page.',
      },
      {
        question: 'How often are new guides added?',
        answer:
          'Guides are added as the calculator suite grows and when readers ask the same question often enough that it deserves a full worked answer. If a grading topic is missing, email support@easygradetool.com and it joins the list.',
      },
      {
        question: 'Can I republish or link to these guides?',
        answer:
          'Linking is always welcome. Schools may also embed the calculators themselves, free, from the For Schools page. Republishing a full article needs written permission: email support@easygradetool.com.',
      },
    ],
    related: [
      { path: '/blog/how-to-grade-30-tests-in-15-minutes/', label: 'How to Grade a Stack of 30 Tests in 15 Minutes', blurb: 'The chart-first workflow that turns grading into lookup.' },
      { path: '/blog/when-to-curve-grades/', label: 'When to Curve Grades: A Teacher’s Guide', blurb: 'Five methods, the fairness checks, and when to leave scores alone.' },
      { path: '/for-schools/', label: 'For Schools: free embeds', blurb: 'Put these calculators on your own school website.' },
      { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'Honors and AP/IB bonuses, side-by-side results.' },
    ],
  };
}

export function buildGradeFasterPost(): ToolPageEntry {
  return {
    slug: 'blog/how-to-grade-30-tests-in-15-minutes',
    path: '/blog/how-to-grade-30-tests-in-15-minutes/',
    navLabel: 'Grade 30 tests in 15 minutes',
    h1: 'How to Grade a Stack of 30 Tests in 15 Minutes — Without Errors',
    title: 'How to Grade 30 Tests in 15 Minutes — Without Errors',
    metaDescription:
      'Grading 30 tests by hand repeats the same maths 30 times. Build the chart once, count wrong answers, read off every grade. The workflow, explained.',
    badge: 'Teacher guide',
    schemaType: 'WebPage',
    intro:
      'Every teacher knows the stack: thirty tests, the same questions, different mistakes. Working out (questions − wrong) ÷ questions × 100 thirty times is slow and invites slips — and one slip means one student gets the wrong letter. The fix is to do the maths once, before you start.',
    keywords: ['how to grade tests faster', 'grade tests quickly', 'ez grader chart', 'teacher grading tips', 'grading workflow'],
    featureList: ['The chart-first workflow', 'Count wrong answers, not right ones', 'One scale for the whole stack'],
    sections: [
      {
        heading: 'Step 1: Build the chart before you touch the stack',
        paragraphs: [
          'Pick your test size and grading scale. An EZ Grader chart lists every possible outcome in advance: 0 wrong = 100% A, 1 wrong = 95% A, and so on down the page. Print it (or open the chart here) and keep it next to the stack. From that moment, grading is lookup, not calculation: count the wrong answers, read across the row, write the percentage and letter.',
          'If your school does not use the 90/80/70/60 scale, set your own cutoffs first — many schools run a 7-point scale (A from 93) or plus/minus. The chart must match the scale you will actually report, or the time you save will be spent again on corrections.',
        ],
      },
      {
        heading: 'Step 2: Count wrong answers, not right ones',
        paragraphs: [
          'On most objective tests, wrong answers are the smaller pile. Counting 3 wrong is faster and less error-prone than counting 47 right, and it is the number the chart is indexed by. Mark each wrong answer clearly as you go, total them once, and look the total up.',
        ],
      },
      {
        heading: 'Step 3: Keep one scale for every section',
        paragraphs: [
          'Use the same chart for period 1 and period 6. Two students with the same score must receive the same percentage and letter, and a printed chart guarantees that in a way mental arithmetic at 9 pm does not. It also gives you an instant answer when a student asks why a 17 out of 20 is an 85: the chart is the policy, visible to everyone.',
        ],
      },
      {
        heading: 'Step 4: Handle the exceptions with the right tool',
        paragraphs: [
          'A chart covers equal-weight questions. When categories count differently (homework 20%, quizzes 30%, exams 50%), switch to the weighted grade calculator instead of forcing the chart. And when an exam turns out genuinely hard — a top score of 72% is the classic sign — decide on a curve with a formula and apply it to everyone, rather than quietly bumping individual grades. A written curve is transparent; improvised generosity is not.',
        ],
      },
      {
        heading: 'Why this works: the error maths',
        paragraphs: [
          'Each long division is a fresh chance to slip, and the slips are not random: tired graders transpose digits, divide by the wrong total, and round inconsistently between the first test and the thirtieth. A chart compresses thirty calculations into one verified table, so there is exactly one place an error could live — and you can check that place once, before the stack, instead of hunting through thirty results after a complaint.',
        ],
      },
    ],
    example: {
      heading: 'The chart for a 20-question test',
      scenario: 'Standard 90/80/70/60 scale. This is the whole lookup table the workflow runs on.',
      rows: [
        { label: '0–2 wrong', value: '100–90% — A' },
        { label: '3–4 wrong', value: '85–80% — B' },
        { label: '5–6 wrong', value: '75–70% — C' },
        { label: '7–8 wrong', value: '65–60% — D' },
        { label: '9 or more wrong', value: '55% and below — F' },
      ],
      takeaway: 'Thirty tests become thirty lookups. Most teachers finish the stack in about 15 minutes once the chart exists.',
    },
    faqs: [
      {
        question: 'How long should grading 30 objective tests take?',
        answer:
          'With a printed grading chart, about 15 minutes for a typical objective test: count wrong answers, read the row, write the result. Without a chart, the repeated percentage calculations usually double or triple that time and add avoidable errors.',
      },
      {
        question: 'Where do I get a chart for my test size?',
        answer:
          'The grading scale charts page has printable charts for common test lengths from 5 to 100 questions, and the Quick Grade chart on the homepage builds one for any size from 1 to 1000 questions, with your own cutoffs if your school uses them.',
      },
      {
        question: 'Does the chart work for tests with weighted questions?',
        answer:
          'Not directly. A chart assumes every question is worth the same. For points-based or weighted assessments, use the test grade calculator (points earned out of points possible) or the weighted grade calculator for category weights.',
      },
    ],
    related: [
      { path: '/', label: 'Quick Grade chart', blurb: 'Build the chart for any test size, 1–1000 questions.' },
      { path: '/grading-scale/', label: 'Printable grading charts', blurb: 'Ready-made charts for common test lengths.' },
      { path: '/blog/when-to-curve-grades/', label: 'When to Curve Grades', blurb: 'The companion guide: five methods and fairness checks.' },
      { path: '/grade-curve-calculator/', label: 'Grade curve calculator', blurb: 'Apply a curve to the whole class at once.' },
    ],
  };
}

export function buildCurveGuidePost(): ToolPageEntry {
  return {
    slug: 'blog/when-to-curve-grades',
    path: '/blog/when-to-curve-grades/',
    navLabel: 'When to curve grades',
    h1: 'When to Curve Grades: A Teacher’s Guide to the Five Methods',
    title: 'When to Curve Grades — Five Methods & Fairness Checks',
    metaDescription:
      'Should you curve that test? The signs it needs a curve, the five methods with real numbers, when to leave scores alone, and how to explain it.',
    badge: 'Teacher guide',
    schemaType: 'WebPage',
    intro:
      'A curve is a promise: one rule, applied to everyone, announced the same way to everyone. Used well it repairs a test that misfired. Used casually it teaches students that grades are negotiable. Here is how to tell the difference, and how each of the five standard methods behaves on a real set of scores.',
    keywords: ['when to curve grades', 'should teachers curve grades', 'grade curve methods', 'bell curve grades', 'curving a test fairly'],
    featureList: ['The five signs a test needs a curve', 'All five methods on the same scores', 'Fairness checks before you post grades'],
    sections: [
      {
        heading: 'The signs a test actually needs a curve',
        paragraphs: [
          'Curve the test, not the students. The legitimate triggers are about the instrument: a question that was ambiguous or mis-taught, a test pitched far above the level it replaced, or a disruption that cost the whole class time. The numbers show it too.',
        ],
        bullets: [
          'The top score is far below the maximum (a best score of 72 out of 100 is the classic case).',
          'The class mean sits well below the same cohort’s usual mean on comparable tests.',
          'One question was missed by nearly everyone, including the strongest students.',
          'Scores bunch tightly: the test separated nobody, so small raw gaps are deciding letters.',
        ],
      },
      {
        heading: 'The five methods, on the same scores',
        paragraphs: [
          `Take five raw scores — ${curveRaw.join(', ')} — with a class mean of ${curveMean}. Flat +5 gives ${curveFlat}: everyone gains equally and gaps are untouched. A bell curve set to an average of 75 and a spread of 10 gives ${curveBell}: the order is preserved, but the class is rebuilt onto the target distribution, and notice that the strongest score can come down as well as go up.`,
          'Top-score-to-100 would add 15 to everyone here (the best raw score is 85), the square-root curve lifts the bottom most (55 becomes about 74), and the target-average method adds exactly the gap between the current mean and your target. Same class, five different gradebooks: the method is the policy decision, not the arithmetic.',
        ],
      },
      {
        heading: 'When not to curve',
        paragraphs: [
          'Do not curve to reach a quota of As, to match another section’s distribution after the fact, or because individual students lobbied. Do not curve a test that did its job: a mean of 78 with a sensible spread is a working instrument, and moving it teaches students that preparation matters less than pressure. And never curve selectively — a rule that applies to some students is not a curve, it is a favour.',
        ],
      },
      {
        heading: 'Fairness checks before you post curved grades',
        paragraphs: [
          'Run these four checks on the before-and-after table (the grade curve calculator prints one). No student’s rank should change unless the method says so, as with the square-root curve’s narrowing gaps. The cap decision (at 100, or uncapped) should be made before you see names. Students near a letter boundary should be explainable in one sentence. Finally, announce the method with the grades: “the top score became 100 and everyone gained 15” ends arguments that “grades were adjusted” starts.',
        ],
      },
    ],
    example: {
      heading: 'One class, before and after',
      scenario: `Raw scores ${curveRaw.join(', ')}, mean ${curveMean}.`,
      rows: [
        { label: 'Flat +5', value: curveFlat },
        { label: 'Bell curve (average 75, spread 10)', value: curveBell },
      ],
      takeaway: 'The flat curve preserves every gap; the bell curve rebuilds the distribution. Choose based on what was wrong with the test, then say which you used.',
    },
    faqs: [
      {
        question: 'Is curving grades fair?',
        answer:
          'A curve is fair when it repairs the test rather than rewarding or punishing students: one published rule, applied to the whole class, chosen because the test misfired. It is unfair when it is selective, secret, or used to hit a predetermined distribution of letters regardless of what students learned.',
      },
      {
        question: 'Should I tell students a test will be curved?',
        answer:
          'Announcing the method with the results is usually best. Promising a curve in advance can change effort on the test itself; explaining it afterwards, with the before-and-after numbers, keeps the repair transparent without weakening the signal the test sends.',
      },
      {
        question: 'What is the most common curve in schools?',
        answer:
          'Flat points and top-score-to-100 are the most common in K-12 and undergraduate teaching because they are easy to explain and never lower a score. Bell curves are more common in large university courses with a set distribution policy.',
      },
    ],
    related: [
      { path: '/grade-curve-calculator/', label: 'Grade curve calculator', blurb: 'All five methods on your own class scores.' },
      { path: '/blog/how-to-grade-30-tests-in-15-minutes/', label: 'Grade 30 Tests in 15 Minutes', blurb: 'The chart-first grading workflow.' },
      { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Percentage and letter for a single test.' },
      { path: '/for-schools/', label: 'For Schools: free embeds', blurb: 'Put these calculators on your school website.' },
    ],
  };
}
