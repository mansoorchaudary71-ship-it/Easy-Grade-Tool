import React from 'react';
import { Link } from './SlashLink';
import { HOME_FAQS } from '../data/homeContent';
import { SemanticGuideImage } from './SemanticGuideImage';
import { ContentSection } from './GuideShell';
import { FAQ, FaqHeading } from './FAQ';

const MORE = [
  { to: '/grade-calculator/', title: 'Weighted grade calculator', text: 'Combine homework, quizzes and exams into a course grade.' },
  { to: '/final-exam-grade-calculator/', title: 'Final exam calculator', text: 'Find the score you need on the final for your target grade.' },
  { to: '/test-grade-calculator/', title: 'Test grade calculator', text: 'Percentage and letter for one test, with bonus points.' },
  { to: '/grade-curve-calculator/', title: 'Grade curve calculator', text: 'Four curving methods with before and after scores.' },
  { to: '/letter-grade-calculator/', title: 'Letter grade calculator', text: 'Percent to letter and GPA points on common scales.' },
  { to: '/gpa-calculator/', title: 'GPA calculator', text: 'Semester and cumulative GPA with credit hours.' },
  { to: '/cgpa-to-percentage-calculator/', title: 'CGPA to percentage', text: '10, 5 and 4-point conversions by university.' },
];

const H2_MAIN = 'text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 tracking-tight';
const H2 = 'text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight';
const H3 = 'text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100';
const P = 'text-slate-600 dark:text-slate-300 leading-relaxed mb-4';
const UL = 'list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed mb-4';
const OL = 'list-decimal pl-6 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed mb-4';
const A = 'text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600';

const HOME_FAQ_HEADING: FaqHeading = {
  eyebrow: 'Quick Grade FAQs',
  title: 'Quick Grade FAQ',
  description: 'Short answers on the Quick Grade (EZ Grader) chart, the percentage formula, grading scales and printing.',
  ctaText: 'Enter your number of questions above to see the full percentage and letter grade chart.',
};

