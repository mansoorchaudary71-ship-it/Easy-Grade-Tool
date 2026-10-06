import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from './SlashLink';
import { HOME_FAQS } from '../data/homeContent';

const MORE = [
  { to: '/grade-calculator/', title: 'Weighted grade calculator', text: 'Combine homework, quizzes and exams into a course grade.' },
  { to: '/final-exam-grade-calculator/', title: 'Final exam calculator', text: 'Find the score you need on the final for your target grade.' },
  { to: '/test-grade-calculator/', title: 'Test grade calculator', text: 'Percentage and letter for one test, with bonus points.' },
  { to: '/grade-curve-calculator/', title: 'Grade curve calculator', text: 'Four curving methods with before and after scores.' },
  { to: '/letter-grade-calculator/', title: 'Letter grade calculator', text: 'Percent to letter and GPA points on common scales.' },
  { to: '/gpa-calculator/', title: 'GPA calculator', text: 'Semester and cumulative GPA with credit hours.' },
  { to: '/cgpa-to-percentage-calculator/', title: 'CGPA to percentage', text: '10, 5 and 4-point conversions by university.' },
  { to: '/ez-grader/', title: 'EZ Grader chart', text: 'The full printable EZ grader table for classroom tests.' },
];

/** Lean homepage guide: one intent (grade a test fast), a worked example, FAQ, and links to every academic tool. */
export const QuickGradeGuide: React.FC = () => (
  <section className="seo-content w-full max-w-4xl mx-auto mt-12 mb-16 px-4 space-y-10 content-auto print:hidden" aria-labelledby="home-guide-title">
    <div className="space-y-3 max-w-3xl">
      <h2 id="home-guide-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
        How to use the Quick Grade chart
      </h2>
      <ol className="list-decimal pl-5 space-y-1.5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
        <li>Enter the number of questions on the test, or tap a preset (10, 20, 25, 50, 100).</li>
        <li>Find the row for the number of questions a student missed and read the percentage and letter.</li>
        <li>Press Print Chart to keep the sheet beside you while you grade.</li>
      </ol>
      <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 m-0">
        Each wrong answer costs the same share of the grade: 100 ÷ number of questions. On a 20-question test every miss
        is worth 5 percentage points, so 2 wrong is 90% (an A on the standard scale) and 4 wrong is 80% (a B).
      </p>
      <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 m-0">
        Cutoffs differ between schools. The default is A 90, B 80, C 70, D 60; switch to plus/minus or set your own under
        Customize Scale Cutoffs. For one student’s course grade across many assignments, use the{' '}
        <Link to="/grade-calculator/" className="underline font-semibold">weighted grade calculator</Link>.
      </p>
    </div>

    <div className="space-y-3">
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

    <div className="space-y-3 max-w-3xl" aria-label="Frequently asked questions">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white m-0">Quick Grade FAQ</h2>
      <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {HOME_FAQS.map((f) => (
          <details key={f.id} className="group px-5 py-4">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-slate-900 dark:text-white">
              <span>{f.question}</span>
              <ChevronDown className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="mt-2 mb-0 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{f.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default QuickGradeGuide;
