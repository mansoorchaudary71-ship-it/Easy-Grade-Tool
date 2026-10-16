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
    title: 'Final Exam Grade Calculator — Grade Needed on the Final',
    metaDescription:
      'Final exam grade calculator: enter your current grade, final exam weight and target to see the score you need to pass or earn an A, B or C, by percent or points.',
    targetAudience: 'college',
    badge: 'Final Exam Target Solver',
    summary:
      'Solve for the minimum score you must achieve on your cumulative or semester final exam to reach your goal letter grade.',
    intentContext:
      'This final exam grade calculator solves for the score you need on the final. Enter your current course grade, the final exam weight and the grade you want, for college, high school or any class graded by percentages or points, and it shows the exam score required.',
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
          'Multiply your current grade by the share of the course already graded, multiply your final exam score by the final exam weight, and add the two: Final Grade = Current Grade × (1 − Final Weight) + Final Exam Score × Final Weight. With an 84% current grade, a 25% final and a 92% exam score, you get 84 × 0.75 + 92 × 0.25 = 63 + 23 = 86%.',
      },
      {
        id: 'faq-final-exam-vs-final-grade',
        category: 'final-exam',
        question: 'Is this a final exam calculator or a final grade calculator?',
        answer:
          'Both. Enter your current grade, your target and the final exam weight to see the score you need on the exam, or try different exam scores to see the final course grade each one would give you. It uses the same formula either way, and it works for any test or exam that counts for a share of your grade.',
      },
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
        id: 'faq-final-what-score-to-pass',
        category: 'final-exam',
        question: 'What score do I need to pass my final exam?',
        answer:
          'Set your target to the lowest passing grade in your syllabus and read the result. With a 72% average and a final worth 30%, you need 32% on the exam to finish at 60% and 65.3% to finish at 70%. If the calculator shows a negative number, you have already passed.',
      },
      {
        id: 'faq-final-grade-to-pass',
        category: 'final-exam',
        question: 'What grade do I need on my final exam to pass?',
        answer:
          'Use your course’s minimum passing grade as the target, enter your current grade and the final exam weight, and the calculator returns the exam percentage that keeps you at or above it. Passing marks differ: 60% is common, but many programs require a C (70%) for a course to count.',
      },
      {
        id: 'faq-final-calc-what-i-need',
        category: 'final-exam',
        question: 'How do I calculate what I need on my final?',
        answer:
          'Use required score = (target − current grade × (1 − final weight)) ÷ final weight, with the weight as a decimal. With an 84% current grade, a 25% final and an 80% target, (80 − 63) ÷ 0.25 = 68%. The calculator does this for any numbers you enter.',
      },
      {
        id: 'faq-final-pass-fail',
        category: 'final-exam',
        question: 'Can I use this simulator to find what I need to just pass the class?',
        answer:
          'Yes. Set your target grade to your institution’s minimum passing mark (typically 70.0% for a C or 60.0% for a D-). The solver will tell you the exact threshold needed to avoid failing the course.',
      },
      {
        id: 'faq-final-find-weight',
        category: 'final-exam',
        question: 'How do I find how much my final exam is worth?',
        answer:
          'Look at the grading breakdown in your syllabus. If it lists percentages, use the number next to the final exam. If your class adds up raw points, divide the final exam’s points by the total points in the course: a 200-point final in a 1,000-point course is worth 20%.',
      },
      {
        id: 'faq-final-keep-b',
        category: 'final-exam',
        question: 'What do I need on the final to keep a B if I have an 82% and the final is worth 25%?',
        answer:
          'Your coursework banks 82 × 0.75 = 61.5 points. To finish with 80% you need (80 − 61.5) ÷ 0.25 = 74% on the final exam. Every point above 74% puts your course grade over the 80% line.',
      },
      {
        id: 'faq-final-heavier-weight',
        category: 'final-exam',
        question: 'How does a heavier final exam weight change the score I need?',
        answer:
          'A heavier final means less is banked, so the exam matters more. With a 78% average on the 60% of the course already graded, a 40% final and an 80% target, you bank 46.8 points and need (80 − 46.8) ÷ 0.40 = 83% on the final.',
      },
      {
        id: 'faq-final-by-points',
        category: 'final-exam',
        question: 'How do I calculate the final exam grade I need if my class uses points?',
        answer:
          'Work in points. Multiply the percentage you want by the total points in the course, then subtract the points you have already earned. With 412 of 500 points so far, a 100-point final and an 80% target, 0.80 × 600 = 480, and 480 − 412 = 68 points, so you need 68 out of 100. Entering an 82.4% current grade and a 16.7% weight in the calculator gives the same 68%.',
      },
      {
        id: 'faq-final-with-midterm',
        category: 'final-exam',
        question: 'How do I include a midterm in my final exam grade calculation?',
        answer:
          'Count the midterm as part of your current grade. If homework is 20% of the course at 90% and the midterm is 30% at 70%, the graded work is worth 50% and banks 18 + 21 = 39 points, a 78% current grade. With a 50% final and an 80% target, you need (80 − 39) ÷ 0.50 = 82% on the final.',
      },
      {
        id: 'faq-final-two-quarters',
        category: 'final-exam',
        question: 'How do I calculate my final exam grade when the year has two quarters?',
        answer:
          'Average the quarters according to their weights, then use that as your current grade. If each of two quarters counts for 40% and the final exam for 20%, quarter grades of 85% and 78% give an 81.5% current grade. For an 80% year grade you need (80 − 81.5 × 0.80) ÷ 0.20 = 74% on the exam.',
      },
      {
        id: 'faq-final-minimum-for-c',
        category: 'final-exam',
        question: 'What is the lowest score I can get on the final and still earn a C?',
        answer:
          'Set the target to the lowest C on your scale and solve for the exam. With a 76% current grade and a final worth 20%, you bank 60.8 points, and (70 − 60.8) ÷ 0.20 = 46%. Any exam score at or above 46% keeps a 70% course grade.',
      },
      {
        id: 'faq-final-replaces-lowest-test',
        category: 'final-exam',
        question: 'How do I calculate a final exam that replaces my lowest test grade?',
        answer:
          'Swap the final’s score in for the lowest test and recalculate. If each test is worth 10% of the course, your lowest test was a 60% and the final earns 85%, the replacement adds (85 − 60) × 0.10 = 2.5 points to your course grade. To plan ahead, enter your tests in the weighted grade calculator and replace the low score with a hypothetical exam score.',
      },
      {
        id: 'faq-final-no-final-exam',
        category: 'final-exam',
        question: 'How do I find my semester grade if there is no final exam?',
        answer:
          'Without a final, the semester grade is the weighted average of everything that was graded. Enter each category with its weight in the weighted grade calculator, which divides by the weights you enter, so they do not have to add up to 100. This page is for classes where one exam is still to come.',
      },
      {
        id: 'faq-final-high-school-college',
        category: 'final-exam',
        question: 'Does the final exam grade calculator work for high school and college?',
        answer:
          'Yes. The formula is the same for any class: the graded work banks points and the final supplies the rest. If your final is split into an exam and a culminating task, add their weights together and treat them as one block; the result is the average score you need across both.',
      },
      {
        id: 'faq-final-curve',
        category: 'final-exam',
        question: 'Can I use the calculator if my instructor curves the final exam?',
        answer:
          'The calculator uses the score you enter, so add the curve to the score you expect before you compare it with the result. For example, a raw 70% plus a 5-point curve counts as 75%. The grade curve calculator shows how common curving methods change a set of scores.',
      },
      {
        id: 'faq-final-effect-on-grade',
        category: 'final-exam',
        question: 'How much does my final exam affect my overall grade?',
        answer:
          'Each percentage point on the exam moves your course grade by the exam weight. On a 25% final, a 10-point swing in the exam score changes the course grade by 2.5 points, and on a 40% final it changes it by 4 points. The heavier the final, the more it can lift or lower your letter grade.',
      },
      {
        id: 'faq-final-gpa-effect',
        category: 'final-exam',
        question: 'How does my final exam grade affect my GPA?',
        answer:
          'The exam changes your course percentage, which sets the course letter grade, and that letter sets the grade points used in your GPA. Find the course grade here first, then enter the letter and credit hours in the GPA calculator to see the semester or cumulative result.',
      },
      {
        id: 'faq-final-excel-formula',
        category: 'final-exam',
        question: 'What is the final exam grade formula to use in Excel or Google Sheets?',
        answer:
          'Put your current grade in A1, your target in B1 and the final weight as a decimal in C1, then enter =(B1-A1*(1-C1))/C1. With 84, 80 and 0.25 it returns 68, the exam percentage you need. This page gives the same answer and also flags targets that are already secured or out of reach.',
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
