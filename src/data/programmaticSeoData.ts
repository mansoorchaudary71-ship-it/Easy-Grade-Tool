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
    path: '/easy-grade-calculator/final-exam-grade-calculator',
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
    relatedSlugs: ['ez-grader'],
  },

  'ez-grader': {
    slug: 'ez-grader',
    path: '/easy-grade-calculator/ez-grader',
    toolKey: 'quick',
    h1: 'EZ Grader Online & Classroom Test Scoring Chart',
    title: 'EZ Grader Online — Classroom Test Grading Chart',
    metaDescription:
      'Free online EZ grader chart for teachers and educators. Grade tests instantly by total question count and number wrong with print-ready tables.',
    targetAudience: 'teachers',
    badge: 'Classroom Test Grader',
    summary:
      'A digital interactive replacement for the classic cardboard EZ-Grader slide chart used by teachers worldwide.',
    intentContext:
      'Whether you are grading a 10-question quiz or a 100-question final examination, this online EZ grader generates an instant scoring matrix. View point percentages, letter grades, and half-point penalties across every possible number of wrong answers without manual math.',
    mode: 'quick-grader',
    scale: 'standard',
    courseName: 'Classroom Test Grader',
    initialAssessments: [
      { id: 601, name: 'Quiz / Test', score: '31', max: '35', weight: '100' },
    ],
    workedExample: {
      title: 'Step-by-Step Worked EZ Grader Scoring Example',
      scenario:
        'A high school teacher is grading a 35-question science exam. A student gets 4 questions wrong and earns full credit on the remaining 31 questions. The school adheres to standard 10-point letter grade boundaries (90-100% A, 80-89% B, 70-79% C, 60-69% D).',
      inputs: [
        { label: 'Total Test Questions', value: '35 questions' },
        { label: 'Number of Wrong Answers', value: '4 questions' },
        { label: 'Number of Correct Answers', value: '31 questions' },
        { label: 'Value Per Question', value: '2.857 percentage points (100 ÷ 35)' },
      ],
      steps: [
        {
          step: 'Step 1: Calculate total correct answers',
          formula: 'Correct Answers = Total Questions - Wrong Answers',
          math: '35 - 4 = 31 correct answers',
          explanation:
            'Each correct answer earns an equal share of the 100 total percentage points available on the exam.',
        },
        {
          step: 'Step 2: Compute percentage test score',
          formula: 'Score Percentage = (Correct Answers ÷ Total Questions) × 100',
          math: '(31 ÷ 35) × 100 = 0.885714 × 100 = 88.57%',
          explanation:
            'Rounded to one decimal place, the student achieved an 88.6% score on the assessment.',
        },
        {
          step: 'Step 3: Map percentage score to institutional letter grade',
          formula: 'Letter Grade Bracket Match',
          math: '88.57% falls in the 80.0% – 89.9% bracket → Grade: B (or B+ on plus/minus scales)',
          explanation:
            'The EZ Grader matrix instantly displays 88.6% and B beside 4 wrong answers, eliminating repetitive arithmetic during batch grading.',
        },
      ],
      outcomes: [
        {
          label: 'Calculated Grade',
          result: '88.6% (Letter Grade: B / B+)',
          commentary:
            'With 4 wrong out of 35, the student misses 11.4 percentage points total, preserving a solid B grade.',
        },
      ],
    },
    audienceComparison: {
      heading: 'Who This EZ Grader Is For vs. General Grade Calculator',
      whoItIsFor:
        'This tool is tailored specifically for teachers, professors, teaching assistants, and homeschooling parents who need to grade stacks of physical or digital quizzes quickly.',
      howItDiffers:
        'A general course grade calculator tracks multiple assignments and course categories over an entire semester. The EZ Grader focuses strictly on grading a single test or quiz by displaying a full chart of points and letter grades for every possible number of missed questions.',
      parentLinkText: 'Instant Quick Grade Calculator',
      parentLinkPath: '/',
    },
    customFaqs: [
      {
        id: 'faq-ez-chart-usage',
        category: 'ez-grader',
        question: 'How does an online EZ grader compare to the traditional cardboard slide chart?',
        answer:
          'Traditional cardboard EZ-Graders use physical sliding scales that can wear out or be limited to whole question counts. This online EZ grader provides identical instant table lookups on any smartphone, tablet, or laptop, while supporting custom grading scales, half-point deductions, and printer-friendly exports.',
      },
      {
        id: 'faq-ez-half-points',
        category: 'ez-grader',
        question: 'Can I calculate partial credit and half-point penalties with this tool?',
        answer:
          'Yes. Enter fractional wrong counts (such as 2.5 or 3.5 wrong answers) in the calculator input to evaluate partial credit for multi-step math problems or essay questions with precision.',
      },
      {
        id: 'faq-ez-rounding-rules',
        category: 'ez-grader',
        question: 'Does the EZ grader chart round up scores like 89.5% to an A?',
        answer:
          'Scores are displayed to two decimal places (e.g., 89.50%). Whether 89.5% rounds up to an A (90%) depends on your individual school or district policy. The raw percentage is displayed clearly so you can apply your institution’s rounding standard.',
      },
      {
        id: 'faq-ez-print-chart',
        category: 'ez-grader',
        question: 'Can I print or save this grading chart for my desk?',
        answer:
          'Yes. Use the print shortcut (Ctrl+P or Cmd+P) or export the score matrix to save a cleanly formatted PDF grading sheet for any test length from 5 to 100 questions.',
      },
      {
        id: 'faq-ez-custom-scale',
        category: 'ez-grader',
        question: 'What grading scales does the EZ Grader support?',
        answer:
          'The EZ Grader supports the standard 10-point scale (A, B, C, D, F), plus/minus scales (A+, A, A-, etc.), and custom user-defined percentage cutoffs to match your classroom syllabus.',
      },
    ],
    searchVolumeTier: 'high',
    relatedSlugs: ['final-exam-grade-calculator'],
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
