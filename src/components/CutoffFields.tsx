import React from 'react';
import { Cutoffs, parseStrictNumber, validateCutoffs } from '../utils/academicMath';

export type CutoffDrafts = Record<'A' | 'B' | 'C' | 'D', string>;

export const cutoffsToDrafts = (c: Cutoffs): CutoffDrafts => ({
  A: String(c.A),
  B: String(c.B),
  C: String(c.C),
  D: String(c.D),
});

/** Parses the four text drafts. Returns the cutoffs (when all four are numbers) and the first problem found. */
export function parseCutoffDrafts(d: CutoffDrafts): { cutoffs: Cutoffs | null; error: string | null } {
  const nums = (['A', 'B', 'C', 'D'] as const).map((k) => parseStrictNumber(d[k]));
  if (nums.some((n) => n === null)) {
    return { cutoffs: null, error: 'Every cutoff must be a number, for example 90.' };
  }
  const cutoffs: Cutoffs = { A: nums[0] as number, B: nums[1] as number, C: nums[2] as number, D: nums[3] as number };
  return { cutoffs, error: validateCutoffs(cutoffs) };
}

interface CutoffFieldsProps {
  idPrefix: string;
  drafts: CutoffDrafts;
  onChange: (key: keyof CutoffDrafts, value: string) => void;
  error: string | null;
}

/** Four minimum-percentage inputs (A, B, C, D) with one inline error message. Shared by the page and the modal. */
export const CutoffFields: React.FC<CutoffFieldsProps> = ({ idPrefix, drafts, onChange, error }) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {(['A', 'B', 'C', 'D'] as const).map((grade) => (
        <div key={grade} className="flex flex-col gap-1.5">
          <label htmlFor={`${idPrefix}-${grade}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {grade} starts at (%)
          </label>
          <input
            id={`${idPrefix}-${grade}`}
            type="text"
            inputMode="decimal"
            enterKeyHint="done"
            autoComplete="off"
            value={drafts[grade]}
            onChange={(e) => onChange(grade, e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${idPrefix}-error` : undefined}
            className={`w-full min-h-[48px] bg-[#F4F6F9] dark:bg-slate-800 border text-stone-900 dark:text-white rounded-[20px] px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] font-mono font-bold text-center text-base transition-all ${
              error ? 'border-rose-500 ring-2 ring-rose-400/60' : 'border-stone-200/80 dark:border-slate-700'
            }`}
          />
        </div>
      ))}
    </div>
    {error && (
      <p id={`${idPrefix}-error`} role="alert" className="m-0 text-sm font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-3">
        {error}
      </p>
    )}
  </div>
);
