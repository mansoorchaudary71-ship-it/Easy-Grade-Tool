import { ToolKey } from '../types.ts';
import { AssessmentItem, CalculationMode, GradingScaleType } from '../types.ts';
import { FAQItem } from '../components/FAQ.tsx';
import { BASE_CANONICAL_ORIGIN } from './constants.ts';

export interface WorkedCalculationStep {
  step: string;
  formula?: string;
  math: string;
  explanation: string;
}

export interface WorkedExampleData {
  title: string;
  scenario: string;
  inputs: { label: string; value: string }[];
  steps: WorkedCalculationStep[];
  outcomes: { label: string; result: string; commentary: string }[];
}

export interface ProgrammaticSeoEntry {
  slug: string;
  path: string;
  toolKey: ToolKey;
  h1: string;
  title: string;
  metaDescription: string;
  targetAudience: 'college' | 'high-school' | 'teachers' | 'general';
  badge: string;
  summary: string;
  intentContext: string;
  mode: CalculationMode;
  scale: GradingScaleType;
  courseName: string;
  initialAssessments?: AssessmentItem[];
  workedExample: WorkedExampleData;
  audienceComparison: {
    heading: string;
    whoItIsFor: string;
    howItDiffers: string;
    parentLinkText: string;
    parentLinkPath: string;
  };
  customFaqs: FAQItem[];
  searchVolumeTier: 'high' | 'medium';
  relatedSlugs: string[];
}

