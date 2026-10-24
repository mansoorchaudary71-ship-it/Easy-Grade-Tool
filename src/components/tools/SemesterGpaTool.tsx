import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { parseStrictNumber } from '../../utils/academicMath';
import { GPA_LETTERS, calculateWeightedGpa, pointsForLetter } from '../../utils/gpaMath';
import { BTN_PRIMARY, CARD, ERROR_TEXT, INPUT, LABEL, RESULT_BOX } from './ui';

interface Row {
  id: number;
  name: string;
  letter: string;
  credits: string;
}

const MAX_ROWS = 20;
const STORAGE_KEY = 'egt-semester-gpa-v1';

const START_ROWS: Row[] = [
  { id: 1, name: 'Biology', letter: 'A', credits: '4' },
  { id: 2, name: 'English Composition', letter: 'A-', credits: '3' },
  { id: 3, name: 'College Algebra', letter: 'B+', credits: '3' },
];

const SELECT = `${INPUT} appearance-auto cursor-pointer`;

function loadSaved(): Row[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Row[];
    if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > MAX_ROWS) return null;
    const rows = parsed.filter(
      (r) => r && typeof r.name === 'string' && typeof r.letter === 'string' && typeof r.credits === 'string',
    ) as Row[];
    return rows.length ? rows : null;
  } catch {
    return null;
  }
}

export const SemesterGpaTool: React.FC = () => {
  const [rows, setRows] = useState<Row[]>(START_ROWS);
  const [nextId, setNextId] = useState(4);
  const hydrated = useRef(false);

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      setRows(saved);
      setNextId(Math.max(...saved.map((r) => r.id)) + 1);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch {
      /* storage blocked: the calculator still works */
    }
  }, [rows]);

  const parsedRows = rows.map((r) => {
    const credits = parseStrictNumber(r.credits);
    const error = credits === null || credits <= 0 ? 'Credits must be a number above 0.' : null;
    return { row: r, credits: error ? null : (credits as number), error };
  });

  const result = useMemo(() => {
    const courses = parsedRows
      .filter((p) => p.credits !== null)
      .map((p) => ({ letter: p.row.letter, credits: p.credits as number, level: 'regular' as const }));
    return calculateWeightedGpa(courses, { honors: 0, ap: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const qualityPoints = useMemo(() => {
    if (!result) return 0;
    return parsedRows.reduce((a, p) => a + (p.credits ? (pointsForLetter(p.row.letter) ?? 0) * p.credits : 0), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, result]);

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  const add = () => {
    if (rows.length >= MAX_ROWS) return;
    setRows((rs) => [...rs, { id: nextId, name: '', letter: 'A', credits: '3' }]);
    setNextId((n) => n + 1);
  };
  const reset = () => {
    setRows(START_ROWS);
    setNextId(4);
  };

  return (
    <div className="space-y-6">
      <section aria-label="Semester GPA inputs" className={`${CARD} space-y-6 print:hidden`}>
        <ul className="space-y-4 list-none p-0 m-0" aria-label="Courses">
          {parsedRows.map((p, i) => {
            const r = p.row;
            const n = i + 1;
            return (
              <li key={r.id} className="grid grid-cols-2 sm:grid-cols-[1.4fr_1fr_1fr_auto] gap-3 items-end rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor={`sg-name-${r.id}`} className={LABEL}>Course {n}</label>
                  <input id={`sg-name-${r.id}`} className={INPUT} type="text" enterKeyHint="next" value={r.name} placeholder="Optional name"
                    onChange={(e) => update(r.id, { name: e.target.value })} autoComplete="off" />
                </div>
                <div>
                  <label htmlFor={`sg-grade-${r.id}`} className={LABEL}>Grade</label>
                  <select id={`sg-grade-${r.id}`} className={SELECT} value={r.letter} onChange={(e) => update(r.id, { letter: e.target.value })}>
                    {GPA_LETTERS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor={`sg-credits-${r.id}`} className={LABEL}>Credits</label>
                  <input id={`sg-credits-${r.id}`} className={INPUT} type="text" inputMode="decimal" enterKeyHint="done" value={r.credits}
                    onChange={(e) => update(r.id, { credits: e.target.value })} aria-invalid={p.error ? true : undefined}
                    aria-describedby={p.error ? `sg-credits-err-${r.id}` : undefined} />
                </div>
                <button type="button" onClick={() => remove(r.id)} disabled={rows.length === 1}
                  aria-label={`Remove course ${n}`}
                  className="min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 disabled:opacity-40 cursor-pointer">
                  <Trash2 className="w-5 h-5" aria-hidden="true" />
                </button>
                {p.error && <p id={`sg-credits-err-${r.id}`} className={`${ERROR_TEXT} col-span-2 sm:col-span-4`} role="alert">Course {n}: {p.error}</p>}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={add} disabled={rows.length >= MAX_ROWS} className={BTN_PRIMARY}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add course</span>
          </button>
          <button type="button" onClick={reset} className="text-sm font-semibold text-slate-600 dark:text-slate-300 underline underline-offset-2 cursor-pointer">
            Reset to the example courses
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 m-0">
          Leave out pass/fail courses: they earn credits but no grade points. Your courses are saved on this device only, in your browser. Nothing is uploaded.
        </p>
      </section>

      <section aria-label="Semester GPA result" className={`${CARD} space-y-4`}>
        {result ? (
          <div className={`${RESULT_BOX} grid sm:grid-cols-3 gap-4 text-center`} role="status" aria-live="polite" aria-atomic="true">
            <div>
              <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Semester GPA</span>
              <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">{result.unweighted.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Quality points</span>
              <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">{qualityPoints.toFixed(1)}</strong>
            </div>
            <div>
              <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Total credits</span>
              <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">{result.totalCredits}</strong>
            </div>
          </div>
        ) : (
          <p className={ERROR_TEXT} role="status">Fix the highlighted fields to see your semester GPA.</p>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-300 m-0">
          Results are estimates. Your school’s rounding, grade replacement and pass/fail policies decide your official semester GPA.
        </p>
      </section>
    </div>
  );
};

export default SemesterGpaTool;
