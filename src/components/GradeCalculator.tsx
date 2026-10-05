import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Plus, X, RotateCcw, Target, ArrowLeft, Table2, Calculator, Download, Printer, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { AssessmentItem, CalculationMode, GradingScaleType } from '../types';
import { INITIAL_ASSESSMENTS } from '../data/constants';
import { QuickGrader } from './QuickGrader';
import { calculateMultiAssessmentGrade } from '../utils/gradeCalculations';
import { GradeVisualProgressBar } from './GradeVisualProgressBar';
import { AmbientAura } from './AmbientAura';
import { triggerHapticFeedback, DEFAULT_HAPTIC_DURATION } from '../utils/haptics';
import { SEO_HOME, SEO_ROUTES } from '../data/seoConfig';
import { EducationalGuide } from './EducationalGuide';

export interface GradeCalculatorProps {
  setToast: (msg: string) => void;
  initialItems?: AssessmentItem[];
  initialMode?: CalculationMode;
  initialScale?: GradingScaleType;
  initialCourseName?: string;
  hideHeading?: boolean;
  hideSeo?: boolean;
}

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

  // Primary default tool is Quick Grade on / and Weighted Grade on /grade-calculator
  const [calcTab, setCalcTab] = useState<'quick-chart' | 'calculator'>(() => {
    if (initialMode === 'points' || initialMode === 'weighted') return 'calculator';
    if (isWeightedRoute) return 'calculator';
    return 'quick-chart';
  });

  useEffect(() => {
    if (initialMode === 'points' || initialMode === 'weighted') return;
    setCalcTab(isWeightedRoute ? 'calculator' : 'quick-chart');
  }, [isWeightedRoute, initialMode]);

  const tabListRef = useRef<HTMLDivElement>(null);
  const quickTabRef = useRef<HTMLButtonElement>(null);
  const weightedTabRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Close mobile dropdown menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const switchTab = (tab: 'quick-chart' | 'calculator') => {
    if (tab === calcTab) return;
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setCalcTab(tab);
  };

  const handleSelectFromDropdown = (tab: 'quick-chart' | 'calculator') => {
    switchTab(tab);
    setIsDropdownOpen(false);
  };

  // Keyboard navigation for ARIA tablist (ArrowLeft, ArrowRight, Home, End)
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, current: 'quick-chart' | 'calculator') => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextTab = current === 'quick-chart' ? 'calculator' : 'quick-chart';
      switchTab(nextTab);
      if (nextTab === 'quick-chart') {
        quickTabRef.current?.focus();
      } else {
        weightedTabRef.current?.focus();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      switchTab('quick-chart');
      quickTabRef.current?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      switchTab('calculator');
      weightedTabRef.current?.focus();
    }
  };

  const [mode, setMode] = useState<'weighted' | 'points'>(() => {
    if (initialMode === 'points') return 'points';
    return 'weighted';
  });

  const [scaleType, setScaleType] = useState<GradingScaleType>(initialScale);
  const [courseName] = useState<string>(initialCourseName || '');
  const [targetGrade, setTargetGrade] = useState<string>('90');
  const [finalWeight, setFinalWeight] = useState<string>('20');

  const [items, setItems] = useState<AssessmentItem[]>(() => {
    if (initialItems && initialItems.length > 0) return initialItems;
    return INITIAL_ASSESSMENTS;
  });

  // Handle assessment mutations for weighted mode
  const handleUpdateItem = (id: number, field: keyof AssessmentItem, val: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleAddItem = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    const newItem: AssessmentItem = {
      id: Date.now(),
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
    setToast?.('Reset to sample assessments');
  };

  // Grade Calculation
  const gradeResult = useMemo(() => {
    return calculateMultiAssessmentGrade(items, mode, {
      scale: scaleType === 'plus' ? 'plus-minus' : 'standard',
      decimalPrecision: 1,
    });
  }, [items, mode, scaleType]);

  // Target Final Exam Simulator
  const targetSimulation = useMemo(() => {
    const target = parseFloat(targetGrade);
    const fWeight = parseFloat(finalWeight) / 100;
    if (isNaN(target) || isNaN(fWeight) || fWeight <= 0 || fWeight >= 1) {
      return null;
    }
    const currentGrade = gradeResult.percentage;
    const required = (target - currentGrade * (1 - fWeight)) / fWeight;
    return {
      required: Math.round(required * 10) / 10,
      achievable: required <= 100 && required >= 0,
      extraCreditNeeded: required > 100,
    };
  }, [targetGrade, finalWeight, gradeResult.percentage]);

  return (
    <>
      {!hideSeo && (
        <SEO
          title={activeSeo.title}
          description={activeSeo.description}
          canonicalUrl={activeSeo.canonicalUrl}
          ogImage={activeSeo.ogImagePlaceholder}
          keywords={activeSeo.keywords}
          applicationCategory={activeSeo.applicationCategory}
          featureList={activeSeo.featureList}
        />
      )}

      {!hideHeading && (
        <ToolHeading
          badge={calcTab === 'quick-chart' ? 'Quick Grade' : 'Weighted Grade'}
          title={
            calcTab === 'quick-chart'
              ? 'Easy Grade Calculator & Quick Chart'
              : 'Weighted Grade & Final Exam Calculator'
          }
          description={
            calcTab === 'quick-chart'
              ? 'Calculate instant test percentage scores, letter grades, and printable quick charts for any test length.'
              : 'Add your assessments, calculate weighted averages, and simulate the exact score needed on your final exam.'
          }
        />
      )}

      {/* Primary Mode Switcher: Mobile Dropdown Menu (<sm) & Clear Segmented Tabs (>=sm) */}
      <div className="w-full flex justify-center mb-6 pt-1 print:hidden">
        {/* Mobile Dropdown Menu (Pill-shaped button with theme colors) */}
        <div ref={dropdownRef} className="relative sm:hidden inline-block text-center">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
            aria-label="Toggle calculator view"
            className="inline-flex items-center justify-between gap-2.5 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 text-stone-900 dark:text-white border border-stone-200/90 dark:border-slate-700 shadow-xs hover:border-stone-300 dark:hover:border-slate-600 font-bold text-xs sm:text-sm cursor-pointer select-none active:scale-[0.98] transition-all"
          >
            {calcTab === 'quick-chart' ? (
              <span className="inline-flex items-center gap-2">
                <Table2 className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" aria-hidden="true" />
                <span>Quick Grade Chart</span>
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">(EZ Grader)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Calculator className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" aria-hidden="true" />
                <span>Weighted &amp; Final Exam</span>
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">(Semester)</span>
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-stone-500 dark:text-stone-400 ml-1 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {isDropdownOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-stone-200 dark:border-slate-700 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => handleSelectFromDropdown('quick-chart')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left cursor-pointer ${
                  calcTab === 'quick-chart'
                    ? 'bg-[#191C1E] text-white dark:bg-slate-800 shadow-xs'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Table2
                    className={`w-4 h-4 shrink-0 ${
                      calcTab === 'quick-chart' ? 'text-teal-400' : 'text-stone-500 dark:text-stone-400'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="leading-tight">Quick Grade Chart</div>
                    <div
                      className={`text-[11px] font-normal ${
                        calcTab === 'quick-chart' ? 'text-stone-300' : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      EZ Grader &bull; Instant Chart
                    </div>
                  </div>
                </div>
                {calcTab === 'quick-chart' && (
                  <Check className="w-4 h-4 text-teal-400 shrink-0 ml-2" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleSelectFromDropdown('calculator')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left cursor-pointer mt-1 ${
                  calcTab === 'calculator'
                    ? 'bg-[#191C1E] text-white dark:bg-slate-800 shadow-xs'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calculator
                    className={`w-4 h-4 shrink-0 ${
                      calcTab === 'calculator' ? 'text-teal-400' : 'text-stone-500 dark:text-stone-400'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="leading-tight">Weighted &amp; Final Exam</div>
                    <div
                      className={`text-[11px] font-normal ${
                        calcTab === 'calculator' ? 'text-stone-300' : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      Semester &bull; Target Final Score
                    </div>
                  </div>
                </div>
                {calcTab === 'calculator' && (
                  <Check className="w-4 h-4 text-teal-400 shrink-0 ml-2" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Desktop / Tablet Segmented Tabs */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Grade calculator modes"
          className="hidden sm:inline-flex p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/90 shadow-xs max-w-full overflow-x-auto gap-1"
        >
          <button
            ref={quickTabRef}
            id="tab-quick-chart"
            role="tab"
            type="button"
            aria-selected={calcTab === 'quick-chart'}
            aria-controls="panel-quick-chart"
            tabIndex={calcTab === 'quick-chart' ? 0 : -1}
            onClick={() => switchTab('quick-chart')}
            onKeyDown={(e) => handleTabKeyDown(e, 'quick-chart')}
            className={`flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer select-none whitespace-nowrap ${
              calcTab === 'quick-chart'
                ? 'bg-[#191C1E] text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                : 'bg-stone-100 text-stone-600 rounded-full font-medium hover:bg-white hover:shadow-sm border border-transparent transition-all px-4 py-1.5'
            }`}
          >
            <Table2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Quick Grade Chart</span>
            <span className="text-[11px] font-medium opacity-80">(EZ Grader)</span>
          </button>

          <button
            ref={weightedTabRef}
            id="tab-calculator"
            role="tab"
            type="button"
            aria-selected={calcTab === 'calculator'}
            aria-controls="panel-calculator"
            tabIndex={calcTab === 'calculator' ? 0 : -1}
            onClick={() => switchTab('calculator')}
            onKeyDown={(e) => handleTabKeyDown(e, 'calculator')}
            className={`flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer select-none whitespace-nowrap ${
              calcTab === 'calculator'
                ? 'bg-[#191C1E] text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                : 'bg-stone-100 text-stone-600 rounded-full font-medium hover:bg-white hover:shadow-sm border border-transparent transition-all px-4 py-1.5'
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Weighted &amp; Final Exam</span>
            <span className="text-[11px] font-medium opacity-80">(Semester)</span>
          </button>
        </div>
      </div>

      {calcTab === 'quick-chart' ? (
        <div
          id="panel-quick-chart"
          role="tabpanel"
          aria-labelledby="tab-quick-chart"
          tabIndex={0}
          className="w-full max-w-full overflow-x-hidden pt-1 focus:outline-none"
        >
          {/* Quick Grade and Test Scoring Chart */}
          <QuickGrader setToast={setToast} />

          {/* Secondary Switch to Weighted / Target Calculator */}
          <div className="mt-8 mb-6 text-center print:hidden">
            <button
              type="button"
              onClick={() => switchTab('calculator')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer bg-white/90 dark:bg-slate-800/90 px-4 py-2 rounded-full border border-stone-200 dark:border-slate-700 shadow-2xs hover:shadow-xs"
            >
              <span>Need to calculate semester weighted assignments or final exam goals?</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold underline">
                Weighted Calculator →
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div
          id="panel-calculator"
          role="tabpanel"
          aria-labelledby="tab-calculator"
          tabIndex={0}
          className="relative tool-layout font-sans pt-1 focus:outline-none"
        >
          <AmbientAura />

          {/* Return to Quick Grade Header */}
          <div className="col-span-full mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => switchTab('quick-chart')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer bg-white/80 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-stone-200 dark:border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Quick Grade Chart</span>
            </button>
          </div>

          {/* Left: Assessment Grade Rows Card */}
          <section aria-label="Assessments Table" className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 space-y-5 sm:space-y-6">
            {/* Header with Mode Toggle & Scale Settings */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Assessments
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">
                  {courseName ? courseName : 'Weighted & Points Calculator'}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 font-medium text-sm mt-1 m-0">
                  Add assignments, quizzes, and exams to calculate your current standing.
                </p>
              </div>

              {/* Mode & Scale Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Scale Toggle (Standard vs Plus/Minus) */}
                <div className="flex items-center gap-1 p-1 rounded-full bg-stone-100/80 dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
                  <button
                    type="button"
                    className={`cursor-pointer text-xs ${
                      scaleType === 'standard'
                        ? 'bg-[#134E48] dark:bg-teal-600 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                        : 'bg-transparent text-stone-600 dark:text-stone-300 rounded-full font-medium hover:bg-white dark:hover:bg-slate-700/60 hover:shadow-sm border border-transparent transition-all px-4 py-1.5'
                    }`}
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
                    className={`cursor-pointer text-xs ${
                      scaleType === 'plus'
                        ? 'bg-[#134E48] dark:bg-teal-600 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                        : 'bg-transparent text-stone-600 dark:text-stone-300 rounded-full font-medium hover:bg-white dark:hover:bg-slate-700/60 hover:shadow-sm border border-transparent transition-all px-4 py-1.5'
                    }`}
                    onClick={() => {
                      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                      setScaleType('plus');
                      setToast?.('Grading scale: Plus/Minus');
                    }}
                  >
                    +/−
                  </button>
                </div>

                {/* Mode Toggle (Weighted vs Points) */}
                <div className="flex items-center gap-1 p-1 rounded-full bg-stone-100/80 dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
                  <button
                    type="button"
                    className={`cursor-pointer text-xs ${
                      mode === 'weighted'
                        ? 'bg-[#134E48] dark:bg-teal-600 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                        : 'bg-transparent text-stone-600 dark:text-stone-300 rounded-full font-medium hover:bg-white dark:hover:bg-slate-700/60 hover:shadow-sm border border-transparent transition-all px-4 py-1.5'
                    }`}
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
                    className={`cursor-pointer text-xs ${
                      mode === 'points'
                        ? 'bg-[#134E48] dark:bg-teal-600 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                        : 'bg-transparent text-stone-600 dark:text-stone-300 rounded-full font-medium hover:bg-white dark:hover:bg-slate-700/60 hover:shadow-sm border border-transparent transition-all px-4 py-1.5'
                    }`}
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

            {/* Assessment Table Header (Desktop Only) */}
            <div className="hidden sm:grid grid-cols-12 gap-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-1">
              <span className={mode === 'weighted' ? 'col-span-5' : 'col-span-6'}>
                Assignment
              </span>
              <span className="col-span-2 text-center">Score</span>
              <span className="col-span-2 text-center">Out Of</span>
              {mode === 'weighted' && (
                <span className="col-span-2 text-center">Weight %</span>
              )}
              <span className="col-span-1" />
            </div>

            {/* Assessment Rows with Subtle Slide-in Animation via Framer Motion */}
            <div className="space-y-3 sm:space-y-2.5 overflow-x-auto">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, x: -18, y: -4 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{
                      opacity: 0,
                      x: 18,
                      height: 0,
                      overflow: 'hidden',
                      transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
                    }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white/80 dark:bg-slate-900/80 sm:bg-transparent sm:dark:bg-transparent border border-slate-200/90 dark:border-slate-800/90 sm:border-0 rounded-2xl sm:rounded-none p-3.5 sm:p-0 shadow-xs sm:shadow-none sm:grid sm:grid-cols-12 sm:gap-2 sm:items-center sm:py-1 space-y-2.5 sm:space-y-0"
                  >
                    {/* Assignment Name (and Mobile Remove Button) */}
                    <div className={mode === 'weighted' ? 'sm:col-span-5' : 'sm:col-span-6'}>
                      <div className="flex items-end gap-2">
                        <div className="flex-1 min-w-0">
                          <label htmlFor={`assess-name-${item.id}`} className="block sm:hidden text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Assignment
                          </label>
                          <input aria-label="Assignment name" placeholder="e.g. Midterm Exam"
                            id={`assess-name-${item.id}`}
                            type="text"
                            className="w-full min-h-[44px] bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-base sm:text-sm placeholder:text-slate-400"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                          />
                        </div>
                        {/* Mobile Remove Button (44x44px touch target) */}
                        <div className="sm:hidden flex-shrink-0">
                          <button
                            type="button"
                            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100/90 hover:bg-rose-50 dark:bg-slate-800/90 dark:hover:bg-rose-950/40 border border-slate-200/70 dark:border-slate-700/70 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label={`Remove ${item.name || 'assignment'}`}
                            disabled={items.length <= 1}
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <X className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile: 2 or 3 Column Row for Score / Out Of / Weight % (Desktop: sm:contents) */}
                    <div className={`grid ${mode === 'weighted' ? 'grid-cols-3' : 'grid-cols-2'} gap-2 sm:contents`}>
                      {/* Earned Score */}
                      <div className="sm:col-span-2">
                        <label htmlFor={`assess-score-${item.id}`} className="block sm:hidden text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 text-center">
                          Score
                        </label>
                        <input aria-label="Score earned" placeholder="85"
                          id={`assess-score-${item.id}`}
                          type="number"
                          inputMode="decimal"
                          className="w-full min-h-[44px] bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-base sm:text-sm font-mono text-center placeholder:text-slate-400"
                          value={item.score}
                          onChange={(e) => handleUpdateItem(item.id, 'score', e.target.value)}
                        />
                      </div>

                      {/* Maximum Possible Points */}
                      <div className="sm:col-span-2">
                        <label htmlFor={`assess-max-${item.id}`} className="block sm:hidden text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 text-center">
                          Out Of
                        </label>
                        <input aria-label="Total possible points" placeholder="100"
                          id={`assess-max-${item.id}`}
                          type="number"
                          inputMode="decimal"
                          className="w-full min-h-[44px] bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-base sm:text-sm font-mono text-center placeholder:text-slate-400"
                          value={item.max}
                          onChange={(e) => handleUpdateItem(item.id, 'max', e.target.value)}
                        />
                      </div>

                      {/* Category Weight % */}
                      {mode === 'weighted' && (
                        <div className="sm:col-span-2">
                          <label htmlFor={`assess-weight-${item.id}`} className="block sm:hidden text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 text-center">
                            Weight %
                          </label>
                          <input aria-label="Category weight percentage" placeholder="20"
                            id={`assess-weight-${item.id}`}
                            type="number"
                            inputMode="decimal"
                            className="w-full min-h-[44px] bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-base sm:text-sm font-mono text-center placeholder:text-slate-400"
                            value={item.weight}
                            onChange={(e) => handleUpdateItem(item.id, 'weight', e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Desktop Remove Button */}
                    <div className="hidden sm:flex sm:col-span-1 justify-center">
                      <button
                        type="button"
                        className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Remove assessment row"
                        disabled={items.length <= 1}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Controls: Add Grade Row & Reset */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                className="bg-[#134E48] hover:bg-[#0D3834] dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-full font-bold shadow-md px-6 py-2.5 min-h-[44px] transition-all inline-flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-95"
                onClick={handleAddItem}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add grade row</span>
              </button>

              <button
                type="button"
                className="bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 rounded-full font-semibold shadow-sm text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors py-2.5 px-5 min-h-[44px]"
                onClick={handleReset}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset rows</span>
              </button>
            </div>
          </section>

          {/* Right: Results & Target Grade Simulator */}
          <section aria-label="Grade Results and Target Calculator" className="result-panel bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between" aria-live="polite">
            <div className="space-y-6">
              {/* Current Grade Outcome - Outer Pastel Wrapper */}
              <div className={`${
                gradeResult.letterGrade.startsWith('A')
                  ? 'bg-[#D2E8E4] dark:bg-teal-950/60 border border-emerald-200/60 dark:border-teal-800/60'
                  : gradeResult.letterGrade.startsWith('B')
                  ? 'bg-[#D6E1FF] dark:bg-indigo-950/60 border border-[#9FB3EE]/50 dark:border-indigo-800/60'
                  : gradeResult.letterGrade.startsWith('C')
                  ? 'bg-[#FFE8C2] dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60'
                  : gradeResult.letterGrade.startsWith('D')
                  ? 'bg-stone-100 dark:bg-slate-800/60 border border-stone-200/60 dark:border-slate-700/60'
                  : 'bg-[#F9D6E1] dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/60'
              } rounded-[24px] p-4.5 space-y-3`}>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Current Grade
                </span>

                {/* Inner Nested White Card for Depth */}
                <div className="bg-white dark:bg-slate-800/90 border border-stone-100 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-sm flex items-center justify-between">
                  <div className="text-3xl sm:text-4xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tracking-tight">
                    {gradeResult.formattedPercentage}%
                  </div>
                  <span
                    className={`text-sm sm:text-base font-bold font-mono px-3 py-1 rounded-full ${
                      gradeResult.letterGrade.startsWith('A')
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700'
                        : gradeResult.letterGrade.startsWith('B')
                        ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-700'
                        : gradeResult.letterGrade.startsWith('C')
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700'
                        : gradeResult.letterGrade.startsWith('D')
                        ? 'bg-orange-100 text-orange-900 border border-orange-300 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-700'
                        : 'bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700'
                    }`}
                  >
                    Grade {gradeResult.letterGrade}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800/90 border border-stone-100 dark:border-slate-700 rounded-xl p-3 shadow-sm">
                  <GradeVisualProgressBar
                    percent={gradeResult.percentage}
                    letter={gradeResult.letterGrade}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 m-0 text-center sm:text-left">
                    Based on {gradeResult.validItemCount} active assessment rows ({mode === 'weighted' ? 'weighted' : 'points-based'}).
                  </p>
                </div>
              </div>

              {/* Target Final Exam Simulator - Secondary Metric Block */}
              <div className="bg-white dark:bg-slate-800/60 rounded-[24px] border border-stone-200/80 dark:border-slate-700 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Target Final Exam Simulator
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="target-grade-input" className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Desired Grade (%)
                    </label>
                    <input
                      id="target-grade-input"
                      type="number"
                      aria-label="Desired course grade percentage"
                      placeholder="90"
                      className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-extrabold text-2xl text-center font-mono placeholder:text-slate-400"
                      value={targetGrade}
                      onChange={(e) => setTargetGrade(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="final-weight-input" className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Final Exam Weight (%)
                    </label>
                    <input
                      id="final-weight-input"
                      type="number"
                      aria-label="Final exam weight percentage"
                      placeholder="20"
                      className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-extrabold text-2xl text-center font-mono placeholder:text-slate-400"
                      value={finalWeight}
                      onChange={(e) => setFinalWeight(e.target.value)}
                    />
                  </div>
                </div>

                {targetSimulation && (
                  <div className="bg-[#D2E8E4] dark:bg-teal-950/60 border border-emerald-200/60 dark:border-teal-800/60 rounded-[24px] p-4.5 space-y-2">
                    <div className="bg-white dark:bg-slate-800/90 border border-stone-100 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-sm flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Required on Final:</span>
                      <strong className="text-2xl font-extrabold text-teal-950 dark:text-teal-100 font-mono">
                        {targetSimulation.required}%
                      </strong>
                    </div>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 block px-1">
                      {targetSimulation.extraCreditNeeded
                        ? 'Extra credit required to hit this target.'
                        : targetSimulation.required <= 0
                        ? 'You have already secured this target grade!'
                        : 'Achievable on the final exam.'}
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    to="/easy-grade-calculator/final-exam-grade-calculator"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline transition-colors"
                  >
                    <span>Need detailed syllabus weighting? Open the Final Exam Grade Calculator simulator &rarr;</span>
                  </Link>
                </div>

                {/* Export PDF & Print Actions */}
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
                    className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#134E48] hover:bg-[#0D3834] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold shadow-md text-xs sm:text-sm transition-all cursor-pointer active:scale-95"
                  >
                    <Printer className="w-4 h-4" aria-hidden="true" />
                    <span>Print Result</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Export grade report as PDF"
                    onClick={async () => {
                      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                      try {
                        setToast?.('Generating PDF grade report...');
                        const { exportGradeReportPdf } = await import('../utils/pdfExport');
                        await exportGradeReportPdf({
                          courseName: courseName || 'Course Grade Report',
                          mode,
                          scale: scaleType,
                          percent: gradeResult.percentage,
                          letter: gradeResult.letterGrade,
                          targetGrade,
                          assessments: items.map((it) => ({
                            ...it,
                            scoreNum: parseFloat(it.score) || 0,
                            maxNum: parseFloat(it.max) || 100,
                            weightNum: parseFloat(it.weight) || 0,
                            invalid: isNaN(parseFloat(it.score)) || isNaN(parseFloat(it.max)) || (parseFloat(it.max) || 0) <= 0,
                          })),
                        });
                        setToast?.('Grade report PDF downloaded!');
                      } catch {
                        setToast?.('Could not generate PDF report.');
                      }
                    }}
                    className="min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 font-semibold shadow-xs text-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
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
