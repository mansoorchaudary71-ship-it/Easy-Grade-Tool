/**
 * Grade Calculation Algorithms & Validation Engine
 * 
 * Supports:
 * - Half-Point (0.5) partial credit on questions and assessments
 * - Dynamic decimal precision (0, 1, or 2 decimal places)
 * - Safe edge-case clamping (negative inputs, over-boundary answers, division by zero)
 * - Clear, polite error messages and safe fallbacks
 * - Zero-latency synchronous evaluation
 */

export type GradingScale = 'standard' | 'plus-minus';
export type DecimalPrecision = 0 | 1 | 2;

export interface QuickGraderInput {
  totalQuestions: number | string;
  wrongAnswers: number | string;
}

export interface QuickGraderValidationResult {
  isValid: boolean;
  totalError: string | null;
  wrongError: string | null;
  politeNotice: string | null;
  safeTotal: number;
  safeWrong: number;
  safeCorrect: number;
}

export interface QuickGraderResult {
  totalQuestions: number;
  wrongAnswers: number;
  correctAnswers: number;
  rawPercentage: number;
  formattedPercentage: string;
  percentageNumber: number;
  letterGrade: string;
  validation: QuickGraderValidationResult;
}

export interface EzGraderRow {
  wrong: number;
  correct: number;
  rawPercentage: number;
  formattedPercentage: string;
  percentage: number;
  letter: string;
  isCurrent?: boolean;
}

export interface MultiAssessmentItem {
  id: number;
  name: string;
  score: string | number;
  max: string | number;
  weight?: string | number;
}

export interface ValidatedMultiAssessment {
  id: number;
  name: string;
  score: string;
  max: string;
  weight: string;
  scoreNum: number;
  maxNum: number;
  weightNum: number;
  isInvalid: boolean;
  errorMessage: string | null;
}

/**
 * Safely parse any input value to a number.
 */
export function safeParseFloat(val: unknown, fallback = 0): number {
  if (typeof val === 'number') {
    return isNaN(val) || !isFinite(val) ? fallback : val;
  }
  if (typeof val === 'string') {
    const cleaned = val.trim();
    if (cleaned === '') return fallback;
    const parsed = Number(cleaned);
    return isNaN(parsed) || !isFinite(parsed) ? fallback : parsed;
  }
  return fallback;
}

/**
 * Letter grade calculation mapping.
 */
export function calculateLetterFromPercentage(
  percent: number,
  scale: GradingScale = 'standard'
): string {
  const safePercent = Math.max(0, Math.min(150, safeParseFloat(percent)));

  if (scale === 'standard') {
    if (safePercent >= 90) return 'A';
    if (safePercent >= 80) return 'B';
    if (safePercent >= 70) return 'C';
    if (safePercent >= 60) return 'D';
    return 'F';
  }

  // Plus/Minus grading scale
  if (safePercent >= 97) return 'A+';
  if (safePercent >= 93) return 'A';
  if (safePercent >= 90) return 'A-';
  if (safePercent >= 87) return 'B+';
  if (safePercent >= 83) return 'B';
  if (safePercent >= 80) return 'B-';
  if (safePercent >= 77) return 'C+';
  if (safePercent >= 73) return 'C';
  if (safePercent >= 70) return 'C-';
  if (safePercent >= 67) return 'D+';
  if (safePercent >= 63) return 'D';
  if (safePercent >= 60) return 'D-';
  return 'F';
}

/**
 * Safely validates and sanitizes Quick Grader inputs with polite error notices.
 */
