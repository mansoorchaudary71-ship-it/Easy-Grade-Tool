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
import { SCALE_PLUS_MINUS, SCALE_STANDARD, LetterBand } from '../utils/academicMath';

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

/** Colours per letter family. Scales below are derived from academicMath so every tool agrees. */
const LETTER_COLORS: Record<string, string[]> = {
  A: ['hsl(157 45% 48%)', 'hsl(157 45% 52%)', 'hsl(157 45% 58%)'],
  B: ['hsl(186 48% 42%)', 'hsl(186 48% 51%)', 'hsl(186 38% 62%)'],
  C: ['hsl(35 88% 58%)', 'hsl(35 76% 63%)', 'hsl(35 66% 68%)'],
  D: ['hsl(25 72% 57%)', 'hsl(25 72% 62%)', 'hsl(25 62% 66%)'],
  F: ['hsl(2 61% 54%)'],
};

function withColors(bands: LetterBand[]): ScaleGrade[] {
  return bands.map((b) => {
    const family = b.letter.charAt(0);
    const shades = LETTER_COLORS[family] || LETTER_COLORS.F;
    const idx = b.letter.endsWith('+') ? 0 : b.letter.endsWith('-') ? 2 : 1;
    return { letter: b.letter, min: b.min, color: shades[Math.min(idx, shades.length - 1)] };
  });
}

/** Letter -> 4.0-scale points. Accepts both the ASCII "-" and the Unicode minus "\u2212" spellings. */
export const GRADE_POINT_MAP: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  for (const band of [...SCALE_PLUS_MINUS, ...SCALE_STANDARD]) {
    map[band.letter] = band.gpa;
    if (band.letter.includes('-')) map[band.letter.replace('-', '\u2212')] = band.gpa;
  }
  return map;
})();

export const GRADING_SCALES: Record<'standard' | 'plus', ScaleGrade[]> = {
  standard: withColors(SCALE_STANDARD),
  plus: withColors(SCALE_PLUS_MINUS),
};

export interface ToolDef {
  key: ToolKey;
  label: string;
  icon: typeof GraduationCap;
  path: string;
}

export const TOOL_PATHS: Record<ToolKey, string> = {
  quick: '/',
  gpa: '/gpa-calculator/',
  cgpa: '/cgpa-to-percentage-calculator/',
  tip: '/tip-calculator/',
  percentage: '/percentage-calculator/',
  loan: '/loan-calculator/',
  mortgage: '/mortgage-calculator/',
  password: '/password-generator/',
};

const SEGMENT_TO_TOOL: Record<string, ToolKey> = {
  'gpa-calculator': 'gpa',
  gpa: 'gpa',
  'cgpa-to-percentage-calculator': 'cgpa',
  'cgpa-to-percentage': 'cgpa',
  'cgpa-calculator': 'cgpa',
  cgpa: 'cgpa',
  'tip-calculator': 'tip',
  tip: 'tip',
  'percentage-calculator': 'percentage',
  percentage: 'percentage',
  'loan-calculator': 'loan',
  loan: 'loan',
  'mortgage-calculator': 'mortgage',
  mortgage: 'mortgage',
  'password-generator': 'password',
  password: 'password',
};

/** Matches the first path segment exactly, so a future slug such as /multiple-choice-grader/ cannot be mis-themed. */
export function getToolKeyFromPath(pathname: string): ToolKey {
  const clean = (pathname || '/').toLowerCase().split(/[?#]/)[0];
  const first = clean.split('/').filter(Boolean)[0] || '';
  return SEGMENT_TO_TOOL[first] || 'quick';
}

export const TOOLS_LIST: ToolDef[] = [
  { key: 'quick', label: 'Quick Grade', icon: GraduationCap, path: '/' },
  { key: 'gpa', label: 'GPA', icon: GraduationCap, path: '/gpa-calculator/' },
  { key: 'cgpa', label: 'CGPA to %', icon: Calculator, path: '/cgpa-to-percentage-calculator/' },
  { key: 'tip', label: 'Tip', icon: Lightbulb, path: '/tip-calculator/' },
  { key: 'percentage', label: 'Percentage', icon: Percent, path: '/percentage-calculator/' },
  { key: 'loan', label: 'Loan', icon: Banknote, path: '/loan-calculator/' },
  { key: 'mortgage', label: 'Mortgage', icon: House, path: '/mortgage-calculator/' },
  { key: 'password', label: 'Password', icon: KeyRound, path: '/password-generator/' },
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
      'The displayed percentage is rounded to one decimal place for readability. The letter grade is chosen from the same rounded value that is displayed, so the percentage and the letter always agree.',
  },
  {
    question: 'How many points do I need to pass my class?',
    answer:
      'Enter your current scores and the passing percentage from your syllabus. Add the remaining assessment as a what-if or final-exam scenario to estimate the points needed, then confirm the result with your instructor’s rules.',
  },
];
