import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from './SlashLink';
import { ToolHeading } from './ToolHeading';
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

const SOLVER_INPUT = 'field text-center text-lg font-bold tabular-nums';
const SOLVER_LABEL = 'field-label';

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
      ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800/60'
      : 'bg-brand-soft border-brand-line shadow-sm';

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
      className="bg-surface rounded-2xl border border-line/80 shadow-sm dark:shadow-none relative overflow-hidden p-6 sm:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-line/60">
        <div>
          <div className="flex items-center gap-2 text-xs tabular-nums font-bold text-brand-ink mb-1">
            <Target className="w-4 h-4" aria-hidden="true" />
            <span>Target Final Exam Solver</span>
          </div>
          <h2 className="m-0">
            Calculate Needed Final Exam Score
          </h2>
        </div>
        <div className="text-xs tabular-nums px-3 py-2 rounded-full bg-surface border border-brand-line text-brand-ink font-semibold">
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
          <p className="text-xs text-ink-2 m-0">From 1 to 100. Use 100 if the final is the whole grade.</p>
        </div>
      </div>

      <label className="inline-flex items-center gap-3 min-h-[48px] text-sm font-medium text-ink cursor-pointer select-none">
        <input
          type="checkbox"
          checked={extraCredit}
          onChange={(e) => setExtraCredit(e.target.checked)}
          className="w-6 h-6 accent-brand-600"
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

      <div className={`p-5 rounded-xl border transition-all ${tone}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div role="status" aria-live="polite" aria-atomic="true">
            <div className="text-xs tabular-nums text-brand-ink">
              Required Score on Final Exam
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-brand-ink tabular-nums mt-1">
              {headline}
            </div>
            <p className="text-sm text-brand-ink/90 mt-1 font-medium">{message}</p>
          </div>
          {valid && (
            <div className="shrink-0 p-4 rounded-xl bg-surface shadow-sm border border-line text-xs tabular-nums space-y-1">
              <div className="text-ink-2">
                Banked: <strong className="text-ink">{result.banked.toFixed(1)} pts</strong>
              </div>
              <div className="text-ink-2">
                Max Possible: <strong className="text-ink">{result.maxPossible.toFixed(1)}%</strong>
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
          'Required Final Exam Score from Current Grade, Exam Weight and Target Grade',
          'Percent and Points Methods with Step-by-Step Worked Examples',
          'Extra Credit, Secured and Out-of-Reach Target Detection',
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

      <div className="programmatic-calc-wrapper flex flex-col gap-8 sm:gap-10">
        {/* Hero banner: same slate banner as every other tool page */}
        <ToolHeading badge="Final Grade Calculator" title={entry.h1} description={entry.intentContext} />

        {/* Interactive Workspace */}
        <section aria-label="Interactive Workspace" className="w-full">
          <>
              {/* Dedicated Required-Final-Score Solver (Top Screen Match) */}
              <FinalExamTargetSolver setToast={setToast} />

              <div className="pt-2 pb-6 flex items-center justify-between text-xs text-ink-3 tabular-nums">
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
          className="card flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            <span className="text-xs font-bold text-ink-2 tabular-nums">
              Academic Calculation Suite:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <Link
              to="/grade-calculator"
              className="inline-flex items-center min-h-[48px] px-4 py-2 rounded-xl bg-surface border border-line text-ink-2 hover:border-brand-500 hover:text-brand transition-all shadow-xs"
            >
              Weighted Grade Calculator
            </Link>
            <Link
              to="/gpa-calculator"
              className="inline-flex items-center min-h-[48px] px-4 py-2 rounded-xl bg-surface border border-line text-ink-2 hover:border-brand-500 hover:text-brand transition-all shadow-xs"
            >
              4.0 GPA Calculator
            </Link>
            <Link
              to="/cgpa-to-percentage-calculator"
              className="inline-flex items-center min-h-[48px] px-4 py-2 rounded-xl bg-surface border border-line text-ink-2 hover:border-brand-500 hover:text-brand transition-all shadow-xs"
            >
              CGPA to Percentage
            </Link>
            <Link
              to="/"
              className="inline-flex items-center min-h-[48px] px-4 py-2 rounded-xl bg-surface border border-line text-ink-2 hover:border-brand-500 hover:text-brand transition-all shadow-xs"
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
