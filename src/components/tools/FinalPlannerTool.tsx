import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { parseStrictNumber } from '../../utils/academicMath';
import { BTN_PRIMARY, CARD, ERROR_TEXT, INPUT, LABEL, RESULT_BOX } from './ui';

interface PlannerRow {
  id: number;
  name: string;
  current: string;
  finalWeight: string;
  target: string;
}

const MAX_ROWS = 10;

const START_ROWS: PlannerRow[] = [
  { id: 1, name: 'Biology', current: '84', finalWeight: '25', target: '90' },
  { id: 2, name: 'English', current: '78', finalWeight: '30', target: '85' },
  { id: 3, name: 'Algebra', current: '91', finalWeight: '20', target: '90' },
];

interface RowResult {
  required: number | null;
  maxAchievable: number | null;
  status: 'secured' | 'possible' | 'impossible' | 'no-weight' | 'invalid';
}

function solveRow(row: PlannerRow): RowResult {
  const current = parseStrictNumber(row.current);
  const weight = parseStrictNumber(row.finalWeight);
  const target = parseStrictNumber(row.target);
  if (current === null || weight === null || target === null) return { required: null, maxAchievable: null, status: 'invalid' };
  if (weight <= 0) return { required: null, maxAchievable: current, status: 'no-weight' };
  if (weight > 100 || current < 0 || current > 100 || target < 0 || target > 100) {
    return { required: null, maxAchievable: null, status: 'invalid' };
  }
  const w = weight / 100;
  const required = (target - current * (1 - w)) / w;
  const maxAchievable = current * (1 - w) + 100 * w;
  if (required <= 0) return { required, maxAchievable, status: 'secured' };
  if (required <= 100) return { required, maxAchievable, status: 'possible' };
  return { required, maxAchievable, status: 'impossible' };
}

export const FinalPlannerTool: React.FC = () => {
  const [rows, setRows] = useState<PlannerRow[]>(START_ROWS);
  const [nextId, setNextId] = useState(4);

  const results = useMemo(() => rows.map((r) => ({ row: r, result: solveRow(r) })), [rows]);
  const onTrack = results.filter((r) => r.result.status === 'secured' || r.result.status === 'possible').length;
  const solvable = results.filter((r) => r.result.status !== 'invalid' && r.result.status !== 'no-weight').length;

  const update = (id: number, patch: Partial<PlannerRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  const add = () => {
    if (rows.length >= MAX_ROWS) return;
    setRows((prev) => [...prev, { id: nextId, name: '', current: '', finalWeight: '', target: '' }]);
    setNextId((n) => n + 1);
  };

  return (
    <div className="space-y-6">
      <section aria-label="Final exam planner" className={`${CARD} space-y-5 print:hidden`}>
        <p className="text-sm text-slate-600 m-0">
          One row per class: your current grade, how much the final exam counts, and the grade you
          want. The planner solves for the final-exam score each class needs — and tells you
          honestly when a target is already secured or out of reach.
        </p>
        <div className="space-y-4">
          {rows.map((row, i) => {
            const result = results[i].result;
            return (
              <div key={row.id} className="grid gap-3 sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto] sm:items-end border border-slate-200 rounded-2xl p-4">
                <div>
                  <label className={LABEL} htmlFor={`planner-name-${row.id}`}>Class</label>
                  <input
                    id={`planner-name-${row.id}`}
                    className={INPUT}
                    placeholder="Biology"
                    value={row.name}
                    onChange={(e) => update(row.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className={LABEL} htmlFor={`planner-current-${row.id}`}>Current grade %</label>
                  <input
                    id={`planner-current-${row.id}`}
                    className={INPUT}
                    inputMode="decimal"
                    value={row.current}
                    onChange={(e) => update(row.id, { current: e.target.value })}
                  />
                </div>
                <div>
                  <label className={LABEL} htmlFor={`planner-weight-${row.id}`}>Final weight %</label>
                  <input
                    id={`planner-weight-${row.id}`}
                    className={INPUT}
                    inputMode="decimal"
                    value={row.finalWeight}
                    onChange={(e) => update(row.id, { finalWeight: e.target.value })}
                  />
                </div>
                <div>
                  <label className={LABEL} htmlFor={`planner-target-${row.id}`}>Target grade %</label>
                  <input
                    id={`planner-target-${row.id}`}
                    className={INPUT}
                    inputMode="decimal"
                    value={row.target}
                    onChange={(e) => update(row.id, { target: e.target.value })}
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${row.name || 'class'}`}
                  className="justify-self-end rounded-xl border border-slate-200 px-3 py-2 text-slate-500 hover:text-rose-600"
                  onClick={() => remove(row.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {result.status === 'invalid' && (
                  <p className={`${ERROR_TEXT} sm:col-span-5`}>Use numbers only: grades 0–100, final weight 0–100.</p>
                )}
                {result.status === 'no-weight' && (
                  <p className="sm:col-span-5 m-0 text-sm text-slate-600 ">
                    The final has no weight here, so this class’s grade is already decided by its current grade.
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <button type="button" className={BTN_PRIMARY} onClick={add} disabled={rows.length >= MAX_ROWS}>
          <Plus className="w-4 h-4" /> Add a class
        </button>
      </section>

      <section aria-label="Planner results" className={RESULT_BOX}>
        <p className="m-0 text-lg font-bold text-slate-900 ">
          {solvable > 0 ? `${onTrack} of ${solvable} classes on track` : 'Fill in a class to see what its final needs.'}
        </p>
        <ul className="m-0 mt-3 space-y-2 list-none p-0">
          {results.map(({ row, result }) => (
            <li key={row.id} className="text-base text-slate-700 ">
              <span className="font-semibold text-slate-900 ">{row.name || 'Unnamed class'}: </span>
              {result.status === 'secured' && <>target already secured — even a 0% on the final keeps it.</>}
              {result.status === 'possible' && <>you need <strong>{result.required!.toFixed(1)}%</strong> on the final.</>}
              {result.status === 'impossible' && (
                <>not possible — even 100% on the final only reaches {result.maxAchievable!.toFixed(1)}%.</>
              )}
              {result.status === 'no-weight' && <>no final weight, so the current grade stands.</>}
              {result.status === 'invalid' && <>check the numbers for this row.</>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default FinalPlannerTool;
