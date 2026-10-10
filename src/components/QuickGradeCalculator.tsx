import React, { useState, useMemo } from 'react';
import { Printer, Settings, Check, Search, RotateCcw, SlidersHorizontal, BookOpen } from 'lucide-react';
import { SegmentedControl } from './ui/SegmentedControl';
import { triggerHapticFeedback, DEFAULT_HAPTIC_DURATION } from '../utils/haptics';
import { ScrollableTableContainer } from './ScrollableTableContainer';

export interface QuickGradeCalculatorProps {
  setToast?: (msg: string) => void;
}

interface GradeThresholds {
  A: number;
  B: number;
  C: number;
  D: number;
}

interface ChartRow {
  wrong: number;
  correct: number;
  percentage: number;
  letter: string;
}

const PRESET_QUESTIONS = [10, 20, 25, 50, 100];

export const QuickGradeCalculator: React.FC<QuickGradeCalculatorProps> = ({ setToast }) => {
  // Inputs & Configuration State
  const [totalQuestionsInput, setTotalQuestionsInput] = useState<string>('20');
  const [scaleType, setScaleType] = useState<'standard' | 'plus'>('standard');
  const [showDecimals, setShowDecimals] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showCutoffEditor, setShowCutoffEditor] = useState<boolean>(false);

  // Custom standard grade thresholds (default: A=90, B=80, C=70, D=60)
  const [thresholds, setThresholds] = useState<GradeThresholds>({
    A: 90,
    B: 80,
    C: 70,
    D: 60,
  });

  // Safe parse of total questions (clamp 1 to 1000)
  const totalQuestions = useMemo(() => {
    const parsed = parseInt(totalQuestionsInput, 10);
    if (isNaN(parsed) || parsed <= 0) return 1;
    return Math.min(1000, parsed);
  }, [totalQuestionsInput]);

  // Points lost per question
  const pointsPerQuestion = useMemo(() => {
    if (totalQuestions <= 0) return 0;
    return 100 / totalQuestions;
  }, [totalQuestions]);

  // Helper to determine letter grade
  const getLetterGrade = (pct: number): string => {
    if (scaleType === 'plus') {
      if (pct >= 93) return 'A';
      if (pct >= 90) return 'A−';
      if (pct >= 87) return 'B+';
      if (pct >= 83) return 'B';
      if (pct >= 80) return 'B−';
      if (pct >= 77) return 'C+';
      if (pct >= 73) return 'C';
      if (pct >= 70) return 'C−';
      if (pct >= 60) return 'D';
      return 'F';
    }
    if (pct >= thresholds.A) return 'A';
    if (pct >= thresholds.B) return 'B';
    if (pct >= thresholds.C) return 'C';
    if (pct >= thresholds.D) return 'D';
    return 'F';
  };

  // Generate full grading chart data
  const chartRows = useMemo<ChartRow[]>(() => {
    const rows: ChartRow[] = [];
    const filterNum = searchFilter.trim() !== '' ? parseInt(searchFilter, 10) : null;

    for (let wrong = 0; wrong <= totalQuestions; wrong++) {
      if (filterNum !== null && !isNaN(filterNum) && wrong !== filterNum) {
        continue;
      }
      const correct = totalQuestions - wrong;
      const rawPct = (correct / totalQuestions) * 100;
      const percentage = showDecimals
        ? Math.round(rawPct * 10) / 10
        : Math.round(rawPct);
      const letter = getLetterGrade(rawPct);

      rows.push({
        wrong,
        correct,
        percentage,
        letter,
      });
    }
    return rows;
  }, [totalQuestions, scaleType, thresholds, showDecimals, searchFilter]);

  const handlePrint = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    try {
      window.print();
    } catch {
      setToast?.('Print is unavailable in this environment.');
    }
  };

  const handleResetThresholds = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setThresholds({ A: 90, B: 80, C: 70, D: 60 });
    setToast?.('Grade cutoffs reset to default (90/80/70/60)');
  };

  // Badge styling for letters
  const getBadgeStyle = (letter: string) => {
    if (letter.startsWith('A')) {
      return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
    }
    if (letter.startsWith('B')) {
      return 'bg-indigo-50 text-indigo-800 border border-indigo-200';
    }
    if (letter.startsWith('C')) {
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    }
    if (letter.startsWith('D')) {
      return 'bg-orange-50 text-orange-800 border border-orange-200';
    }
    return 'bg-rose-50 text-rose-800 border border-rose-200';
  };

  const getTierRowBg = (letter: string) => {
    if (letter.startsWith('A')) {
      return 'bg-[#CFE9DF] hover:bg-[#C0E0D3] border border-[#96CDB8]/50';
    }
    if (letter.startsWith('B')) {
      return 'bg-[#D6E1FF] hover:bg-[#C8D6FF] border border-[#A5BCF0]/50';
    }
    if (letter.startsWith('C')) {
      return 'bg-[#FFE8C2] hover:bg-[#FFDFA8] border border-[#F5C77A]/50';
    }
    if (letter.startsWith('D')) {
      return 'bg-[#F0F2F5] hover:bg-[#e4e7eb] border border-[#D1D5DB]/50';
    }
    return 'bg-[#F9D6E1] hover:bg-[#F5C3D3] border border-[#EDA3BB]/50';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-sans">
      {/* 1. Header & Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <span>Quick Grade Chart</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Easy Grade Calculator &amp; EZ Grader
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Calculate instant test scores, percentage grades, and printable quick grading charts for any number of test questions.
        </p>
      </div>

      {/* 2. Top Controls & Configuration Card */}
      <section
        aria-label="Test Parameters and Grading Settings"
        className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Number of Questions */}
          <div className="space-y-2">
            <label htmlFor="quick-total-questions" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Total Questions
            </label>
            <input
              id="quick-total-questions"
              type="number"
              min="1"
              max="1000"
              value={totalQuestionsInput}
              onChange={(e) => setTotalQuestionsInput(e.target.value)}
              className="w-full h-14 bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-0 leading-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg sm:text-2xl font-mono text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="20"
            />
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400">Presets:</span>
              <SegmentedControl
                ariaLabel="Question count presets"
                variant="chips"
                size="sm"
                optionClassName="preset-btn"
                value={totalQuestions}
                onChange={(n) => setTotalQuestionsInput(String(n))}
                options={PRESET_QUESTIONS.map((n) => ({
                  value: n,
                  label: n,
                  onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION),
                }))}
              />
            </div>
          </div>

          {/* Scale Type & Precision */}
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Grading Scale
              </span>
              <SegmentedControl
                ariaLabel="Grading scale"
                fill
                size="sm"
                value={scaleType}
                onChange={(v) => setScaleType(v)}
                options={[
                  { value: 'standard', label: 'Standard (A–F)', onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION) },
                  { value: 'plus', label: 'Plus / Minus (A+–F)', onSelect: () => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION) },
                ]}
              />
            </div>

            {/* Decimal Toggle */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-800/60 rounded-[24px] border border-stone-200/80 dark:border-slate-700 shadow-sm p-4">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Show Decimal Percentages
              </span>
              <input
                type="checkbox"
                checked={showDecimals}
                onChange={(e) => setShowDecimals(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="bg-[#CFE9DF] dark:bg-teal-950/60 border border-[#96CDB8] dark:border-teal-800/60 rounded-[24px] p-4 text-center shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 block">
                Points Per Question
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-950 dark:text-teal-100 font-mono block mt-0.5">
                {pointsPerQuestion.toFixed(showDecimals ? 2 : 1)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCutoffEditor((prev) => !prev)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-5 bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 rounded-full font-semibold shadow-sm text-xs transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showCutoffEditor ? 'Hide Cutoffs' : 'Adjust Cutoffs'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-6 bg-[#134E48] hover:bg-[#0D3834] dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-full font-bold shadow-md text-xs transition-all cursor-pointer active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Chart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Optional Inline Cutoff Adjustment Section */}
        {showCutoffEditor && (
          <div className="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Standard Cutoff Thresholds (%)
              </span>
              <button
                type="button"
                onClick={handleResetThresholds}
                className="inline-flex items-center gap-1 text-xs bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 rounded-full font-semibold shadow-sm px-4 py-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map((grade) => (
                <div key={grade} className="p-3 bg-[#F8F9FA] dark:bg-slate-800/60 rounded-[24px] border border-stone-100 dark:border-slate-800">
                  <label htmlFor={`cutoff-${grade}`} className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Grade {grade} Min (%)
                  </label>
                  <input
                    id={`cutoff-${grade}`}
                    type="number"
                    min="0"
                    max="100"
                    value={thresholds[grade]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setThresholds((prev) => ({ ...prev, [grade]: val }));
                    }}
                    className="w-full min-h-[44px] bg-[#F4F6F9] dark:bg-slate-800/90 border border-stone-200/80 dark:border-slate-700 text-stone-900 dark:text-white rounded-[20px] px-4 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-base sm:text-sm font-mono text-center shadow-inner"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Search Filter & Grading Table Card */}
      <section
        aria-label="Grading Chart Table and Search"
        className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8"
      >
        {/* Table Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Grading Chart Table ({totalQuestions} Total Questions)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing percentage and letter grade based on number of missed questions.
            </p>
          </div>

          <div className="relative w-full sm:w-64 group">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search wrong answers..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full pl-10 pr-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-base sm:text-xs placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Scrollable Table View */}
        <ScrollableTableContainer
          ariaLabel="Quick Grader scoring chart table"
          tableWrapperClassName="max-h-[520px] overflow-y-auto"
        >
          <table className="w-full min-w-[460px] text-left border-separate border-spacing-y-1.5 text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/90 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-700 font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 backdrop-blur-xs">
              <tr>
                <th className="py-3 px-4 sm:px-6 sticky left-0 z-30 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-xs min-w-[130px] rounded-l-2xl">Wrong Answers</th>
                <th className="py-3 px-4 sm:px-6 whitespace-nowrap">Correct Questions</th>
                <th className="py-3 px-4 sm:px-6 whitespace-nowrap">Score (%)</th>
                <th className="py-3 px-4 sm:px-6 text-right whitespace-nowrap rounded-r-2xl">Letter Grade</th>
              </tr>
            </thead>
            <tbody>
              {chartRows.map((row) => (
                <tr
                  key={row.wrong}
                  className={`rounded-2xl transition-colors ${getTierRowBg(row.letter)}`}
                >
                  <td className="py-3 px-4 sm:px-6 font-mono font-bold text-slate-900 rounded-l-2xl sticky left-0 z-10 bg-inherit backdrop-blur-xs shadow-[1px_0_0_0_rgba(226,232,240,0.8)]">
                    -{row.wrong}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 font-mono whitespace-nowrap">
                    {row.correct} / {totalQuestions}
                  </td>
                  <td className="py-3 px-4 sm:px-6 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {row.percentage}%
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right whitespace-nowrap rounded-r-2xl">
                    <span
                      className={`inline-block px-3 py-1 rounded-2xl text-xs font-extrabold border ${getBadgeStyle(
                        row.letter
                      )}`}
                    >
                      {row.letter}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableTableContainer>
      </section>

      {/* 4. Educational Guide & Calculation Methodology Text */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
          <BookOpen className="w-4 h-4" />
          <span>How Easy Grade Calculator Works</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Calculation Formula &amp; Scoring Principles
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The Easy Grade Calculator (EZ Grader) automatically converts raw test question results into an exact percentage score and letter grade.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Percentage Formula
            </span>
            <code className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
              Grade (%) = ((Total - Wrong) / Total) × 100
            </code>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Subtracts incorrect answers from total points, divided by total questions.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Points Per Item
            </span>
            <code className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
              Weight = 100 / Total Questions
            </code>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              For a 20-question quiz, every missed question subtracts exactly 5.0% from the grade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
