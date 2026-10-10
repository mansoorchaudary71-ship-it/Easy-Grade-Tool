import React, { useState, useEffect, useId } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Helmet } from '../utils/helmet';
import {
  Calculator,
  CheckCircle2,
  Copy,
  Check,
  Percent,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { BASE_CANONICAL_ORIGIN, SITE_LAUNCH_DATE, SITE_LAST_MODIFIED, CONTACT_EMAIL } from '../data/seoConfig';

export interface HowToStepData {
  id: string;
  stepNumber: number;
  name: string;
  shortSummary: string;
  text: string;
  formula?: string;
  example?: string;
  tip?: string;
}

export const HOW_TO_STEPS: HowToStepData[] = [
  {
    id: 'gather-scores',
    stepNumber: 1,
    name: 'Gather Your Scores and Syllabus Category Weights',
    shortSummary: 'Collect earned points, maximum possible points, and category percentages.',
    text: 'Collect your points earned and total points possible for all graded coursework (homework, quizzes, exams, and projects). Next, consult your course syllabus to determine whether your instructor evaluates grades using weighted percentage categories (e.g., Homework 20%, Midterms 30%, Final Exam 50%) or a total points-based system.',
    example: 'Example: Syllabus specifies Homework (20%), Midterm Exam (30%), Quizzes (20%), and Final Exam (30%).',
    tip: 'If weights are not explicitly listed in the syllabus, ask your instructor if all points carry equal weight.',
  },
  {
    id: 'convert-percentages',
    stepNumber: 2,
    name: 'Convert Each Assignment Score to a Percentage',
    shortSummary: 'Divide earned points by total points possible and multiply by 100.',
    text: 'Convert every individual assignment or test score into a standard percentage. Divide the points you earned by the maximum points possible and multiply the result by 100.',
    formula: 'Score % = (Points Earned ÷ Total Points Possible) × 100',
    example: 'Example: 42 points earned out of 50 possible points on a quiz = (42 ÷ 50) × 100 = 84.0%.',
  },
  {
    id: 'calculate-category-average',
    stepNumber: 3,
    name: 'Calculate the Average Percentage for Each Category',
    shortSummary: 'Compute the average score for each assignment group.',
    text: 'If a category contains multiple assignments (e.g., 5 homework assignments), sum the scores and find the category average. If all assignments within that category have equal weight, add their percentages together and divide by the number of assignments.',
    formula: 'Category Average % = (Sum of Category Scores) ÷ (Number of Assignments)',
    example: 'Example Homework: Scores of 90%, 85%, and 95% = (90 + 85 + 95) ÷ 3 = 90.0% homework average.',
  },
  {
    id: 'multiply-by-weights',
    stepNumber: 4,
    name: 'Multiply Each Category Average by Its Relative Weight',
    shortSummary: 'Multiply each category average by its decimal percentage weight.',
    text: 'Convert each syllabus category weight from a percentage into a decimal (by dividing by 100), then multiply it by that category’s average percentage to calculate its weighted contribution.',
    formula: 'Weighted Contribution = Category Average % × (Category Weight ÷ 100)',
    example: 'Example:\n• Homework: 90.0% × 0.20 = 18.0 points\n• Midterm: 80.0% × 0.30 = 24.0 points\n• Quizzes: 85.0% × 0.20 = 17.0 points\n• Final Exam: 92.0% × 0.30 = 27.6 points',
  },
  {
    id: 'sum-weighted-contributions',
    stepNumber: 5,
    name: 'Sum Weighted Contributions to Find Your Final Grade',
    shortSummary: 'Add all weighted values together and divide by total active weight.',
    text: 'Add all individual weighted contributions together. If your category weights already total 100%, this sum directly represents your final course percentage. If the term is ongoing and not all categories have occurred, divide the sum by the total active weights evaluated so far.',
    formula: 'Final Grade % = (Sum of Weighted Contributions) ÷ (Sum of Active Weights)',
    example: 'Example: 18.0 + 24.0 + 17.0 + 27.6 = 86.6% (Overall course grade).',
  },
  {
    id: 'map-to-letter-grade',
    stepNumber: 6,
    name: 'Map Your Final Percentage to the Official Grading Scale',
    shortSummary: 'Convert your percentage to a letter grade (A, B, C, D, F) and 4.0 GPA.',
    text: 'Compare your final calculated percentage to your school’s or university’s official letter grading scale to determine your final letter grade, grade points, and GPA impact.',
    example: 'Standard Scale: 90–100% = A (4.0), 80–89% = B (3.0), 70–79% = C (2.0), 60–69% = D (1.0), Below 60% = F (0.0). With 86.6%, the grade is a B (or B+ on a plus/minus scale).',
  },
];

/**
 * Generates valid Schema.org HowTo structured data JSON-LD object.
 */
export function getHowToSchema(
  canonicalOrigin: string = BASE_CANONICAL_ORIGIN,
  routePath: string = '/'
) {
  const cleanOrigin = canonicalOrigin.replace(/\/+$/, '');
  const normalizedPath = routePath === '/grade-calculator' ? '/grade-calculator' : '/';
  const url = `${cleanOrigin}${normalizedPath}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#manual-grade-calculation-guide`,
    name: 'How to Manually Calculate Your Course Grade (Weighted and Points-Based)',
    description:
      'Step-by-step instructions on how to manually calculate your course grade, weighted average, and final exam score using standard academic grading formulas.',
    inLanguage: 'en-US',
    datePublished: SITE_LAUNCH_DATE,
    dateModified: SITE_LAST_MODIFIED,
    author: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url: `${cleanOrigin}/`,
      email: CONTACT_EMAIL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url: `${cleanOrigin}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${cleanOrigin}/icon.svg`,
      },
    },
    totalTime: 'PT5M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Course syllabus with grading breakdown',
      },
      {
        '@type': 'HowToTool',
        name: 'Easy Grade Calculator (or standard pocket calculator)',
      },
      {
        '@type': 'HowToTool',
        name: 'Pen and paper (or spreadsheet)',
      },
    ],
    step: HOW_TO_STEPS.map((step) => ({
      '@type': 'HowToStep',
      position: step.stepNumber,
      url: `${url}#step-${step.id}`,
      name: step.name,
      text: step.text,
      itemListElement: [
        {
          '@type': 'HowToDirection',
          text: step.text,
        },
        ...(step.formula
          ? [
              {
                '@type': 'HowToTip',
                text: `Formula: ${step.formula}`,
              },
            ]
          : []),
        ...(step.example
          ? [
              {
                '@type': 'HowToTip',
                text: step.example,
              },
            ]
          : []),
      ],
    })),
  };
}

