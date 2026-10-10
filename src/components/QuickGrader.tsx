import React, { useState, useMemo, memo, useEffect, useCallback, useDeferredValue, useRef } from 'react';
import {
  Printer,
  ChevronDown,
  Hash,
  SearchX,
  RotateCcw,
  Minus,
  Plus,
  UserRound,
  Download,
  Copy,
} from 'lucide-react';
import { GradingScaleType } from '../types';
import {
  Cutoffs,
  DEFAULT_CUTOFFS,
  LetterBand,
  SCALE_PLUS_MINUS,
  scaleFromCutoffs,
} from '../utils/academicMath';
import {
  DecimalPrecision,
  MAX_QUESTIONS,
  QuickChartRow,
  buildQuickChart,
  gradeOneStudent,
  validateQuestionCount,
  validateWrongCount,
} from '../utils/gradeCalculations';
import { AmbientAura } from './AmbientAura';
import { SegmentedControl } from './ui/SegmentedControl';
import { CutoffFields, CutoffDrafts, cutoffsToDrafts, parseCutoffDrafts } from './CutoffFields';
import { triggerHapticFeedback, DEFAULT_HAPTIC_DURATION } from '../utils/haptics';
import { preloadPdf } from '../utils/toolPreloader';

interface LetterGroup {
  letter: string;
  minThreshold: number;
  items: { wrong: number; percentage: number; letter: string; text: string }[];
}

interface StudentEntry {
  n: number;
  wrong: number;
  percent: number;
  letter: string;
}

export interface QuickGraderProps {
  setToast?: (msg: string) => void;
}

const CHUNK_SIZE = 100;
const VIRTUALIZE_THRESHOLD = 250;
const MAX_TALLY = 500;
const STORAGE_KEY = 'egt:quick-grader:v1';
const COMMON_QUESTION_PRESETS = [10, 20, 25, 50, 100];

const BTN_SOLID =
  'inline-flex items-center justify-center gap-2 min-h-[48px] bg-[#4C5985] hover:bg-[#3D476B] dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-full font-bold shadow-md px-6 py-3 text-sm transition-all cursor-pointer active:scale-95';
const BTN_SOFT =
  'inline-flex items-center justify-center gap-2 min-h-[48px] bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 rounded-full font-semibold shadow-sm px-5 py-3 text-sm transition-all cursor-pointer active:scale-[0.98]';
const STEP_BTN =
  'w-12 h-12 min-w-[48px] shrink-0 inline-flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-100 border border-stone-300 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-700 shadow-sm cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed';
const FIELD =
  'w-full h-12 min-h-[48px] bg-[#F0F2F5] dark:bg-slate-800 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-4 py-0 leading-none focus:bg-white dark:focus:bg-slate-900 focus:border-transparent focus:ring-2 focus:ring-teal-500/40 transition-all font-bold text-lg text-center placeholder:text-slate-500 dark:placeholder:text-slate-400';
const CARD_SHELL =
  'bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative p-5 sm:p-8';

const familyOf = (letter: string) => letter.charAt(0);

const getBadgeClasses = (letter: string) => {
  switch (familyOf(letter)) {
    case 'A':
      return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60';
    case 'B':
      return 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60';
    case 'C':
      return 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60';
    case 'D':
      return 'bg-orange-50 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60';
    default:
      return 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60';
  }
};

const getTierWrapperClass = (letter: string) => {
  switch (familyOf(letter)) {
    case 'A':
      return 'bg-[#DCE1EF] dark:bg-teal-950/55 border border-[#B0BAD9] dark:border-teal-800/60 rounded-[24px] p-4';
    case 'B':
      return 'bg-[#D6E1FF] dark:bg-indigo-950/55 border border-[#A5BCF0] dark:border-indigo-800/60 rounded-[24px] p-4';
    case 'C':
      return 'bg-[#FFE8C2] dark:bg-amber-950/55 border border-[#F5C77A] dark:border-amber-800/60 rounded-[24px] p-4';
    case 'D':
      return 'bg-[#F0F2F5] dark:bg-slate-800/50 border border-[#D1D5DB] dark:border-slate-700/50 rounded-[24px] p-4';
    default:
      return 'bg-[#F9D6E1] dark:bg-rose-950/55 border border-[#EDA3BB] dark:border-rose-800/60 rounded-[24px] p-4';
  }
};

