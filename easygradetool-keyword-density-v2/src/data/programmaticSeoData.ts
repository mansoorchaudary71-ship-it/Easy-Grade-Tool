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
    title: 'Final Exam Grade Calculator — What Score Do You Need?',
    metaDescription:
      'Find the score you need on your final exam to pass or reach an A, B or C. Enter your current grade, the exam weight and your target grade.',
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
        id: 'faq-final-how-to-calculate',
        category: 'final-exam',
        question: 'How do I calculate my final grade?',
        answer:
          'Take your current percentage times the share of the course already marked, add the exam score times the exam’s weight, and the sum is your course total: Final Grade = Current Grade × (1 − Weight) + Exam Score × Weight. With 84% so far, a 25% exam and a 92% result, that is 84 × 0.75 + 92 × 0.25 = 63 + 23 = 86%.',
      },
      {
        id: 'faq-final-exam-vs-final-grade',
        category: 'final-exam',
        question: 'Is this a final exam calculator or a final grade calculator?',
        answer:
          'Both. Enter your current standing, your target and the exam weight to see the score you need, or try different exam scores to see the course result each would produce. The same formula runs either way, and it works for any test or exam that counts toward part of your mark.',
      },
      {
        id: 'faq-final-over-100',
        category: 'final-exam',
        question: 'What does it mean if my required final exam score is over 100%?',
        answer:
          'A required score above 100% means your target cannot be reached with ordinary exam points. You would need extra credit, a curve from your instructor, or a more realistic target such as the next letter down.',
      },
      {
        id: 'faq-final-negative-score',
        category: 'final-exam',
        question: 'What does it mean if the calculator says I need a negative score?',
        answer:
          'A negative result means your earlier homework, labs and midterms have already banked enough to lock in the target. Even a zero on the exam would not drop you below it.',
      },
      {
        id: 'faq-final-points-vs-percent',
        category: 'final-exam',
        question: 'How do I use this calculator if my class uses total points instead of percentages?',
        answer:
          'Convert points to percentages first. Divide the points earned so far by the points possible so far to get your current percentage, and divide the exam’s point value by the course total to get its weight.',
      },
      {
        id: 'faq-final-drop-lowest',
        category: 'final-exam',
        question: 'How do dropped quiz or exam scores affect my final exam calculation?',
        answer:
          'Recalculate your current percentage after removing the dropped score, then enter that figure here. Dropping a low score raises your standing, which lowers the mark you need on exam day.',
      },
      {
        id: 'faq-final-what-score-to-pass',
        category: 'final-exam',
        question: 'What score do I need to pass my final exam?',
        answer:
          'Enter the lowest passing mark in your syllabus as the target and read the result. With a 72% average and an exam worth 30%, you need 32% to finish at 60% and 65.3% to finish at 70%. A negative number means you have already passed. Pass marks differ by school: 60% is common, but many programs require a C (70%) for the course to count, so check your syllabus before you choose the target.',
      },
      {
        id: 'faq-final-calc-what-i-need',
        category: 'final-exam',
        question: 'How do I calculate what I need on my final?',
        answer:
          'Use required score = (target − current × (1 − weight)) ÷ weight, with the weight as a decimal. With 84% so far, a 25% weighting and an 80% target, (80 − 63) ÷ 0.25 = 68%. The calculator does this for any numbers you enter.',
      },
      {
        id: 'faq-final-find-weight',
        category: 'final-exam',
        question: 'How do I find how much my final exam is worth?',
        answer:
          'Check the grading breakdown in your syllabus. If it lists percentages, use the number beside the exam. If your class adds up raw points, divide the exam’s points by the course total: a 200-point exam in a 1,000-point course is worth 20%.',
      },
      {
        id: 'faq-final-keep-b',
        category: 'final-exam',
        question: 'What do I need on the final to keep a B if I have an 82% and the final is worth 25%?',
        answer:
          'Your coursework banks 82 × 0.75 = 61.5 points. To finish with 80% you need (80 − 61.5) ÷ 0.25 = 74% on the exam, and every point above that puts you over the 80% line.',
      },
      {
        id: 'faq-final-worth-20',
        category: 'final-exam',
        question: 'If my final is worth 20 percent, what score do I need for an A?',
        answer:
          'With the exam worth 20%, the rest of the course counts for 80%, so the score you need is (90 − current × 0.8) ÷ 0.2 for a 90% A. Holding 95% needs 70% on the exam, holding 90% needs 90%, holding 85% needs 110% (not possible without extra credit) and holding 80% needs 130%.',
      },
      {
        id: 'faq-final-heavier-weight',
        category: 'final-exam',
        question: 'How does a heavier final exam weight change the score I need?',
        answer:
          'A heavier exam means less is banked, so it matters more. With a 78% average on the 60% of the course already marked, a 40% weighting and an 80% target, you bank 46.8 points and need (80 − 46.8) ÷ 0.40 = 83%.',
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
