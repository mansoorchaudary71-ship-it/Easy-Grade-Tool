import React, { useState, useMemo, memo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Printer, Settings, Check, SlidersHorizontal, Hash, SearchX, RotateCcw, ChevronDown } from 'lucide-react';
import { parseNumber } from '../utils/formatters';
import { GRADING_SCALES } from '../data/constants';
import { GradingScaleType, ScaleGrade } from '../types';
import { AmbientAura } from './AmbientAura';
import { triggerHapticFeedback, handleNumericKeyDownHaptic, DEFAULT_HAPTIC_DURATION } from '../utils/haptics';
import { GradeScaleModal } from './GradeScaleModal';
import { preloadPdf } from '../utils/toolPreloader';

interface QuickChartItem {
  wrong: number;
  percentage: number;
  letter: string;
}

interface LetterGroup {
  letter: string;
  minThreshold: number;
  items: QuickChartItem[];
}

export interface QuickGraderProps {
  setToast?: (msg: string) => void;
}

const CHUNK_SIZE = 100;
const VIRTUALIZE_THRESHOLD = 250;

// Memoized individual score chip to prevent unnecessary re-renders of 1,000 items
const ScoreChip = memo<{
  wrong: number;
  percentage: number;
  pctColorClass: string;
  showDecimals: boolean;
  rowBgClass?: string;
}>(({ wrong, percentage, pctColorClass, showDecimals }) => (
  <div
    className="ez-score-item flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800/90 rounded-xl shadow-xs border border-black/5 dark:border-slate-700/60 transition-colors"
  >
    <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium">
      <strong className="text-rose-600 dark:text-rose-400 font-bold">
        {wrong}
      </strong>{' '}
      wrong
    </span>
    <span className={`font-bold text-xs sm:text-sm font-mono tabular-nums ${pctColorClass}`}>
      {showDecimals ? percentage.toFixed(1) : Math.round(percentage)}%
    </span>
  </div>
));
ScoreChip.displayName = 'ScoreChip';

const COMMON_QUESTION_PRESETS = [10, 20, 25, 50, 100];