const getPctColor = (letter: string) => {
  switch (familyOf(letter)) {
    case 'A':
      return 'text-emerald-800 dark:text-emerald-300';
    case 'B':
      return 'text-indigo-800 dark:text-indigo-300';
    case 'C':
      return 'text-amber-800 dark:text-amber-300';
    case 'D':
      return 'text-orange-800 dark:text-orange-300';
    default:
      return 'text-rose-800 dark:text-rose-300';
  }
};

/** One chart row. On screen it is a 48px+ button that loads that wrong-answer count into the student panel. */
const ScoreChip = memo<{
  wrong: number;
  text: string;
  letter: string;
  pctColorClass: string;
  selected?: boolean;
  onPick?: (wrong: number) => void;
}>(({ wrong, text, letter, pctColorClass, selected, onPick }) => {
  const inner = (
    <>
      <span className="text-slate-800 dark:text-slate-200 text-sm font-medium">
        <strong className="text-rose-700 dark:text-rose-400 font-bold">{wrong}</strong> wrong
      </span>
      <span className={`font-bold text-sm font-mono tabular-nums ${pctColorClass}`}>{text}%</span>
    </>
  );
  const base =
    'ez-score-item flex items-center justify-between w-full min-h-[48px] px-4 py-3 rounded-xl shadow-xs border transition-colors text-left';
  if (!onPick) {
    return <div className={`${base} bg-white dark:bg-slate-800/90 border-black/5 dark:border-slate-700/60`}>{inner}</div>;
  }
  return (
    <button
      type="button"
      onClick={() => onPick(wrong)}
      aria-pressed={!!selected}
      aria-label={`${wrong} wrong, ${text}%, grade ${letter}. Use for the current student.`}
      className={`${base} cursor-pointer hover:bg-teal-50 dark:hover:bg-slate-700 ${
        selected
          ? 'bg-teal-50 dark:bg-slate-700 border-teal-600 dark:border-teal-400 ring-2 ring-teal-600/30'
          : 'bg-white dark:bg-slate-800/90 border-black/5 dark:border-slate-700/60'
      }`}
    >
      {inner}
    </button>
  );
});
ScoreChip.displayName = 'ScoreChip';

const formatStep = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

interface SavedState {
  total?: string;
  decimals?: boolean;
  scale?: GradingScaleType;
  half?: boolean;
  cutoffs?: CutoffDrafts;
}