/** Homepage guide: what an EZ grader chart is, easy grader vs manual grading, free tools for teachers, then the FAQ. */
export const QuickGradeGuide: React.FC = () => (
  <>
    <ContentSection labelledBy="home-guide-title">
      <div>
        <h2 id="home-guide-title" className={H2_MAIN}>
          Easy Grade Calculator: Free Easy Grader Tool and EZ Grader Chart
        </h2>

        <div className="my-6">
          <SemanticGuideImage
            toolKey="quick"
            alt="Study desk with a notebook of grades, a scientific calculator and a laptop for scoring tests"
          />
        </div>

        <p className={P}>
          This <strong>easy grade calculator</strong> is a free <strong>easy grader tool</strong> built for the
          moment a stack of tests lands on your desk: an <strong>easy grader for teachers</strong> that turns the number
          of questions into an EZ grader chart, with the percentage and letter grade for every possible number of wrong
          answers, ready to look up or print. Students can use the same chart to check a score, and the tools below
          cover weighted grades, final exams and GPA.
        </p>
      </div>

      <div>
        <h2 className={H2}>EZ Grader Chart Explained</h2>

        <h3 className={H3}>What is an EZ grader chart?</h3>
        <p className={P}>
          An EZ grader chart is a score table for one test size. Each row shows a number of wrong answers with the
          matching percentage and letter grade, so nobody has to divide on every paper. The classic version is a
          cardboard wheel; this one is a digital chart that adjusts to any number of questions and any grading scale.
        </p>

        <h3 className={H3}>How do teachers use an EZ grader?</h3>
        <ol className={OL}>
          <li>Count the questions on the test and enter that number above.</li>
          <li>Pick the standard A–F scale or the plus/minus scale, or set your own cutoffs.</li>
          <li>Count the wrong answers on each paper and find that row in the chart.</li>
          <li>Write the percentage and letter grade on the paper, or print the chart and keep it beside you.</li>
        </ol>

        <h3 className={H3}>Printable grader chart</h3>
        <p className={P}>
          Press Print chart (or Download PDF) for a clean one-page <strong>printable grader chart</strong> without the site navigation. For
          a ready-made chart at a fixed size, open the{' '}
          <Link to="/grading-scale/" className={A}>grading scale charts by number of questions</Link>.
        </p>

        <h3 className={H3}>From wrong answers to percentage</h3>
        <p className={P}>
          The chart uses one formula: (questions − wrong answers) ÷ questions × 100. On a 20-question test, 2 wrong
          answers gives 18 ÷ 20 × 100 = 90%. To grade a test where questions have different point values, use the{' '}
          <Link to="/test-grade-calculator/" className={A}>test grade calculator</Link> instead.
        </p>
      </div>

      <div>
        <h2 className={H2}>Easy Grader vs. Manual Grading</h2>

        <h3 className={H3}>Manual test grading</h3>
        <p className={P}>
          Manual test grading means working out each score by hand: subtract the wrong answers, divide by the number of
          questions, multiply by 100, then look up the letter. It is simple for one paper and slow and error-prone for a
          class of thirty, especially when the test size changes from quiz to quiz.
        </p>

        <h3 className={H3}>Printable grading chart vs grading by hand</h3>
        <p className={P}>
          A printable grading chart does the arithmetic once, in advance. You look up the number of wrong answers instead
          of recalculating, so every student with the same score gets exactly the same percentage and letter. Grading
          by hand still makes sense for essays and rubric work, where the score comes from your judgment rather than a
          count.
        </p>

        <h3 className={H3}>Is an online grader faster than grading by hand?</h3>
        <p className={P}>
          For objective tests, yes. Looking up a row takes a few seconds, while repeating the division and the letter
          conversion for every paper takes much longer and invites rounding slips. An online grader also keeps the
          grading scale consistent across all your classes.
        </p>

        <h3 className={H3}>What is the easiest way for a teacher to grade tests?</h3>
        <p className={P}>
          The easiest way is to build the chart before you start: choose the test size and scale, print the chart, then
          mark each paper by counting wrong answers and reading across. Use a calculator only for the cases a chart
          cannot cover, such as bonus points, weighted categories or a late penalty.
        </p>
      </div>

      <div>
        <h2 className={H2}>Best Free Grading Tools for Teachers</h2>
        <p className={P}>
          The best free grading tools for teachers share a few traits: they need no account, they run in the browser,
          they let you set your own grading scale, and they do not upload student scores anywhere. Easy Grade Tool works
          that way: calculations stay on your device and nothing you enter is stored on a server.
        </p>

        <h3 className={H3}>What is the best free grading tool for teachers?</h3>
        <p className={P}>
          It depends on the job. For grading a stack of multiple-choice tests, a chart-based easy grader is the fastest.
          For a semester grade, a weighted grade calculator is the right fit, and for curving a hard exam you want a
          curve calculator. Here is how the free tools on this site match the common jobs:
        </p>
        <ul className={UL}>
          <li>Grading one test at a time: the EZ grader chart above or the test grade calculator.</li>
          <li>Course grades with categories: the weighted grade calculator.</li>
          <li>Hard exam, low scores: the grade curve calculator.</li>
          <li>Printing a reference sheet for the class: the grading scale charts.</li>
        </ul>

        <h3 className={H3}>Best grade calculator for teachers</h3>
        <p className={P}>
          A good grade calculator for teachers handles both single tests and whole courses, and shows its formula so you
          can check the math. Use the weighted grade calculator for category weights, then the average grade calculator
          when you need a class mean, median and letter grade for a set of scores.
        </p>

        <h3 className={H3}>Online grader for classroom tests</h3>
        <p className={P}>
          An online grader for classroom tests should work on any device, including the phone you carry between rooms.
          This site installs as an app and keeps working offline once loaded, so you can grade in a room with no
          Wi-Fi.
        </p>

        <h3 className={H3}>EZ grader vs online grade calculator</h3>
        <p className={P}>
          An EZ grader chart lists every possible score for one test size, so it is built for speed across many papers.
          An online grade calculator takes any set of points and weights and computes one result at a time, so it is
          built for flexibility. Teachers usually want both, which is why they live side by side here.
        </p>
      </div>

      <div>
        <h2 className={H2}>How Grades Connect Across Tools</h2>
        <p className={P}>
          A test percentage becomes one assessment in a weighted course grade, and the course letter feeds your GPA.
          Start with the chart or test grade calculator, move to the weighted grade calculator for the course, use the
          final exam calculator to plan the last assessment, and take the letters to the GPA calculator for a semester
          or cumulative GPA.
        </p>
      </div>
    </ContentSection>

    <div className="guide-shell print:hidden space-y-3" style={{ marginTop: '3rem' }}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white m-0">More grade calculators</h2>
      <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
        {MORE.map((m) => (
          <li key={m.to}>
            <Link to={m.to} className="glow-surface block h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-teal-600 transition-colors no-underline">
              <span className="block font-bold text-slate-900 dark:text-white">{m.title}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400">{m.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>

    <FAQ tool="quick" items={HOME_FAQS} heading={HOME_FAQ_HEADING} />
  </>
);

export default QuickGradeGuide;