export const QuickGrader: React.FC<QuickGraderProps> = ({ setToast }) => {
  // Inputs & Controls
  const [totalQuestionsInput, setTotalQuestionsInput] = useState<string>('10');
  const [showDecimals, setShowDecimals] = useState<boolean>(false);
  const [scaleType, setScaleType] = useState<GradingScaleType>('standard');
  const [isScaleModalOpen, setIsScaleModalOpen] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const { pathname } = useLocation();
  const isEzGraderPage = pathname.replace(/\/+$/, '') === '/easy-grade-calculator/ez-grader';

  // Custom threshold overrides (defaults: A: 90, B: 80, C: 70, D: 60)
  const [thresholds, setThresholds] = useState<{ A: number; B: number; C: number; D: number }>({
    A: 90,
    B: 80,
    C: 70,
    D: 60,
  });

  const handleOpenScaleModal = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setIsScaleModalOpen(true);
  };

  // Safe parsed total questions (min 1, max 1000)
  const totalQuestions = useMemo(() => {
    const parsed = parseNumber(totalQuestionsInput);
    if (isNaN(parsed) || parsed <= 0) return 1;
    return Math.min(1000, Math.floor(parsed));
  }, [totalQuestionsInput]);

  // Progressive rendering state: render initial chunk on screen, expand on demand
  const [renderedCount, setRenderedCount] = useState<number>(CHUNK_SIZE);

  // Reset rendered chunk count whenever inputs or filters change
  useEffect(() => {
    setRenderedCount(CHUNK_SIZE);
  }, [totalQuestions, showDecimals, scaleType, thresholds, searchFilter]);

  // Points deducted per wrong question
  const pointsPerQuestion = useMemo(() => {
    if (totalQuestions <= 0) return 0;
    return 100 / totalQuestions;
  }, [totalQuestions]);

  // Helper to determine letter grade based on active scale/thresholds
  const getLetter = (pct: number): string => {
    if (scaleType === 'plus') {
      const scaleGrades: ScaleGrade[] = GRADING_SCALES.plus;
      for (const item of scaleGrades) {
        if (pct >= item.min) return item.letter;
      }
      return 'F';
    }
    // Standard scale with custom thresholds
    if (pct >= thresholds.A) return 'A';
    if (pct >= thresholds.B) return 'B';
    if (pct >= thresholds.C) return 'C';
    if (pct >= thresholds.D) return 'D';
    return 'F';
  };

  // Vertical Quick Chart Outcomes Grouped by Letter Grade
  const letterGroups = useMemo<LetterGroup[]>(() => {
    const total = totalQuestions;
    const allItems: QuickChartItem[] = [];

    const filterNum = searchFilter.trim() !== '' ? parseInt(searchFilter, 10) : null;

    for (let wrong = 0; wrong <= total; wrong++) {
      if (filterNum !== null && !isNaN(filterNum) && wrong !== filterNum) {
        continue;
      }

      const correct = total - wrong;
      const rawPct = total > 0 ? (correct / total) * 100 : 0;
      const percentage = showDecimals
        ? Math.round(rawPct * 10) / 10
        : Math.round(rawPct);
      const letter = getLetter(rawPct);

      allItems.push({
        wrong,
        percentage,
        letter,
      });
    }

    const standardKeys = ['A', 'B', 'C', 'D', 'F'];
    const plusKeys = ['A', 'A−', 'B+', 'B', 'B−', 'C+', 'C', 'C−', 'D', 'F'];
    const activeKeys = scaleType === 'plus' ? plusKeys : standardKeys;

    const groups: LetterGroup[] = [];

    activeKeys.forEach((key) => {
      const matchingItems = allItems.filter((item) => item.letter === key);
      if (matchingItems.length > 0) {
        let minThresh = 0;
        if (scaleType === 'standard') {
          if (key === 'A') minThresh = thresholds.A;
          else if (key === 'B') minThresh = thresholds.B;
          else if (key === 'C') minThresh = thresholds.C;
          else if (key === 'D') minThresh = thresholds.D;
        } else {
          const found = GRADING_SCALES.plus.find((g) => g.letter === key);
          if (found) minThresh = found.min;
        }

        groups.push({
          letter: key,
          minThreshold: minThresh,
          items: matchingItems,
        });
      }
    });

    return groups;
  }, [totalQuestions, showDecimals, scaleType, thresholds, searchFilter]);

  // Total matching items across all groups
  const totalCalculatedItems = useMemo(() => {
    return letterGroups.reduce((acc, g) => acc + g.items.length, 0);
  }, [letterGroups]);

  // Screen-rendered groups (chunked progressively up to renderedCount when total exceeds VIRTUALIZE_THRESHOLD)
  const visibleLetterGroups = useMemo<LetterGroup[]>(() => {
    // If test is small or search filter narrowed items below threshold, render all immediately
    if (totalCalculatedItems <= VIRTUALIZE_THRESHOLD) {
      return letterGroups;
    }

    let remainingBudget = renderedCount;
    const result: LetterGroup[] = [];

    for (const group of letterGroups) {
      if (remainingBudget <= 0) break;
      if (group.items.length <= remainingBudget) {
        result.push(group);
        remainingBudget -= group.items.length;
      } else {
        // Slice the group to fit remaining chunk budget
        result.push({
          ...group,
          items: group.items.slice(0, remainingBudget),
        });
        remainingBudget = 0;
      }
    }

    return result;
  }, [letterGroups, totalCalculatedItems, renderedCount]);

  const hasMoreItems = totalCalculatedItems > VIRTUALIZE_THRESHOLD && renderedCount < totalCalculatedItems;

  // The print-only copy of the chart is only needed when the on-screen list is chunked.
  // For normal tests the screen view prints as-is, so the chart appears once in the page HTML.
  const needsPrintView = totalCalculatedItems > VIRTUALIZE_THRESHOLD;

  const handleShowMore = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setRenderedCount((prev) => Math.min(totalCalculatedItems, prev + CHUNK_SIZE));
  };

  const handleShowAll = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setRenderedCount(totalCalculatedItems);
  };

  const handlePrint = async () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

    if (isInIframe) {
      try {
        setToast?.('Preparing printable grading chart...');
        const { exportQuickGradePdf } = await import('../utils/pdfExport');
        exportQuickGradePdf({
          totalQuestions,
          scaleType,
          showDecimals,
          thresholds,
          letterGroups,
        });
        setToast?.(`Generated printable PDF grading chart for ${totalQuestions} questions!`);
      } catch {
        setToast?.('Could not generate printable chart.');
      }
      return;
    }

    try {
      window.print();
    } catch {
      try {
        const { exportQuickGradePdf } = await import('../utils/pdfExport');
        exportQuickGradePdf({
          totalQuestions,
          scaleType,
          showDecimals,
          thresholds,
          letterGroups,
        });
        setToast?.(`Generated printable PDF grading chart for ${totalQuestions} questions!`);
      } catch {
        setToast?.('Print is unavailable in this browser.');
      }
    }
  };

  const getBadgeClasses = (letter: string) => {
    if (letter.startsWith('A')) {
      return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60';
    }
    if (letter.startsWith('B')) {
      return 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60';
    }
    if (letter.startsWith('C')) {
      return 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60';
    }
    if (letter.startsWith('D')) {
      return 'bg-orange-50 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60';
    }
    return 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60';
  };

  const getTierWrapperClass = (letter: string) => {
    if (letter.startsWith('A')) {
      return 'bg-[#E6F2EE] dark:bg-teal-950/30 border border-[#BDE0D5] dark:border-teal-800/40 rounded-[24px] p-4';
    }
    if (letter.startsWith('B')) {
      return 'bg-[#E8EEFF] dark:bg-indigo-950/30 border border-[#C6D4F9] dark:border-indigo-800/40 rounded-[24px] p-4';
    }
    if (letter.startsWith('C')) {
      return 'bg-[#FFF5E5] dark:bg-amber-950/30 border border-[#FDE0B2] dark:border-amber-800/40 rounded-[24px] p-4';
    }
    if (letter.startsWith('D')) {
      return 'bg-[#F0F2F5] dark:bg-slate-800/50 border border-[#D1D5DB] dark:border-slate-700/50 rounded-[24px] p-4';
    }
    return 'bg-[#FCEAEF] dark:bg-rose-950/30 border border-[#F7C6D5] dark:border-rose-800/40 rounded-[24px] p-4';
  };

  const getPctColor = (letter: string) => {
    if (letter.startsWith('A')) {
      return 'text-emerald-800 dark:text-emerald-300';
    }
    if (letter.startsWith('B')) {
      return 'text-indigo-800 dark:text-indigo-300';
    }
    if (letter.startsWith('C')) {
      return 'text-amber-800 dark:text-amber-300';
    }
    if (letter.startsWith('D')) {
      return 'text-orange-800 dark:text-orange-300';
    }
    return 'text-rose-800 dark:text-rose-300';
  };

  return (
    <div className="relative tool-layout font-sans">
      <AmbientAura />

      {/* 1. Left Inputs & Settings Card (Universal App Styling) */}
      <section aria-label="Test Configuration" className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col gap-6 print:hidden">
        {/* Panel Header */}
        <div className="pb-5 border-b border-slate-200/60 dark:border-slate-800">
          <span className="text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-1">
            Test Configuration
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">
            Grading Parameters
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base mt-1 m-0">
            Set total questions and customize grading scale cutoffs.
          </p>
          {!isEzGraderPage && (
          <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/60">
            <Link
              to="/easy-grade-calculator/ez-grader"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline transition-colors"
            >
              <span>Grading classroom quizzes? View the complete EZ Grader Online Chart table &rarr;</span>
            </Link>
          </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {/* Number of Questions Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="num-questions"
                className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase"
              >
                Number of questions
              </label>
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                1–1000 max
              </span>
            </div>

            <div className="relative group">
              <input
                id="num-questions"
                type="number"
                inputMode="numeric"
                min="1"
                max="1000"
                step="1"
                className="w-full h-14 bg-[#F0F2F5] dark:bg-slate-800 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-0 leading-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg sm:text-xl text-center placeholder:text-slate-400 dark:placeholder:text-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={totalQuestionsInput}
                onChange={(e) => setTotalQuestionsInput(e.target.value)}
                onKeyDown={handleNumericKeyDownHaptic}
                placeholder="10"
              />
            </div>

            {/* Quick Presets (Universal UI Chips) */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                Presets:
              </span>
              {COMMON_QUESTION_PRESETS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                    setTotalQuestionsInput(String(q));
                  }}
                  className={`preset-btn text-xs transition-all cursor-pointer ${
                    totalQuestions === q
                      ? 'bg-[#134E48] dark:bg-teal-600 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 rounded-full font-semibold shadow-sm px-4 py-1.5 transition-all'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Grade Scale Selection & Modal Trigger */}
          <div className="bg-white dark:bg-slate-800/60 rounded-[24px] border border-stone-200/80 dark:border-slate-800 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Grading Scale
              </span>
              <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                {scaleType === 'standard' ? 'Standard (A–F)' : 'Plus / Minus (A–F)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-stone-100/80 dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
              <button
                type="button"
                className={`text-xs cursor-pointer text-center ${
                  scaleType === 'standard'
                    ? 'bg-[#134E48] dark:bg-teal-600 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 rounded-full font-semibold shadow-sm px-4 py-1.5 transition-all'
                }`}
                onClick={() => {
                  triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                  setScaleType('standard');
                }}
              >
                Standard (A, B, C, D, F)
              </button>
              <button
                type="button"
                className={`text-xs cursor-pointer text-center ${
                  scaleType === 'plus'
                    ? 'bg-[#134E48] dark:bg-teal-600 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 rounded-full font-semibold shadow-sm px-4 py-1.5 transition-all'
                }`}
                onClick={() => {
                  triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                  setScaleType('plus');
                }}
              >
                Plus / Minus (A, A−, B+...)
              </button>
            </div>

            <button
              type="button"
              className="w-full bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 rounded-full font-semibold shadow-sm px-5 py-2.5 transition-all cursor-pointer inline-flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.98]"
              onClick={handleOpenScaleModal}
            >
              <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" aria-hidden="true" />
              <span>Customize Scale Cutoffs</span>
            </button>
          </div>

          {/* Show Decimals Toggle (Universal Rounded Pill Control) */}
          <div className="bg-white dark:bg-slate-800/60 rounded-[24px] border border-stone-200/80 dark:border-slate-800 shadow-sm p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Decimal Precision
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Display scores with one decimal place (e.g. 92.5%)
              </span>
            </div>
            <label htmlFor="decimal-precision-toggle" className="relative inline-flex items-center cursor-pointer select-none">
              <input
                id="decimal-precision-toggle"
                type="checkbox"
                aria-label="Toggle decimal precision"
                className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-600 text-teal-600 focus:ring-2 focus:ring-teal-500/30 accent-teal-600 cursor-pointer transition-all"
                checked={showDecimals}
                onChange={(e) => {
                  triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                  setShowDecimals(e.target.checked);
                }}
              />
            </label>
          </div>

          {/* Quick Metrics / Scoring Summary */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#E6F2EE] dark:bg-teal-950/40 rounded-[20px] p-4 border border-[#BDE0D5] dark:border-teal-800/50 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-teal-300 uppercase tracking-wider block">
                Each Worth
              </span>
              <strong className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                {pointsPerQuestion.toFixed(pointsPerQuestion % 1 === 0 ? 0 : 2)}%
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-teal-400/80">Value per question</span>
            </div>

            <div className="bg-[#FFF5E5] dark:bg-amber-950/40 rounded-[20px] p-4 border border-[#FEE3B8] dark:border-amber-800/50 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-amber-300 uppercase tracking-wider block">
                Passing Cutoff (D)
              </span>
              <strong className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                ≥ {thresholds.D}%
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-amber-400/80">Standard passing minimum</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Right Output Card: Quick Chart (Universal App Styling) */}
      <section
        aria-label="Scoring Output Chart"
        className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between"
        aria-live="polite"
        id="ez-print-section"
      >
        <div>
          {/* Output Card Header - Master Highlight Container */}
          <div className="bg-[#E6F2EE] dark:bg-teal-950/40 border border-[#BDE0D5] dark:border-teal-800/60 rounded-[24px] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-semibold tracking-widest text-teal-800 dark:text-teal-300 uppercase block mb-1">
                Scoring Output
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-teal-950 dark:text-teal-100 tracking-tight m-0">
                Quick Chart · {totalQuestions}-Question Test
              </h2>
              <p className="text-teal-900/80 dark:text-teal-200/80 font-medium text-xs sm:text-sm mt-1 m-0">
                Scores for 0 to {totalQuestions} wrong answers.
              </p>
            </div>

            <button
              type="button"
              className="bg-[#134E48] hover:bg-[#0D3834] dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-full font-bold shadow-md px-6 py-2.5 transition-all inline-flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-95 self-start sm:self-auto print:hidden"
              onClick={handlePrint}
              onMouseEnter={preloadPdf}
              onFocus={preloadPdf}
              onTouchStart={preloadPdf}
              onPointerDown={preloadPdf}
              aria-label="Print or export grading chart"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Print Chart</span>
            </button>
          </div>

          {/* Quick Search / Jump Filter */}
          <div className="my-4 print:hidden">
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Hash className="w-3.5 h-3.5" />
              </span>
              <input
                id="filter-wrong-answers"
                type="number"
                min="0"
                max={totalQuestions}
                placeholder="Filter by wrong answers (e.g. 3)..."
                aria-label="Filter by wrong answers"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-[#F0F2F5] dark:bg-slate-800 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 pl-10 pr-8 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Grouped Letter Grade Sections */}
          <div className="space-y-6 max-h-[680px] overflow-y-auto pr-1">
            {/* Screen View: Rendered in progressive chunks up to renderedCount */}
            <div className={`space-y-6 ${needsPrintView ? 'print:hidden' : ''}`}>
              {visibleLetterGroups.map((group) => {
                const badgeClass = getBadgeClasses(group.letter);
                const pctColorClass = getPctColor(group.letter);
                const tierWrapperClass = getTierWrapperClass(group.letter);

                return (
                  <div key={group.letter} className={`${tierWrapperClass} space-y-3`}>
                    {/* Letter Group Header with Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-lg border shadow-xs select-none ${badgeClass}`}
                        >
                          {group.letter}
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          Grade {group.letter}
                        </span>
                      </div>

                      <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                        {group.letter === 'F' ? `< ${group.minThreshold || 60}%` : `≥ ${group.minThreshold}%`}
                      </span>
                    </div>

                    {/* 2-Column Responsive Score Chips (Memoized for high FPS) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {group.items.map((item) => (
                        <ScoreChip
                          key={item.wrong}
                          wrong={item.wrong}
                          percentage={item.percentage}
                          pctColorClass={pctColorClass}
                          showDecimals={showDecimals}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Progressive Chunking Controls (above 250 questions, e.g. 500-1000) */}
              {hasMoreItems && (
                <div className="pt-2 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700/90 shadow-xs">
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium text-center sm:text-left">
                    Showing <strong className="text-slate-900 dark:text-white font-mono">{Math.min(renderedCount, totalCalculatedItems)}</strong> of{' '}
                    <strong className="text-slate-900 dark:text-white font-mono">{totalCalculatedItems}</strong> questions.
                    <span className="block sm:inline sm:ml-1 text-slate-500 dark:text-slate-400">
                      Chunked for high performance on mobile.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleShowMore}
                      className="px-4 py-2 min-h-[44px] rounded-xl bg-teal-700 hover:bg-teal-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500 font-semibold text-xs transition-all shadow-sm shadow-teal-700/20 inline-flex items-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Show next {Math.min(CHUNK_SIZE, totalCalculatedItems - renderedCount)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShowAll}
                      className="px-3.5 py-2 min-h-[44px] rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-all cursor-pointer"
                    >
                      Show all {totalCalculatedItems}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Print View: only rendered for long tests where the screen list is chunked */}
            {needsPrintView && (
            <div className="hidden print:block space-y-6">
              {letterGroups.map((group) => {
                const badgeClass = getBadgeClasses(group.letter);
                const pctColorClass = getPctColor(group.letter);
                const tierWrapperClass = getTierWrapperClass(group.letter);

                return (
                  <div key={`print-${group.letter}`} className={`letter-group-section ${tierWrapperClass} space-y-3`}>
                    <div className="flex items-center justify-between pb-1 border-b border-black/10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-2xl flex items-center justify-center font-bold text-base border ${badgeClass}`}
                        >
                          {group.letter}
                        </div>
                        <span className="font-bold text-sm text-slate-900">
                          Grade {group.letter}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-600">
                        {group.letter === 'F' ? `< ${group.minThreshold || 60}%` : `≥ ${group.minThreshold}%`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {group.items.map((item) => (
                        <ScoreChip
                          key={`print-item-${item.wrong}`}
                          wrong={item.wrong}
                          percentage={item.percentage}
                          pctColorClass={pctColorClass}
                          showDecimals={showDecimals}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            {letterGroups.length === 0 && (
              <div
                role="status"
                aria-live="polite"
                className="py-10 px-6 text-center rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col items-center justify-center space-y-3 my-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-2xs">
                  <SearchX className="w-6 h-6 text-slate-400 dark:text-slate-400" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base m-0">
                    No matching question count found
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto m-0">
                    {searchFilter
                      ? `No results for "${searchFilter}" wrong answers. Enter a value between 0 and ${totalQuestions}.`
                      : `No results match your current settings.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2 min-h-[44px] rounded-full bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 font-semibold text-xs sm:text-sm shadow-sm shadow-teal-700/20 transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Clear filter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grade Scale Settings Modal */}
      {isScaleModalOpen && (
        <GradeScaleModal
          isOpen={isScaleModalOpen}
          onClose={() => setIsScaleModalOpen(false)}
          scaleType={scaleType}
          thresholds={thresholds}
          onSave={(newScaleType, newThresholds) => {
            setScaleType(newScaleType);
            setThresholds(newThresholds);
            setToast?.('Grade scale updated.');
          }}
          setToast={setToast}
        />
      )}
    </div>
  );
};