export const PROGRAMMATIC_SEO_REGISTRY: Record<string, ProgrammaticSeoEntry> = {
  'final-exam-grade-calculator': {
    slug: 'final-exam-grade-calculator',
    path: '/final-exam-grade-calculator/',
    toolKey: 'quick',
    h1: 'Final Exam Grade Calculator',
    title: 'Final Exam Grade Calculator — Target Score Needed',
    metaDescription:
      'Calculate the exact score you need on your final exam to pass or earn an A, B, or C. Step-by-step syllabus weight formula and grade simulator.',
    targetAudience: 'college',
    badge: 'Final Exam Target Solver',
    summary:
      'Solve for the minimum score you must achieve on your cumulative or semester final exam to reach your goal letter grade.',
    intentContext:
      'Instead of calculating what grade you currently have, this specialized final exam calculator solves the inverse equation. Enter your current course standing, your desired final class grade, and the percentage weight of your final exam to reveal your required target score.',
    mode: 'weighted',
    scale: 'standard',
    courseName: 'Final Exam Preparation',
    initialAssessments: [
      { id: 501, name: 'Current Coursework (Before Final)', score: '84', max: '100', weight: '75' },
    ],
    workedExample: {
      title: 'Step-by-Step Worked Final Exam Calculation Example',
      scenario:
        'A student currently holds an 84.0% (B) in Organic Chemistry based on 75% of completed semester coursework. The upcoming cumulative final exam counts for the remaining 25% of the total course grade. The student evaluates three targets: aiming for an A (90.0%), reaching an achievable B+ (86.0%), and securing a minimum B (80.0%).',
      inputs: [
        { label: 'Current Grade', value: '84.0%' },
        { label: 'Completed Coursework Weight', value: '75% (0.75)' },
        { label: 'Final Exam Weight', value: '25% (0.25)' },
        { label: 'Target Final Grade (Scenario 1 - Goal A)', value: '90.0%' },
        { label: 'Target Final Grade (Scenario 2 - Achievable B+)', value: '86.0%' },
        { label: 'Target Final Grade (Scenario 3 - Minimum B)', value: '80.0%' },
      ],
      steps: [
        {
          step: 'Step 1: Calculate points already banked from completed coursework',
          formula: 'Banked Points = Current Grade × (1 - Final Exam Weight)',
          math: '84.0 × 0.75 = 63.0 points earned out of 100 total course points',
          explanation:
            'The coursework completed so far contributes exactly 63.0 percentage points toward the final course grade of 100 possible points.',
        },
        {
          step: 'Step 2: Determine maximum possible semester grade',
          formula: 'Max Possible Grade = Banked Points + (100% on Final × Final Exam Weight)',
          math: '63.0 + (100 × 0.25) = 63.0 + 25.0 = 88.0%',
          explanation:
            'Even with a flawless 100% score on the final exam, the highest grade mathematically achievable is 88.0% (B+). An overall A (90.0%) is not mathematically possible without instructor curves or extra credit.',
        },
        {
          step: 'Step 3: Solve for the required exam percentage across targets',
          formula: 'Required Score = (Target Grade - Banked Points) ÷ Final Exam Weight',
          math: 'For A (90%): (90.0 - 63.0) ÷ 0.25 = 108.0% | For B+ (86%): (86.0 - 63.0) ÷ 0.25 = 92.0% | For B (80%): (80.0 - 63.0) ÷ 0.25 = 68.0%',
          explanation:
            'For an A (90.0%), you would need 108.0%, which is impossible; the highest grade you can reach is 88.0%. However, an 86.0% (B+) is realistic and requires 92.0% on the final exam, while locking in an 80.0% (B) requires only 68.0%.',
        },
      ],
      outcomes: [
        {
          label: 'Target A (90.0%)',
          result: 'Mathematically Impossible (108.0% Required)',
          commentary:
            'You would need 108.0%, which is impossible; the highest grade you can reach is 88.0% even with a perfect 100% on the final.',
        },
        {
          label: 'Target B+ (86.0% - Achievable)',
          result: '92.0% Required',
          commentary:
            'Achievable high-performance goal: scoring 92.0% on the final lifts your semester standing to an 86.0% (B+).',
        },
        {
          label: 'Target B (80.0% - Safe)',
          result: '68.0% Required',
          commentary:
            'Scoring 68.0% or higher preserves your B grade. You can miss up to 32% of final exam points and still meet your minimum threshold.',
        },
      ],
    },
    audienceComparison: {
      heading: 'Who This Calculator Is For vs. General Grade Calculator',
      whoItIsFor:
        'This tool is engineered specifically for students entering finals week who already know their current course grade and need to set realistic study targets for an upcoming exam.',
      howItDiffers:
        'A general grade calculator averages your individual homework, quizzes, and midterm grades forward to give you your present score. This final exam grade calculator works backwards using algebraic inversion to answer the single question: "What minimum score do I need on the final?"',
      parentLinkText: 'Weighted Course Grade Calculator',
      parentLinkPath: '/grade-calculator',
    },
    customFaqs: [
      {
        id: 'faq-final-over-100',
        category: 'final-exam',
        question: 'What does it mean if my required final exam score is over 100%?',
        answer:
          'If the calculator returns a required score exceeding 100%, achieving your target letter grade is mathematically impossible with regular exam points alone. You would need extra credit opportunities, a grading curve from your instructor, or to adjust your target to the next realistic letter grade.',
      },
      {
        id: 'faq-final-negative-score',
        category: 'final-exam',
        question: 'What does it mean if the calculator says I need a negative score?',
        answer:
          'A negative required score means you have already banked enough points from previous homework, labs, and midterms to lock in your target grade. Even if you receive a zero on the final exam, your overall grade will not fall below that threshold.',
      },
      {
        id: 'faq-final-points-vs-percent',
        category: 'final-exam',
        question: 'How do I use this calculator if my class uses total points instead of percentages?',
        answer:
          'Convert your point totals into percentages first. Divide your total points earned by total points possible before the final to find your current percentage, and divide the final exam point value by total course points to determine the final exam weight percentage.',
      },
      {
        id: 'faq-final-drop-lowest',
        category: 'final-exam',
        question: 'How do dropped quiz or exam scores affect my final exam calculation?',
        answer:
          'Recalculate your current grade after removing the dropped score before entering your numbers here. Dropping a low grade raises your current percentage standing, which reduces the exam score you need on finals day.',
      },
      {
        id: 'faq-final-pass-fail',
        category: 'final-exam',
        question: 'Can I use this simulator to find what I need to just pass the class?',
        answer:
          'Yes. Set your target grade to your institution’s minimum passing mark (typically 70.0% for a C or 60.0% for a D-). The solver will tell you the exact threshold needed to avoid failing the course.',
      },
    ],
    searchVolumeTier: 'high',
    relatedSlugs: [],
  },
};

/**
 * Resolves a programmatic SEO entry by slug.
 */
export function resolveProgrammaticSeo(rawSlug: string | undefined): ProgrammaticSeoEntry {
  const slug = (rawSlug || '').trim().toLowerCase().replace(/^\/+|\/+$/g, '');

  if (PROGRAMMATIC_SEO_REGISTRY[slug]) {
    return PROGRAMMATIC_SEO_REGISTRY[slug];
  }

  // Fallback defaults to final-exam-grade-calculator
  return PROGRAMMATIC_SEO_REGISTRY['final-exam-grade-calculator'];
}

/**
 * List of all active canonical programmatic slugs for sitemap and SSG pre-rendering.
 */
export const ALL_PROGRAMMATIC_SLUGS = Object.keys(PROGRAMMATIC_SEO_REGISTRY);
