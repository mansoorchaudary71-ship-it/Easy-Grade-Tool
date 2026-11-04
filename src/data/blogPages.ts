import type { ToolPageEntry } from './toolPages';
import {
  SCALE_PLUS_MINUS,
  SCALE_SEVEN_POINT,
  SCALE_STANDARD,
  applyCurve,
  computeStats,
  percentToLetter,
  roundTo,
} from '../utils/academicMath';
import { calculateWeightedGpa } from '../utils/gpaMath';

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
          '“Grading Systems Explained” compares every system a student is likely to meet — A–F, plus/minus, 7-point, pass/fail, credit/no credit and standards-based — with the same scores graded under each. “High School GPA vs College GPA” explains what actually changes after graduation: credits, weighting, and why the same grades produce different GPAs. The “Easy Grade Calculator Guide” covers the formulas, half points and what-if planning behind the everyday grading tools.',
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
      { path: '/blog/grading-systems-explained/', label: 'Grading Systems Explained', blurb: 'A–F, pass/fail, standards-based and ungrading, compared.' },
      { path: '/blog/high-school-vs-college-gpa/', label: 'High School GPA vs College GPA', blurb: 'Credits, weighting and what changes after graduation.' },
      { path: '/blog/easy-grade-calculator-guide/', label: 'Easy Grade Calculator Guide', blurb: 'Formulas, half points, what-if grades and quick answers.' },
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

/* -------------------------------------------------------------------------- */
/* New guides (2026-10-25): grading systems + HS vs college GPA. Every number */
/* is computed with percentToLetter / calculateWeightedGpa, never typed.      */
/* -------------------------------------------------------------------------- */

const sysScores = [92, 85, 78, 68];
const sysTableRows = sysScores.map((s) => [
  `${s}%`,
  percentToLetter(s, SCALE_STANDARD).letter,
  percentToLetter(s, SCALE_PLUS_MINUS).letter,
  percentToLetter(s, SCALE_SEVEN_POINT).letter,
]);

