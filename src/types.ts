export type ToolKey =
  | 'quick'
  | 'gpa'
  | 'cgpa'
  | 'tip'
  | 'percentage'
  | 'loan'
  | 'mortgage'
  | 'password';

export type CalculationMode = 'quick-grader' | 'points' | 'weighted';

export type GradingScaleType = 'standard' | 'plus';

export interface AssessmentItem {
  id: number;
  name: string;
  score: string;
  max: string;
  weight: string;
}

export interface ValidatedAssessment extends AssessmentItem {
  scoreNum: number;
  maxNum: number;
  weightNum: number;
  invalid: boolean;
}

export interface CourseItem {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

export interface ScaleGrade {
  letter: string;
  min: number;
  color: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

