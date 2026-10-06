import React, { useMemo, useState } from 'react';
import { Printer } from 'lucide-react';
import {
  CurveMethod,
  SCALE_PLUS_MINUS,
  SCALE_STANDARD,
  applyCurve,
  computeStats,
  parseScoreList,
  percentToLetter,
  roundTo,
} from '../../utils/academicMath';
import { BTN_PRIMARY, CARD, INPUT, LABEL, PILL_OFF, PILL_ON } from './ui';

const METHODS: { key: CurveMethod; label: string }[] = [
  { key: 'flat', label: 'Add flat points' },
  { key: 'scale-top', label: 'Top score → 100' },
  { key: 'sqrt', label: 'Square root' },
  { key: 'linear-target', label: 'Target average' },
];

const MAX_ROWS = 300;

export const GradeCurveTool: React.FC = () => {
  const [raw, setRaw] = useState('55, 62, 70, 78, 85');
  const [method, setMethod] = useState<CurveMethod>('flat');
  const [flat, setFlat] = useState('5');
  const [target, setTarget] = useState('78');
  const [cap, setCap] = useState(true);
  const [plus, setPlus] = useState(false);
  const scale = plus ? SCALE_PLUS_MINUS : SCALE_STANDARD;

  const { scores, rejected } = useMemo(() => parseScoreList(raw), [raw]);
  const curved = useMemo(
    () =>
      applyCurve(scores, {
        method,
        flatPoints: Number(flat) || 0,
        targetAverage: Number(target) || 0,
        capAtMax: cap,
      }),
    [scores, method, flat, target, cap]
  );
  const before = computeStats(scores);
  const after = computeStats(curved);

  return (
    <div className="space-y-6">
      <section aria-label="Grade curve inputs" className={`${CARD} space-y-5 print:hidden`}>
        <div>
          <label htmlFor="gc-scores" className={LABEL}>Raw scores (separate with commas, spaces or new lines)</label>
          <textarea
            id="gc-scores"
            rows={4}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="w-full bg-[#F0F2F5] dark:bg-slate-800 border-2 border-transparent text-stone-900 dark:text-white rounded-2xl px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-mono text-base"
            spellCheck={false}
          />
          {rejected.length > 0 && (
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1.5 m-0" role="status">
              Ignored {rejected.length} value{rejected.length > 1 ? 's' : ''} that are not scores between 0 and 1000: {rejected.slice(0, 5).join(', ')}
              {rejected.length > 5 ? '…' : ''}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Curve method">
          {METHODS.map((m) => (
            <button key={m.key} type="button" aria-pressed={method === m.key} className={method === m.key ? PILL_ON : PILL_OFF} onClick={() => setMethod(m.key)}>
              {m.label}
            </button>
          ))}
        </div>

        {method === 'flat' && (
          <div className="max-w-[12rem]">
            <label htmlFor="gc-flat" className={LABEL}>Points to add</label>
            <input id="gc-flat" className={INPUT} type="number" inputMode="decimal" step="any" value={flat} onChange={(e) => setFlat(e.target.value)} />
          </div>
        )}
        {method === 'linear-target' && (
          <div className="max-w-[12rem]">
            <label htmlFor="gc-target" className={LABEL}>Target class average</label>
            <input id="gc-target" className={INPUT} type="number" inputMode="decimal" step="any" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
            <input type="checkbox" checked={cap} onChange={(e) => setCap(e.target.checked)} className="w-5 h-5 accent-teal-600" />
            Cap curved scores at 100
          </label>
          <div className="flex items-center gap-2" role="group" aria-label="Grading scale">
            <button type="button" aria-pressed={!plus} className={!plus ? PILL_ON : PILL_OFF} onClick={() => setPlus(false)}>A–F</button>
            <button type="button" aria-pressed={plus} className={plus ? PILL_ON : PILL_OFF} onClick={() => setPlus(true)}>Plus / minus</button>
          </div>
        </div>
      </section>

      <section aria-label="Curved results" aria-live="polite" className={`${CARD} space-y-5`}>
        {scores.length === 0 ? (
          <p className="text-sm text-rose-700 dark:text-rose-400 m-0" role="alert">Enter at least one score to see the curve.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                ['Mean before', before.mean],
                ['Mean after', after.mean],
                ['Median before', before.median],
                ['Median after', after.median],
              ].map(([label, val]) => (
                <div key={label as string} className="rounded-2xl bg-[#CFE9DF] dark:bg-teal-950/60 border border-[#96CDB8] dark:border-teal-800/60 p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-900 dark:text-teal-300 block">{label as string}</span>
                  <strong className="text-xl font-extrabold font-mono text-teal-950 dark:text-teal-100">{roundTo(val as number, 1)}</strong>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">Raw and curved scores</caption>
                <thead className="sticky top-0 bg-white dark:bg-slate-900">
                  <tr className="text-left text-slate-500">
                    <th scope="col" className="py-1.5 pr-3">#</th>
                    <th scope="col" className="py-1.5 pr-3">Raw</th>
                    <th scope="col" className="py-1.5 pr-3">Curved</th>
                    <th scope="col" className="py-1.5 pr-3">Change</th>
                    <th scope="col" className="py-1.5">Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.slice(0, MAX_ROWS).map((s, i) => (
                    <tr key={i} className="border-t border-slate-200/70 dark:border-slate-800">
                      <td className="py-1.5 pr-3 text-slate-400 font-mono">{i + 1}</td>
                      <td className="py-1.5 pr-3 font-mono">{roundTo(s, 1)}</td>
                      <td className="py-1.5 pr-3 font-mono font-bold">{roundTo(curved[i], 1)}</td>
                      <td className="py-1.5 pr-3 font-mono text-emerald-700 dark:text-emerald-400">
                        {curved[i] - s >= 0 ? '+' : ''}{roundTo(curved[i] - s, 1)}
                      </td>
                      <td className="py-1.5 font-bold">{percentToLetter(curved[i], scale).letter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {scores.length > MAX_ROWS && (
              <p className="text-xs text-slate-500 m-0">Showing the first {MAX_ROWS} of {scores.length} scores. Statistics use all of them.</p>
            )}
          </>
        )}
        <button type="button" onClick={() => window.print()} className={`${BTN_PRIMARY} print:hidden`}>
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>Print or save as PDF</span>
        </button>
      </section>
    </div>
  );
};

export default GradeCurveTool;
