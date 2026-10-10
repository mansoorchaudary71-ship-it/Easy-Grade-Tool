import React, { useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from './SlashLink';
import { Plus, X, RotateCcw, Target, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { AssessmentItem, CalculationMode, GradingScaleType } from '../types';
import { INITIAL_ASSESSMENTS } from '../data/constants';
import { QuickGrader } from './QuickGrader';
import { calculateMultiAssessmentGrade } from '../utils/gradeCalculations';
import { solveFinalExam } from '../utils/finalExam';
import { parseStrictNumber } from '../utils/academicMath';
import { GradeVisualProgressBar } from './GradeVisualProgressBar';
import { AmbientAura } from './AmbientAura';
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

const SEG_WRAP =
  'flex items-center gap-1 p-1 rounded-full bg-stone-100/80 dark:bg-slate-800 border border-stone-200 dark:border-slate-700';
const SEG_ON = 'cursor-pointer min-h-[48px] text-sm bg-[#134E48] dark:bg-teal-600 text-white rounded-full font-bold px-5 py-2 shadow-sm';
const SEG_OFF =
  'cursor-pointer min-h-[48px] text-sm bg-transparent text-stone-700 dark:text-stone-200 rounded-full font-medium hover:bg-white dark:hover:bg-slate-700/60 hover:shadow-sm border border-transparent transition-all px-5 py-2';
const ROW_INPUT =
  'w-full min-h-[48px] bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-base sm:text-sm font-mono text-center placeholder:text-slate-500 dark:placeholder:text-slate-400';
const ROW_LABEL = 'block sm:hidden text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 text-center';
const BTN_SOLID =
  'bg-[#134E48] hover:bg-[#0D3834] dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-full font-bold shadow-md px-6 py-3 min-h-[48px] transition-all inline-flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-95';
const BTN_SOFT =
  'bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 rounded-full font-semibold shadow-sm text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors py-3 px-5 min-h-[48px] active:scale-95';
const REMOVE_BTN =
  'w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl text-slate-600 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 bg-slate-100/90 hover:bg-rose-50 dark:bg-slate-800/90 dark:hover:bg-rose-950/40 border border-slate-200/70 dark:border-slate-700/70 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

const letterTone = (letter: string) => {
  if (letter.startsWith('A')) return 'bg-[#D2E8E4] dark:bg-teal-950/60 border border-emerald-200/60 dark:border-teal-800/60';
  if (letter.startsWith('B')) return 'bg-[#D6E1FF] dark:bg-indigo-950/60 border border-[#9FB3EE]/50 dark:border-indigo-800/60';
  if (letter.startsWith('C')) return 'bg-[#FFE8C2] dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60';
  if (letter.startsWith('D')) return 'bg-stone-100 dark:bg-slate-800/60 border border-stone-200/60 dark:border-slate-700/60';
  return 'bg-[#F9D6E1] dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/60';
};

const letterBadge = (letter: string) => {
  if (letter.startsWith('A')) return 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700';
  if (letter.startsWith('B')) return 'bg-indigo-100 text-indigo-900 border border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-700';
  if (letter.startsWith('C')) return 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700';
  if (letter.startsWith('D')) return 'bg-orange-100 text-orange-900 border border-orange-300 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-700';
  return 'bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700';
};

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
          title={calcTab === 'quick-chart' ? 'Easy Grade Calculator & Quick Chart' : 'Weighted Grade & Final Exam Calculator'}
          description={
            calcTab === 'quick-chart'
              ? 'Calculate instant test percentage scores, letter grades, and printable quick charts for any test length.'
              : 'Add your assessments, calculate weighted averages, and simulate the exact score needed on your final exam.'
          }
        />
      )}

      {calcTab === 'quick-chart' ? (
        <div id="panel-quick-chart" className="w-full max-w-full pt-1">
          <QuickGrader setToast={setToast} />
          <nav aria-label="Grading scale charts by test size" className="mt-8 rounded-[28px] bg-white dark:bg-slate-900 border border-white/80 dark:border-slate-800 p-5 sm:p-6 print:hidden">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">Ready-made grading scale charts</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 mb-4">Pick your test size for the percentage and letter grade of every score.</p>
            <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
              {GRADING_SCALE_SIZES.map((n) => (
                <li key={n}>
                  <Link
                    to={gradingScalePath(n)}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] px-4 rounded-full border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-stone-800 dark:text-slate-100 hover:border-teal-600 no-underline"
                    aria-label={`${n}-question grading scale`}
                  >
                    {n}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/grading-scale/" className="inline-flex items-center min-h-[48px] px-4 rounded-full text-sm font-bold text-teal-800 dark:text-teal-300 hover:underline no-underline">
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
          className="relative tool-layout font-sans pt-1 focus:outline-none"
        >
          <AmbientAura />

          {/* Left: assessments */}
          <section aria-label="Assessments Table" className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative p-6 sm:p-8 space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Assessments</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">
                  {courseName ? courseName : 'Weighted & Points Calculator'}
                </h2>
                <p className="text-slate-700 dark:text-slate-300 font-medium text-sm mt-1 m-0">
                  Add assignments, quizzes, and exams to calculate your current standing. Leave the score empty for work that is not graded yet.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className={SEG_WRAP} role="group" aria-label="Grading scale">
                  <button
                    type="button"
                    aria-pressed={scaleType === 'standard'}
                    className={scaleType === 'standard' ? SEG_ON : SEG_OFF}
                    onClick={() => {
                      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                      setScaleType('standard');
                      setToast?.('Grading scale: Standard (A–F)');
                    }}
                  >
                    A–F
                  </button>
                  <button
                    type="button"
                    aria-pressed={scaleType === 'plus'}
                    className={scaleType === 'plus' ? SEG_ON : SEG_OFF}
                    onClick={() => {
                      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                      setScaleType('plus');
                      setToast?.('Grading scale: Plus/Minus');
                    }}
                  >
                    +/−
                  </button>
                </div>

                <div className={SEG_WRAP} role="group" aria-label="Calculation mode">
                  <button
                    type="button"
                    aria-pressed={mode === 'weighted'}
                    className={mode === 'weighted' ? SEG_ON : SEG_OFF}
                    onClick={() => {
                      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                      setMode('weighted');
                      setToast?.('Switched to Weighted grading');
                    }}
                  >
                    Weighted (%)
                  </button>
                  <button
                    type="button"
                    aria-pressed={mode === 'points'}
                    className={mode === 'points' ? SEG_ON : SEG_OFF}
                    onClick={() => {
                      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                      setMode('points');
                      setToast?.('Switched to Points-based grading');
                    }}
                  >
                    Points
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop column headers */}
            <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-semibold tracking-wider text-slate-700 dark:text-slate-300 uppercase px-1">
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
                      className="bg-white/80 dark:bg-slate-900/80 sm:bg-transparent sm:dark:bg-transparent border border-slate-200/90 dark:border-slate-800/90 sm:border-0 rounded-2xl sm:rounded-none p-3.5 sm:p-0 shadow-xs sm:shadow-none sm:grid sm:grid-cols-12 sm:gap-2 sm:items-center sm:py-1 space-y-2.5 sm:space-y-0"
                    >
                      <div className={mode === 'weighted' ? 'sm:col-span-5' : 'sm:col-span-6'}>
                        <div className="flex items-end gap-2">
                          <div className="flex-1 min-w-0">
                            <label htmlFor={`assess-name-${item.id}`} className="block sm:hidden text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                              Assignment
                            </label>
                            <input
                              aria-label={`Assignment name, row ${index + 1}`}
                              placeholder="e.g. Midterm Exam"
                              id={`assess-name-${item.id}`}
                              type="text"
                              enterKeyHint="next"
                              className="w-full min-h-[48px] bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-base sm:text-sm placeholder:text-slate-500 dark:placeholder:text-slate-400"
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
                        <p className={`sm:col-span-12 text-sm m-0 ${issue ? 'text-rose-700 dark:text-rose-400 font-semibold' : 'text-slate-600 dark:text-slate-400'}`} role={issue ? 'alert' : undefined}>
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
          <section aria-label="Grade Results and Target Calculator" className="result-panel bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className={`${hasResult ? letterTone(gradeResult.letterGrade) : 'bg-stone-100 dark:bg-slate-800/60 border border-stone-200/60 dark:border-slate-700/60'} rounded-[24px] p-4 space-y-3`}>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">Current Grade</span>

                {/* The only live region in the results: one short line. */}
                <div
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="bg-white dark:bg-slate-800/90 border border-stone-100 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-sm flex items-center justify-between gap-3"
                >
                  {hasResult ? (
                    <>
                      <div className="text-3xl sm:text-4xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tracking-tight">
                        {gradeResult.formattedPercentage}%
                      </div>
                      <span className={`text-sm sm:text-base font-bold font-mono px-3 py-1.5 rounded-full ${letterBadge(gradeResult.letterGrade)}`}>
                        Grade {gradeResult.letterGrade}
                      </span>
                    </>
                  ) : (
                    <p className="m-0 text-sm font-semibold text-slate-700 dark:text-slate-200">Enter at least one score to see your grade.</p>
                  )}
                </div>

                {hasResult && (
                  <div className="bg-white dark:bg-slate-800/90 border border-stone-100 dark:border-slate-700 rounded-xl p-3 shadow-sm">
                    <GradeVisualProgressBar percent={Math.min(100, gradeResult.percentage)} letter={gradeResult.letterGrade} />
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-2 m-0 text-center sm:text-left">
                      Based on {gradeResult.validItemCount} counted row{gradeResult.validItemCount === 1 ? '' : 's'} ({mode === 'weighted' ? 'weighted' : 'points-based'}).
                      {ignoredCount > 0 ? ` ${ignoredCount} row${ignoredCount === 1 ? ' is' : 's are'} not counted.` : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Target Final Exam Simulator */}
              <div className="bg-white dark:bg-slate-800/60 rounded-[24px] border border-stone-200/80 dark:border-slate-700 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-700 dark:text-purple-300" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Target Final Exam Simulator</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="target-grade-input" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                      Desired Grade (%)
                    </label>
                    <input
                      id="target-grade-input"
                      type="text"
                      inputMode="decimal"
                      enterKeyHint="next"
                      placeholder="90"
                      className="w-full min-h-[48px] bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-extrabold text-2xl text-center font-mono placeholder:text-slate-500"
                      value={targetGrade}
                      onChange={(e) => setTargetGrade(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="final-weight-input" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                      Final Exam Weight (%)
                    </label>
                    <input
                      id="final-weight-input"
                      type="text"
                      inputMode="decimal"
                      enterKeyHint="done"
                      placeholder="20"
                      className="w-full min-h-[48px] bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-extrabold text-2xl text-center font-mono placeholder:text-slate-500"
                      value={finalWeight}
                      onChange={(e) => setFinalWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div role="status" aria-live="polite" aria-atomic="true">
                  {!hasResult ? (
                    <p className="m-0 text-sm text-slate-700 dark:text-slate-300">Add at least one scored row first, then the simulator can work out what you need.</p>
                  ) : targetSimulation && targetSimulation.status === 'invalid' ? (
                    <ul className="m-0 pl-5 list-disc text-sm text-rose-700 dark:text-rose-400">
                      {targetSimulation.errors.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  ) : targetSimulation ? (
                    <div className="bg-[#D2E8E4] dark:bg-teal-950/60 border border-emerald-200/60 dark:border-teal-800/60 rounded-[24px] p-4 space-y-2">
                      <div className="bg-white dark:bg-slate-800/90 border border-stone-100 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-sm flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Required on Final:</span>
                        <strong className="text-2xl font-extrabold text-teal-950 dark:text-teal-100 font-mono">
                          {targetSimulation.status === 'secured' ? '0%' : `${(Math.round(targetSimulation.required * 10) / 10).toFixed(1)}%`}
                        </strong>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 m-0 px-1">
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
                    className="inline-flex items-center min-h-[48px] gap-1.5 text-sm font-bold text-teal-800 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-200 hover:underline transition-colors"
                  >
                    <span>Need more detail? Open the Final Exam Grade Calculator &rarr;</span>
                  </Link>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-2 print:hidden">
                  <button
                    type="button"
                    aria-label="Print grade calculation result"
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
