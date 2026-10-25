import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { parseStrictNumber } from '../../utils/academicMath';
import {
  CourseBonus,
  CourseLevel,
  DEFAULT_BONUS,
  GPA_LETTERS,
  MAX_BONUS,
  WeightedCourse,
  calculateWeightedGpa,
} from '../../utils/gpaMath';
import { BTN_PRIMARY, CARD, ERROR_TEXT, INPUT, LABEL, RESULT_BOX } from './ui';

export interface WeightedGpaRow {
  id: number;
  name: string;
  letter: string;
  credits: string;
  level: CourseLevel;
}

type Row = WeightedGpaRow;

const MAX_ROWS = 20;

const START_ROWS: Row[] = [
  { id: 1, name: 'AP Calculus', letter: 'A', credits: '1', level: 'ap' },
  { id: 2, name: 'Honors English', letter: 'B', credits: '1', level: 'honors' },
  { id: 3, name: 'US History', letter: 'A', credits: '1', level: 'regular' },
];

const SELECT = `${INPUT} appearance-auto cursor-pointer`;

const DEFAULT_STORAGE_KEY = 'egt-weighted-gpa-v1';

interface SavedState {
  rows: Row[];
  honors: string;
  ap: string;
}

function loadSaved(storageKey: string): SavedState | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedState;
    if (!Array.isArray(parsed.rows) || parsed.rows.length === 0 || parsed.rows.length > MAX_ROWS) return null;
    const rows = parsed.rows.filter(
      (r) => r && typeof r.name === 'string' && typeof r.letter === 'string' && typeof r.credits === 'string' && (r.level === 'regular' || r.level === 'honors' || r.level === 'ap'),
    ) as Row[];
    if (rows.length === 0) return null;
    return { rows, honors: typeof parsed.honors === 'string' ? parsed.honors : String(DEFAULT_BONUS.honors), ap: typeof parsed.ap === 'string' ? parsed.ap : String(DEFAULT_BONUS.ap) };
  } catch {
    return null;
  }
}

function parseBonus(raw: string): { value: number | null; error: string | null } {
  const n = parseStrictNumber(raw);
  if (n === null) return { value: null, error: 'Enter a number such as 0.5 or 1.' };
  if (n < 0 || n > MAX_BONUS) return { value: null, error: `Use a bonus between 0 and ${MAX_BONUS}.` };
  return { value: n, error: null };
}

export interface WeightedGpaToolProps {
  /** Default rows when nothing is saved yet (defaults to the weighted set). */
  startRows?: WeightedGpaRow[];
  /** Own storage key, so pages that reuse this tool never share saved rows. */
  storageKey?: string;
  inputsLabel?: string;
}

