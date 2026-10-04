import {
  GraduationCap,
  Calculator,
  Lightbulb,
  Percent,
  Banknote,
  House,
  KeyRound,
} from 'lucide-react';
import { AssessmentItem, CourseItem, FaqItem, ScaleGrade, ToolKey } from '../types';

/**
 * Single source of truth for the official application contact and support email.
 */
export const CONTACT_EMAIL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_CONTACT_EMAIL) ||
  (typeof process !== 'undefined' && process.env?.CONTACT_EMAIL) ||
  'support@easygradetool.com';

/**
 * Single source of truth for the canonical site URL and origin.
 */
export const SITE_URL = 'https://www.easygradetool.com';
export const BASE_CANONICAL_ORIGIN = SITE_URL;

export const INITIAL_ASSESSMENTS: AssessmentItem[] = [
  { id: 1, name: 'Weekly quiz', score: '18', max: '20', weight: '15' },
  { id: 2, name: 'Midterm exam', score: '84', max: '100', weight: '35' },
  { id: 3, name: 'Final project', score: '92', max: '100', weight: '50' },
];

export const INITIAL_COURSES: CourseItem[] = [
  { id: 1, name: 'English composition', credits: '3', grade: 'A' },
  { id: 2, name: 'Biology', credits: '4', grade: 'B+' },
  { id: 3, name: 'History', credits: '3', grade: 'A-' },
];

export const GRADE_POINT_MAP: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'A−': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'B−': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'C−': 1.7,
  'D+': 1.3,
  D: 1.0,
  'D-': 0.7,
  'D−': 0.7,
  F: 0.0,
};

export const GRADING_SCALES: Record<'standard' | 'plus', ScaleGrade[]> = {
  standard: [
    { letter: 'A', min: 90, color: 'hsl(157 45% 48%)' },
    { letter: 'B', min: 80, color: 'hsl(186 48% 42%)' },
    { letter: 'C', min: 70, color: 'hsl(35 88% 58%)' },
    { letter: 'D', min: 60, color: 'hsl(25 72% 57%)' },
    { letter: 'F', min: 0, color: 'hsl(2 61% 54%)' },
  ],
  plus: [
    { letter: 'A', min: 93, color: 'hsl(157 45% 48%)' },
    { letter: 'A−', min: 90, color: 'hsl(157 45% 58%)' },
    { letter: 'B+', min: 87, color: 'hsl(186 48% 42%)' },
    { letter: 'B', min: 83, color: 'hsl(186 48% 51%)' },
    { letter: 'B−', min: 80, color: 'hsl(186 38% 62%)' },
    { letter: 'C+', min: 77, color: 'hsl(35 88% 58%)' },
    { letter: 'C', min: 73, color: 'hsl(35 76% 63%)' },
    { letter: 'C−', min: 70, color: 'hsl(35 66% 68%)' },
    { letter: 'D', min: 60, color: 'hsl(25 72% 57%)' },
    { letter: 'F', min: 0, color: 'hsl(2 61% 54%)' },
  ],
};

export interface ToolDef {
  key: ToolKey;
  label: string;
  icon: typeof GraduationCap;
  path: string;
}

export const TOOL_PATHS: Record<ToolKey, string> = {
  quick: '/',
  gpa: '/gpa-calculator',
  cgpa: '/cgpa-to-percentage-calculator',
  tip: '/tip-calculator',
  percentage: '/percentage-calculator',
  loan: '/loan-calculator',
  mortgage: '/mortgage-calculator',
  password: '/password-generator',
};

export function getToolKeyFromPath(pathname: string): ToolKey {
  const clean = (pathname || '/').toLowerCase();
  if (clean.includes('cgpa')) return 'cgpa';
  if (clean.includes('gpa')) return 'gpa';
  if (clean.includes('tip')) return 'tip';
  if (clean.includes('percentage')) return 'percentage';
  if (clean.includes('loan')) return 'loan';
  if (clean.includes('mortgage')) return 'mortgage';
  if (clean.includes('password')) return 'password';
  return 'quick';
}

export const TOOLS_LIST: ToolDef[] = [
  { key: 'quick', label: 'Quick Grade', icon: GraduationCap, path: '/' },
  { key: 'gpa', label: 'GPA', icon: GraduationCap, path: '/gpa-calculator' },
  { key: 'cgpa', label: 'CGPA to %', icon: Calculator, path: '/cgpa-to-percentage-calculator' },
  { key: 'tip', label: 'Tip', icon: Lightbulb, path: '/tip-calculator' },
  { key: 'percentage', label: 'Percentage', icon: Percent, path: '/percentage-calculator' },
  { key: 'loan', label: 'Loan', icon: Banknote, path: '/loan-calculator' },
  { key: 'mortgage', label: 'Mortgage', icon: House, path: '/mortgage-calculator' },
  { key: 'password', label: 'Password', icon: KeyRound, path: '/password-generator' },
];

export const FAQ_LIST: FaqItem[] = [
  {
    question: 'How do I calculate my weighted grade average?',
    answer:
      'Convert each assessment to a percentage, multiply that percentage by the assessment weight, and add the weighted results. If your weights total 100, the result is your final percentage. The calculator normalizes relative weights when their total is different.',
  },
  {
    question: 'What grade do I need on my final exam to get an A?',
    answer:
      'Enter your current assessments, choose a target percentage, and use the final-exam planning fields or what-if calculator to solve for the score you need. Compare the result with the final exam’s possible points to see whether the target is reachable.',
  },
  {
    question: 'What is the formula for a weighted average grade?',
    answer:
      'The formula is sum of (assessment percentage × assessment weight) divided by the total of all weights, then multiplied by 100 when weights are written as decimals. The same idea works with category percentages.',
  },
  {
    question: 'Can I calculate a grade when my weights do not add to 100%?',
    answer:
      'Yes. Relative weights can still describe how much each assessment matters. The calculator divides the weighted contribution by the total weight, which is equivalent to normalizing the weights before calculating.',
  },
  {
    question: 'Should I use points mode or weighted mode?',
    answer:
      'Use Points mode when every earned point contributes directly to the course total. Use Weighted mode when exams, projects, participation, or categories count for different percentages.',
  },
  {
    question: 'How is GPA calculated from course grades?',
    answer:
      'Convert each letter grade to its 4.0-scale value, multiply that value by the course credits, add the quality points, and divide by the total number of credits.',
  },
  {
    question: 'Can I use a GPA vs percentage grade calculator to convert grades?',
    answer:
      'You can compare a GPA and percentage, but there is no universal conversion table. Schools and countries use different policies, so treat any conversion as an estimate and check your institution’s official scale.',
  },
  {
    question: 'Does this grade calculator round the final percentage?',
    answer:
      'The displayed percentage is rounded to one decimal place for readability. Letter classification uses the unrounded calculated percentage, so a value displayed as 89.5% is not automatically treated as 90%.',
  },
  {
    question: 'How many points do I need to pass my class?',
    answer:
      'Enter your current scores and the passing percentage from your syllabus. Add the remaining assessment as a what-if or final-exam scenario to estimate the points needed, then confirm the result with your instructor’s rules.',
  },
];
