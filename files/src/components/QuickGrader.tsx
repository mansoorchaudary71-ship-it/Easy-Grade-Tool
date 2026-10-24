import React, { useState, useMemo, useEffect, useCallback, useDeferredValue, useRef } from 'react';
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
  SlidersHorizontal,
} from 'lucide-react';
import { GradingScaleType } from '../types';
import {
  Cutoffs,
  DEFAULT_CUTOFFS,
  LetterBand,
  SCALE_PLUS_MINUS,
  SCALE_SEVEN_POINT,
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
import { QuickChartTable } from './QuickChartTable';
import { gradeTone, NEUTRAL_TONE } from '../utils/gradeTone';
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

/* 60-30-10: neutral canvas (60%), white / slate cards and borders (30%), ONE blue-600 accent (10%) for primary actions.
   White on blue-600 is 5.2:1 and white on blue-700 (hover) is 6.7:1, so both pass WCAG AA for text. */
const BTN_SOLID =
  'inline-flex items-center justify-center gap-2 min-h-[48px] min-w-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-sm px-6 py-3 text-sm transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-900';
const BTN_OUTLINE =
  'inline-flex items-center justify-center gap-2 min-h-[48px] min-w-[44px] bg-white dark:bg-slate-900 text-blue-800 dark:text-blue-300 border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full font-bold px-6 py-3 text-sm transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';
const BTN_SOFT =
  'inline-flex items-center justify-center gap-2 min-h-[48px] min-w-[44px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full font-semibold shadow-sm px-5 py-3 text-sm transition-colors cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';
const STEP_BTN =
  'w-12 h-12 min-w-[48px] shrink-0 inline-flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-500 dark:border-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm cursor-pointer transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';
/* Inputs: a 2px slate-500 border (4.8:1 on white) so the field edge passes the 3:1 non-text contrast rule. */
const FIELD =
  'w-full h-12 min-h-[48px] bg-white dark:bg-slate-800 border-2 border-slate-500 dark:border-slate-400 text-slate-900 dark:text-white rounded-full px-4 py-0 leading-none focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-600/30 dark:focus:ring-blue-400/40 focus:outline-none transition-colors font-bold text-lg text-center placeholder:text-slate-600 dark:placeholder:text-slate-300';
const FIELD_LABEL = 'text-sm font-semibold text-slate-800 dark:text-slate-100';
const HELP_TEXT = 'text-xs text-slate-600 dark:text-slate-300';
/** INPUT card: white, light border, flat. The cards a person types into. */
const CARD_INPUT =
  'bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative p-4 sm:p-6';
/** OUTPUT card: tinted, stronger shadow and a 4px accent rule on top, so results read as a different layer from the inputs. */
const CARD_OUTPUT =
  'bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-300 border-t-4 border-t-blue-600 dark:border-slate-600 dark:border-t-blue-400 shadow-lg shadow-slate-900/10 dark:shadow-black/30 relative p-4 sm:p-6';

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
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);
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
        if (saved.scale === 'standard' || saved.scale === 'plus' || saved.scale === 'seven') setScaleType(saved.scale);
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
    () => (scaleType === 'plus' ? SCALE_PLUS_MINUS : scaleType === 'seven' ? SCALE_SEVEN_POINT : scaleFromCutoffs(appliedCutoffs)),
    [scaleType, appliedCutoffs]
  );
  const customCutoffsActive =
    scaleType === 'standard' &&
    (appliedCutoffs.A !== DEFAULT_CUTOFFS.A ||
      appliedCutoffs.B !== DEFAULT_CUTOFFS.B ||
      appliedCutoffs.C !== DEFAULT_CUTOFFS.C ||
      appliedCutoffs.D !== DEFAULT_CUTOFFS.D);

  // Miller's Law: advanced settings stay folded away, but open by themselves when saved custom cutoffs are in use.
  useEffect(() => {
    if (customCutoffsActive) setAdvancedOpen(true);
  }, [customCutoffsActive]);

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

  const handleDownloadPdf = async () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    try {
      setToast?.('Preparing PDF...');
      await exportPdf();
      setToast?.(`PDF downloaded for the ${total}-question chart.`);
    } catch {
      setToast?.('Could not create the PDF. Use Print chart and choose Save as PDF.');
    }
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
  const scaleLabel = scaleType === 'standard' ? 'Standard A–F' : scaleType === 'seven' ? '7-point scale' : 'Plus / minus';
  const selectedWrong = wrongNum;

  const advancedSummary = [
    scaleLabel,
    showDecimals ? '1 decimal' : 'Whole numbers',
    customCutoffsActive ? 'Custom cutoffs' : null,
    halfPoints ? 'Half points' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const studentTone = student ? gradeTone(student.letter) : null;
  const StudentIcon = studentTone?.Icon;

  return (
    <div className="relative tool-layout font-sans">
      <AmbientAura />

      {/* Left column: INPUT cards (setup + one-student grading). Right column: the OUTPUT card (quick chart). */}
      <div className="flex flex-col gap-6 min-w-0">
        {/* 1. Setup card (input) */}
        <section aria-label="Test Configuration" className={`${CARD_INPUT} overflow-visible flex flex-col gap-6 print:hidden`}>
          <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight m-0">Test configuration</h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base mt-1 m-0">
              Set the number of questions, then grade one student at a time or print the chart.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Primary inputs: always visible */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <label htmlFor="num-questions" className={FIELD_LABEL}>
                  Number of questions
                </label>
                <span id="num-questions-rule" className={HELP_TEXT}>
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
                  className={`${FIELD} ${totalCheck.error ? 'border-rose-600 dark:border-rose-400 focus:border-rose-600' : ''}`}
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
                <p id="num-questions-error" role="alert" className="m-0 text-sm font-semibold text-rose-700 dark:text-rose-300">
                  {totalCheck.error} Showing the chart for {total} questions until this is fixed.
                </p>
              )}

              <div className="flex items-center gap-x-3 gap-y-2 pt-1 flex-wrap">
                <span className={FIELD_LABEL}>Presets</span>
                <SegmentedControl
                  ariaLabel="Common test sizes"
                  variant="chips"
                  optionClassName="preset-btn min-w-[44px]"
                  value={totalCheck.error ? null : total}
                  onChange={(v) => setTotalInput(String(v))}
                  options={COMMON_QUESTION_PRESETS.map((q) => ({
                    value: q,
                    label: q,
                    ariaLabel: `${q} questions`,
                    onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION),
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrint}
                onMouseEnter={preloadPdf}
                onFocus={preloadPdf}
                onTouchStart={preloadPdf}
                className={`w-full ${BTN_OUTLINE}`}
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Print chart</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                onMouseEnter={preloadPdf}
                onFocus={preloadPdf}
                onTouchStart={preloadPdf}
                className={`w-full ${BTN_OUTLINE}`}
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download PDF</span>
              </button>
            </div>
            <a
              href="#ez-print-section"
              className="md:hidden self-start text-sm font-semibold text-blue-700 dark:text-blue-300 underline underline-offset-2 min-h-[44px] inline-flex items-center"
            >
              Jump to the chart ↓
            </a>

            {/* Advanced settings: folded away by default (Miller's Law). Scale, decimal precision, cutoffs, half points. */}
            <div className="rounded-2xl border border-slate-300 dark:border-slate-600">
              <button
                type="button"
                id="advanced-settings-toggle"
                aria-expanded={advancedOpen}
                aria-controls="advanced-settings-panel"
                onClick={() => setAdvancedOpen((v) => !v)}
                className="flex w-full min-h-[56px] cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <SlidersHorizontal className="w-5 h-5 shrink-0 text-slate-700 dark:text-slate-200" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-slate-50">Advanced settings</span>
                    <span className="block truncate text-xs text-slate-600 dark:text-slate-300">{advancedSummary}</span>
                  </span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-slate-700 dark:text-slate-200 transition-transform duration-200 motion-reduce:transition-none ${advancedOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {advancedOpen && (
                <div
                  id="advanced-settings-panel"
                  role="group"
                  aria-labelledby="advanced-settings-toggle"
                  className="flex flex-col gap-6 border-t border-slate-200 dark:border-slate-700 px-4 pb-5 pt-4"
                >
                  <div className="flex flex-col gap-3">
                    <p className={`${FIELD_LABEL} m-0`}>Grading scale</p>
                    <SegmentedControl
                      ariaLabel="Grading scale"
                      fill
                      value={scaleType}
                      onChange={(v) => setScaleType(v)}
                      options={[
                        { value: 'standard', label: 'A, B, C, D, F', onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION) },
                        { value: 'plus', label: 'Plus / minus', onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION) },
                        { value: 'seven', label: '7-point', onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION) },
                      ]}
                    />

                    {scaleType === 'standard' ? (
                      <div className="space-y-3 pt-1">
                        <p className={`${FIELD_LABEL} m-0`}>Customize cutoffs</p>
                        <p className={`${HELP_TEXT} m-0`}>Minimum percentage for each grade.</p>
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
                        <p className={`${HELP_TEXT} m-0`}>Your cutoffs are remembered on this device only.</p>
                      </div>
                    ) : scaleType === 'plus' ? (
                      <p className="text-sm text-slate-700 dark:text-slate-300 m-0">
                        Fixed plus/minus cutoffs: A+ 97, A 93, A- 90, B+ 87, B 83, B- 80, C+ 77, C 73, C- 70, D+ 67, D 63, D- 60.
                      </p>
                    ) : (
                      <p className="text-sm text-slate-700 dark:text-slate-300 m-0">
                        Fixed 7-point cutoffs used by many schools: A 93, B 86, C 79, D 72, F below 72.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200 dark:border-slate-700 pt-5">
                    <p className={`${FIELD_LABEL} m-0`}>Decimal precision</p>
                    <SegmentedControl
                      ariaLabel="Decimal precision"
                      fill
                      value={showDecimals ? 1 : 0}
                      onChange={(v) => setShowDecimals(v === 1)}
                      options={[
                        { value: 0, label: 'Whole numbers', ariaLabel: 'Whole numbers, like 92%', onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION) },
                        { value: 1, label: '1 decimal', ariaLabel: 'One decimal place, like 92.5%', onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION) },
                      ]}
                    />

                    <label className="flex items-center justify-between gap-4 min-h-[48px] cursor-pointer select-none">
                      <span>
                        <span className={`${FIELD_LABEL} block`}>Half points</span>
                        <span className={HELP_TEXT}>Allow 0.5 wrong for partial credit (up to 200 questions)</span>
                      </span>
                      <input
                        type="checkbox"
                        role="switch"
                        className="w-7 h-7 shrink-0 accent-blue-600 cursor-pointer"
                        checked={halfPoints}
                        onChange={(e) => {
                          triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                          setHalfPoints(e.target.checked);
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className={`${NEUTRAL_TONE.surface} rounded-2xl p-4 border`}>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">Each worth</span>
                <strong className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                  {pointsPerQuestion.toFixed(pointsPerQuestion % 1 === 0 ? 0 : 2)}%
                </strong>
                <span className={HELP_TEXT}>Value per question</span>
              </div>
              <div className={`${NEUTRAL_TONE.surface} rounded-2xl p-4 border`}>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">Lowest passing grade</span>
                <strong className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">≥ {lowestPassing}%</strong>
                <span className={HELP_TEXT}>Below this is an F</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Grade one student + class tally (input + live readout) */}
        <section
          id="student-panel"
          aria-label="Grade one student"
          onKeyDown={onPanelKeyDown}
          className={`${CARD_INPUT} space-y-5 print:hidden`}
        >
          <div className="flex items-center gap-2">
            <UserRound className="w-5 h-5 text-slate-700 dark:text-slate-200" aria-hidden="true" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight m-0">Grade one student</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="student-wrong" className={FIELD_LABEL}>
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
                className={`${FIELD} ${wrongCheck.error ? 'border-rose-600 dark:border-rose-400 focus:border-rose-600' : ''}`}
                aria-invalid={wrongCheck.error ? true : undefined}
                aria-describedby={wrongCheck.error ? 'student-wrong-error' : undefined}
              />
              <button type="button" className={STEP_BTN} onClick={() => adjustWrong(step)} disabled={(wrongNum ?? 0) >= total} aria-label="One more wrong answer">
                <Plus className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            {wrongCheck.error && (
              <p id="student-wrong-error" role="alert" className="m-0 text-sm font-semibold text-rose-700 dark:text-rose-300">
                {wrongCheck.error}
              </p>
            )}
          </div>

          {/* The result. The only live region in the tool: one short sentence, announced politely.
              The grade is the largest thing on the page; colour (green / amber / rose) is backed by an icon and a word. */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`rounded-3xl border-2 p-5 sm:p-6 shadow-md ${studentTone ? studentTone.surface : NEUTRAL_TONE.surface}`}
          >
            {student && studentTone && StudentIcon ? (
              <div className="space-y-3">
                <p className="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatStep(total - (wrongNum ?? 0))} of {total} correct
                </p>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">Score</span>
                    <strong className={`block text-5xl sm:text-6xl font-extrabold leading-none font-mono tabular-nums ${studentTone.text}`}>
                      {student.formattedPercentage}%
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">Grade</span>
                    <strong className={`block text-6xl sm:text-7xl font-black leading-none ${studentTone.text}`}>{student.letter}</strong>
                  </div>
                </div>
                <p className={`m-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${studentTone.badge}`}>
                  <StudentIcon className="w-4 h-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                  <span>{studentTone.label}</span>
                </p>
              </div>
            ) : (
              <p className={`m-0 text-sm font-semibold ${NEUTRAL_TONE.text}`}>Enter the number of wrong answers to see the grade.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className={BTN_SOLID} onClick={nextStudent}>
              <span>Next student</span>
              <kbd className="hidden sm:inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded bg-white/20 text-xs font-mono">R</kbd>
            </button>
            <button type="button" className={BTN_SOFT} onClick={() => setWrongInput('0')}>
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Clear</span>
            </button>
          </div>
          <p className={`${HELP_TEXT} m-0 hidden md:block`}>
            Shortcuts while this panel is focused: ↑ ↓ change wrong answers, Enter or R saves the student and starts the next one. You can also tap any row in the chart.
          </p>

          {students.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-5 space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 m-0">Class tally</h3>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {students.length} student{students.length === 1 ? '' : 's'} · average{' '}
                  <strong className="font-mono">{tally.average.toFixed(1)}%</strong>
                </span>
              </div>
              <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
                {bands
                  .filter((b) => tally.counts[b.letter])
                  .map((b) => {
                    const t = gradeTone(b.letter);
                    const TIcon = t.Icon;
                    return (
                      <li key={b.letter} className={`inline-flex items-center gap-2 px-3 min-h-[44px] min-w-[44px] rounded-full border text-sm font-bold ${t.badge}`}>
                        <TIcon className="w-4 h-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                        <span>{b.letter}</span>
                        <span className="font-mono">{tally.counts[b.letter]}</span>
                      </li>
                    );
                  })}
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
              <p className={`${HELP_TEXT} m-0`}>The tally lives in this tab only. It is never sent anywhere and is gone when you close the page.</p>
            </div>
          )}
        </section>
      </div>

      {/* 3. Quick chart (OUTPUT card) */}
      <section
        aria-label="Scoring Output Chart"
        className={`${CARD_OUTPUT} overflow-visible flex flex-col min-w-0`}
        id="ez-print-section"
        data-print-area
        data-print-title={`Quick Grade Chart — ${total}-question test`}
      >
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight m-0">
                Quick chart · {total}-question test
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 m-0">
                Scores for 0 to {total} wrong answers
                {halfPoints && total <= 200 ? ', in half-point steps' : ''}.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 self-start sm:self-auto print:hidden">
              <button
                type="button"
                className={BTN_SOLID}
                onClick={handlePrint}
                onMouseEnter={preloadPdf}
                onFocus={preloadPdf}
                onTouchStart={preloadPdf}
                onPointerDown={preloadPdf}
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Print chart</span>
              </button>
              <button
                type="button"
                className={BTN_OUTLINE}
                onClick={handleDownloadPdf}
                onMouseEnter={preloadPdf}
                onFocus={preloadPdf}
                onTouchStart={preloadPdf}
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Short summary only; the chart itself is not a live region. */}
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {totalCalculatedItems} result{totalCalculatedItems === 1 ? '' : 's'} for a {total}-question test, {scaleLabel} scale.
          </p>

          <div className="my-4 print:hidden">
            <label htmlFor="filter-wrong-answers" className="sr-only">Filter by wrong answers</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-300 group-focus-within:text-blue-700 dark:group-focus-within:text-blue-300 transition-colors pointer-events-none">
                <Hash className="w-4 h-4" aria-hidden="true" />
              </span>
              <input
                id="filter-wrong-answers"
                type="text"
                inputMode={halfPoints ? 'decimal' : 'numeric'}
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Jump to wrong answers (e.g. 3)"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                aria-invalid={filterCheck.error ? true : undefined}
                aria-describedby={filterCheck.error ? 'filter-error' : undefined}
                className="w-full min-h-[48px] bg-white dark:bg-slate-900 border-2 border-slate-500 dark:border-slate-400 text-slate-900 dark:text-white rounded-full py-3 pl-11 pr-24 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-600/30 focus:outline-none transition-colors font-semibold text-base placeholder:text-slate-600 dark:placeholder:text-slate-300"
              />
              {filterInput && (
                <button
                  type="button"
                  onClick={() => setFilterInput('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] px-4 text-sm font-semibold text-slate-800 dark:text-slate-100 cursor-pointer rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-label="Clear filter"
                >
                  Clear
                </button>
              )}
            </div>
            {filterCheck.error && (
              <p id="filter-error" role="alert" className="m-0 mt-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
                {filterCheck.error}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {letterGroups.length > 0 && (
              <div className={needsPrintView ? 'print:hidden' : ''}>
                <QuickChartTable
                  groups={visibleLetterGroups}
                  total={total}
                  lowestPassing={lowestPassing}
                  selectedWrong={selectedWrong}
                  onPick={pickWrong}
                  maxHeightClassName="max-h-[min(560px,70vh)]"
                />
              </div>
            )}

            {hasMoreItems && (
              <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-300 dark:border-slate-600 shadow-xs">
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

            {needsPrintView && (
              <div className="hidden print:block">
                <QuickChartTable groups={letterGroups} total={total} lowestPassing={lowestPassing} printView />
              </div>
            )}

            {letterGroups.length === 0 && (
              <div
                role="status"
                className="py-10 px-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 shadow-xs flex flex-col items-center justify-center space-y-3 my-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                  <SearchX className="w-6 h-6 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 dark:text-slate-50 text-base m-0">No matching wrong-answer count</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 max-w-xs mx-auto m-0">
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
