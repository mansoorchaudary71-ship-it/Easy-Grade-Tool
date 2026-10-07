import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from './SlashLink';
import {
  Calculator,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Target,
  GraduationCap,
} from 'lucide-react';
import {
  resolveProgrammaticSeo,
  ProgrammaticSeoEntry,
} from '../data/programmaticSeoData';
import { SEO } from './SEO';
import { GradeCalculator } from './GradeCalculator';
import { BASE_CANONICAL_ORIGIN } from '../data/constants';
import { FAQ, PAGE_FAQ_HEADINGS } from './FAQ';

export interface ProgrammaticCalculatorViewProps {
  setToast: (msg: string) => void;
  presetSlug?: string;
}

const FinalExamTargetSolver: React.FC<{ setToast: (msg: string) => void }> = ({ setToast }) => {
  const [currentGrade, setCurrentGrade] = useState<string>('84');
  const [targetGrade, setTargetGrade] = useState<string>('90');
  const [finalWeight, setFinalWeight] = useState<string>('25');

  const curr = parseFloat(currentGrade) || 0;
  const target = parseFloat(targetGrade) || 0;
  const weight = parseFloat(finalWeight) || 25;

  const fWeightRatio = Math.max(0.01, Math.min(0.99, weight / 100));
  const banked = curr * (1 - fWeightRatio);
  const needed = (target - banked) / fWeightRatio;
  const maxPossible = banked + 100 * fWeightRatio;

  const isImpossible = needed > 100;
  const isLocked = needed <= 0;

  return (
    <section
      aria-label="Target Final Exam Solver"
      className="bg-white rounded-[32px] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden p-6 sm:p-8 mb-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-200/60 dark:border-teal-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 mb-1">
            <Target className="w-4 h-4" />
            <span>Target Final Exam Solver</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">
            Calculate Needed Final Exam Score
          </h2>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-700 text-teal-800 dark:text-teal-300 font-semibold shadow-2xs">
          Formula: (Target − Banked) ÷ Final Weight
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="target-solver-current" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Current Course Grade (%)
          </label>
          <input
            id="target-solver-current"
            type="number"
            min="0"
            max="120"
            step="0.1"
            value={currentGrade}
            onChange={(e) => setCurrentGrade(e.target.value)}
            className="w-full bg-[#F4F6F9] border border-stone-200/80 text-stone-900 rounded-[20px] px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all font-bold text-lg font-mono text-center shadow-inner"
            placeholder="84"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="target-solver-target" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Desired Final Grade (%)
          </label>
          <input
            id="target-solver-target"
            type="number"
            min="0"
            max="120"
            step="0.1"
            value={targetGrade}
            onChange={(e) => setTargetGrade(e.target.value)}
            className="w-full bg-[#F4F6F9] border border-stone-200/80 text-stone-900 rounded-[20px] px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all font-bold text-lg font-mono text-center shadow-inner"
            placeholder="90"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="target-solver-weight" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Final Exam Weight (%)
          </label>
          <input
            id="target-solver-weight"
            type="number"
            min="1"
            max="99"
            step="1"
            value={finalWeight}
            onChange={(e) => setFinalWeight(e.target.value)}
            className="w-full bg-[#F4F6F9] border border-stone-200/80 text-stone-900 rounded-[20px] px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all font-bold text-lg font-mono text-center shadow-inner"
            placeholder="25"
          />
        </div>
      </div>

      {/* Result Display Banner - Primary Highlight */}
      <div className={`p-5 rounded-[24px] border transition-all ${
        isImpossible
          ? 'bg-[#F9D6E1] border-[#EDA3BB] text-rose-950'
          : 'bg-[#CFE9DF] border-[#96CDB8] shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-teal-800">
              Required Score on Final Exam
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-950 font-mono mt-1">
              {needed.toFixed(1)}%
            </div>
            <p className="text-xs sm:text-sm text-teal-900/80 mt-1 font-medium">
              {isImpossible
                ? `You would need ${needed.toFixed(1)}%, which is impossible without extra credit; the highest grade you can reach is ${maxPossible.toFixed(1)}%.`
                : isLocked
                ? `You already have ${banked.toFixed(1)} points banked! Your target of ${target.toFixed(1)}% is mathematically locked in even with a 0% on the final.`
                : `Score at least ${needed.toFixed(1)}% on the final exam to secure your target grade of ${target.toFixed(1)}%.`}
            </p>
          </div>
          <div className="shrink-0 p-4 rounded-xl bg-white shadow-sm border border-stone-100 text-xs font-mono space-y-1">
            <div className="text-slate-700">Banked: <strong className="text-slate-900">{banked.toFixed(1)} pts</strong></div>
            <div className="text-slate-700">Max Possible: <strong className="text-slate-900">{maxPossible.toFixed(1)}%</strong></div>
          </div>
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

        {/* Who This Is For vs General Calculator */}
        <section
          aria-labelledby="comparison-heading"
          className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono mb-2">
            <Target className="w-4 h-4 text-teal-600" />
            <span>Audience &amp; Tool Purpose</span>
          </div>
          <h2
            id="comparison-heading"
            className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-4"
          >
            {entry.audienceComparison.heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                Target Audience &amp; Use Case
              </h3>
              <p>{entry.audienceComparison.whoItIsFor}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-teal-600 shrink-0" />
                Mathematical Difference
              </h3>
              <p>{entry.audienceComparison.howItDiffers}</p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Need standard weighted grading or point tracking instead?
            </span>
            <Link
              to={entry.audienceComparison.parentLinkPath}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline transition-colors"
            >
              <span>Switch to {entry.audienceComparison.parentLinkText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Step-by-Step Worked Calculation Example */}
        <section
          aria-labelledby="worked-example-heading"
          className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-6"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono mb-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Pedagogical Math Guide</span>
            </div>
            <h2
              id="worked-example-heading"
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight"
            >
              {entry.workedExample.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {entry.workedExample.scenario}
            </p>
          </div>

          {/* Given Inputs Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th scope="col" className="px-4 py-3">Parameter</th>
                  <th scope="col" className="px-4 py-3">Example Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {entry.workedExample.inputs.map((inp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300 font-medium">{inp.label}</td>
                    <td className="px-4 py-2.5 text-teal-700 dark:text-teal-400 font-semibold font-mono">{inp.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {entry.workedExample.steps.map((st, sIdx) => (
              <div
                key={sIdx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {st.step}
                </h3>
                {st.formula && (
                  <div className="text-xs font-mono bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 px-3 py-1.5 rounded-lg border border-teal-100 dark:border-teal-900/50 inline-block">
                    Formula: {st.formula}
                  </div>
                )}
                <p className="text-xs sm:text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {st.math}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Outcomes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {entry.workedExample.outcomes.map((out, oIdx) => (
              <div
                key={oIdx}
                className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/55 border border-teal-200/80 dark:border-teal-900/60"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  {out.label}
                </span>
                <div className="text-lg font-extrabold text-teal-900 dark:text-teal-200 font-mono mt-0.5 mb-1.5">
                  {out.result}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {out.commentary}
                </p>
              </div>
            ))}
          </div>
        </section>

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
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-2xs"
            >
              Weighted Grade Calculator
            </Link>
            <Link
              to="/gpa-calculator"
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-2xs"
            >
              4.0 GPA Calculator
            </Link>
            <Link
              to="/cgpa-to-percentage-calculator"
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-2xs"
            >
              CGPA to Percentage
            </Link>
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-2xs"
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
