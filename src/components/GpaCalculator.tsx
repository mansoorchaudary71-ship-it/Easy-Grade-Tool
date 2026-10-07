import React, { useState, useMemo } from 'react';
import { Link } from './SlashLink';
import { Plus, X, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { INITIAL_COURSES } from '../data/constants';
import { CourseItem } from '../types';
import { parseNumber } from '../utils/formatters';
import { AmbientAura } from './AmbientAura';
import { triggerHapticFeedback, DEFAULT_HAPTIC_DURATION } from '../utils/haptics';
import { SEO_ROUTES } from '../data/seoConfig';
import { GUIDE_IMAGES } from '../data/guideImages';
import { SemanticGuideImage } from './SemanticGuideImage';
import { FAQ } from './FAQ';

interface GpaCalculatorProps {
  setToast?: (msg: string) => void;
  hideHeading?: boolean;
  hideSeo?: boolean;
}

const CREDIT_OPTIONS = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0];

const GRADE_OPTIONS = [
  'A+',
  'A',
  'A-',
  'B+',
  'B',
  'B-',
  'C+',
  'C',
  'C-',
  'D+',
  'D',
  'D-',
  'F',
];

export const GpaCalculator: React.FC<GpaCalculatorProps> = ({
  setToast,
  hideHeading = false,
  hideSeo = false,
}) => {
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);

  // Settings & Global Inputs
  const [aPlusValue, setAPlusValue] = useState<4.0 | 4.33>(4.0);
  const [priorCumulativeGpa, setPriorCumulativeGpa] = useState<string>('');
  const [priorCreditsEarned, setPriorCreditsEarned] = useState<string>('');

  // Grade point mapping based on aPlusValue
  const getGradeValue = (grade: string): number => {
    switch (grade) {
      case 'A+':
        return aPlusValue;
      case 'A':
        return 4.0;
      case 'A-':
        return 3.7;
      case 'B+':
        return 3.3;
      case 'B':
        return 3.0;
      case 'B-':
        return 2.7;
      case 'C+':
        return 2.3;
      case 'C':
        return 2.0;
      case 'C-':
        return 1.7;
      case 'D+':
        return 1.3;
      case 'D':
        return 1.0;
      case 'D-':
        return 0.7;
      case 'F':
      default:
        return 0.0;
    }
  };

  // Semester GPA Calculation: Total Quality Points / Total Credit Hours
  const { semesterCredits, semesterQualityPoints, semesterGpa } = useMemo(() => {
    let creds = 0;
    let points = 0;

    courses.forEach((c) => {
      const cr = Math.max(0, Math.min(6.0, parseNumber(c.credits) || 0));
      const pt = getGradeValue(c.grade);
      creds += cr;
      points += cr * pt;
    });

    const gpa = creds > 0 ? points / creds : 0;
    return {
      semesterCredits: creds,
      semesterQualityPoints: points,
      semesterGpa: gpa,
    };
  }, [courses, aPlusValue]);

  // Cumulative GPA Calculation (incorporating prior cumulative GPA and prior credits if entered)
  const { cumulativeGpa, totalCumulativeCredits, hasPriorHistory } = useMemo(() => {
    const priorGpa = parseNumber(priorCumulativeGpa);
    const priorCredits = parseNumber(priorCreditsEarned);

    const hasValidPrior =
      !isNaN(priorGpa) &&
      priorGpa >= 0 &&
      priorGpa <= 4.33 &&
      !isNaN(priorCredits) &&
      priorCredits > 0;

    if (hasValidPrior) {
      const priorPoints = priorGpa * priorCredits;
      const combinedCredits = priorCredits + semesterCredits;
      const combinedPoints = priorPoints + semesterQualityPoints;
      const cumGpa = combinedCredits > 0 ? combinedPoints / combinedCredits : 0;
      return {
        cumulativeGpa: cumGpa,
        totalCumulativeCredits: combinedCredits,
        hasPriorHistory: true,
      };
    }

    return {
      cumulativeGpa: semesterGpa,
      totalCumulativeCredits: semesterCredits,
      hasPriorHistory: false,
    };
  }, [priorCumulativeGpa, priorCreditsEarned, semesterCredits, semesterQualityPoints, semesterGpa]);

  const handleUpdateCourse = (
    id: number,
    field: keyof CourseItem,
    value: string
  ) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleAddCourse = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setCourses((prev) => [
      ...prev,
      { id: Date.now(), name: '', credits: '3', grade: 'A' },
    ]);
  };

  const handleRemoveCourse = (id: number) => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <>
      {!hideSeo && (
        <SEO
          title={SEO_ROUTES.gpa.title}
          description={SEO_ROUTES.gpa.description}
          canonicalUrl={SEO_ROUTES.gpa.canonicalUrl}
          ogImage={SEO_ROUTES.gpa.ogImagePlaceholder}
          keywords={SEO_ROUTES.gpa.keywords}
          applicationCategory={SEO_ROUTES.gpa.applicationCategory}
          featureList={SEO_ROUTES.gpa.featureList}
        />
      )}
      {!hideHeading && (
        <ToolHeading
          badge="GPA Calculator"
          title="GPA Calculator — Semester & Cumulative 4.0 Scale"
          description="Use our free college and high school GPA Calculator to add your classes, select credit hours, and calculate both your Semester and Cumulative GPA in real time."
        />
      )}

      <div className="relative tool-layout font-sans">
        <AmbientAura />

        {/* Course Rows & Global Settings */}
        <section aria-label="Course Rows and Settings" className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Global Settings: A+ Grade Value Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase block mb-1">
                Semester Plan
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">Your Courses</h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base mt-1 m-0">Credits make high-hour classes count proportionally.</p>
            </div>

            {/* A+ grade value toggle (4.0 or 4.33) */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-stone-100/80 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 pl-2">
                A+ grade value:
              </span>
              <button
                type="button"
                className={`text-xs cursor-pointer ${
                  aPlusValue === 4.0
                    ? 'bg-[#134E48] dark:bg-teal-600 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 rounded-full font-semibold shadow-sm px-4 py-1.5 transition-all'
                }`}
                onClick={() => {
                  triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                  setAPlusValue(4.0);
                  setToast?.('A+ grade value set to 4.0');
                }}
              >
                4.0
              </button>
              <button
                type="button"
                className={`text-xs cursor-pointer ${
                  aPlusValue === 4.33
                    ? 'bg-[#134E48] dark:bg-teal-600 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 rounded-full font-semibold shadow-sm px-4 py-1.5 transition-all'
                }`}
                onClick={() => {
                  triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                  setAPlusValue(4.33);
                  setToast?.('A+ grade value set to 4.33');
                }}
              >
                4.33
              </button>
            </div>
          </div>

          {/* Optional Prior Cumulative Inputs with Generous 8px-Grid Spacing */}
          <div className="bg-white dark:bg-slate-900/60 rounded-[24px] border border-stone-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-5">
            <span className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase block mb-1">
              Optional: Prior Cumulative Inputs
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2.5">
                <label htmlFor="prior-gpa" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                  Prior cumulative GPA
                </label>
                <input
                  id="prior-gpa"
                  type="number"
                  aria-label="Prior cumulative GPA"
                  placeholder="e.g. 3.50"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  max={aPlusValue === 4.33 ? 4.33 : 4.0}
                  className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg text-center placeholder:text-slate-400"
                  value={priorCumulativeGpa}
                  onChange={(e) => setPriorCumulativeGpa(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label htmlFor="prior-credits" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                  Prior credits earned
                </label>
                <input
                  id="prior-credits"
                  type="number"
                  aria-label="Prior credits earned"
                  placeholder="e.g. 45"
                  inputMode="decimal"
                  step="0.5"
                  min="0"
                  max="300"
                  className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg text-center placeholder:text-slate-400"
                  value={priorCreditsEarned}
                  onChange={(e) => setPriorCreditsEarned(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Courses Section Divider with Increased Vertical Margin */}
          <div className="my-8 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <div className="course-head text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              <span>Course</span>
              <span>Credits</span>
              <span>Grade</span>
              <span />
            </div>
          </div>

          <div className="courses-list-container space-y-4 sm:space-y-5 overflow-x-auto">
            <AnimatePresence initial={false}>
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  layout="position"
                  initial={{ opacity: 0, x: -18, y: -4 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 18, height: 0, overflow: 'hidden', transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="course-row py-2 my-1"
                >
                  <div className="course-row-main">
                    <input aria-label="Course name" placeholder="Course name (e.g. Biology 101)"
                      id={`course-name-${course.id}`}
                      type="text"
                      className="w-full min-h-[48px] bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-base sm:text-sm text-left sm:text-center placeholder:text-slate-400"
                      value={course.name}
                      onChange={(e) => handleUpdateCourse(course.id, 'name', e.target.value)}
                    />
                    <button
                      type="button"
                      className="p-2 rounded-full text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      aria-label={`Remove ${course.name || 'course'}`}
                      disabled={courses.length === 1}
                      onClick={() => handleRemoveCourse(course.id)}
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="course-row-details">
                    {/* Credits Selection: Simple dropdown menu (0.5 to 6.0) */}
                    <div className="field-group">
                      <label htmlFor={`course-credits-${course.id}`} className="field-sublabel text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                        Credits
                      </label>
                      <select
                        id={`course-credits-${course.id}`}
                        className="bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-2.5 h-12 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold font-mono text-center text-base sm:text-sm cursor-pointer"
                        value={course.credits}
                        onChange={(e) => handleUpdateCourse(course.id, 'credits', e.target.value)}
                        aria-label={`${course.name || 'Course'} credits`}
                      >
                        {CREDIT_OPTIONS.map((cr) => (
                          <option key={cr} value={cr}>
                            {cr.toFixed(1)} cr
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Grade Dropdown (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F) */}
                    <div className="field-group">
                      <label htmlFor={`course-grade-${course.id}`} className="field-sublabel text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                        Grade
                      </label>
                      <select
                        id={`course-grade-${course.id}`}
                        className="bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-2.5 h-12 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-center text-base sm:text-sm cursor-pointer"
                        value={course.grade}
                        onChange={(e) => handleUpdateCourse(course.id, 'grade', e.target.value)}
                        aria-label={`${course.name || 'Course'} grade`}
                      >
                        {GRADE_OPTIONS.map((letter) => (
                          <option key={letter} value={letter}>
                            {letter} ({getGradeValue(letter).toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="mt-6 bg-[#134E48] hover:bg-[#0D3834] dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-full font-bold shadow-md px-6 py-3 transition-all inline-flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-95"
            onClick={handleAddCourse}
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Add course
          </button>
        </section>

        {/* Output: Instantly calculate and display Semester and Cumulative GPA as clear text */}
        <section aria-label="GPA Results Summary" className="result-panel bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between" aria-live="polite">
          <div className="space-y-5">
            {/* Semester GPA - Master Output Container */}
            <div className="bg-[#CFE9DF] dark:bg-teal-950/60 border border-[#96CDB8] dark:border-teal-800/60 rounded-[28px] p-5 shadow-sm">
              <span className="text-xs font-semibold tracking-widest text-teal-800 dark:text-teal-300 uppercase block">
                Semester GPA
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tracking-tight mt-2 flex items-baseline gap-1.5">
                <span>{semesterGpa.toFixed(2)}</span>
                <span className="text-sm font-medium text-teal-700/80 dark:text-teal-400">/ {aPlusValue === 4.33 ? '4.33' : '4.0'}</span>
              </div>
              <div className="bg-white/90 dark:bg-slate-900/80 rounded-2xl shadow-xs p-3 mt-3 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200 font-medium">
                <span>{semesterCredits.toFixed(1)} Semester Credits</span>
                <span>{semesterQualityPoints.toFixed(1)} Quality Points</span>
              </div>
            </div>

            {/* Cumulative GPA - Master Output Container */}
            <div className="bg-[#D6E1FF] dark:bg-indigo-950/60 border border-[#A5BCF0] dark:border-indigo-800/60 rounded-[28px] p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest text-indigo-900 dark:text-indigo-300 uppercase">
                  Cumulative GPA
                </span>
                {hasPriorHistory && (
                  <span className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-[#A5BCF0] dark:border-indigo-800/60 shadow-xs">
                    Includes Prior History
                  </span>
                )}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-950 dark:text-indigo-100 font-mono tracking-tight mt-2 flex items-baseline gap-1.5">
                <span>{cumulativeGpa.toFixed(2)}</span>
                <span className="text-sm font-medium text-indigo-800/80 dark:text-indigo-400">
                  / {aPlusValue === 4.33 ? '4.33' : '4.0'}
                </span>
              </div>
            </div>

            {/* Secondary Metric Tabs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#FFE8C2] dark:bg-amber-950/55 rounded-[24px] p-4 border border-black/5 dark:border-amber-800/50 shadow-xs">
                <strong className="block text-xl font-bold text-slate-800 dark:text-white">{totalCumulativeCredits.toFixed(1)}</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total credits</span>
              </div>
              <div className="bg-[#F8F9FA] dark:bg-slate-800/60 rounded-[24px] p-4 border border-black/5 dark:border-slate-700/60 shadow-xs">
                <strong className="block text-xl font-bold text-slate-800 dark:text-white">{courses.length}</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Semester courses</span>
              </div>
            </div>

            {/* Export GPA PDF & Print Controls */}
            <div className="pt-4 border-t border-slate-100/80 dark:border-slate-800 flex flex-wrap items-center gap-2.5 print:hidden">
              <button
                type="button"
                aria-label="Print GPA result"
                onClick={() => {
                  triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                  try {
                    window.print();
                  } catch {
                    setToast?.('Use Export GPA PDF to save a printable transcript.');
                  }
                }}
                className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#134E48] hover:bg-[#0D3834] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold shadow-md text-xs sm:text-sm transition-all cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Print Result</span>
              </button>
              <button
                type="button"
                aria-label="Export GPA transcript report as PDF"
                onClick={async () => {
                  triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                  try {
                    setToast?.('Generating GPA transcript PDF...');
                    const { exportGpaReportPdf } = await import('../utils/pdfExport');
                    await exportGpaReportPdf({
                      gpa: cumulativeGpa,
                      totalCredits: totalCumulativeCredits,
                      courses,
                    });
                    setToast?.('GPA transcript PDF downloaded!');
                  } catch {
                    setToast?.('Could not generate GPA PDF.');
                  }
                }}
                className="min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 font-semibold shadow-xs text-xs transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Export GPA PDF</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Optimized Educational & SEO Content for GPA Calculator */}
      <section className="seo-content w-full max-w-4xl mx-auto mt-12 mb-16" aria-labelledby="gpa-guide-title">
        <article className="seo-article bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 border border-white/60 dark:border-white/10 shadow-sm rounded-3xl p-6 sm:p-10 font-sans">
          <h2
            id="gpa-guide-title"
            className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 tracking-tight"
          >
            How to Calculate GPA: Grade Point Average for College &amp; University Registrar
          </h2>

          <div className="my-6">
            <SemanticGuideImage
              toolKey="gpa"
              alt="A hand holds a calculator over a paper with course names and numbers visible."
            />
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            An essential metric for academic evaluation, the Grade Point Average (GPA) plays a pivotal role in a student&apos;s educational journey. <strong className="font-semibold text-slate-900 dark:text-white">Understanding how to calculate GPA is crucial for every college and university student, especially when considering how different institutions approach semester and cumulative calculations.</strong> This guide demystifies the GPA calculation process, providing clarity on how to convert letter grades and credit hours into an accurate grade-point average. Need to calculate an individual course grade first? Use our <Link to="/grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Weighted Grade Calculator</Link> or <Link to="/" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Quick Grade Chart</Link>.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Understanding GPA
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What is GPA?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            GPA, or Grade Point Average, is a standardized numerical representation of a student&apos;s academic achievement across a term or degree program. <strong className="font-semibold text-slate-900 dark:text-white">It serves as a comprehensive metric that reflects the credit-weighted average of all grades earned across various courses.</strong> Each letter grade, such as an A, B, C, D, or F, is assigned a specific point value, and these grade points—including pluses and minuses—are then used in the calculation. This system allows for a consistent evaluation of a student&apos;s performance throughout their high school, college, or university enrollment.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Importance of Grade Point Average
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The Grade Point Average holds significant importance across higher education and career placement. <strong className="font-semibold text-slate-900 dark:text-white">A student&apos;s GPA can impact college admissions, scholarship eligibility, academic honors, and future employment opportunities, highlighting the importance of maintaining strong semester and cumulative averages.</strong> Many institutions set a minimum GPA for academic good standing, and a higher GPA opens doors to honors programs, financial aid, and graduate school admissions.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Types of GPAs: Weighted vs. Unweighted
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            When considering how to calculate GPA, it is crucial to understand the distinction between weighted GPA and unweighted GPA. <strong className="font-semibold text-slate-900 dark:text-white">An unweighted GPA calculates the grade point average on a standard 4.0 scale, where an A always equates to 4.0 grade points regardless of course difficulty. Conversely, a weighted GPA considers course rigor, assigning additional points (often on a 5.0 scale) to Advanced Placement (AP), IB, or Honors classes.</strong> This means that a student can earn more quality points for an A in an AP course than for an A in a standard course.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Calculating GPA
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Step-by-Step Calculation Process
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The process to calculate GPA involves several clear steps to reflect a student&apos;s academic achievement accurately. First, gather all coursework, credit hours, and letter grade information for the semester. <strong className="font-semibold text-slate-900 dark:text-white">Assign numerical grade points to each letter grade earned in a course on the 4.0 GPA scale (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0). Next, multiply these grade points by the number of credit hours for each course to determine the quality points for that course.</strong> Sum the quality points for all courses in the term, and divide that total by the total number of credit hours attempted to arrive at your GPA. You can review the full mathematical derivation in our <Link to="/about" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Academic Grading Methodology</Link>.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Using a GPA Calculator
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            To simplify the calculation process and avoid manual errors, <strong className="font-semibold text-slate-900 dark:text-white">a GPA calculator is an invaluable tool for any high school, college, or university student.</strong> This digital tool automates the steps involved in calculating your GPA, allowing you to input letter grades and corresponding credit hours for each course and immediately see both semester and cumulative results.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Factors Influencing GPA Calculation
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Several institutional rules can influence the final GPA calculation beyond basic grade points. A college or university may use a plus/minus grading scale (where an A- equals 3.7 and a B+ equals 3.3). <strong className="font-semibold text-slate-900 dark:text-white">The credit weight of specific courses, such as 4-credit lab sciences versus 1-credit seminars, also causes high-credit classes to have a much larger impact on your semester and cumulative GPA.</strong> Additionally, pass/fail, audit, or withdrawn courses are typically excluded from the GPA denominator.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            GPA and Course Grades
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Grade Points Assignment
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The foundation of the GPA system lies in the precise assignment of grade points to each letter grade a student earns. <strong className="font-semibold text-slate-900 dark:text-white">On a standard 4.0 GPA scale, an &quot;A&quot; is assigned 4.0 points, a &quot;B&quot; receives 3.0 points, a &quot;C&quot; gets 2.0 points, a &quot;D&quot; is given 1.0 point, and an &quot;F&quot; receives 0.0 points.</strong> These numerical equivalents provide a standardized method of evaluating academic achievement across courses and academic terms.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Quality Points Explained
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Quality points represent the weighted value of a grade in a course relative to its credit load. <strong className="font-semibold text-slate-900 dark:text-white">To determine quality points for a course, multiply the grade points for the letter grade earned (including pluses and minuses) by the number of credit hours for that course.</strong> For example, an &quot;A&quot; (4.0 grade points) in a 3-credit course yields 12.0 quality points (4.0 × 3). Summing quality points across all courses and dividing by total credits produces your final GPA.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Impact of Course Weight on GPA
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The credit weight and rigor of a course significantly impact a student&apos;s GPA. <strong className="font-semibold text-slate-900 dark:text-white">Courses designated as more rigorous, such as Advanced Placement (AP) or honors classes, are often assigned additional weight in high school systems, while in college, 4-credit and 5-credit courses carry proportionally greater weight than 2-credit electives.</strong> Prioritizing high-credit courses is one of the most effective ways to protect and raise your GPA.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Cumulative GPA and Overall Performance
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What is Cumulative GPA?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">The cumulative GPA represents the overall credit-weighted average of a student&apos;s performance across all courses completed throughout their entire academic career at an institution.</strong> Unlike a semester GPA, which only considers grades from a single term, the cumulative GPA combines prior cumulative quality points and credits with current semester coursework.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Tracking GPA Over Time
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Tracking your GPA over time helps you monitor academic progress and maintain good academic standing for scholarships and degree requirements.</strong> By calculating your projected GPA before finals week, you can see how each course grade affects your cumulative standing and allocate study time strategically.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Strategies for Improving Overall GPA
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Improving your overall GPA requires consistent effort across academic terms. Key strategies include prioritizing courses with higher credit hours, calculating needed exam scores using our <Link to="/easy-grade-calculator/final-exam-grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Final Exam Grade Calculator</Link>, scoring individual quizzes with the <Link to="/" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Quick Grade Chart</Link>, and utilizing office hours early in the semester. <strong className="font-semibold text-slate-900 dark:text-white">Students should also check institutional grade-forgiveness policies for retaking courses where they received a low grade, as replacing a low mark can substantially boost cumulative GPA.</strong>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            GPA in College and University
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Understanding Transcripts and GPAs
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Official academic transcripts detail a student&apos;s enrollment history, including all courses taken, letter grades received, credit hours, semester GPAs, and cumulative GPA.</strong> Understanding how your registrar computes term and cumulative averages is vital when transferring credits, applying for internships, or preparing graduate school applications.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            GPA Requirements for Different Programs
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            GPA requirements vary across academic departments and degree programs. Most undergraduate programs require a minimum cumulative GPA of 2.0 on a 4.0 scale to maintain good academic standing and graduate, while competitive majors in engineering, nursing, business, and computer science often require a 2.5 to 3.2 major GPA. <strong className="font-semibold text-slate-900 dark:text-white">Students should review their department&apos;s specific plus/minus grading rules and major GPA prerequisites each semester.</strong>
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            GPA Guidelines for Honors and Graduate Programs
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Honors designations and graduate programs set higher GPA benchmarks to recognize sustained academic excellence. Dean&apos;s List and Latin honors (Cum Laude, Magna Cum Laude, Summa Cum Laude) typically begin between 3.50 and 3.85 cumulative GPA. <strong className="font-semibold text-slate-900 dark:text-white">Graduate and professional schools generally look for an undergraduate GPA of 3.0 to 3.7+ alongside strong upper-division coursework.</strong>
          </p>

          <div className="mt-8 p-5 rounded-2xl bg-teal-100/80 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Need to Convert a 10.0, 5.0, or 4.0 CGPA to Percentage?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Use our dedicated <strong>CGPA to Percentage Calculator</strong> with 30+ verified Indian and international university ordinances (VTU, Mumbai University, MAKAUT, GTU, SPPU, Anna University, BHU, and CBSE × 9.5).
              </p>
            </div>
            <Link
              to="/cgpa-to-percentage-calculator"
              className="shrink-0 min-h-[44px] px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center transition-colors no-underline"
            >
              Open CGPA to % Calculator &rarr;
            </Link>
          </div>
        </article>
      </section>

      {!hideSeo && (
        <section aria-label="GPA Frequently Asked Questions" className="w-full max-w-4xl mx-auto my-12 px-4">
          <FAQ tool="gpa" />
        </section>
      )}
    </>
  );
};
