import React, { useMemo, useState } from 'react';
import { parseStrictNumber, roundTo } from '../../utils/academicMath';
import { CARD, ERROR_TEXT, INPUT, LABEL, RESULT_BOX } from './ui';

interface Field {
  value: number | null;
  error: string | null;
}

function parseGpa(raw: string): Field {
  const n = parseStrictNumber(raw);
  if (n === null) return { value: null, error: 'Enter a GPA such as 3.4.' };
  if (n < 0 || n > 4) return { value: null, error: 'Use a GPA between 0 and 4.0.' };
  return { value: n, error: null };
}

function parseCredits(raw: string): Field {
  const n = parseStrictNumber(raw);
  if (n === null) return { value: null, error: 'Enter credits such as 60.' };
  if (n <= 0) return { value: null, error: 'Credits must be above 0.' };
  return { value: n, error: null };
}

export const CumulativeGpaTool: React.FC = () => {
  const [prevGpaRaw, setPrevGpaRaw] = useState('3.4');
  const [prevCreditsRaw, setPrevCreditsRaw] = useState('60');
  const [semGpaRaw, setSemGpaRaw] = useState('3.8');
  const [semCreditsRaw, setSemCreditsRaw] = useState('15');
  const [targetRaw, setTargetRaw] = useState('3.5');

  const prevGpa = parseGpa(prevGpaRaw);
  const prevCredits = parseCredits(prevCreditsRaw);
  const semGpa = parseGpa(semGpaRaw);
  const semCredits = parseCredits(semCreditsRaw);
  const target = targetRaw.trim() === '' ? ({ value: null, error: null } as Field) : parseGpa(targetRaw);

  const combined = useMemo(() => {
    if (prevGpa.value === null || prevCredits.value === null || semGpa.value === null || semCredits.value === null) return null;
    const totalCredits = prevCredits.value + semCredits.value;
    const points = prevGpa.value * prevCredits.value + semGpa.value * semCredits.value;
    return { gpa: roundTo(points / totalCredits, 2), totalCredits, points };
  }, [prevGpa.value, prevCredits.value, semGpa.value, semCredits.value]);

  const needed = useMemo(() => {
    if (target.value === null || prevGpa.value === null || prevCredits.value === null || semCredits.value === null) return null;
    const totalCredits = prevCredits.value + semCredits.value;
    const need = (target.value * totalCredits - prevGpa.value * prevCredits.value) / semCredits.value;
    return roundTo(need, 2);
  }, [target.value, prevGpa.value, prevCredits.value, semCredits.value]);

  const field = (
    id: string,
    label: string,
    raw: string,
    set: (v: string) => void,
    f: Field,
  ) => (
    <div>
      <label htmlFor={id} className={LABEL}>{label}</label>
      <input id={id} className={INPUT} type="text" inputMode="decimal" enterKeyHint="done" value={raw}
        onChange={(e) => set(e.target.value)} aria-invalid={f.error ? true : undefined}
        aria-describedby={f.error ? `${id}-err` : undefined} />
      {f.error && <p id={`${id}-err`} className={`${ERROR_TEXT} mt-1.5`} role="alert">{f.error}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <section aria-label="Cumulative GPA inputs" className={`${CARD} space-y-6 print:hidden`}>
        <div className="grid sm:grid-cols-2 gap-4">
          {field('cg-prev-gpa', 'Previous cumulative GPA', prevGpaRaw, setPrevGpaRaw, prevGpa)}
          {field('cg-prev-credits', 'Previous credits', prevCreditsRaw, setPrevCreditsRaw, prevCredits)}
          {field('cg-sem-gpa', 'This semester’s GPA', semGpaRaw, setSemGpaRaw, semGpa)}
          {field('cg-sem-credits', 'This semester’s credits', semCreditsRaw, setSemCreditsRaw, semCredits)}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 m-0">
          Find your previous GPA and credits on your transcript or student portal. Do not have this semester’s GPA yet? Use the semester GPA calculator first, or try target grades here to plan.
        </p>
      </section>

      <section aria-label="Cumulative GPA result" className={`${CARD} space-y-4`}>
        {combined ? (
          <div className={`${RESULT_BOX} grid sm:grid-cols-2 gap-4 text-center`} role="status" aria-live="polite" aria-atomic="true">
            <div>
              <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">New cumulative GPA</span>
              <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">{combined.gpa.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Total credits</span>
              <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">{combined.totalCredits}</strong>
            </div>
          </div>
        ) : (
          <p className={ERROR_TEXT} role="status">Fix the highlighted fields to see your new cumulative GPA.</p>
        )}

        <div className="max-w-xs">
          {field('cg-target', 'Target cumulative GPA (optional)', targetRaw, setTargetRaw, target)}
        </div>
        {target.value !== null && needed !== null && (
          needed > 4 ? (
            <p className="text-sm text-slate-700 dark:text-slate-300 m-0" role="status">
              Reaching {target.value.toFixed(2)} this semester would need a semester GPA of {needed.toFixed(2)}, which is above the 4.0 maximum. Spread the goal over more credits, or raise the semester credit load.
            </p>
          ) : needed <= 0 ? (
            <p className="text-sm text-slate-700 dark:text-slate-300 m-0" role="status">
              Your previous GPA is already at or above {target.value.toFixed(2)}, so any passing semester keeps you there.
            </p>
          ) : (
            <p className="text-sm text-slate-700 dark:text-slate-300 m-0" role="status">
              To finish at {target.value.toFixed(2)}, this semester needs a GPA of at least <strong>{needed.toFixed(2)}</strong>.
            </p>
          )
        )}
        <p className="text-sm text-slate-600 dark:text-slate-300 m-0">
          Results are estimates. Grade replacement for repeated courses and your school’s rounding decide the official cumulative GPA.
        </p>
      </section>
    </div>
  );
};

export default CumulativeGpaTool;
