import React, { useMemo, useState } from 'react';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Printer } from 'lucide-react';
import {
  CurveMethod,
  SCALE_PLUS_MINUS,
  SCALE_STANDARD,
  applyCurve,
  computeStats,
  parseScoreListDetailed,
  parseStrictNumber,
  percentToLetter,
  roundTo,
  validateCurveParams,
} from '../../utils/academicMath';
import { BTN_PRIMARY, CARD, ERROR_TEXT, INPUT, LABEL, SWITCH_ROW, WARN_TEXT } from './ui';

const METHODS: { key: CurveMethod; label: string }[] = [
  { key: 'flat', label: 'Add flat points' },
  { key: 'scale-top', label: 'Top score → max' },
  { key: 'sqrt', label: 'Square root' },
  { key: 'linear-target', label: 'Target average' },
];

const MAX_ROWS = 300;

export const GradeCurveTool: React.FC = () => {
  const [raw, setRaw] = useState('55, 62, 70, 78, 85');
  const [maxInput, setMaxInput] = useState('100');
  const [method, setMethod] = useState<CurveMethod>('flat');
  const [flat, setFlat] = useState('5');
  const [target, setTarget] = useState('78');
  const [cap, setCap] = useState(true);
  const [plus, setPlus] = useState(false);
  const scale = plus ? SCALE_PLUS_MINUS : SCALE_STANDARD;

  const maxParsed = parseStrictNumber(maxInput);
  const maxScore = maxParsed !== null && maxParsed > 0 ? maxParsed : null;
  const maxError = maxScore === null ? 'Maximum score must be a number above 0.' : null;

  const parsed = useMemo(() => parseScoreListDetailed(raw, maxScore ?? 1000), [raw, maxScore]);
  const { scores, rejected, notes } = parsed;

  const params = useMemo(
    () => ({
      method,
      flatPoints: parseStrictNumber(flat) ?? undefined,
      targetAverage: parseStrictNumber(target) ?? undefined,
      maxScore: maxScore ?? 100,
      capAtMax: cap,
    }),
    [method, flat, target, maxScore, cap]
  );

  const problem = maxError || validateCurveParams(scores, params);
  const curved = useMemo(() => (problem ? [] : applyCurve(scores, params)), [problem, scores, params]);
  const before = computeStats(scores);
  const after = computeStats(curved);
  const limit = maxScore ?? 100;

  return (
    <div className="space-y-6">
      <section aria-label="Grade curve inputs" className={`${CARD} space-y-5 print:hidden`}>
        <div>
          <label htmlFor="gc-scores" className={LABEL}>Raw scores (commas, spaces or new lines)</label>
          <textarea
            id="gc-scores"
            rows={4}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            inputMode="decimal"
            enterKeyHint="done"
            autoCapitalize="off"
            autoCorrect="off"
            aria-describedby="gc-scores-help"
            className="w-full bg-[#F0F2F5] dark:bg-slate-800 border-2 border-transparent text-stone-900 dark:text-white rounded-2xl px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-mono text-base"
            spellCheck={false}
          />
          <p id="gc-scores-help" className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 m-0">
            Plain numbers only. Use a dot or a comma for decimals, for example 88.5.
          </p>
          {notes.map((n) => (
            <p key={n} className="text-sm text-slate-600 dark:text-slate-300 mt-1 m-0" role="status">{n}</p>
          ))}
          {rejected.length > 0 && (
            <div className="mt-2" role="status">
              <p className={WARN_TEXT}>
                Left out {rejected.length} value{rejected.length > 1 ? 's' : ''}:
              </p>
              <ul className="m-0 mt-1 pl-5 text-sm text-amber-800 dark:text-amber-300 list-disc">
                {rejected.slice(0, 6).map((r, i) => (
                  <li key={`${r.token}-${i}`}><span className="font-mono">{r.token}</span> ({r.reason})</li>
                ))}
              </ul>
              {rejected.length > 6 && <p className={WARN_TEXT}>and {rejected.length - 6} more.</p>}
            </div>
          )}
        </div>

        <div className="max-w-[12rem]">
          <label htmlFor="gc-max" className={LABEL}>Maximum score</label>
          <input
            id="gc-max"
            className={INPUT}
            type="text"
            inputMode="decimal"
            enterKeyHint="done"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            aria-invalid={maxError ? true : undefined}
            aria-describedby={maxError ? 'gc-max-err' : undefined}
          />
          {maxError && <p id="gc-max-err" className={`${ERROR_TEXT} mt-1.5`} role="alert">{maxError}</p>}
        </div>

        <SegmentedControl
          ariaLabel="Curve method"
          variant="chips"
          value={method}
          onChange={(v) => setMethod(v)}
          options={METHODS.map((m) => ({ value: m.key, label: m.label }))}
        />

        {method === 'flat' && (
          <div className="max-w-[12rem]">
            <label htmlFor="gc-flat" className={LABEL}>Points to add</label>
            <input id="gc-flat" className={INPUT} type="text" inputMode="decimal" enterKeyHint="done" value={flat} onChange={(e) => setFlat(e.target.value)} />
          </div>
        )}
        {method === 'linear-target' && (
          <div className="max-w-[12rem]">
            <label htmlFor="gc-target" className={LABEL}>Target class average</label>
            <input id="gc-target" className={INPUT} type="text" inputMode="decimal" enterKeyHint="done" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className={SWITCH_ROW}>
            <input type="checkbox" checked={cap} onChange={(e) => setCap(e.target.checked)} className="w-6 h-6 accent-teal-600" />
            <span>Cap curved scores at {limit}</span>
          </label>
          <SegmentedControl
          ariaLabel="Grading scale"
          value={plus ? 'plus' : 'standard'}
          onChange={(v) => setPlus(v === 'plus')}
          options={[{ value: 'standard', label: 'A–F' }, { value: 'plus', label: 'Plus / minus' }]}
        />
        </div>
      </section>

      <section aria-label="Curved results" className={`${CARD} space-y-5`}>
        {problem ? (
          <p className={ERROR_TEXT} role="alert">{problem}</p>
        ) : (
          <>
            <div role="status" aria-live="polite" aria-atomic="true" className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                ['Mean before', before.mean],
                ['Mean after', after.mean],
                ['Median before', before.median],
                ['Median after', after.median],
              ].map(([label, val]) => (
                <div key={label as string} className="glow-surface rounded-2xl bg-[#DCE1EF] dark:bg-teal-950/60 border border-[#B0BAD9] dark:border-teal-800/60 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-900 dark:text-teal-300 block">{label as string}</span>
                  <strong className="text-xl font-extrabold font-mono text-teal-950 dark:text-teal-100">{roundTo(val as number, 1)}</strong>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">Raw and curved scores</caption>
                <thead className="sticky top-0 bg-white dark:bg-slate-900">
                  <tr className="text-left text-slate-600 dark:text-slate-300">
                    <th scope="col" className="py-2 pr-3">#</th>
                    <th scope="col" className="py-2 pr-3">Raw</th>
                    <th scope="col" className="py-2 pr-3">Curved</th>
                    <th scope="col" className="py-2 pr-3">Change</th>
                    <th scope="col" className="py-2">Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.slice(0, MAX_ROWS).map((s, i) => {
                    const delta = roundTo(curved[i] - s, 1);
                    const tone =
                      delta > 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : delta < 0
                        ? 'text-rose-700 dark:text-rose-400'
                        : 'text-slate-600 dark:text-slate-300';
                    return (
                      <tr key={i} className="border-t border-slate-200/70 dark:border-slate-800">
                        <td className="py-2 pr-3 text-slate-600 dark:text-slate-400 font-mono">{i + 1}</td>
                        <td className="py-2 pr-3 font-mono">{roundTo(s, 1)}</td>
                        <td className="py-2 pr-3 font-mono font-bold">{roundTo(curved[i], 1)}</td>
                        <td className={`py-2 pr-3 font-mono ${tone}`}>{delta > 0 ? '+' : ''}{delta}</td>
                        <td className="py-2 font-bold">{percentToLetter((curved[i] / limit) * 100, scale).letter}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {scores.length > MAX_ROWS && (
              <p className="text-sm text-slate-600 dark:text-slate-300 m-0">Showing the first {MAX_ROWS} of {scores.length} scores. Statistics use all of them.</p>
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