export interface ManualGradeHowToProps {
  className?: string;
  onUseCalculatorClick?: () => void;
}

export const ManualGradeHowTo: React.FC<ManualGradeHowToProps> = ({
  className = '',
  onUseCalculatorClick,
}) => {
  const [activeTab, setActiveTab] = useState<'weighted' | 'points' | 'final-exam'>('weighted');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  const baseId = useId();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const location = useLocation();
  const howToSchema = getHowToSchema(BASE_CANONICAL_ORIGIN, location.pathname);

  // Direct DOM synchronization guarantees document.head contains the updated HowTo JSON-LD schema
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let scriptTag = document.querySelector('script#schema-org-howto') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('id', 'schema-org-howto');
      document.head.appendChild(scriptTag);
    } else {
      scriptTag.removeAttribute('data-rh');
    }
    scriptTag.textContent = JSON.stringify(howToSchema, null, 2);
    return () => {
      document.querySelector('script#schema-org-howto')?.remove();
    };
  }, [howToSchema]);

  return (
    <>
      {typeof window === 'undefined' && (
        <Helmet>
          <script id="schema-org-howto" type="application/ld+json">
            {JSON.stringify(howToSchema)}
          </script>
        </Helmet>
      )}
      <section
        id="manual-grade-calculation-guide"
        itemScope
        itemType="https://schema.org/HowTo"
        className={`manual-grade-guide mt-12 bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 border border-white/60 dark:border-white/10 shadow-sm rounded-3xl p-6 sm:p-10 font-sans ${className}`}
        aria-labelledby={`${baseId}-howto-heading`}
      >
        {/* Eyebrow & Main Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono mb-1.5">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Step-by-Step Tutorial &amp; Math Formulas</span>
            </div>
            <h2
              id={`${baseId}-howto-heading`}
              itemProp="name"
              className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              How to Manually Calculate a Grade (Step-by-Step)
            </h2>
            <p
              itemProp="description"
              className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed"
            >
              Learn the exact mathematical formulas to compute weighted course grades, total points averages, and needed final exam scores by hand—or verify your Easy Grade Calculator results with confidence.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-teal-50/80 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>~5 min read</span>
            </span>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <LayoutGroup id="howto-tabs"><div className="mt-6 flex flex-wrap gap-2 p-1.5 bg-slate-100/80 border border-gray-200/70 rounded-full" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'weighted'}
            onClick={() => setActiveTab('weighted')}
            className={`relative isolate flex min-h-[44px] items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm cursor-pointer ${
              activeTab === 'weighted'
                ? 'font-bold text-stone-900'
                : 'font-semibold text-stone-600 transition-all duration-300 hover:-translate-y-0.5 hover:text-emerald-700'
            }`}
          >
            {activeTab === 'weighted' && (
              <motion.span
                layoutId="howto-active-pill"
                className="absolute inset-0 -z-10 rounded-full border border-gray-200/70 bg-white shadow-sm shadow-gray-400/20"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                aria-hidden="true"
              />
            )}
            <Layers className="w-4 h-4" aria-hidden="true" />
            <span>Weighted Grading (Syllabus Categories)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'points'}
            onClick={() => setActiveTab('points')}
            className={`relative isolate flex min-h-[44px] items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm cursor-pointer ${
              activeTab === 'points'
                ? 'font-bold text-stone-900'
                : 'font-semibold text-stone-600 transition-all duration-300 hover:-translate-y-0.5 hover:text-emerald-700'
            }`}
          >
            {activeTab === 'points' && (
              <motion.span
                layoutId="howto-active-pill"
                className="absolute inset-0 -z-10 rounded-full border border-gray-200/70 bg-white shadow-sm shadow-gray-400/20"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                aria-hidden="true"
              />
            )}
            <Percent className="w-4 h-4" aria-hidden="true" />
            <span>Points-Based Grading</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'final-exam'}
            onClick={() => setActiveTab('final-exam')}
            className={`relative isolate flex min-h-[44px] items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm cursor-pointer ${
              activeTab === 'final-exam'
                ? 'font-bold text-stone-900'
                : 'font-semibold text-stone-600 transition-all duration-300 hover:-translate-y-0.5 hover:text-emerald-700'
            }`}
          >
            {activeTab === 'final-exam' && (
              <motion.span
                layoutId="howto-active-pill"
                className="absolute inset-0 -z-10 rounded-full border border-gray-200/70 bg-white shadow-sm shadow-gray-400/20"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                aria-hidden="true"
              />
            )}
            <Calculator className="w-4 h-4" aria-hidden="true" />
            <span>Needed Final Exam Target Score</span>
          </button>
        </div></LayoutGroup>

        {/* Tab 1: Weighted Grading Steps */}
        {activeTab === 'weighted' && (
          <div className="mt-6 space-y-6">
            {/* Quick Formula Banner */}
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/60 dark:border-slate-800/80 shadow-sm rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wide">
                  Master Weighted Formula
                </div>
                <div className="font-mono text-sm sm:text-base font-semibold text-teal-950 dark:text-teal-100 mt-1">
                  Final Grade % = Σ (Category Score % × Category Weight) ÷ Total Active Weight
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    'Final Grade % = Σ (Category Score % × Category Weight) ÷ Total Active Weight',
                    'weighted-master'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-slate-200/60 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors cursor-pointer self-start md:self-center shadow-xs"
              >
                {copiedFormula === 'weighted-master' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Formula</span>
                  </>
                )}
              </button>
            </div>

            {/* Steps List */}
            <div className="space-y-4">
              {HOW_TO_STEPS.map((step) => (
                <div
                  key={step.id}
                  id={`step-${step.id}`}
                  itemProp="step"
                  itemScope
                  itemType="https://schema.org/HowToStep"
                  className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/60 dark:border-slate-800 shadow-sm rounded-3xl p-6 transition-all hover:shadow-md"
                >
                  <meta itemProp="position" content={String(step.stepNumber)} />
                  <div className="flex items-start gap-4">
                    {/* Step Number Badge */}
                    <div className="shrink-0 w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center shadow-xs">
                      {step.stepNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        itemProp="name"
                        className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight"
                      >
                        {step.name}
                      </h3>
                      <p
                        itemProp="text"
                        className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed"
                      >
                        {step.text}
                      </p>

                      {/* Formula callout if present */}
                      {step.formula && (
                        <div className="mt-3 p-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                          <code className="text-xs sm:text-sm font-mono text-teal-800 dark:text-teal-300 font-semibold overflow-x-auto">
                            {step.formula}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy(step.formula!, step.id)}
                            className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Copy formula"
                            aria-label={`Copy formula for ${step.name}`}
                          >
                            {copiedFormula === step.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Example Box */}
                      {step.example && (
                        <div className="mt-3 p-3 bg-teal-50/40 dark:bg-teal-950/20 border-l-4 border-teal-500 rounded-r-lg text-xs sm:text-sm text-teal-950 dark:text-teal-200 font-sans whitespace-pre-line leading-relaxed">
                          {step.example}
                        </div>
                      )}

                      {/* Optional Tip */}
                      {step.tip && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 italic">
                          <HelpCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{step.tip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Points-Based Grading */}
        {activeTab === 'points' && (
          <div className="mt-6 space-y-5">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/60 dark:border-slate-800/80 shadow-sm rounded-3xl p-6">
              <div className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wide">
                Points-Based Formula
              </div>
              <div className="font-mono text-base font-semibold text-teal-950 dark:text-teal-100 mt-1">
                Course Grade % = (Total Points Earned ÷ Total Points Possible) × 100
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                In a points-based grading system, every point has equal mathematical value regardless of the assignment type. Follow these 3 simple steps:
              </p>
              <ol className="list-decimal pl-5 space-y-2.5">
                <li>
                  <strong className="text-slate-900 dark:text-white font-semibold">Sum Total Points Earned:</strong> Add all points received across every homework, quiz, lab, and exam (e.g., 450 points).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white font-semibold">Sum Total Points Possible:</strong> Add the maximum possible points for all assignments graded to date (e.g., 500 points).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white font-semibold">Divide and Multiply by 100:</strong> Divide earned by possible points: (450 ÷ 500) × 100 = <strong>90.0% (A)</strong>.
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 3: Target Final Exam Score */}
        {activeTab === 'final-exam' && (
          <div className="mt-6 space-y-5">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/60 dark:border-slate-800/80 shadow-sm rounded-3xl p-6">
              <div className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wide">
                Target Final Exam Score Formula
              </div>
              <div className="font-mono text-base font-semibold text-teal-950 dark:text-teal-100 mt-1">
                Required Exam Score = [Target Grade - (Current Grade × Current Weight)] ÷ Final Exam Weight
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                To calculate the minimum score you need on your final exam to achieve a specific target course grade:
              </p>
              <div className="p-6 bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/60 dark:border-slate-800 shadow-sm rounded-3xl space-y-2.5 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-white">Walkthrough Scenario:</div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                  <li>Current Course Grade: <strong className="text-slate-900 dark:text-white">86.0%</strong></li>
                  <li>Final Exam Weight: <strong className="text-slate-900 dark:text-white">25%</strong> (0.25)</li>
                  <li>Target Grade Desired: <strong className="text-slate-900 dark:text-white">90.0%</strong> (Letter grade A)</li>
                </ul>
                <div className="pt-2 font-mono text-teal-700 dark:text-teal-300 font-semibold">
                  Required Score = [90 - (86 × 0.75)] ÷ 0.25 = [90 - 64.5] ÷ 0.25 = <strong>102.0%</strong>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  (In this example, an A would require extra credit, or a 90% target would need to be adjusted.)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action Card */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shrink-0 shadow-sm">
              <Calculator className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Prefer Instant Automation?
              </div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Calculate weighted grades and test target scores in real-time with our tool above.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={
              onUseCalculatorClick ||
              (() => window.scrollTo({ top: 0, behavior: 'smooth' }))
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-full shadow-lg shadow-slate-900/20 transition-all cursor-pointer shrink-0"
          >
            <span>Use Online Grade Calculator</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </>
  );
};

export default ManualGradeHowTo;
