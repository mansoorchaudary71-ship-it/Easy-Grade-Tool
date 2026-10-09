import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from './SlashLink';
import { Target, GraduationCap } from 'lucide-react';
import {
  resolveProgrammaticSeo,
  ProgrammaticSeoEntry,
} from '../data/programmaticSeoData';
import { SEO } from './SEO';
import { GradeCalculator } from './GradeCalculator';
import { BASE_CANONICAL_ORIGIN } from '../data/constants';
import { FAQ, PAGE_FAQ_HEADINGS } from './FAQ';
import { ToolContentGuide } from './ToolContentGuide';
import { solveFinalExam } from '../utils/finalExam';

export interface ProgrammaticCalculatorViewProps {
  setToast: (msg: string) => void;
  presetSlug?: string;
}

const SOLVER_INPUT =
  'w-full min-h-[48px] bg-[#F4F6F9] dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 text-stone-900 dark:text-white rounded-[20px] px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-stone-900 dark:focus:ring-teal-400 focus:border-stone-900 dark:focus:border-teal-400 transition-all font-bold text-lg font-mono text-center shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400';
const SOLVER_LABEL =
  'text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider block';

const FinalExamTargetSolver: React.FC<{ setToast: (msg: string) => void }> = ({ setToast: _setToast }) => {
  const [currentGrade, setCurrentGrade] = useState<string>('84');
  const [targetGrade, setTargetGrade] = useState<string>('90');
  const [finalWeight, setFinalWeight] = useState<string>('25');
  const [extraCredit, setExtraCredit] = useState<boolean>(false);

  // Real validation: a blank or zero field never turns into a hidden default.
  const result = solveFinalExam({
    current: currentGrade,
    target: targetGrade,
    weight: finalWeight,
    maxFinal: extraCredit ? 120 : 100,
  });

  const valid = result.status !== 'invalid';
  const tone =
    result.status === 'unreachable'
      ? 'bg-[#F9D6E1] dark:bg-rose-950/60 border-[#EDA3BB] dark:border-rose-800/60'
      : 'bg-[#CFE9DF] dark:bg-teal-950/60 border-[#96CDB8] dark:border-teal-800/60 shadow-sm';

  let headline = '—';
  let message = 'Fill in all three boxes to see the score you need.';
  if (result.status === 'ok') {
    headline = `${result.required.toFixed(1)}%`;
    message = `Score at least ${result.required.toFixed(1)}% on the final exam to reach ${parseFloat(targetGrade)}%.`;
  } else if (result.status === 'secured') {
    headline = '0%';
    message = `Already secured: your ${result.banked.toFixed(1)} banked points reach the target even with 0% on the final.`;
  } else if (result.status === 'unreachable') {
    headline = `${result.required.toFixed(1)}%`;
    message = `That is above the ${extraCredit ? '120' : '100'}% the final can earn. The highest course grade you can reach is ${result.maxPossible.toFixed(1)}%.`;
  }

  return (
    <section
      aria-label="Target Final Exam Solver"
      className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 mb-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-200/60 dark:border-teal-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 mb-1">
            <Target className="w-4 h-4" aria-hidden="true" />
            <span>Target Final Exam Solver</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">
            Calculate Needed Final Exam Score
          </h2>
        </div>
        <div className="text-xs font-mono px-3 py-2 rounded-full bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-700 text-teal-900 dark:text-teal-300 font-semibold">
          Formula: (Target − Banked) ÷ Final Weight
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="target-solver-current" className={SOLVER_LABEL}>Current Course Grade (%)</label>
          <input
            id="target-solver-current"
            type="text"
            inputMode="decimal"
            enterKeyHint="next"
            value={currentGrade}
            onChange={(e) => setCurrentGrade(e.target.value)}
            className={SOLVER_INPUT}
            placeholder="84"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="target-solver-target" className={SOLVER_LABEL}>Desired Final Grade (%)</label>
          <input
            id="target-solver-target"
            type="text"
            inputMode="decimal"
            enterKeyHint="next"
            value={targetGrade}
            onChange={(e) => setTargetGrade(e.target.value)}
            className={SOLVER_INPUT}
            placeholder="90"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="target-solver-weight" className={SOLVER_LABEL}>Final Exam Weight (%)</label>
          <input
            id="target-solver-weight"
            type="text"
            inputMode="decimal"
            enterKeyHint="done"
            value={finalWeight}
            onChange={(e) => setFinalWeight(e.target.value)}
            className={SOLVER_INPUT}
            placeholder="25"
          />
          <p className="text-xs text-slate-600 dark:text-slate-400 m-0">From 1 to 100. Use 100 if the final is the whole grade.</p>
        </div>
      </div>

      <label className="inline-flex items-center gap-3 min-h-[48px] text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={extraCredit}
          onChange={(e) => setExtraCredit(e.target.checked)}
          className="w-6 h-6 accent-teal-600"
        />
        <span>The final has extra credit (allow up to 120%)</span>
      </label>

      {result.status === 'invalid' && (
        <ul className="m-0 pl-5 list-disc text-sm text-rose-700 dark:text-rose-400" role="alert">
          {result.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <div className={`p-5 rounded-[24px] border transition-all ${tone}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div role="status" aria-live="polite" aria-atomic="true">
            <div className="text-xs font-mono uppercase tracking-wider text-teal-900 dark:text-teal-300">
              Required Score on Final Exam
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-950 dark:text-teal-100 font-mono mt-1">
              {headline}
            </div>
            <p className="text-sm text-teal-950/90 dark:text-teal-100/90 mt-1 font-medium">{message}</p>
          </div>
          {valid && (
            <div className="shrink-0 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-stone-100 dark:border-slate-700 text-xs font-mono space-y-1">
              <div className="text-slate-700 dark:text-slate-300">
                Banked: <strong className="text-slate-900 dark:text-white">{result.banked.toFixed(1)} pts</strong>
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                Max Possible: <strong className="text-slate-900 dark:text-white">{result.maxPossible.toFixed(1)}%</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const ProgrammaticCalculatorView: React.FC<ProgrammaticCalculatorViewProps> = ({
  setToast,
  presetSlug,
}) => {
  const params = useParams<{ slug?: string }>();
  const rawSlug = presetSlug || params.slug || 'final-exam-grade-calculator';
  const entry: ProgrammaticSeoEntry = resolveProgrammaticSeo(rawSlug);

  const canonicalUrl = `${BASE_CANONICAL_ORIGIN}${entry.path}`;
  return (
    <>
      <SEO
        title={entry.title}
        description={entry.metaDescription}
        canonicalUrl={canonicalUrl}
        applicationCategory="EducationalApplication"
        featureList={[
          `${entry.h1} Engine`,
          'Step-by-Step Mathematical Walkthrough',
          'Interactive Target Solver',
          'Print & PDF Friendly Format',
          'Zero Account Needed & 100% Client-Side Privacy',
        ]}
        keywords={[
          entry.h1.toLowerCase(),
          'final exam grade calculator',
          'ez grader online',
          'test scoring chart',
          'target grade simulator',
        ]}
      />

      <div className="programmatic-calc-wrapper w-full max-w-5xl mx-auto space-y-8">
        {/* Hero Header */}
        <header className="p-6 sm:p-8 bg-gradient-to-r from-slate-50/95 to-teal-50/80 dark:from-slate-900/95 dark:to-slate-800/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {entry.h1}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-3xl leading-relaxed">
            {entry.intentContext}
          </p>
        </header>

        {/* Interactive Workspace */}
        <section aria-label="Interactive Workspace" className="w-full">
          <>
              {/* Dedicated Required-Final-Score Solver (Top Screen Match) */}
              <FinalExamTargetSolver setToast={setToast} />

              <div className="pt-2 pb-6 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Want to break down your grades by category? Use the full course syllabus solver below:</span>
              </div>

              <GradeCalculator
                key={entry.slug}
                setToast={setToast}
                initialItems={entry.initialAssessments}
                initialMode={entry.mode}
                initialScale={entry.scale}
                initialCourseName={entry.courseName}
                hideHeading={true}
                hideSeo={true}
              />
          </>
        </section>

        <ToolContentGuide guide="final-exam" />

        {/* FAQ: same component and UI as every other tool; schema comes from the same entry.customFaqs */}
        <FAQ tool="quick" items={entry.customFaqs} heading={PAGE_FAQ_HEADINGS['final-exam-grade-calculator']} />

        {/* Streamlined Internal Linking Cluster */}
        <nav
          aria-label="Related Academic Calculators"
          className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
              Academic Calculation Suite:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <Link
              to="/grade-calculator"
              className="inline-flex items-center min-h-[48px] px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-2xs"
            >
              Weighted Grade Calculator
            </Link>
            <Link
              to="/gpa-calculator"
              className="inline-flex items-center min-h-[48px] px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-2xs"
            >
              4.0 GPA Calculator
            </Link>
            <Link
              to="/cgpa-to-percentage-calculator"
              className="inline-flex items-center min-h-[48px] px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-2xs"
            >
              CGPA to Percentage
            </Link>
            <Link
              to="/"
              className="inline-flex items-center min-h-[48px] px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-2xs"
            >
              Quick Grade Chart
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default ProgrammaticCalculatorView;
