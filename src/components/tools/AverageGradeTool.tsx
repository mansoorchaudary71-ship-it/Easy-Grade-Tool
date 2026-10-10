import React, { useMemo, useState } from 'react';
import { Printer } from 'lucide-react';
import {
  SCALE_PLUS_MINUS,
  SCALE_STANDARD,
  computeStats,
  parseScoreListDetailed,
  parseStrictNumber,
  percentToLetter,
  roundTo,
} from '../../utils/academicMath';
import { BTN_PRIMARY, CARD, ERROR_TEXT, INPUT, LABEL, PILL_OFF, PILL_ON, RESULT_BOX, WARN_TEXT } from './ui';

export const AverageGradeTool: React.FC = () => {
  const [raw, setRaw] = useState('88, 92, 79, 95, 84');
  const [maxInput, setMaxInput] = useState('100');
  const [plus, setPlus] = useState(false);

  const max = parseStrictNumber(maxInput);
  const maxError = max === null || max <= 0 ? 'Out of must be a number above 0.' : null;
  const limit = maxError ? 100 : (max as number);
  const parsed = useMemo(() => parseScoreListDetailed(raw, limit), [raw, limit]);
  const stats = useMemo(() => computeStats(parsed.scores), [parsed.scores]);
  const percent = (stats.mean / limit) * 100;
  const band = parsed.scores.length ? percentToLetter(roundTo(percent, 1), plus ? SCALE_PLUS_MINUS : SCALE_STANDARD) : null;

  return (
    <div className="space-y-6">
      <section aria-label="Average grade inputs" className={`${CARD} space-y-5 print:hidden`}>
        <div>
          <label htmlFor="ag-scores" className={LABEL}>Scores (commas, spaces or new lines)</label>
          <textarea
            id="ag-scores"
            rows={4}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            inputMode="decimal"
            enterKeyHint="done"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full bg-[#F0F2F5] dark:bg-slate-800 border-2 border-transparent text-stone-900 dark:text-white rounded-2xl px-4 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-mono text-base"
          />
          {parsed.notes.map((n) => (
            <p key={n} className="text-sm text-slate-600 dark:text-slate-300 mt-1 m-0" role="status">{n}</p>
          ))}
          {parsed.rejected.length > 0 && (
            <div className="mt-2" role="status">
              <p className={WARN_TEXT}>Left out {parsed.rejected.length} value{parsed.rejected.length > 1 ? 's' : ''}:</p>
              <ul className="m-0 mt-1 pl-5 text-sm text-amber-800 dark:text-amber-300 list-disc">
                {parsed.rejected.slice(0, 6).map((r, i) => (
                  <li key={`${r.token}-${i}`}><span className="font-mono">{r.token}</span> ({r.reason})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="max-w-[12rem]">
          <label htmlFor="ag-max" className={LABEL}>Each score is out of</label>
          <input id="ag-max" className={INPUT} type="text" inputMode="decimal" enterKeyHint="done" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} aria-invalid={maxError ? true : undefined} />
          {maxError && <p className={`${ERROR_TEXT} mt-1.5`} role="alert">{maxError}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Grading scale">
          <button type="button" aria-pressed={!plus} className={!plus ? PILL_ON : PILL_OFF} onClick={() => setPlus(false)}>A–F</button>
          <button type="button" aria-pressed={plus} className={plus ? PILL_ON : PILL_OFF} onClick={() => setPlus(true)}>Plus / minus</button>
        </div>
      </section>

      <section aria-label="Average grade result" className={`${CARD} space-y-4`}>
        {band ? (
          <>
            <div className={`${RESULT_BOX} flex flex-wrap items-center justify-between gap-4`} role="status" aria-live="polite" aria-atomic="true">
              <div>
                <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Average of {parsed.scores.length} score{parsed.scores.length === 1 ? '' : 's'}</span>
                <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">{roundTo(percent, 1)}%</strong>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Grade</span>
                <strong className="text-4xl font-extrabold text-teal-950 dark:text-teal-100">{band.letter}</strong>
              </div>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 m-0">
              {[
                ['Mean', stats.mean],
                ['Median', stats.median],
                ['Highest', stats.max],
                ['Lowest', stats.min],
              ].map(([label, val]) => (
                <div key={label as string} className="rounded-2xl bg-[#F0F2F5] dark:bg-slate-800 p-3 text-center">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">{label as string}</dt>
                  <dd className="m-0 text-xl font-extrabold font-mono text-slate-900 dark:text-white">{roundTo(val as number, 2)}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p className={ERROR_TEXT} role="alert">Enter at least one score.</p>
        )}
        <button type="button" onClick={() => window.print()} className={`${BTN_PRIMARY} print:hidden`}>
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>Print or save as PDF</span>
        </button>
      </section>
    </div>
  );
};

export default AverageGradeTool;