export const WeightedGpaTool: React.FC<WeightedGpaToolProps> = ({
  startRows,
  storageKey = DEFAULT_STORAGE_KEY,
  inputsLabel = 'Weighted GPA inputs',
}) => {
  const initialRows = startRows ?? START_ROWS;
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [nextId, setNextId] = useState(initialRows.length + 1);
  const [honorsRaw, setHonorsRaw] = useState(String(DEFAULT_BONUS.honors));
  const [apRaw, setApRaw] = useState(String(DEFAULT_BONUS.ap));
  const hydrated = useRef(false);

  // Restore courses saved on this device (after mount, so prerendered HTML and hydration match).
  useEffect(() => {
    const saved = loadSaved(storageKey);
    if (saved) {
      setRows(saved.rows);
      setNextId(Math.max(...saved.rows.map((r) => r.id)) + 1);
      setHonorsRaw(saved.honors);
      setApRaw(saved.ap);
    }
    hydrated.current = true;
  }, [storageKey]);

  // Save on this device only: nothing is uploaded, and clearing site data removes it.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      const state: SavedState = { rows, honors: honorsRaw, ap: apRaw };
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* storage blocked: the calculator still works, courses just are not remembered */
    }
  }, [rows, honorsRaw, apRaw, storageKey]);

  const reset = () => {
    setRows(initialRows);
    setNextId(initialRows.length + 1);
    setHonorsRaw(String(DEFAULT_BONUS.honors));
    setApRaw(String(DEFAULT_BONUS.ap));
  };

  const honors = parseBonus(honorsRaw);
  const ap = parseBonus(apRaw);

  const parsedRows = rows.map((r) => {
    const credits = parseStrictNumber(r.credits);
    const error = credits === null || credits <= 0 ? 'Credits must be a number above 0.' : null;
    return { row: r, credits: error ? null : (credits as number), error };
  });

  const result = useMemo(() => {
    if (honors.value === null || ap.value === null) return null;
    const bonus: CourseBonus = { honors: honors.value, ap: ap.value };
    const courses: WeightedCourse[] = parsedRows
      .filter((p) => p.credits !== null)
      .map((p) => ({ letter: p.row.letter, credits: p.credits as number, level: p.row.level }));
    return calculateWeightedGpa(courses, bonus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, honors.value, ap.value]);

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  const add = () => {
    if (rows.length >= MAX_ROWS) return;
    setRows((rs) => [...rs, { id: nextId, name: '', letter: 'A', credits: '1', level: 'regular' }]);
    setNextId((n) => n + 1);
  };

  return (
    <div className="space-y-6">
      <section aria-label={inputsLabel} className={`${CARD} space-y-6 print:hidden`}>
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
          <div>
            <label htmlFor="wg-honors" className={LABEL}>Honors bonus</label>
            <input id="wg-honors" className={INPUT} type="text" inputMode="decimal" enterKeyHint="done" value={honorsRaw}
              onChange={(e) => setHonorsRaw(e.target.value)} aria-invalid={honors.error ? true : undefined}
              aria-describedby={honors.error ? 'wg-honors-err' : 'wg-bonus-help'} />
            {honors.error && <p id="wg-honors-err" className={`${ERROR_TEXT} mt-1.5`} role="alert">{honors.error}</p>}
          </div>
          <div>
            <label htmlFor="wg-ap" className={LABEL}>AP / IB bonus</label>
            <input id="wg-ap" className={INPUT} type="text" inputMode="decimal" enterKeyHint="done" value={apRaw}
              onChange={(e) => setApRaw(e.target.value)} aria-invalid={ap.error ? true : undefined}
              aria-describedby={ap.error ? 'wg-ap-err' : 'wg-bonus-help'} />
            {ap.error && <p id="wg-ap-err" className={`${ERROR_TEXT} mt-1.5`} role="alert">{ap.error}</p>}
          </div>
          <p id="wg-bonus-help" className="sm:col-span-2 text-sm text-slate-600 dark:text-slate-300 m-0">
            Bonus points are added to the 4.0 points of each honors or AP/IB course. Use the values your school publishes: they differ from school to school. A course graded F gets no bonus.
          </p>
        </div>

        <ul className="space-y-4 list-none p-0 m-0" aria-label="Courses">
          {parsedRows.map((p, i) => {
            const r = p.row;
            const n = i + 1;
            return (
              <li key={r.id} className="grid grid-cols-2 sm:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] gap-3 items-end rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor={`wg-name-${r.id}`} className={LABEL}>Course {n}</label>
                  <input id={`wg-name-${r.id}`} className={INPUT} type="text" enterKeyHint="next" value={r.name} placeholder="Optional name"
                    onChange={(e) => update(r.id, { name: e.target.value })} autoComplete="off" />
                </div>
                <div>
                  <label htmlFor={`wg-grade-${r.id}`} className={LABEL}>Grade</label>
                  <select id={`wg-grade-${r.id}`} className={SELECT} value={r.letter} onChange={(e) => update(r.id, { letter: e.target.value })}>
                    {GPA_LETTERS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor={`wg-level-${r.id}`} className={LABEL}>Level</label>
                  <select id={`wg-level-${r.id}`} className={SELECT} value={r.level} onChange={(e) => update(r.id, { level: e.target.value as CourseLevel })}>
                    <option value="regular">Regular</option>
                    <option value="honors">Honors</option>
                    <option value="ap">AP / IB</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`wg-credits-${r.id}`} className={LABEL}>Credits</label>
                  <input id={`wg-credits-${r.id}`} className={INPUT} type="text" inputMode="decimal" enterKeyHint="done" value={r.credits}
                    onChange={(e) => update(r.id, { credits: e.target.value })} aria-invalid={p.error ? true : undefined}
                    aria-describedby={p.error ? `wg-credits-err-${r.id}` : undefined} />
                </div>
                <button type="button" onClick={() => remove(r.id)} disabled={rows.length === 1}
                  aria-label={`Remove course ${n}`}
                  className="min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 disabled:opacity-40 cursor-pointer">
                  <Trash2 className="w-5 h-5" aria-hidden="true" />
                </button>
                {p.error && <p id={`wg-credits-err-${r.id}`} className={`${ERROR_TEXT} col-span-2 sm:col-span-5`} role="alert">Course {n}: {p.error}</p>}
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
          Your courses are saved on this device only, in your browser, so they are here when you come back. Nothing is uploaded or shared.
        </p>
      </section>

      <section aria-label="Weighted GPA result" className={`${CARD} space-y-4`}>
        {result ? (
          <div className={`${RESULT_BOX} grid sm:grid-cols-2 gap-4`} role="status" aria-live="polite" aria-atomic="true">
            <div>
              <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Weighted GPA</span>
              <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">{result.weighted.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Unweighted GPA</span>
              <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">{result.unweighted.toFixed(2)}</strong>
            </div>
            <p className="sm:col-span-2 text-sm text-teal-950 dark:text-teal-100 m-0">
              {result.courseCount} course{result.courseCount === 1 ? '' : 's'}, {result.totalCredits} credit{result.totalCredits === 1 ? '' : 's'}. The weighted GPA is {(result.weighted - result.unweighted).toFixed(2)} higher because of the bonus points.
            </p>
          </div>
        ) : (
          <p className={ERROR_TEXT} role="status">Fix the highlighted fields to see your GPA.</p>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-300 m-0">
          Results are estimates. Your school sets the official bonus points, credit values and rounding, and a college may recalculate your GPA with its own rules.
        </p>
      </section>
    </div>
  );
};

export default WeightedGpaTool;