export function buildGradingSystemsPost(): ToolPageEntry {
  return {
    slug: 'blog/grading-systems-explained',
    path: '/blog/grading-systems-explained/',
    navLabel: 'Grading systems explained',
    h1: 'Grading Systems Explained: A–F, Pass/Fail, Standards-Based & More',
    title: 'Grading Systems Explained — A–F, Pass/Fail, Standards-Based',
    metaDescription:
      'The grading systems US schools use — A–F, plus/minus, 7-point, pass/fail, standards-based and ungrading — compared on the same scores.',
    badge: 'Teacher guide',
    schemaType: 'WebPage',
    intro:
      'A grade is a translation: a student’s work goes in, a symbol comes out, and the symbol only means something if everyone reading it shares the same dictionary. This guide compares the dictionaries schools actually use, grades the same scores under each, and explains when each system helps and when it hides information.',
    keywords: [
      'grading systems explained',
      'types of grading systems',
      'a-f grading system',
      'pass fail grading',
      'standards-based grading',
      'mastery grading vs traditional',
    ],
    featureList: [
      'A–F, plus/minus and 7-point scales compared',
      'Pass/fail, credit/no credit and satisfactory systems',
      'Standards-based, mastery, contract and specifications grading',
      'The same scores graded under every system',
    ],
    sections: [
      {
        heading: 'The five grading systems US schools use most',
        paragraphs: [
          'The A–F letter system is the default: A for excellent, B for good, C for satisfactory, D for passing but weak, F for failing, with cutoffs usually at 90/80/70/60. The plus/minus variant splits each letter (A-, B+, B-) so a 91 and a 99 stop sharing the same symbol. The 7-point variant, common in middle and high schools, moves A up to 93 and compresses the bands below it — the same 91% that earns an A on a 10-point scale earns a B on a 7-point one, which is why the scale matters as much as the score.',
          'Pass/fail drops letters entirely: work either meets the bar or it does not. Credit/no credit and satisfactory/unsatisfactory are the same idea with different labels, used for electives, internships and courses where ranking students would distort the learning. The trade is information for safety: nobody can tell a strong pass from a bare pass, which is the point when the goal is trying something hard without GPA risk.',
        ],
      },
      {
        heading: 'Standards-based grading: report the skill, not the average',
        paragraphs: [
          'Standards-based grading replaces one course grade with a report per learning standard: a student can be exceeding in argumentation, meeting in evidence and approaching in conventions, all in the same essay. Averages disappear, so one bad week in September stops dragging down a December grade, and retakes measure the current skill instead of the old one. It demands more from teachers — every standard needs its own scale and evidence — and it confuses readers who expect a single letter, which is why schools that adopt it usually publish a conversion guide alongside it.',
        ],
      },
      {
        heading: 'The alternatives: mastery, contract, specifications, ungrading',
        paragraphs: [
          'Mastery grading lets students revise until they demonstrate the skill, with the grade reflecting the final state rather than the first attempt. Contract grading agrees the grade in advance: complete the listed work to the listed standard and the grade follows. Specifications grading (specs grading) grades bundles of work pass/fail against published specs, with the bundle chosen deciding the maximum grade. Ungrading drops grades during the course in favour of feedback and self-assessment, with a final grade negotiated or assigned at the end. All four trade simple comparability for a closer link between the grade and what the student can actually do.',
        ],
      },
      {
        heading: 'How to choose a grading system',
        paragraphs: [
          'Match the system to the decision the grade must support. If the grade feeds a GPA, a transcript or a transfer, use a system with fine distinctions and published cutoffs — A–F or plus/minus — because readers need comparability. If the grade must encourage risk-taking in an elective or a first attempt at a hard skill, pass/fail protects that. If the grade must tell a student exactly what to improve, standards-based reporting beats any single letter. And whatever system you choose, publish its cutoffs before the course starts: a grading system students cannot read in advance is not a system, it is a surprise.',
        ],
      },
    ],
    lookupTables: [
      {
        heading: 'The same scores under three letter scales',
        intro: 'Computed with the same scales the letter grade calculator uses. Note how 91% changes letter between scales.',
        columns: ['Score', 'A–F (90/80/70/60)', 'Plus/minus', '7-point (93/85/77/70)'],
        rows: sysTableRows,
      },
    ],
    example: {
      heading: 'Worked example: one score, three letters',
      scenario: 'A student scores 91% on a test. The letter depends entirely on the school’s scale.',
      rows: [
        { label: 'A–F scale (90/80/70/60)', value: percentToLetter(91, SCALE_STANDARD).letter },
        { label: 'Plus/minus scale', value: percentToLetter(91, SCALE_PLUS_MINUS).letter },
        { label: '7-point scale (93/85/77/70)', value: percentToLetter(91, SCALE_SEVEN_POINT).letter },
      ],
      takeaway:
        'Same work, three different letters. Always state the scale beside a letter grade — without it, the letter is ambiguous.',
    },
    faqs: [
      {
        question: 'What is the most common grading system in the US?',
        answer:
          'The A–F letter system with 90/80/70/60 cutoffs, with plus/minus variants common in colleges and 7-point variants common in middle and high schools. Pass/fail appears mainly for electives, and standards-based grading is growing in K-12 without replacing letters on transcripts.',
      },
      {
        question: 'What is standards-based grading?',
        answer:
          'Reporting achievement per learning standard instead of one averaged course grade. A student can exceed one standard, meet another and approach a third, and retakes measure current skill rather than averaging old failures in.',
      },
      {
        question: 'Is pass/fail better than letter grades?',
        answer:
          'For different goals. Pass/fail protects risk-taking and reduces GPA anxiety, but hides distinctions readers of a transcript may need. It suits electives and exploratory courses; it suits a major’s core requirements less well.',
      },
      {
        question: 'Can a school switch grading systems mid-year?',
        answer:
          'It can, but it should publish the new cutoffs and a conversion for work already graded, because students planned under the old rules. Retroactive changes to already-awarded grades are where switches become unfair.',
      },
    ],
    related: [
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Percent to letter on every scale in this guide.' },
      { path: '/blog/when-to-curve-grades/', label: 'When to Curve Grades', blurb: 'Five methods and the fairness checks.' },
      { path: '/gpa-to-letter-grade/', label: 'GPA to letter grade', blurb: 'Convert a GPA back to its letter.' },
      { path: '/for-schools/', label: 'For Schools: free embeds', blurb: 'Put these calculators on your own school website.' },
    ],
  };
}

