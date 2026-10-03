import { GRADING_SCALES } from '../data/constants';
import { GradingScaleType } from '../types';

export function parseNumber(val: string | number, fallback = 0): number {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function getLetterFromPercent(
  percent: number,
  scale: GradingScaleType
): string {
  const targetScale = GRADING_SCALES[scale];
  return targetScale.find((item) => percent >= item.min)?.letter ?? 'F';
}

export function getGradeStatus(percent: number): string {
  if (percent >= 90) return 'Excellent';
  if (percent >= 80) return 'Solid work';
  if (percent >= 70) return 'In the mix';
  if (percent >= 60) return 'Passing';
  return 'Needs improvement';
}

export function getGradeFeedback(percent: number): string {
  if (percent >= 90) return 'A strong position. Keep the rhythm going.';
  if (percent >= 80) return 'There is room to climb. Keep pushing for your target.';
  if (percent >= 70) return 'You are in the mix. One good assessment can move this.';
  if (percent >= 60) return 'A little more focus will make a meaningful difference.';
  return 'This is a starting point, not a verdict. Let’s map the next move.';
}

export function getGradeRemark(percent: number): string {
  if (percent >= 90) return 'A strong position. Keep the rhythm going.';
  if (percent >= 80) return 'Solid work so far. There is room to climb.';
  if (percent >= 70) return 'You are in the mix. One good assessment can move this.';
  if (percent >= 60) return 'A little more focus will make a meaningful difference.';
  return 'This is a starting point, not a verdict. Let’s map the next move.';
}
