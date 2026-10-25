import {
  GraduationCap, Calculator, Target, ClipboardCheck, TrendingUp, Type, Percent,
  Lightbulb, Banknote, House, KeyRound, BookOpen, Sigma,
} from 'lucide-react';
import { ToolKey } from '../types';

export interface NavItem {
  label: string;
  title: string;
  path: string;
  group: 'academic' | 'utility';
  toolKey: ToolKey;
  icon: typeof GraduationCap;
}

/** Academic tools come first and are visually separated from general utilities (topical-authority fix). */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Quick Grade', title: 'Quick Grade chart (EZ Grader)', path: '/', group: 'academic', toolKey: 'quick', icon: GraduationCap },
  { label: 'Weighted Grade', title: 'Weighted grade calculator', path: '/grade-calculator/', group: 'academic', toolKey: 'quick', icon: Calculator },
  { label: 'Final Exam', title: 'Final exam grade calculator', path: '/final-exam-grade-calculator/', group: 'academic', toolKey: 'quick', icon: Target },
  { label: 'Test Grade', title: 'Test grade calculator', path: '/test-grade-calculator/', group: 'academic', toolKey: 'quick', icon: ClipboardCheck },
  { label: 'Grade Curve', title: 'Grade curve calculator', path: '/grade-curve-calculator/', group: 'academic', toolKey: 'quick', icon: TrendingUp },
  { label: 'Average Grade', title: 'Average grade calculator', path: '/average-grade-calculator/', group: 'academic', toolKey: 'quick', icon: Sigma },
  { label: 'Letter Grade', title: 'Letter grade calculator', path: '/letter-grade-calculator/', group: 'academic', toolKey: 'quick', icon: Type },
  { label: 'GPA', title: 'GPA calculator', path: '/gpa-calculator/', group: 'academic', toolKey: 'gpa', icon: BookOpen },
  { label: 'Weighted GPA', title: 'Weighted GPA calculator', path: '/weighted-gpa-calculator/', group: 'academic', toolKey: 'gpa', icon: BookOpen },
  { label: 'Semester GPA', title: 'Semester GPA calculator', path: '/semester-gpa-calculator/', group: 'academic', toolKey: 'gpa', icon: BookOpen },
  { label: 'Cumulative GPA', title: 'Cumulative GPA calculator', path: '/cumulative-gpa-calculator/', group: 'academic', toolKey: 'gpa', icon: BookOpen },
  { label: 'High School GPA', title: 'High school GPA calculator', path: '/high-school-gpa-calculator/', group: 'academic', toolKey: 'gpa', icon: BookOpen },
  { label: 'College GPA', title: 'College GPA calculator', path: '/college-gpa-calculator/', group: 'academic', toolKey: 'gpa', icon: BookOpen },
  { label: 'GPA to Letter', title: 'GPA to letter grade converter', path: '/gpa-to-letter-grade/', group: 'academic', toolKey: 'gpa', icon: Type },
  { label: 'Letter to GPA', title: 'Letter grade to GPA converter', path: '/letter-grade-to-gpa/', group: 'academic', toolKey: 'gpa', icon: Type },
  { label: 'Final Planner', title: 'Final grade planner for every class', path: '/final-grade-planner/', group: 'academic', toolKey: 'quick', icon: Target },
  { label: 'CGPA to %', title: 'CGPA to percentage calculator', path: '/cgpa-to-percentage-calculator/', group: 'academic', toolKey: 'cgpa', icon: Calculator },
  { label: 'Percentage', title: 'Percentage calculator', path: '/percentage-calculator/', group: 'academic', toolKey: 'percentage', icon: Percent },
  { label: 'Tip', title: 'Tip calculator', path: '/tip-calculator/', group: 'utility', toolKey: 'tip', icon: Lightbulb },
  { label: 'Loan', title: 'Loan calculator', path: '/loan-calculator/', group: 'utility', toolKey: 'loan', icon: Banknote },
  { label: 'Mortgage', title: 'Mortgage calculator', path: '/mortgage-calculator/', group: 'utility', toolKey: 'mortgage', icon: House },
  { label: 'Password', title: 'Password generator', path: '/password-generator/', group: 'utility', toolKey: 'password', icon: KeyRound },
];

/* -------------------------------------------------------------------------- */
/* Hick's Law: one primary link + one grouped "Tools" menu                      */
/* -------------------------------------------------------------------------- */

/** The one tool that stays visible in the header: it is the home page and the most-used calculator. */
export const PRIMARY_NAV_ITEM: NavItem = NAV_ITEMS[0];

export interface NavGroup {
  id: string;
  heading: string;
  items: NavItem[];
}

const byPath = (paths: string[]): NavItem[] =>
  paths.map((p) => NAV_ITEMS.find((n) => n.path === p)).filter((n): n is NavItem => !!n);

/** Everything except the primary item, in three small groups (5-7 items each is easy to scan). */
export const TOOL_GROUPS: NavGroup[] = [
  {
    id: 'grades',
    heading: 'Grade tools',
    items: byPath([
      '/grade-calculator/',
      '/final-exam-grade-calculator/',
      '/test-grade-calculator/',
      '/grade-curve-calculator/',
      '/average-grade-calculator/',
      '/letter-grade-calculator/',
    ]),
  },
  {
    id: 'gpa',
    heading: 'GPA and percentages',
    items: byPath(['/gpa-calculator/', '/weighted-gpa-calculator/', '/semester-gpa-calculator/', '/cumulative-gpa-calculator/', '/cgpa-to-percentage-calculator/', '/percentage-calculator/']),
  },
  {
    id: 'everyday',
    heading: 'Everyday tools',
    items: byPath(['/tip-calculator/', '/loan-calculator/', '/mortgage-calculator/', '/password-generator/']),
  },
];

/** Flat list of every item inside the Tools menu. */
export const TOOLS_MENU_ITEMS: NavItem[] = TOOL_GROUPS.flatMap((g) => g.items);