export const QuickGrader: React.FC<QuickGraderProps> = ({ setToast }) => {
  // ---- Test setup ---------------------------------------------------------------------------
  const [totalInput, setTotalInput] = useState<string>('10');
  const [showDecimals, setShowDecimals] = useState<boolean>(false);
  const [halfPoints, setHalfPoints] = useState<boolean>(false);
  const [scaleType, setScaleType] = useState<GradingScaleType>('standard');
  const [cutoffDrafts, setCutoffDrafts] = useState<CutoffDrafts>(cutoffsToDrafts(DEFAULT_CUTOFFS));
  const [appliedCutoffs, setAppliedCutoffs] = useState<Cutoffs>(DEFAULT_CUTOFFS);
  const [filterInput, setFilterInput] = useState<string>('');
  const [renderedCount, setRenderedCount] = useState<number>(CHUNK_SIZE);

  // ---- One-student panel and class tally ----------------------------------------------------
  const [wrongInput, setWrongInput] = useState<string>('0');
  const [students, setStudents] = useState<StudentEntry[]>([]);

  const hydrated = useRef(false);

  // Restore saved settings after mount (never during render, so prerendered HTML and hydration match).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as SavedState;
        if (typeof saved.total === 'string' && validateQuestionCount(saved.total).value !== null) setTotalInput(saved.total);
        if (typeof saved.decimals === 'boolean') setShowDecimals(saved.decimals);
        if (typeof saved.half === 'boolean') setHalfPoints(saved.half);
        if (saved.scale === 'standard' || saved.scale === 'plus') setScaleType(saved.scale);
        if (saved.cutoffs && typeof saved.cutoffs === 'object') {
          const drafts: CutoffDrafts = {
            A: String(saved.cutoffs.A ?? ''),
            B: String(saved.cutoffs.B ?? ''),
            C: String(saved.cutoffs.C ?? ''),
            D: String(saved.cutoffs.D ?? ''),
          };
          const parsed = parseCutoffDrafts(drafts);
          if (parsed.cutoffs && !parsed.error) {
            setCutoffDrafts(drafts);
            setAppliedCutoffs(parsed.cutoffs);
          }
        }
      }
    } catch {
      /* storage blocked or empty: defaults stay */
    }
    hydrated.current = true;
  }, []);

  const cutoffCheck = useMemo(() => parseCutoffDrafts(cutoffDrafts), [cutoffDrafts]);
  // Only valid cutoffs are applied; while the fields hold an error the last good cutoffs stay in use.
  useEffect(() => {
    if (cutoffCheck.cutoffs && !cutoffCheck.error) setAppliedCutoffs(cutoffCheck.cutoffs);
  }, [cutoffCheck]);

  const totalCheck = useMemo(() => validateQuestionCount(totalInput), [totalInput]);
  const [total, setTotal] = useState<number>(10);
  useEffect(() => {
    if (totalCheck.value !== null) setTotal(totalCheck.value);
  }, [totalCheck.value]);

  // Save settings (cheap, only when something the teacher set changes).
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      const state: SavedState = {
        total: totalCheck.value !== null ? totalInput : String(total),
        decimals: showDecimals,
        half: halfPoints,
        scale: scaleType,
        cutoffs: cutoffsToDrafts(appliedCutoffs),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage blocked: the page still works, settings just are not remembered */
    }
  }, [totalInput, totalCheck.value, total, showDecimals, halfPoints, scaleType, appliedCutoffs]);

  const decimals: DecimalPrecision = showDecimals ? 1 : 0;
  const bands: LetterBand[] = useMemo(
    () => (scaleType === 'plus' ? SCALE_PLUS_MINUS : scaleFromCutoffs(appliedCutoffs)),
    [scaleType, appliedCutoffs]
  );
  const customCutoffsActive =
    scaleType === 'standard' &&
    (appliedCutoffs.A !== DEFAULT_CUTOFFS.A ||
      appliedCutoffs.B !== DEFAULT_CUTOFFS.B ||
      appliedCutoffs.C !== DEFAULT_CUTOFFS.C ||
      appliedCutoffs.D !== DEFAULT_CUTOFFS.D);

  // Large tests: the chart updates at lower priority so typing in the number field stays instant.
  const deferredTotal = useDeferredValue(total);
  const deferredBands = useDeferredValue(bands);
  const deferredDecimals = useDeferredValue(decimals);
  const deferredHalf = useDeferredValue(halfPoints);

  const rows: QuickChartRow[] = useMemo(
    () => buildQuickChart({ total: deferredTotal, decimals: deferredDecimals, halfPoints: deferredHalf, bands: deferredBands }),
    [deferredTotal, deferredDecimals, deferredHalf, deferredBands]
  );

  // Wrong-answer filter for the chart
  const filterCheck = useMemo(() => validateWrongCount(filterInput, total, halfPoints), [filterInput, total, halfPoints]);

  const letterGroups = useMemo<LetterGroup[]>(() => {
    const visible = filterCheck.value === null ? rows : rows.filter((r) => r.wrong === filterCheck.value);
    const order = deferredBands.map((b) => b.letter);
    const groups: LetterGroup[] = [];
    order.forEach((letter, idx) => {
      const items = visible.filter((r) => r.letter === letter).map((r) => ({
        wrong: r.wrong,
        percentage: r.percentage,
        letter: r.letter,
        text: r.formattedPercentage,
      }));
      if (items.length) {
        groups.push({ letter, minThreshold: deferredBands[idx].min, items });
      }
    });
    return groups;
  }, [rows, filterCheck.value, deferredBands]);

  const totalCalculatedItems = useMemo(() => letterGroups.reduce((acc, g) => acc + g.items.length, 0), [letterGroups]);

  useEffect(() => {
    setRenderedCount(CHUNK_SIZE);
  }, [total, showDecimals, halfPoints, scaleType, appliedCutoffs, filterInput]);

  const visibleLetterGroups = useMemo<LetterGroup[]>(() => {
    if (totalCalculatedItems <= VIRTUALIZE_THRESHOLD) return letterGroups;
    let budget = renderedCount;
    const result: LetterGroup[] = [];
    for (const group of letterGroups) {
      if (budget <= 0) break;
      if (group.items.length <= budget) {
        result.push(group);
        budget -= group.items.length;
      } else {
        result.push({ ...group, items: group.items.slice(0, budget) });
        budget = 0;
      }
    }
    return result;
  }, [letterGroups, totalCalculatedItems, renderedCount]);

  const hasMoreItems = totalCalculatedItems > VIRTUALIZE_THRESHOLD && renderedCount < totalCalculatedItems;
  const needsPrintView = totalCalculatedItems > VIRTUALIZE_THRESHOLD;
  const pointsPerQuestion = 100 / total;

  // ---- One-student grading ------------------------------------------------------------------
  const step = halfPoints ? 0.5 : 1;
  const wrongCheck = useMemo(() => validateWrongCount(wrongInput, total, halfPoints), [wrongInput, total, halfPoints]);
  const wrongNum = wrongCheck.value;
  const student = useMemo(
    () => (wrongNum === null ? null : gradeOneStudent(total, wrongNum, decimals, bands)),
    [wrongNum, total, decimals, bands]
  );

  const adjustWrong = useCallback(
    (delta: number) => {
      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
      setWrongInput((prev) => {
        const current = validateWrongCount(prev, total, true).value ?? 0;
        const next = Math.min(total, Math.max(0, current + delta));
        return formatStep(next);
      });
    },
    [total]
  );

  const pickWrong = useCallback((wrong: number) => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setWrongInput(formatStep(wrong));
    const panel = document.getElementById('student-panel');
    if (panel && typeof panel.scrollIntoView === 'function') {
      panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, []);

  const nextStudent = useCallback(() => {
    if (wrongNum === null || !student) {
      setToast?.('Enter the wrong answers first.');
      return;
    }
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setStudents((prev) =>
      prev.length >= MAX_TALLY
        ? prev
        : [...prev, { n: prev.length + 1, wrong: wrongNum, percent: student.percentage, letter: student.letter }]
    );
    setWrongInput('0');
    setToast?.(`Student ${students.length + 1} saved: ${student.formattedPercentage}% ${student.letter}`);
  }, [wrongNum, student, students.length, setToast]);

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const inField = target instanceof HTMLInputElement;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      adjustWrong(step);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      adjustWrong(-step);
    } else if ((e.key === 'r' || e.key === 'R') && !inField && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      nextStudent();
    } else if (e.key === 'Enter' && inField && target.id === 'student-wrong') {
      e.preventDefault();
      nextStudent();
    }
  };

  const tally = useMemo(() => {
    const counts: Record<string, number> = {};
    let sum = 0;
    students.forEach((s) => {
      counts[s.letter] = (counts[s.letter] || 0) + 1;
      sum += s.percent;
    });
    return { counts, average: students.length ? sum / students.length : 0 };
  }, [students]);

  const csvText = useMemo(() => {
    const header = 'Student,Wrong,Correct,Percent,Letter';
    const lines = students.map((s) => `${s.n},${s.wrong},${formatStep(total - s.wrong)},${s.percent.toFixed(decimals)},${s.letter}`);
    return [`Questions,${total}`, header, ...lines].join('\n');
  }, [students, total, decimals]);

  const downloadCsv = () => {
    try {
      const blob = new Blob([csvText + '\n'], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `class-grades-${total}-questions.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setToast?.('CSV downloaded.');
    } catch {
      setToast?.('Could not download the CSV. Use Copy instead.');
    }
  };

  const copyCsv = async () => {
    try {
      await navigator.clipboard.writeText(csvText);
      setToast?.('Copied. Paste it into a spreadsheet.');
    } catch {
      setToast?.('Copy is not available in this browser.');
    }
  };

  // ---- Chart paging and printing ------------------------------------------------------------
  const handleShowMore = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setRenderedCount((prev) => Math.min(totalCalculatedItems, prev + CHUNK_SIZE));
  };
  const handleShowAll = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setRenderedCount(totalCalculatedItems);
  };

  const exportPdf = async () => {
    const { exportQuickGradePdf } = await import('../utils/pdfExport');
    await exportQuickGradePdf({
      totalQuestions: total,
      scaleType,
      showDecimals,
      thresholds: appliedCutoffs,
      letterGroups: letterGroups.map((g) => ({
        letter: g.letter,
        minThreshold: g.minThreshold,
        items: g.items.map((i) => ({ wrong: i.wrong, percentage: i.percentage, letter: i.letter })),
      })),
    });
  };

  const handlePrint = async () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
    if (isInIframe) {
      try {
        setToast?.('Preparing printable grading chart...');
        await exportPdf();
        setToast?.(`Generated printable PDF grading chart for ${total} questions!`);
      } catch {
        setToast?.('Could not generate printable chart.');
      }
      return;
    }
    try {
      window.print();
    } catch {
      try {
        await exportPdf();
        setToast?.(`Generated printable PDF grading chart for ${total} questions!`);
      } catch {
        setToast?.('Print is unavailable in this browser.');
      }
    }
  };

  const adjustTotal = (delta: number) => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    const base = totalCheck.value ?? total;
    setTotalInput(String(Math.min(MAX_QUESTIONS, Math.max(1, base + delta))));
  };

  const resetCutoffs = () => {
    setCutoffDrafts(cutoffsToDrafts(DEFAULT_CUTOFFS));
    setAppliedCutoffs(DEFAULT_CUTOFFS);
    setToast?.('Cutoffs reset to 90 / 80 / 70 / 60.');
  };

  const lowestPassing = bands.length > 1 ? bands[bands.length - 2].min : 60;
  const scaleLabel = scaleType === 'standard' ? 'Standard A–F' : 'Plus / minus';
  const selectedWrong = wrongNum;

  return (
    <div className="relative tool-layout font-sans">
      <AmbientAura />

      {/* Left column: setup + one-student grading. Right column: the quick chart. */}
      <div className="flex flex-col gap-6 min-w-0">
      {/* 1. Setup card */}
      <section aria-label="Test Configuration" className={`${CARD_SHELL} overflow-visible flex flex-col gap-6 print:hidden`}>
        <div className="pb-5 border-b border-slate-200/60 dark:border-slate-800">
          <span className="text-xs font-semibold tracking-widest text-slate-700 dark:text-slate-300 uppercase block mb-1">Test Configuration</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">Grading Parameters</h2>
          <p className="text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base mt-1 m-0">
            Set the number of questions, then grade one student at a time or print the chart.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="num-questions" className="text-xs font-semibold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                Number of questions
              </label>
              <span id="num-questions-rule" className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                Whole number, 1 to {MAX_QUESTIONS}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className={STEP_BTN} onClick={() => adjustTotal(-1)} disabled={total <= 1} aria-label="One fewer question">
                <Minus className="w-5 h-5" aria-hidden="true" />
              </button>
              <input
                id="num-questions"
                type="text"
                inputMode="numeric"
                enterKeyHint="done"
                autoComplete="off"
                className={`${FIELD} ${totalCheck.error ? 'border-rose-500 focus:border-rose-500' : ''}`}
                value={totalInput}
                onChange={(e) => setTotalInput(e.target.value)}
                placeholder="10"
                aria-invalid={totalCheck.error ? true : undefined}
                aria-describedby={totalCheck.error ? 'num-questions-error num-questions-rule' : 'num-questions-rule'}
              />
              <button type="button" className={STEP_BTN} onClick={() => adjustTotal(1)} disabled={total >= MAX_QUESTIONS} aria-label="One more question">
                <Plus className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            {totalCheck.error && (
              <p id="num-questions-error" role="alert" className="m-0 text-sm font-semibold text-rose-700 dark:text-rose-400">
                {totalCheck.error} Showing the chart for {total} questions until this is fixed.
              </p>
            )}

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mr-1">Presets:</span>
              <SegmentedControl
                ariaLabel="Common test sizes"
                variant="chips"
                optionClassName="preset-btn"
                value={totalCheck.error ? null : total}
                onChange={(v) => setTotalInput(String(v))}
                options={COMMON_QUESTION_PRESETS.map((q) => ({
                  value: q,
                  label: q,
                  onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION),
                }))}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            onMouseEnter={preloadPdf}
            onFocus={preloadPdf}
            onTouchStart={preloadPdf}
            className={`w-full ${BTN_SOLID}`}
            aria-label="Print the grading chart"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            <span>Print Chart</span>
          </button>

          {/* Scale, cutoffs and precision, inline instead of a pop-up */}
          <details className="group rounded-[24px] border border-stone-200/80 dark:border-slate-800 px-4" open={customCutoffsActive || undefined}>
            <summary className="flex items-center justify-between min-h-[48px] cursor-pointer list-none text-sm font-semibold text-slate-800 dark:text-slate-200 select-none">
              <span>
                Scale, cutoffs and decimals
                <span className="ml-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                  {scaleLabel}
                  {customCutoffsActive ? ' · custom' : ''}
                </span>
              </span>
              <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="pb-4 pt-2 flex flex-col gap-5">
              <SegmentedControl
                ariaLabel="Grading scale"
                fill
                value={scaleType}
                onChange={(v) => setScaleType(v)}
                options={[
                  { value: 'standard', label: 'A, B, C, D, F', onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION) },
                  { value: 'plus', label: 'Plus / minus', onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION) },
                ]}
              />

              {scaleType === 'standard' ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 m-0">
                    Minimum percentage for each grade
                  </p>
                  <CutoffFields
                    idPrefix="quick-cutoff"
                    drafts={cutoffDrafts}
                    onChange={(k, v) => setCutoffDrafts((prev) => ({ ...prev, [k]: v }))}
                    error={cutoffCheck.error}
                  />
                  <button type="button" className={BTN_SOFT} onClick={resetCutoffs}>
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Reset to 90 / 80 / 70 / 60</span>
                  </button>
                  <p className="text-xs text-slate-600 dark:text-slate-400 m-0">Your cutoffs are remembered on this device only.</p>
                </div>
              ) : (
                <p className="text-sm text-slate-700 dark:text-slate-300 m-0">
                  Fixed plus/minus cutoffs: A+ 97, A 93, A- 90, B+ 87, B 83, B- 80, C+ 77, C 73, C- 70, D+ 67, D 63, D- 60.
                </p>
              )}

              <label className="flex items-center justify-between gap-4 min-h-[48px] cursor-pointer select-none">
                <span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">Show decimals</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Display scores like 92.5%</span>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  className="w-7 h-7 shrink-0 accent-teal-600 cursor-pointer"
                  checked={showDecimals}
                  onChange={(e) => {
                    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                    setShowDecimals(e.target.checked);
                  }}
                />
              </label>

              <label className="flex items-center justify-between gap-4 min-h-[48px] cursor-pointer select-none">
                <span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">Half points</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Allow 0.5 wrong for partial credit (up to 200 questions)</span>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  className="w-7 h-7 shrink-0 accent-teal-600 cursor-pointer"
                  checked={halfPoints}
                  onChange={(e) => {
                    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                    setHalfPoints(e.target.checked);
                  }}
                />
              </label>
            </div>
          </details>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#DCE1EF] dark:bg-teal-950/60 rounded-[20px] p-4 border border-[#B0BAD9] dark:border-teal-800/50 shadow-sm">
              <span className="text-xs font-semibold text-slate-700 dark:text-teal-300 uppercase tracking-wider block">Each worth</span>
              <strong className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                {pointsPerQuestion.toFixed(pointsPerQuestion % 1 === 0 ? 0 : 2)}%
              </strong>
              <span className="text-xs text-slate-700 dark:text-teal-300">Value per question</span>
            </div>
            <div className="bg-[#FFE8C2] dark:bg-amber-950/60 rounded-[20px] p-4 border border-[#F5C77A] dark:border-amber-800/50 shadow-sm">
              <span className="text-xs font-semibold text-slate-700 dark:text-amber-300 uppercase tracking-wider block">Lowest passing grade</span>
              <strong className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">≥ {lowestPassing}%</strong>
              <span className="text-xs text-slate-700 dark:text-amber-300">Below this is an F</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Grade one student + class tally */}
      <section
        id="student-panel"
        aria-label="Grade one student"
        onKeyDown={onPanelKeyDown}
        className={`${CARD_SHELL} space-y-5 print:hidden`}
      >
        <div className="flex items-center gap-2">
          <UserRound className="w-5 h-5 text-teal-700 dark:text-teal-300" aria-hidden="true" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">Grade one student</h2>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="student-wrong" className="text-xs font-semibold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
            Wrong answers{halfPoints ? ' (halves allowed)' : ''}
          </label>
          <div className="flex items-center gap-2">
            <button type="button" className={STEP_BTN} onClick={() => adjustWrong(-step)} disabled={(wrongNum ?? 0) <= 0} aria-label="One fewer wrong answer">
              <Minus className="w-5 h-5" aria-hidden="true" />
            </button>
            <input
              id="student-wrong"
              type="text"
              inputMode={halfPoints ? 'decimal' : 'numeric'}
              enterKeyHint="next"
              autoComplete="off"
              value={wrongInput}
              onChange={(e) => setWrongInput(e.target.value)}
              className={`${FIELD} ${wrongCheck.error ? 'border-rose-500 focus:border-rose-500' : ''}`}
              aria-invalid={wrongCheck.error ? true : undefined}
              aria-describedby={wrongCheck.error ? 'student-wrong-error' : undefined}
            />
            <button type="button" className={STEP_BTN} onClick={() => adjustWrong(step)} disabled={(wrongNum ?? 0) >= total} aria-label="One more wrong answer">
              <Plus className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          {wrongCheck.error && (
            <p id="student-wrong-error" role="alert" className="m-0 text-sm font-semibold text-rose-700 dark:text-rose-400">
              {wrongCheck.error}
            </p>
          )}
        </div>

        {/* The only live region in the tool: one short sentence, announced politely. */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="bg-[#DCE1EF] dark:bg-teal-950/60 border border-[#B0BAD9] dark:border-teal-800/60 rounded-[24px] p-5 shadow-sm"
        >
          {student ? (
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">
                  {formatStep(total - (wrongNum ?? 0))} of {total} correct
                </span>
                <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">
                  {student.formattedPercentage}%
                </strong>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Grade</span>
                <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100">{student.letter}</strong>
              </div>
            </div>
          ) : (
            <p className="m-0 text-sm font-semibold text-teal-950 dark:text-teal-100">Enter the number of wrong answers to see the grade.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" className={BTN_SOLID} onClick={nextStudent}>
            <span>Next student</span>
            <kbd className="hidden sm:inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded bg-white/20 text-xs font-mono">R</kbd>
          </button>
          <button
            type="button"
            className={BTN_SOFT}
            onClick={() => setWrongInput('0')}
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Clear</span>
          </button>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 m-0">
          Shortcuts while this panel is focused: ↑ ↓ change wrong answers, Enter or R saves the student and starts the next one. You can also tap any row in the chart.
        </p>

        {students.length > 0 && (
          <div className="border-t border-slate-200/70 dark:border-slate-800 pt-5 space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 m-0">Class tally</h3>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {students.length} student{students.length === 1 ? '' : 's'} · average{' '}
                <strong className="font-mono">{tally.average.toFixed(1)}%</strong>
              </span>
            </div>
            <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
              {bands
                .filter((b) => tally.counts[b.letter])
                .map((b) => (
                  <li key={b.letter} className={`inline-flex items-center gap-2 px-3 min-h-[48px] rounded-full text-sm font-bold ${getBadgeClasses(b.letter)}`}>
                    <span>{b.letter}</span>
                    <span className="font-mono">{tally.counts[b.letter]}</span>
                  </li>
                ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={BTN_SOFT} onClick={downloadCsv}>
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download CSV</span>
              </button>
              <button type="button" className={BTN_SOFT} onClick={copyCsv}>
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>Copy for spreadsheet</span>
              </button>
              <button
                type="button"
                className={BTN_SOFT}
                onClick={() => {
                  setStudents([]);
                  setToast?.('Class tally cleared.');
                }}
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Clear tally</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 m-0">The tally lives in this tab only. It is never sent anywhere and is gone when you close the page.</p>
          </div>
        )}
      </section>

      </div>

      {/* 3. Quick chart */}
      <section
        aria-label="Scoring Output Chart"
        className={`${CARD_SHELL} overflow-visible flex flex-col justify-between min-w-0`}
        id="ez-print-section"
        data-print-area
        data-print-title={`Quick Grade Chart — ${total}-question test`}
      >
        <div>
          <div className="bg-[#DCE1EF] dark:bg-teal-950/60 border border-[#B0BAD9] dark:border-teal-800/60 rounded-[24px] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block mb-1">Scoring Output</span>
              <h2 className="text-xl sm:text-2xl font-bold text-teal-950 dark:text-teal-100 tracking-tight m-0">
                Quick Chart · {total}-Question Test
              </h2>
              <p className="text-teal-950/90 dark:text-teal-100/90 font-medium text-sm mt-1 m-0">
                Scores for 0 to {total} wrong answers
                {halfPoints && total <= 200 ? ', in half-point steps' : ''}.
              </p>
            </div>
            <button
              type="button"
              className={`${BTN_SOLID} self-start sm:self-auto print:hidden`}
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

          {/* Short summary only; the chart itself is not a live region. */}
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {totalCalculatedItems} result{totalCalculatedItems === 1 ? '' : 's'} for a {total}-question test, {scaleLabel} scale.
          </p>

          <div className="my-4 print:hidden">
            <label htmlFor="filter-wrong-answers" className="sr-only">Filter by wrong answers</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                <Hash className="w-4 h-4" aria-hidden="true" />
              </span>
              <input
                id="filter-wrong-answers"
                type="text"
                inputMode={halfPoints ? 'decimal' : 'numeric'}
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Jump to a wrong-answer count, e.g. 3"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                aria-invalid={filterCheck.error ? true : undefined}
                aria-describedby={filterCheck.error ? 'filter-error' : undefined}
                className="w-full min-h-[48px] bg-[#F0F2F5] dark:bg-slate-800 border-2 border-transparent text-stone-900 dark:text-white rounded-full py-3 pl-11 pr-24 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent focus:ring-2 focus:ring-teal-500/40 transition-all font-bold text-base placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
              {filterInput && (
                <button
                  type="button"
                  onClick={() => setFilterInput('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[48px] min-w-[48px] px-4 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700"
                  aria-label="Clear filter"
                >
                  Clear
                </button>
              )}
            </div>
            {filterCheck.error && (
              <p id="filter-error" role="alert" className="m-0 mt-2 text-sm font-semibold text-rose-700 dark:text-rose-400">
                {filterCheck.error}
              </p>
            )}
          </div>

          {/* The chart scrolls inside its own box. Keep padding so focus rings are never clipped. */}
          <div className="space-y-6 max-h-[680px] overflow-y-auto p-1">
            <div className={`space-y-6 ${needsPrintView ? 'print:hidden' : ''}`}>
              {visibleLetterGroups.map((group) => {
                const pctColorClass = getPctColor(group.letter);
                return (
                  <div key={group.letter} className={`${getTierWrapperClass(group.letter)} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg border shadow-xs select-none ${getBadgeClasses(group.letter)}`}>
                          {group.letter}
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Grade {group.letter}</span>
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                        {group.letter === 'F' ? `< ${lowestPassing}%` : `≥ ${group.minThreshold}%`}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {group.items.map((item) => (
                        <ScoreChip
                          key={item.wrong}
                          wrong={item.wrong}
                          text={item.text}
                          letter={item.letter}
                          pctColorClass={pctColorClass}
                          selected={selectedWrong === item.wrong}
                          onPick={pickWrong}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {hasMoreItems && (
                <div className="pt-2 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700/90 shadow-xs">
                  <div className="text-sm text-slate-700 dark:text-slate-300 font-medium text-center sm:text-left">
                    Showing <strong className="text-slate-900 dark:text-white font-mono">{Math.min(renderedCount, totalCalculatedItems)}</strong> of{' '}
                    <strong className="text-slate-900 dark:text-white font-mono">{totalCalculatedItems}</strong> rows.
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button type="button" onClick={handleShowMore} className={BTN_SOLID}>
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                      <span>Show next {Math.min(CHUNK_SIZE, totalCalculatedItems - renderedCount)}</span>
                    </button>
                    <button type="button" onClick={handleShowAll} className={BTN_SOFT}>
                      Show all {totalCalculatedItems}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {needsPrintView && (
              <div className="hidden print:block space-y-6">
                {letterGroups.map((group) => {
                  const pctColorClass = getPctColor(group.letter);
                  return (
                    <div key={`print-${group.letter}`} className={`letter-group-section ${getTierWrapperClass(group.letter)} space-y-3`}>
                      <div className="flex items-center justify-between pb-1 border-b border-black/10">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-2xl flex items-center justify-center font-bold text-base border ${getBadgeClasses(group.letter)}`}>
                            {group.letter}
                          </div>
                          <span className="font-bold text-sm text-slate-900">Grade {group.letter}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-700">
                          {group.letter === 'F' ? `< ${lowestPassing}%` : `≥ ${group.minThreshold}%`}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {group.items.map((item) => (
                          <ScoreChip key={`print-item-${item.wrong}`} wrong={item.wrong} text={item.text} letter={item.letter} pctColorClass={pctColorClass} />
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
                className="py-10 px-6 text-center rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col items-center justify-center space-y-3 my-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center">
                  <SearchX className="w-6 h-6 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-base m-0">No matching wrong-answer count</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto m-0">
                    {filterInput
                      ? `There is no row for "${filterInput}" wrong answers. Enter a value from 0 to ${total}.`
                      : 'No results match your current settings.'}
                  </p>
                </div>
                <button type="button" onClick={() => setFilterInput('')} className={BTN_SOLID}>
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Clear filter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
