import React, { useMemo, useState } from 'react';
import { Printer } from 'lucide-react';
import {
  SCALE_PLUS_MINUS,
  SCALE_STANDARD,
  bandRanges,
  letterToMidpoint,
  percentToLetter,
} from '../../utils/academicMath';
import { BTN_PRIMARY, CARD, INPUT, LABEL, PILL_OFF, PILL_ON, RESULT_BOX } from './ui';

type Mode = 'percent' | 'letter';

export const LetterGradeTool: React.FC = () => {
  const [mode, setMode] = useState<Mode>('percent');
  const [plus, setPlus] = useState(false);
  const [percent, setPercent] = useState('89.5');
  const [letter, setLetter] = useState('B');
  const scale = plus ? SCALE_PLUS_MINUS : SCALE_STANDARD;
  const ranges = useMemo(() => bandRanges(scale), [scale]);

  const pct = percent.trim() === '' ? NaN : Number(percent);
  const band = Number.isFinite(pct) && pct >= 0 ? percentToLetter(pct, scale) : null;
  const letterRange = ranges.find((r) => r.letter.toUpperCase() === letter.trim().toUpperCase());
  const mid = letterToMidpoint(letter, scale);

  return (
    <div className="space-y-6">
      <section aria-label="Letter grade inputs" className={`${CARD} space-y-5 print:hidden`}>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Conversion direction">
          <button type="button" aria-pressed={mode === 'percent'} className={mode === 'percent' ? PILL_ON : PILL_OFF} onClick={() => setMode('percent')}>Percent → letter</button>
          <button type="button" aria-pressed={mode === 'letter'} className={mode === 'letter' ? PILL_ON : PILL_OFF} onClick={() => setMode('letter')}>Letter → percent</button>
          <span className="mx-1 w-px bg-slate-300 dark:bg-slate-700" aria-hidden="true" />
          <button type="button" aria-pressed={!plus} className={!plus ? PILL_ON : PILL_OFF} onClick={() => setPlus(false)}>A–F</button>
          <button type="button" aria-pressed={plus} className={plus ? PILL_ON : PILL_OFF} onClick={() => setPlus(true)}>Plus / minus</button>
        </div>

        {mode === 'percent' ? (
          <div>
            <label htmlFor="lg-percent" className={LABEL}>Percentage</label>
            <input id="lg-percent" className={INPUT} type="number" inputMode="decimal" min="0" max="200" step="any" value={percent} onChange={(e) => setPercent(e.target.value)} />
          </div>
        ) : (
          <div>
            <label htmlFor="lg-letter" className={LABEL}>Letter grade</label>
            <select id="lg-letter" className={INPUT} value={letter} onChange={(e) => setLetter(e.target.value)}>
              {ranges.map((r) => (
                <option key={r.letter} value={r.letter}>{r.letter}</option>
              ))}
            </select>
          </div>
        )}
      </section>

      <section aria-label="Letter grade result" aria-live="polite" className={`${CARD} space-y-5`}>
        <div className={RESULT_BOX}>
          {mode === 'percent' ? (
            band ? (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold tracking-widest text-teal-800 dark:text-teal-300 uppercase block">{pct}% is a</span>
                  <strong className="text-5xl font-extrabold text-teal-950 dark:text-teal-100">{band.letter}</strong>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold tracking-widest text-teal-800 dark:text-teal-300 uppercase block">GPA points (4.0 scale)</span>
                  <strong className="text-3xl font-extrabold font-mono text-teal-950 dark:text-teal-100">{band.gpa.toFixed(1)}</strong>
                </div>
              </div>
            ) : (
              <p className="m-0 text-sm text-rose-700 dark:text-rose-400" role="alert">Enter a percentage of 0 or more.</p>
            )
          ) : letterRange ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-widest text-teal-800 dark:text-teal-300 uppercase block">{letterRange.letter} covers</span>
                <strong className="text-3xl sm:text-4xl font-extrabold font-mono text-teal-950 dark:text-teal-100">
                  {letterRange.from}% – {letterRange.to}%
                </strong>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold tracking-widest text-teal-800 dark:text-teal-300 uppercase block">Midpoint · GPA points</span>
                <strong className="text-2xl font-extrabold font-mono text-teal-950 dark:text-teal-100">{mid}% · {letterRange.gpa.toFixed(1)}</strong>
              </div>
            </div>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="text-left text-xs font-semibold uppercase tracking-widest text-slate-500 pb-2">
              {plus ? 'Plus/minus' : 'Standard A–F'} grade scale
            </caption>
            <thead>
              <tr className="text-left text-slate-500">
                <th scope="col" className="py-1.5 pr-3">Letter</th>
                <th scope="col" className="py-1.5 pr-3">Percentage</th>
                <th scope="col" className="py-1.5">GPA points</th>
              </tr>
            </thead>
            <tbody>
              {ranges.map((r) => (
                <tr key={r.letter} className="border-t border-slate-200/70 dark:border-slate-800">
                  <th scope="row" className="py-1.5 pr-3 font-bold">{r.letter}</th>
                  <td className="py-1.5 pr-3 font-mono">{r.from}% – {r.to}%</td>
                  <td className="py-1.5 font-mono">{r.gpa.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={() => window.print()} className={`${BTN_PRIMARY} print:hidden`}>
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>Print this scale</span>
        </button>
      </section>
    </div>
  );
};

export default LetterGradeTool;
