import React from 'react';
import { Target } from 'lucide-react';
import { gradeTone, type GradeToneKey } from '../utils/gradeTone';

export interface GradeVisualProgressBarProps {
  percent: number;
  letter: string;
  targetGrade?: number | null;
  targetLetter?: string | null;
  passingThreshold?: number; // default 60%
  showScaleBar?: boolean;
}

interface TierVisualConfig {
  isPassing: boolean;
  statusText: string;
  tier: 'A' | 'B' | 'C' | 'D' | 'F';
}

/** Which tier a percentage falls in. The colour for that tier comes from gradeTone(), never from this file. */
export function getTierVisualConfig(percent: number, passThreshold = 60): TierVisualConfig {
  if (percent >= 90) return { isPassing: true, tier: 'A', statusText: 'Passing — Honor Standing (Tier A)' };
  if (percent >= 80) return { isPassing: true, tier: 'B', statusText: 'Passing — Above Average (Tier B)' };
  if (percent >= 70) return { isPassing: true, tier: 'C', statusText: 'Passing — Satisfactory (Tier C)' };
  if (percent >= passThreshold) return { isPassing: true, tier: 'D', statusText: 'Passing — Marginal (Tier D)' };
  return { isPassing: false, tier: 'F', statusText: 'Failing — At Risk (Tier F)' };
}

/** Solid fill per tone (one colour per tone, same as the rest of the app). */
const FILL: Record<GradeToneKey, string> = {
  good: 'bg-emerald-600 dark:bg-emerald-400',
  fair: 'bg-amber-500 dark:bg-amber-400',
  poor: 'bg-rose-600 dark:bg-rose-400',
};

const TIERS: Array<{ letter: 'F' | 'D' | 'C' | 'B' | 'A'; range: string; flex: number }> = [
  { letter: 'F', range: '< 60%', flex: 60 },
  { letter: 'D', range: '60-69%', flex: 10 },
  { letter: 'C', range: '70-79%', flex: 10 },
  { letter: 'B', range: '80-89%', flex: 10 },
  { letter: 'A', range: '90-100%', flex: 10 },
];

export const GradeVisualProgressBar: React.FC<GradeVisualProgressBarProps> = ({
  percent,
  letter,
  targetGrade = null,
  targetLetter = null,
  passingThreshold = 60,
  showScaleBar = true,
}) => {
  const config = getTierVisualConfig(percent, passingThreshold);
  const tone = gradeTone(config.tier);
  const ToneIcon = tone.Icon;
  const clamped = Math.min(100, Math.max(0, percent));
  const hasTarget = targetGrade !== null && !isNaN(targetGrade) && targetGrade >= 0 && targetGrade <= 100;

  return (
    <div className="grade-visual-progress-card flex w-full flex-col gap-3" role="region" aria-label="Grade Visual Progress Output">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${tone.badge}`}>
          <ToneIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {config.statusText}
        </span>
        {hasTarget && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
            <Target className="h-4 w-4" aria-hidden="true" />
            Goal: {targetGrade}% {targetLetter ? `(${targetLetter})` : ''}
          </span>
        )}
      </div>

      <div className="relative w-full pt-5 pb-1">
        <div
          className="relative h-3.5 w-full overflow-hidden rounded-full border border-line bg-sunken"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${percent.toFixed(1)}%, Letter grade ${letter}, ${config.statusText}`}
        >
          <div className={`h-full rounded-full transition-[width] duration-300 ${FILL[tone.key]}`} style={{ width: `${clamped}%` }} />
        </div>

        {/* Passing threshold marker */}
        <div
          className="pointer-events-none absolute bottom-0 top-5 z-10 w-0.5 bg-ink-3"
          style={{ left: `${passingThreshold}%` }}
          title={`Passing threshold: ${passingThreshold}%`}
        >
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-ink-3">
            Pass {passingThreshold}%
          </span>
        </div>

        {/* Goal marker */}
        {hasTarget && (
          <div
            className="pointer-events-none absolute bottom-0 top-5 z-20 w-0.5 -translate-x-1/2 bg-brand"
            style={{ left: `${targetGrade}%` }}
            title={`Goal target: ${targetGrade}%`}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-ink-3 tabular-nums">
        <span>0% (F)</span>
        <span className={`font-bold ${tone.text}`}>
          {clamped.toFixed(1)}% ({letter})
        </span>
        <span>100% (A+)</span>
      </div>

      {showScaleBar && (
        <div className="panel flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-2">
            <span>Grading spectrum</span>
            <span>Current: Tier {config.tier}</span>
          </div>
          <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full">
            {TIERS.map((t) => {
              const tt = gradeTone(t.letter);
              const active = t.letter === config.tier;
              return (
                <div
                  key={t.letter}
                  className={`${FILL[tt.key]} ${active ? 'opacity-100' : 'opacity-30'}`}
                  style={{ flex: t.flex }}
                  title={`Tier ${t.letter} zone (${t.range})`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs font-semibold text-ink-3">
            {TIERS.map((t) => (
              <span key={t.letter} className={t.letter === config.tier ? gradeTone(t.letter).text : ''}>
                {t.letter}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeVisualProgressBar;