export function validateQuickGraderInput(
  rawTotalInput: number | string,
  rawWrongInput: number | string
): QuickGraderValidationResult {
  const totalStr = String(rawTotalInput ?? '').trim();
  const wrongStr = String(rawWrongInput ?? '').trim();

  let totalError: string | null = null;
  let wrongError: string | null = null;
  let politeNotice: string | null = null;

  // Validate Total Questions
  let parsedTotal = safeParseFloat(totalStr, NaN);
  if (totalStr === '') {
    totalError = 'Please enter the total number of questions on the test.';
    parsedTotal = 50; // Fallback default
  } else if (isNaN(parsedTotal)) {
    totalError = 'Total questions must be a valid number.';
    parsedTotal = 50;
  } else if (parsedTotal <= 0) {
    totalError = 'Total questions must be at least 1.';
    politeNotice = `Total questions must be greater than zero (received ${parsedTotal}). We evaluated this using 1 question so calculations remain safe.`;
    parsedTotal = 1;
  } else if (parsedTotal > 1000) {
    totalError = 'Total questions is capped at 1,000.';
    politeNotice = `You entered ${parsedTotal} questions. We safely capped this at 1,000 to keep calculations ultra-fast.`;
    parsedTotal = 1000;
  }

  const safeTotal = Math.max(1, Math.min(1000, parsedTotal));

  // Validate Wrong Answers
  let parsedWrong = safeParseFloat(wrongStr, 0);
  if (wrongStr === '') {
    parsedWrong = 0;
  } else if (isNaN(parsedWrong)) {
    wrongError = 'Wrong answers must be a valid number.';
    parsedWrong = 0;
  } else if (parsedWrong < 0) {
    wrongError = 'Number of wrong answers cannot be negative.';
    politeNotice = `Negative answers (${parsedWrong}) are not possible. We safely adjusted this to 0 wrong (100% score) so your grades remain accurate.`;
    parsedWrong = 0;
  } else if (parsedWrong > safeTotal) {
    wrongError = `Number of wrong answers (${parsedWrong}) cannot exceed total questions (${safeTotal}).`;
    politeNotice = `You entered ${parsedWrong} wrong answers out of ${safeTotal} total questions. We calculated this using ${safeTotal} wrong (0.0%) to prevent impossible negative scores.`;
    parsedWrong = safeTotal;
  }

  const safeWrong = Math.max(0, Math.min(safeTotal, Math.round(parsedWrong * 10) / 10));
  const safeCorrect = Math.max(0, Math.round((safeTotal - safeWrong) * 10) / 10);

  return {
    isValid: !totalError && !wrongError,
    totalError,
    wrongError,
    politeNotice,
    safeTotal,
    safeWrong,
    safeCorrect,
  };
}

/**
 * Calculates a single test grade with Half-Point (0.5) support and customizable decimal precision.
 */
export function calculateQuickGrade(
  totalQuestions: number | string,
  wrongAnswers: number | string,
  options: {
    halfPointSupport?: boolean;
    decimalPrecision?: DecimalPrecision;
    scale?: GradingScale;
  } = {}
): QuickGraderResult {
  const { decimalPrecision = 1, scale = 'standard' } = options;

  const validation = validateQuickGraderInput(totalQuestions, wrongAnswers);
  const { safeTotal, safeWrong, safeCorrect } = validation;

  const rawPercentage = safeTotal > 0 ? (safeCorrect / safeTotal) * 100 : 0;
  const clampedPercentage = Math.max(0, Math.min(100, rawPercentage));
  const formattedPercentage = clampedPercentage.toFixed(decimalPrecision);
  const percentageNumber = Number(formattedPercentage);
  const letterGrade = calculateLetterFromPercentage(clampedPercentage, scale);

  return {
    totalQuestions: safeTotal,
    wrongAnswers: safeWrong,
    correctAnswers: safeCorrect,
    rawPercentage: clampedPercentage,
    formattedPercentage,
    percentageNumber,
    letterGrade,
    validation,
  };
}

/**
 * Generates every possible grade row for the EZ Grader Quick Table via a clean JavaScript loop.
 * Supports Half-Point (0.5) step increments for partial credit.
 */
