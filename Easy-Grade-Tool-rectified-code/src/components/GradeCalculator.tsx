import React, { useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from './SlashLink';
import { Plus, X, RotateCcw, Target, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { gradeTone } from '../utils/gradeTone';
import { SegmentedControl } from './ui/SegmentedControl';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { AssessmentItem, CalculationMode, GradingScaleType } from '../types';
import { INITIAL_ASSESSMENTS } from '../data/constants';
import { QuickGrader } from './QuickGrader';
import { calculateMultiAssessmentGrade } from '../utils/gradeCalculations';
import { solveFinalExam } from '../utils/finalExam';
import { parseStrictNumber } from '../utils/academicMath';
import { GradeVisualProgressBar } from './GradeVisualProgressBar';
import { triggerHapticFeedback, DEFAULT_HAPTIC_DURATION } from '../utils/haptics';
import { SEO_HOME, SEO_ROUTES } from '../data/seoConfig';
import { EducationalGuide } from './EducationalGuide';
import { GRADING_SCALE_SIZES, gradingScalePath } from '../data/gradingScaleSizes';

export interface GradeCalculatorProps {
  setToast: (msg: string) => void;
  initialItems?: AssessmentItem[];
  initialMode?: CalculationMode;
  initialScale?: GradingScaleType;
  initialCourseName?: string;
  hideHeading?: boolean;
  /**
   * Set when a parent already renders <SEO> for this page. On / and /grade-calculator this component
   * is the single SEO owner (SEOHead skips those routes), so it stays false there.
   */
  hideSeo?: boolean;
}

const ROW_INPUT = 'field text-center font-bold tabular-nums';
const ROW_LABEL = 'block sm:hidden text-xs font-semibold text-ink-2 mb-1 text-center';
const BTN_SOLID = 'btn btn-primary';
const BTN_SOFT = 'btn btn-secondary';
const REMOVE_BTN = 'btn btn-ghost btn-icon hover:text-rose-700 dark:hover:text-rose-400';

/** Semantic grade colours (A/B green, C amber, D/F rose). Shared with the Quick Chart; see utils/gradeTone.ts. */
const letterTone = (letter: string) => `${gradeTone(letter).surface} border`;
const letterBadge = (letter: string) => `${gradeTone(letter).badge} border`;

export const GradeCalculator: React.FC<GradeCalculatorProps> = ({
  setToast,
  initialItems,
  initialMode,
  initialScale = 'standard',
  initialCourseName,
  hideHeading = false,
  hideSeo = false,
}) => {
  const location = useLocation();
  const isWeightedRoute = location.pathname.replace(/\/+$/, '') === '/grade-calculator';
  const activeSeo = isWeightedRoute ? SEO_ROUTES.quick : SEO_HOME;

  // Quick Grade (/) and Weighted Grade (/grade-calculator) are separate tools; the view is derived from the route.
  const calcTab: 'quick-chart' | 'calculator' =
    initialMode === 'points' || initialMode === 'weighted' || isWeightedRoute ? 'calculator' : 'quick-chart';

  const [mode, setMode] = useState<'weighted' | 'points'>(() => (initialMode === 'points' ? 'points' : 'weighted'));
  const [scaleType, setScaleType] = useState<GradingScaleType>(initialScale);
  const [courseName] = useState<string>(initialCourseName || '');
  const [targetGrade, setTargetGrade] = useState<string>('90');
  const [finalWeight, setFinalWeight] = useState<string>('20');

  const [items, setItems] = useState<AssessmentItem[]>(() => {
    if (initialItems && initialItems.length > 0) return initialItems;
    return INITIAL_ASSESSMENTS;
  });

  // Unique, monotonic row ids. Date.now() could repeat when two taps land in the same millisecond.
  const nextId = useRef<number>(
    Math.max(0, ...(initialItems && initialItems.length > 0 ? initialItems : INITIAL_ASSESSMENTS).map((i) => i.id)) + 1
  );

  const handleUpdateItem = (id: number, field: keyof AssessmentItem, val: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  };

  const handleAddItem = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    const newItem: AssessmentItem = {
      id: nextId.current++,
      name: '',
      score: '',
      max: '100',
      weight: mode === 'weighted' ? '20' : '0',
    };
    setItems((prev) => [...prev, newItem]);
    setToast?.('New grade row added');
  };

  const handleRemoveItem = (id: number) => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setItems(INITIAL_ASSESSMENTS);
    nextId.current = Math.max(nextId.current, Math.max(0, ...INITIAL_ASSESSMENTS.map((i) => i.id)) + 1);
    setToast?.('Reset to sample assessments');
  };

  const gradeResult = useMemo(
    () =>
      calculateMultiAssessmentGrade(items, mode, {
        scale: scaleType === 'plus' ? 'plus-minus' : 'standard',
        decimalPrecision: 1,
      }),
    [items, mode, scaleType]
  );

  const hasResult = gradeResult.validItemCount > 0;
  const issueById = useMemo(() => {
    const map = new Map<number | string, string>();
    gradeResult.issues.forEach((i) => map.set(i.id, i.message));
    return map;
  }, [gradeResult.issues]);
  const countedIds = useMemo(() => {
    const ids = new Set<number>();
    items.forEach((it) => {
      if (it.score.trim() !== '' && !issueById.has(it.id)) ids.add(it.id);
    });
    return ids;
  }, [items, issueById]);

  // Target final exam simulator: always the EXACT current grade, never the rounded display value.
  const targetSimulation = useMemo(() => {
    if (!hasResult) return null;
    return solveFinalExam({ current: gradeResult.rawPercentage, target: targetGrade, weight: finalWeight });
  }, [hasResult, gradeResult.rawPercentage, targetGrade, finalWeight]);

  const weightsTotal = Math.round(gradeResult.totalWeight * 100) / 100;
  const ignoredCount = gradeResult.issues.length + gradeResult.blankRowCount;

  return (
    <>
      {!hideSeo && (
        <SEO
          title={activeSeo.title}
          description={activeSeo.description}
          canonicalUrl={activeSeo.canonicalUrl}
          ogImage={activeSeo.ogImagePlaceholder}
          applicationCategory={activeSeo.applicationCategory}
          featureList={activeSeo.featureList}
          name={isWeightedRoute ? 'Weighted Grade Calculator' : 'Easy Grade Calculator & Quick Grade Chart'}
          breadcrumbLabel={isWeightedRoute ? 'Weighted Grade Calculator' : 'Quick Grade Calculator'}
        />
      )}

      {!hideHeading && (
        <ToolHeading
          badge={calcTab === 'quick-chart' ? 'Quick Grade' : 'Weighted Grade'}
          title={calcTab === 'quick-chart' ? 'EZ Grader Chart & Easy Grade Calculator' : 'Weighted Grade & Final Exam Calculator'}
          description={
            calcTab === 'quick-chart'
              ? 'EZ grader chart online: enter the number of questions to see the percentage and letter grade for every number of wrong answers, then print the chart or save it as a PDF.'
              : 'Add your assessments, calculate weighted averages, and simulate the exact score needed on your final exam.'
          }
        />
      )}

      {calcTab === 'quick-chart' ? (
        <div id="panel-quick-chart" className="w-full max-w-full pt-1">
          <QuickGrader setToast={setToast} />
          <nav aria-label="Grading scale charts by test size" className="card mt-8 print:hidden">
            <h2 className="m-0">Ready-made grading scale charts</h2>
            <p className="text-sm text-ink-2 mt-1 mb-4">Pick your test size for the percentage and letter grade of every score.</p>
            <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
              {GRADING_SCALE_SIZES.map((n) => (
                <li key={n}>
                  <Link
                    to={gradingScalePath(n)}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] px-4 rounded-full border border-line bg-surface text-sm font-semibold text-ink hover:border-brand-600 no-underline"
                  >
                    {n}
                    <span className="sr-only">-question grading scale</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/grading-scale/" className="inline-flex items-center min-h-[48px] px-4 rounded-full text-sm font-bold text-brand-ink hover:underline no-underline">
                  All charts &rarr;
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : (
        <div
          id="panel-calculator"
          data-print-area
          data-print-title="Weighted Grade Report"
          className="relative focus:outline-none"
        >

          {/* Left: assessments */}
          <section aria-label="Assessments Table" className="card relative space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line/60">
              <div>
                <span className="text-xs font-semibold text-ink-2 block mb-1">Assessments</span>
                <h2 className="m-0">
                  {courseName ? courseName : 'Weighted & Points Calculator'}
                </h2>
                <p className="text-ink-2 font-medium text-sm mt-1 m-0">
                  Add assignments, quizzes, and exams to calculate your current standing. Leave the score empty for work that is not graded yet.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <SegmentedControl
                  ariaLabel="Grading scale"
                  value={scaleType}
                  onChange={(v) => setScaleType(v)}
                  options={[
                    { value: 'standard', label: 'A–F', onSelect: () => { triggerHapticFeedback(DEFAULT_HAPTIC_DURATION); setToast?.('Grading scale: Standard (A–F)'); } },
                    { value: 'plus', label: '+/−', ariaLabel: 'Plus and minus grading', onSelect: () => { triggerHapticFeedback(DEFAULT_HAPTIC_DURATION); setToast?.('Grading scale: Plus/Minus'); } },
                  ]}
                />

                <SegmentedControl
                  ariaLabel="Calculation mode"
                  value={mode}
                  onChange={(v) => setMode(v)}
                  options={[
                    { value: 'weighted', label: 'Weighted (%)', onSelect: () => { triggerHapticFeedback(DEFAULT_HAPTIC_DURATION); setToast?.('Switched to Weighted grading'); } },
                    { value: 'points', label: 'Points', onSelect: () => { triggerHapticFeedback(DEFAULT_HAPTIC_DURATION); setToast?.('Switched to Points-based grading'); } },
                  ]}
                />
              </div>
            </div>

            {/* Desktop column headers */}
            <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-semibold text-ink-2 px-1">
              <span className={mode === 'weighted' ? 'col-span-5' : 'col-span-6'}>Assignment</span>
              <span className="col-span-2 text-center">Score</span>
              <span className="col-span-2 text-center">Out Of</span>
              {mode === 'weighted' && <span className="col-span-2 text-center">Weight %</span>}
              <span className="col-span-1" />
            </div>

            {/* Rows. Padding keeps the focus ring visible inside the clipping box. */}
            <div className="space-y-3 sm:space-y-2.5 overflow-x-auto p-1 -m-1">
              <AnimatePresence initial={false}>
                {items.map((item, index) => {
                  const rowName = item.name.trim() || `Row ${index + 1}`;
                  const issue = issueById.get(item.id);
                  const ignored = item.score.trim() === '';
                  return (
                    <motion.div
                      key={item.id}
                      layout="position"
                      initial={{ opacity: 0, x: -18, y: -4 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: 18, height: 0, overflow: 'hidden', transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-surface/80 sm:bg-transparent sm:dark:bg-transparent border border-line/90 sm:border-0 rounded-2xl sm:rounded-none p-3.5 sm:p-0 shadow-sm sm:shadow-none sm:grid sm:grid-cols-12 sm:gap-2 sm:items-center sm:py-1 space-y-2.5 sm:space-y-0"
                    >
                      <div className={mode === 'weighted' ? 'sm:col-span-5' : 'sm:col-span-6'}>
                        <div className="flex items-end gap-2">
                          <div className="flex-1 min-w-0">
                            <label htmlFor={`assess-name-${item.id}`} className="block sm:hidden text-xs font-semibold text-ink-2 mb-1">
                              Assignment
                            </label>
                            <input
                              aria-label={`Assignment name, row ${index + 1}`}
                              placeholder="e.g. Midterm Exam"
                              id={`assess-name-${item.id}`}
                              type="text"
                              enterKeyHint="next"
                              className="field w-full px-5 py-3 transition-all font-bold text-base sm:text-sm"
                              value={item.name}
                              onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="sm:hidden flex-shrink-0">
                            <button
                              type="button"
                              className={REMOVE_BTN}
                              aria-label={`Remove ${rowName}`}
                              disabled={items.length <= 1}
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <X className="w-5 h-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className={`grid ${mode === 'weighted' ? 'grid-cols-3' : 'grid-cols-2'} gap-2 sm:contents`}>
                        <div className="sm:col-span-2">
                          <label htmlFor={`assess-score-${item.id}`} className={ROW_LABEL}>Score</label>
                          <input
                            aria-label={`Score earned, ${rowName}`}
                            placeholder="85"
                            id={`assess-score-${item.id}`}
                            type="text"
                            inputMode="decimal"
                            enterKeyHint="next"
                            aria-invalid={issue ? true : undefined}
                            className={ROW_INPUT}
                            value={item.score}
                            onChange={(e) => handleUpdateItem(item.id, 'score', e.target.value)}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor={`assess-max-${item.id}`} className={ROW_LABEL}>Out Of</label>
                          <input
                            aria-label={`Total possible points, ${rowName}`}
                            placeholder="100"
                            id={`assess-max-${item.id}`}
                            type="text"
                            inputMode="decimal"
                            enterKeyHint="next"
                            aria-invalid={issue ? true : undefined}
                            className={ROW_INPUT}
                            value={item.max}
                            onChange={(e) => handleUpdateItem(item.id, 'max', e.target.value)}
                          />
                        </div>
                        {mode === 'weighted' && (
                          <div className="sm:col-span-2">
                            <label htmlFor={`assess-weight-${item.id}`} className={ROW_LABEL}>Weight %</label>
                            <input
                              aria-label={`Category weight percentage, ${rowName}`}
                              placeholder="20"
                              id={`assess-weight-${item.id}`}
                              type="text"
                              inputMode="decimal"
                              enterKeyHint="done"
                              aria-invalid={issue ? true : undefined}
                              className={ROW_INPUT}
                              value={item.weight}
                              onChange={(e) => handleUpdateItem(item.id, 'weight', e.target.value)}
                            />
                          </div>
                        )}
                      </div>

                      <div className="hidden sm:flex sm:col-span-1 justify-center">
                        <button
                          type="button"
                          className={REMOVE_BTN}
                          aria-label={`Remove ${rowName}`}
                          disabled={items.length <= 1}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X className="w-5 h-5" aria-hidden="true" />
                        </button>
                      </div>

                      {(issue || ignored) && (
                        <p className={`sm:col-span-12 text-sm m-0 ${issue ? 'text-rose-700 dark:text-rose-400 font-semibold' : 'text-ink-2'}`} role={issue ? 'alert' : undefined}>
                          {issue || `${rowName} is not counted yet because the score is empty.`}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {mode === 'weighted' && hasResult && (
              <p className={`text-sm m-0 font-medium ${weightsTotal === 100 ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'}`}>
                Weights total {weightsTotal}%.{' '}
                {weightsTotal === 100
                  ? 'Your weights add up to 100%.'
                  : 'They do not add up to 100%, so the result is scaled to the weights you entered.'}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button type="button" className={BTN_SOLID} onClick={handleAddItem}>
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add grade row</span>
              </button>
              <button type="button" className={BTN_SOFT} onClick={handleReset}>
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Reset rows</span>
              </button>
            </div>
          </section>

          {/* Right: results and target simulator */}
          <section aria-label="Grade Results and Target Calculator" className="card result-panel relative flex flex-col justify-between">
            <div className="space-y-6">
              <div className={`${hasResult ? letterTone(gradeResult.letterGrade) : 'bg-sunken border border-line/60'} rounded-xl p-4 space-y-3`}>
                <span className="text-xs font-semibold text-ink-2 block">Current Grade</span>

                {/* The only live region in the results: one short line. */}
                <div
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="bg-surface border border-line rounded-xl px-3.5 py-2.5 shadow-sm flex items-center justify-between gap-3"
                >
                  {hasResult ? (
                    <>
                      <div className={`text-5xl sm:text-6xl font-bold leading-none tabular-nums tracking-tight ${gradeTone(gradeResult.letterGrade).text}`}>
                        {gradeResult.formattedPercentage}%
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-base sm:text-lg font-bold tabular-nums px-4 py-2 rounded-full ${letterBadge(gradeResult.letterGrade)}`}>
                        Grade {gradeResult.letterGrade}
                      </span>
                    </>
                  ) : (
                    <p className="m-0 text-sm font-semibold text-ink-2">Enter at least one score to see your grade.</p>
                  )}
                </div>

                {hasResult && (
                  <div className="bg-surface border border-line rounded-xl p-3 shadow-sm">
                    <GradeVisualProgressBar percent={Math.min(100, gradeResult.percentage)} letter={gradeResult.letterGrade} />
                    <p className="text-sm text-ink-2 font-medium mt-2 m-0 text-center sm:text-left">
                      Based on {gradeResult.validItemCount} counted row{gradeResult.validItemCount === 1 ? '' : 's'} ({mode === 'weighted' ? 'weighted' : 'points-based'}).
                      {ignoredCount > 0 ? ` ${ignoredCount} row${ignoredCount === 1 ? ' is' : 's are'} not counted.` : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Target Final Exam Simulator */}
              <div className="bg-surface rounded-xl border border-line/80 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-brand" aria-hidden="true" />
                  <span className="text-xs font-semibold text-ink-2">Target Final Exam Simulator</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="target-grade-input" className="text-xs font-semibold text-ink-2 block mb-1">
                      Desired Grade (%)
                    </label>
                    <input
                      id="target-grade-input"
                      type="text"
                      inputMode="decimal"
                      enterKeyHint="next"
                      placeholder="90"
                      className="field w-full px-4 py-3 transition-all font-bold text-2xl text-center tabular-nums"
                      value={targetGrade}
                      onChange={(e) => setTargetGrade(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="final-weight-input" className="text-xs font-semibold text-ink-2 block mb-1">
                      Final Exam Weight (%)
                    </label>
                    <input
                      id="final-weight-input"
                      type="text"
                      inputMode="decimal"
                      enterKeyHint="done"
                      placeholder="20"
                      className="field w-full px-4 py-3 transition-all font-bold text-2xl text-center tabular-nums"
                      value={finalWeight}
                      onChange={(e) => setFinalWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div role="status" aria-live="polite" aria-atomic="true">
                  {!hasResult ? (
                    <p className="m-0 text-sm text-ink-2">Add at least one scored row first, then the simulator can work out what you need.</p>
                  ) : targetSimulation && targetSimulation.status === 'invalid' ? (
                    <ul className="m-0 pl-5 list-disc text-sm text-rose-700 dark:text-rose-400">
                      {targetSimulation.errors.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  ) : targetSimulation ? (
                    <div className="bg-brand-soft border border-brand-line/60 rounded-xl p-4 space-y-2">
                      <div className="bg-surface border border-line rounded-xl px-3.5 py-2.5 shadow-sm flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-ink-2">Required on Final:</span>
                        <strong className="text-2xl font-bold text-brand-ink tabular-nums">
                          {targetSimulation.status === 'secured' ? '0%' : `${(Math.round(targetSimulation.required * 10) / 10).toFixed(1)}%`}
                        </strong>
                      </div>
                      <p className="text-sm text-ink m-0 px-1">
                        {targetSimulation.status === 'secured'
                          ? 'Already secured: you reach this target even with 0% on the final.'
                          : targetSimulation.status === 'unreachable'
                          ? `Out of reach without extra credit: the most you can reach is ${targetSimulation.maxPossible.toFixed(1)}%.`
                          : 'Achievable on the final exam.'}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="pt-1">
                  <Link
                    to="/final-exam-grade-calculator/"
                    className="inline-flex items-center min-h-[48px] gap-1.5 text-sm font-bold text-brand-ink hover:text-brand-ink hover:underline transition-colors"
                  >
                    <span>Need more detail? Open the Final Exam Grade Calculator &rarr;</span>
                  </Link>
                </div>

                <div className="pt-4 border-t border-line/60 flex flex-wrap items-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                      try {
                        window.print();
                      } catch {
                        setToast?.('Use Export PDF to save a printable report.');
                      }
                    }}
                    className={`flex-1 ${BTN_SOLID}`}
                  >
                    <Printer className="w-4 h-4" aria-hidden="true" />
                    <span>Print Result</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Export grade report as PDF"
                    disabled={!hasResult}
                    onClick={async () => {
                      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                      try {
                        setToast?.('Generating PDF grade report...');
                        const { exportGradeReportPdf } = await import('../utils/pdfExport');
                        // Export exactly the rows the screen counted, so the PDF matches the on-screen result.
                        await exportGradeReportPdf({
                          courseName: courseName || 'Course Grade Report',
                          mode,
                          scale: scaleType,
                          percent: gradeResult.percentage,
                          letter: gradeResult.letterGrade,
                          targetGrade,
                          assessments: items
                            .filter((it) => countedIds.has(it.id))
                            .map((it) => ({
                              ...it,
                              scoreNum: parseStrictNumber(it.score) ?? 0,
                              maxNum: parseStrictNumber(it.max) ?? 1,
                              weightNum: parseStrictNumber(it.weight) ?? 0,
                              invalid: false,
                            })),
                        });
                        setToast?.('Grade report PDF downloaded!');
                      } catch {
                        setToast?.('Could not generate PDF report.');
                      }
                    }}
                    className={`${BTN_SOFT} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {!hideSeo && <EducationalGuide activeTool="quick" />}
    </>
  );
};