const hsVsCourses = [
  { name: 'AP Calculus', letter: 'A', credits: 1, level: 'ap' as const },
  { name: 'Honors English', letter: 'B+', credits: 1, level: 'honors' as const },
  { name: 'US History', letter: 'A', credits: 1, level: 'regular' as const },
  { name: 'AP Biology', letter: 'B', credits: 1, level: 'ap' as const },
  { name: 'Spanish II', letter: 'A', credits: 1, level: 'regular' as const },
];
const hsVsResult = calculateWeightedGpa(hsVsCourses, { honors: 0.5, ap: 1.0 })!;
const collegeVsCourses = hsVsCourses.map((c, i) => ({
  ...c,
  credits: [2, 4, 3, 4, 2][i],
  level: 'regular' as const,
}));
const collegeVsResult = calculateWeightedGpa(collegeVsCourses, { honors: 0.5, ap: 1.0 })!;

export function buildHighSchoolVsCollegePost(): ToolPageEntry {
  return {
    slug: 'blog/high-school-vs-college-gpa',
    path: '/blog/high-school-vs-college-gpa/',
    navLabel: 'High school vs college GPA',
    h1: 'High School GPA vs College GPA: What Actually Changes',
    title: 'High School GPA vs College GPA — Credits, Weighting & Targets',
    metaDescription:
      'High school GPA vs college GPA: why the same grades give different GPAs — credit hours, AP and honors weighting, cumulative maths, and the targets that matter in each.',
    badge: 'Student guide',
    schemaType: 'WebPage',
    intro:
      'Students arrive at college expecting their GPA to behave the way it did at school, and it does not: credits replace equal-weighted courses, weighting rules change, and the cumulative maths gets slower every semester. This guide shows exactly what changes, with the same grades computed both ways.',
    keywords: [
      'high school gpa vs college gpa',
      'college gpa vs high school gpa',
      'how is college gpa different',
      'weighted gpa high school vs college',
      'does high school gpa matter in college',
    ],
    featureList: [
      'The same grades computed as HS weighted, HS unweighted and college GPA',
      'Credit hours explained with real numbers',
      'AP and honors weighting, and where it stops applying',
      'Cumulative GPA behaviour by year',
    ],
    sections: [
      {
        heading: 'The three differences that matter',
        paragraphs: [
          'First, credits. High school courses usually count equally — one credit each — so every grade pulls the average equally. College courses carry different credit hours, so a 4-credit A outweighs a 2-credit A by double. Second, weighting. High schools add bonuses for honors and AP courses; colleges generally do not weight by course difficulty in the GPA itself (a college A is 4.0 whether the course was introductory or advanced), though admissions readers absolutely notice rigor separately. Third, the record itself: high school GPA is often reported per year and recomputed by colleges, while college GPA is one cumulative figure that follows you across all four years.',
        ],
      },
      {
        heading: 'Why the same grades give different GPAs',
        paragraphs: [
          'Take five grades — A, B+, A, B, A — and compute them three ways. As an unweighted high school GPA they average 3.66. Add the usual honors (+0.5) and AP (+1.0) bonuses and the weighted high school GPA is 4.16. As a college GPA with credit hours 2/4/3/4/2 and no difficulty bonuses, the same letters give 3.55, because the credits — not the course labels — decide the weight. The letters never changed; only the weighting rules did.',
        ],
      },
      {
        heading: 'Cumulative GPA slows down every year',
        paragraphs: [
          'In high school, each year is a fresh average of that year’s courses, and colleges often recompute from the transcript anyway. In college, every semester joins one cumulative average, so the same strong semester moves a first-year cumulative far more than a final-year one. That is why early semesters deserve disproportionate attention: a weak first year is not erased by a strong final year, it is diluted by it — slowly.',
        ],
      },
      {
        heading: 'What to aim for, in each system',
        paragraphs: [
          'In high school, aim for the strongest unweighted GPA you can pair with the hardest courses you can handle — colleges read both numbers together, and a slightly lower GPA with AP rigor usually beats a perfect GPA with none. In college, aim for consistency in high-credit courses first, because credits are the lever: one A in a 4-credit course is worth two As in 2-credit courses. And in both systems, check the catalog: thresholds for good standing, scholarships and program entry are set by institutions, not by any national table.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: the same five grades, three GPAs',
      scenario: 'Grades A, B+, A, B, A — as a high school record (with AP/honors bonuses) and as a college record (credit hours 2/4/3/4/2, no bonuses).',
      rows: [
        { label: 'High school unweighted GPA', value: hsVsResult.unweighted.toFixed(2) },
        { label: 'High school weighted GPA', value: hsVsResult.weighted.toFixed(2) },
        { label: 'College GPA (credit-weighted)', value: collegeVsResult.unweighted.toFixed(2) },
      ],
      takeaway:
        'Identical letters, three different GPAs. The difference is entirely in the weighting rules — which is why a GPA without its system attached is an incomplete number.',
    },
    faqs: [
      {
        question: 'Does my high school GPA matter in college?',
        answer:
          'For admission, yes — colleges read it alongside course rigor and test scores where used. Once enrolled, your college GPA starts fresh: high school grades do not enter the college cumulative figure.',
      },
      {
        question: 'Is college GPA harder to raise than high school GPA?',
        answer:
          'Usually, because of cumulative maths: each new semester is averaged with all previous credits, so the more credits banked, the slower the cumulative moves. High school yearly averages reset the denominator each year.',
      },
      {
        question: 'Do AP courses boost college GPA?',
        answer:
          'Not directly: colleges generally do not add AP bonuses to the GPA itself. AP work can earn college credit, which changes the courses you take, but an A in a college course is 4.0 regardless of its difficulty.',
      },
      {
        question: 'What GPA should I aim for in college?',
        answer:
          'Around 3.0 keeps most scholarships and programs open; 3.5 and above is strong for competitive graduate programs. The binding thresholds are your school’s and program’s own — check the catalog, then use the target-GPA solver to plan semesters.',
      },
    ],
    related: [
      { path: '/high-school-gpa-calculator/', label: 'High school GPA calculator', blurb: 'Weighted and unweighted, side by side.' },
      { path: '/college-gpa-calculator/', label: 'College GPA calculator', blurb: 'Credit-weighted GPA for college courses.' },
      { path: '/cumulative-gpa-calculator/', label: 'Cumulative GPA calculator', blurb: 'Combine semesters into one GPA.' },
      { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'Honors and AP/IB bonuses.' },
    ],
  };
}

/* ---------- Easy grade calculator guide (keyword-mapped long-form post) ---------- */

const egcRow = (earned: number, possible: number, label: string) => {
  const pct = roundTo((earned / possible) * 100, 1);
  return { label, value: `${pct}% — ${percentToLetter(pct, SCALE_STANDARD).letter}` };
};

const egcLookupRows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10].map((wrong) => {
  const right = 20 - wrong;
  const pct = roundTo((right / 20) * 100, 1);
  return [String(wrong), `${right} out of 20`, `${pct}%`, percentToLetter(pct, SCALE_STANDARD).letter];
});

export function buildEasyGradeCalculatorGuidePost(): ToolPageEntry {
  return {
    slug: 'blog/easy-grade-calculator-guide',
    path: '/blog/easy-grade-calculator-guide/',
    navLabel: 'Easy grade calculator guide',
    h1: 'Easy Grade Calculator Online: A Friendly Guide to Faster, Fairer Grading',
    title: 'Easy Grade Calculator Online — A Free Guide for Teachers',
    metaDescription:
      'How an easy grade calculator online turns scores into percentages and letter grades: formulas, worked examples, half points and what-if planning.',
    badge: 'Complete guide',
    schemaType: 'WebPage',
    intro:
      'An easy grade calculator online does one small job very well: it takes the number of questions and the number of wrong answers, then hands back a percentage and a letter grade. Teachers lean on it to clear a pile of quizzes before the bell, and students use it to double-check a returned test. This guide walks through how the maths works, where the time savings come from, and which slip-ups quietly skew results.',
    keywords: [
      'easy grade calculator online',
      'easy grade calculator free',
      'easy grade calculator for teachers',
      'easy grader for teachers',
      'quick grade calculator',
    ],
    featureList: [
      'Plain-English formulas with worked examples',
      'Half points, points mode and what-if planning',
      'Straight answers to the most common grade questions',
    ],
    sections: [
      {
        heading: 'What a grade calculator really does',
        paragraphs: [
          'Behind the friendly buttons sits one idea: a grade is a fraction wearing a percentage costume. Points earned divided by points possible, multiplied by 100, gives the percent, and a grading scale then turns that percent into a letter. A calculator repeats those steps the same way every single time, which is exactly why it earns more trust than mental arithmetic at the end of a long day.',
        ],
        subsections: [
          {
            heading: 'The formula in plain words',
            paragraphs: [
              'For a test where every question counts the same, the percent is (questions − wrong) ÷ questions × 100. A student who misses 2 questions on a 20-question quiz scores 18 ÷ 20 × 100 = 90%, an A on the common 90/80/70/60 scale. Miss 3 and the score becomes 85%, a B.',
            ],
          },
          {
            heading: 'Why a calculator beats doing it by hand',
            paragraphs: [
              'Long division is easy once and error-prone thirty times in a row. A simple grade calculator removes the repetition, keeps rounding consistent from the first paper to the last, and leaves teachers free to spend their attention on feedback instead of arithmetic.',
            ],
          },
        ],
      },
      {
        heading: 'Who gets the most out of a free grading tool',
        paragraphs: [
          'Grading tools attract three groups of people, and each group uses them a little differently. The searches that bring them in are telling: “easy grade calculator free” almost always means no sign-up, no paywall and no software to install, which is a fair standard to hold any tool to.',
        ],
        subsections: [
          {
            heading: 'Teachers with a stack of papers',
            paragraphs: [
              'An easy grade calculator for teachers earns its keep when one test goes to several classes. The chart is built once for the test length and the grading scale, printed or saved as a PDF, and every paper in every period is then graded by lookup: count the wrong answers, read across the row, write the result. An easy grader for teachers also keeps the scale identical across sections, so two students with the same score always receive the same grade.',
            ],
          },
          {
            heading: 'Students checking a result',
            paragraphs: [
              'A quick grade calculator works just as well on the other side of the desk. A student holding a quiz marked 14 out of 18 can see in seconds that it equals 77.8%, a C on the standard scale, and can then decide how much the next quiz needs to improve. Knowing the number early beats guessing at it.',
            ],
          },
          {
            heading: 'Parents and tutors',
            paragraphs: [
              'Parents and tutors use the same maths to sanity-check a report card or to set a realistic target before an exam. Because the steps are visible, a teacher grade calculator also works as a conversation starter: everyone can see how 17 out of 20 became 85%, instead of taking the number on faith.',
            ],
          },
        ],
      },
      {
        heading: 'Features that make grading faster',
        paragraphs: [
          'Not every calculator copes well with a real classroom. A few features separate the tools that get used every week from the ones abandoned after the first try.',
        ],
        subsections: [
          {
            heading: 'Entering correct answers or wrong answers',
            paragraphs: [
              'Some graders think in answers right, others in answers missed. People who type “easy grade calculator number correct” are usually after the first style: a quick way to enter how many answers a student got right and watch the percentage appear. Both routes land on the same result, because correct answers equal questions minus wrong answers, so the better choice is simply whichever matches how the test was marked.',
            ],
          },
          {
            heading: 'Half points for partial credit',
            paragraphs: [
              'An easy grade calculator with half points handles the answers that deserve something between full marks and zero. On a 20-question quiz, 17.5 correct works out to 87.5%, a B on the standard scale and a B+ on a plus/minus scale. Without half-point support, partial answers have to be rounded up or down one at a time, and those small decisions add up across a class.',
            ],
          },
          {
            heading: 'Points mode for uneven assignments',
            paragraphs: [
              'Not every assignment is built from equal questions. When the worth of each item varies, an easy grade calculator points setting works from points earned out of points possible instead: 42 out of 50 is 84%, a B, whether it came from five long answers or fifty short ones.',
            ],
          },
          {
            heading: 'Installing it like an app',
            paragraphs: [
              'Plenty of teachers grade on a phone or tablet in the staff room. An easy grade calculator app saves a trip to the browser bar, and Easy Grade Tool can be installed to the home screen and keeps working offline once the page has loaded, which helps in classrooms with unreliable wifi.',
            ],
          },
        ],
      },
      {
        heading: 'A worked example from start to finish',
        paragraphs: [
          'Take a 15-question vocabulary quiz graded on the standard scale. One student misses 2 questions, so the score is 13 out of 15, which is 86.7% and a B. Another student misses 4, so 11 out of 15 gives 73.3%, a C. Both numbers come from the same two steps, subtract the misses and divide by the total, and a printed chart simply stores the answer for every possible number of misses.',
          'Plus/minus scales shift the letters but never the percentages: 86.7% stays 86.7%, and the letter it earns depends on the school’s cutoffs. That is why checking the scale before grading matters more than any clever shortcut.',
        ],
      },
      {
        heading: 'Planning ahead with what-if grades',
        paragraphs: [
          'Grades are not only about looking back. For many students the most useful question points forward: what is still needed to finish the course on a particular grade?',
        ],
        subsections: [
          {
            heading: 'How a what if grade calculator works',
            paragraphs: [
              'A what if grade calculator reverses the usual formula. Take a course where coursework is worth 70% of the final grade and the current coursework average is 82%. To finish at 85%, the final exam, worth the remaining 30%, needs (85 − 0.7 × 82) ÷ 0.3 = 92%. Seeing that number in October is far more useful than discovering it in June.',
            ],
          },
          {
            heading: 'Single tests versus the whole course',
            paragraphs: [
              'A test grade calculator answers for one exam. A grade score calculator turns any single result into a percentage and a letter, which suits quizzes and homework. Whole-course questions, such as category weights or a final exam target, belong to the weighted and final-exam planners instead, and choosing the narrowest tool that fits the question keeps the answer clear.',
            ],
          },
        ],
      },
      {
        heading: 'Quick answers to questions people often ask',
        paragraphs: [
          'A handful of questions turn up again and again whenever grades come up. Short, honest answers to the four most common ones follow.',
        ],
        subsections: [
          {
            heading: 'How to easily calculate grade?',
            paragraphs: [
              'Divide the points earned by the points possible, multiply by 100, and compare the result with the grading scale. When every question counts the same, subtract the wrong answers from the total first: 17 correct out of 20 is 17 ÷ 20 × 100 = 85%, a B on the common 90/80/70/60 scale. A calculator repeats those steps instantly, and a printed chart does them once for every possible score.',
            ],
          },
          {
            heading: 'Is 75% a 2.5 GPA?',
            paragraphs: [
              'Usually not. On the common 4.0 scale, 75% is a C, and a C is worth 2.0 grade points. A plus/minus scale keeps 75% in the C band too (roughly 73% to 76%), so the value stays at 2.0. A 2.5 falls between a C+ (2.3) and a B- (2.7), so it tends to appear only when a school uses its own conversion table or averages several courses. The school’s published scale always has the final word.',
            ],
          },
          {
            heading: 'Is 7.6 CGPA first class?',
            paragraphs: [
              'In most Indian universities, yes. First class generally begins at around 60%, and a 7.6 CGPA converts to 72.2% under the common CGPA × 9.5 rule, which clears that line comfortably. It stays under the 75% mark many universities use for distinction, although a university that multiplies by 10 would read the same CGPA as 76%. The university’s own circular decides, and the CGPA to percentage calculator lists formulas for specific universities.',
            ],
          },
          {
            heading: 'What is 70% of a grade?',
            paragraphs: [
              'That depends on what is being asked. As a score, 70% is a C on the standard scale (the very bottom of the C band, and a C- on a plus/minus scale), worth 2.0 grade points. As a share of a number, 70% of 50 points is 35 points. As a weight, a category worth 70% of the final grade counts for more than twice as much as every other category put together.',
            ],
          },
        ],
      },
      {
        heading: 'Mistakes that quietly skew a grade',
        paragraphs: [
          'Most grading errors are small, boring and repeatable, which is what makes them dangerous. The usual suspects:',
        ],
        bullets: [
          'Dividing by the wrong total, for example 19 instead of 20 after a question was dropped.',
          'Rounding early on some papers and late on others.',
          'Using the wrong scale, such as 90/80/70/60 for a class graded on a 7-point scale.',
          'Treating half-credit answers as full or zero without telling anyone.',
          'Dropping equal-weight chart results straight into a weighted course grade.',
        ],
        subsections: [
          {
            heading: 'One scale, one rounding rule, one chart',
            paragraphs: [
              'Consistent easy grade calculator grading removes most of these in a single move. When the whole stack shares one scale, one rounding rule and one chart, there is exactly one place an error could hide, and it can be checked before the first paper is marked.',
            ],
          },
        ],
      },
      {
        heading: 'How to pick a tool that stays easy',
        paragraphs: [
          'The best grading tool is the one that fades into the background. A few quick checks show whether a calculator will do that.',
        ],
        subsections: [
          {
            heading: 'Look for plain answers',
            paragraphs: [
              'An easy to use calculator online should show how it reached the answer, not just the answer itself. A visible formula, a clear scale and a printable result make a real difference when a student or parent asks why a score became a particular letter.',
            ],
          },
          {
            heading: 'Choose teacher-first features',
            paragraphs: [
              'Searches for an easy grader calculator for teachers tend to be about speed and fairness: charts for any test length, custom cutoffs and no account to create. An easy grader calculator online that offers those, works on a phone and costs nothing is hard to beat. Some teachers say ez grade calculator, others say simple grade calculator, and the best tools answer to every name without making anyone learn new vocabulary.',
            ],
          },
          {
            heading: 'Test it on a real quiz',
            paragraphs: [
              'The simplest check is to run one past test through the tool and compare the result with a hand calculation. If the numbers match and the scale is the one the school uses, the tool is ready for the stack. The Quick Grade chart on the Easy Grade Tool homepage builds the chart for any test length from 1 to 1,000 questions and accepts custom cutoffs.',
            ],
          },
        ],
      },
    ],
    lookupTables: [
      {
        heading: 'Quick lookup: every score on a 20-question quiz',
        intro: 'Standard 90/80/70/60 scale. Each row is worked out with the same formula the calculators use.',
        columns: ['Wrong answers', 'Score', 'Percent', 'Letter'],
        rows: egcLookupRows,
      },
    ],
    example: {
      heading: 'The numbers from this guide in one place',
      scenario: 'Standard 90/80/70/60 scale. Every row is computed with the same formulas the calculators use.',
      rows: [
        egcRow(18, 20, '18 out of 20'),
        egcRow(17, 20, '17 out of 20'),
        egcRow(17.5, 20, '17.5 out of 20 (half points)'),
        egcRow(14, 18, '14 out of 18'),
        egcRow(42, 50, '42 out of 50'),
      ],
      takeaway: 'Every result comes from the same two steps: divide points earned by points possible, then read the letter from the scale.',
    },
    faqs: [
      {
        question: 'Is a grade calculator accurate enough for report cards?',
        answer:
          'The arithmetic is exact; what needs checking is the scale. A teacher grade calculator is only as accurate as the cutoffs loaded into it, so the safest habit is to match the scale to the school’s published policy and test one known score by hand before grading the whole stack.',
      },
      {
        question: 'Does the calculator save student names or scores?',
        answer:
          'No. Results are worked out in the browser, and the tools need no account or sign-up, so nothing about a class has to be uploaded or stored to get an answer.',
      },
      {
        question: 'How many questions can the chart cover?',
        answer:
          'The Quick Grade chart on the homepage builds a chart for any test from 1 to 1,000 questions with custom cutoffs, and the grading scale pages hold ready-made printable charts for common lengths from 5 to 100 questions.',
      },
      {
        question: 'How does a single-score calculator differ from a GPA calculator?',
        answer:
          'A grade score calculator turns one result into a percentage and a letter. A GPA calculator averages the grade points from many courses, weighted by credits where needed. The first answers how a single test went, the second answers how the whole term is going.',
      },
    ],
    related: [
      { path: '/', label: 'Quick Grade chart', blurb: 'Build the chart for any test size, 1–1000 questions.' },
      { path: '/test-grade-calculator/', label: 'Test score and letter grade', blurb: 'Points earned out of points possible, with bonus points.' },
      { path: '/final-grade-planner/', label: 'Final exam planner', blurb: 'What each class needs on the final to reach a target.' },
      { path: '/cgpa-to-percentage-calculator/', label: 'CGPA to percentage', blurb: 'Formulas for 10-point CGPA conversions.' },
      { path: '/blog/how-to-grade-30-tests-in-15-minutes/', label: 'How to Grade a Stack of 30 Tests in 15 Minutes', blurb: 'The chart-first workflow that turns grading into lookup.' },
    ],
  };
}
