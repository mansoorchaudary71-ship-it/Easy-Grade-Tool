import {
  GraduationCap, Calculator, Target, ClipboardCheck, TrendingUp, Type, Percent,
  Lightbulb, Banknote, House, KeyRound, BookOpen,
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
  { label: 'EZ Grader', title: 'EZ Grader online test grading chart', path: '/ez-grader/', group: 'academic', toolKey: 'quick', icon: ClipboardCheck },
  { label: 'Weighted Grade', title: 'Weighted grade calculator', path: '/grade-calculator/', group: 'academic', toolKey: 'quick', icon: Calculator },
  { label: 'Final Exam', title: 'Final exam grade calculator', path: '/final-exam-grade-calculator/', group: 'academic', toolKey: 'quick', icon: Target },
  { label: 'Test Grade', title: 'Test grade calculator', path: '/test-grade-calculator/', group: 'academic', toolKey: 'quick', icon: ClipboardCheck },
  { label: 'Grade Curve', title: 'Grade curve calculator', path: '/grade-curve-calculator/', group: 'academic', toolKey: 'quick', icon: TrendingUp },
  { label: 'Letter Grade', title: 'Letter grade calculator', path: '/letter-grade-calculator/', group: 'academic', toolKey: 'quick', icon: Type },
  { label: 'GPA', title: 'GPA calculator', path: '/gpa-calculator/', group: 'academic', toolKey: 'gpa', icon: BookOpen },
  { label: 'CGPA to %', title: 'CGPA to percentage calculator', path: '/cgpa-to-percentage-calculator/', group: 'academic', toolKey: 'cgpa', icon: Calculator },
  { label: 'Percentage', title: 'Percentage calculator', path: '/percentage-calculator/', group: 'academic', toolKey: 'percentage', icon: Percent },
  { label: 'Tip', title: 'Tip calculator', path: '/tip-calculator/', group: 'utility', toolKey: 'tip', icon: Lightbulb },
  { label: 'Loan', title: 'Loan calculator', path: '/loan-calculator/', group: 'utility', toolKey: 'loan', icon: Banknote },
  { label: 'Mortgage', title: 'Mortgage calculator', path: '/mortgage-calculator/', group: 'utility', toolKey: 'mortgage', icon: House },
  { label: 'Password', title: 'Password generator', path: '/password-generator/', group: 'utility', toolKey: 'password', icon: KeyRound },
];