export function generateEzGraderTable(
  totalQuestions: number | string,
  options: {
    halfPointSupport?: boolean;
    decimalPrecision?: DecimalPrecision;
    scale?: GradingScale;
    sortAsc?: boolean;
    currentWrong?: number;
  } = {}
): EzGraderRow[] {
  const {
    halfPointSupport = false,
    decimalPrecision = 1,
    scale = 'standard',
    sortAsc = true,
    currentWrong = -1,
  } = options;

  const rawTotal = safeParseFloat(totalQuestions, 50);
  const total = Math.max(1, Math.min(500, rawTotal));

  // Determine step size: 0.5 for partial credit (for up to 150 questions), otherwise 1
  const step = halfPointSupport && total <= 150 ? 0.5 : 1;
  const rows: EzGraderRow[] = [];

  // Pure JavaScript loop iterating through all possible wrong answers
  for (let wrong = 0; wrong <= total + 0.0001; wrong = Math.round((wrong + step) * 10) / 10) {
    const correct = Math.max(0, Math.round((total - wrong) * 10) / 10);
    const rawPct = total > 0 ? (correct / total) * 100 : 0;
    const clampedPct = Math.max(0, Math.min(100, rawPct));
    const formattedPercentage = clampedPct.toFixed(decimalPrecision);
    const percentage = Number(formattedPercentage);
    const letter = calculateLetterFromPercentage(clampedPct, scale);
    const isCurrent = Math.abs(wrong - currentWrong) < 0.001;

    rows.push({
      wrong,
      correct,
      rawPercentage: clampedPct,
      formattedPercentage,
      percentage,
      letter,
      isCurrent,
    });
  }

  if (!sortAsc) {
    rows.reverse();
  }

  return rows;
}

/**
 * Calculates a multi-assessment weighted or points-based course grade.
 * Gracefully ignores invalid rows and guards against division by zero.
 */
export function calculateMultiAssessmentGrade(
  items: MultiAssessmentItem[],
  mode: 'points' | 'weighted',
  options: {
    decimalPrecision?: DecimalPrecision;
    scale?: GradingScale;
  } = {}
): {
  percentage: number;
  formattedPercentage: string;
  letterGrade: string;
  validItemCount: number;
} {
  const { decimalPrecision = 1, scale = 'standard' } = options;

  const validItems = items
    .map((item) => {
      const scoreNum = safeParseFloat(item.score, NaN);
      const maxNum = safeParseFloat(item.max, NaN);
      const weightNum = safeParseFloat(item.weight, NaN);
      const isValid =
        !isNaN(scoreNum) &&
        !isNaN(maxNum) &&
        maxNum > 0 &&
        scoreNum >= 0 &&
        (mode !== 'weighted' || (!isNaN(weightNum) && weightNum > 0));

      return {
        scoreNum,
        maxNum,
        weightNum: isNaN(weightNum) ? 1 : weightNum,
        isValid,
      };
    })
    .filter((item) => item.isValid);

  if (!validItems.length) {
    return {
      percentage: 0,
      formattedPercentage: (0).toFixed(decimalPrecision),
      letterGrade: calculateLetterFromPercentage(0, scale),
      validItemCount: 0,
    };
  }

  let finalRawPercent = 0;

  if (mode === 'weighted') {
    const totalWeight = validItems.reduce((acc, curr) => acc + curr.weightNum, 0);
    if (totalWeight <= 0) {
      finalRawPercent = 0;
    } else {
      const weightedSum = validItems.reduce(
        (acc, curr) => acc + (curr.scoreNum / curr.maxNum) * curr.weightNum,
        0
      );
      finalRawPercent = (weightedSum / totalWeight) * 100;
    }
  } else {
    // Points mode
    const totalPossible = validItems.reduce((acc, curr) => acc + curr.maxNum, 0);
    if (totalPossible <= 0) {
      finalRawPercent = 0;
    } else {
      const totalEarned = validItems.reduce((acc, curr) => acc + curr.scoreNum, 0);
      finalRawPercent = (totalEarned / totalPossible) * 100;
    }
  }

  const clampedPercent = Math.max(0, Math.min(100, finalRawPercent));
  const formattedPercentage = clampedPercent.toFixed(decimalPrecision);
  const percentage = Number(formattedPercentage);
  const letterGrade = calculateLetterFromPercentage(clampedPercent, scale);

  return {
    percentage,
    formattedPercentage,
    letterGrade,
    validItemCount: validItems.length,
  };
}
