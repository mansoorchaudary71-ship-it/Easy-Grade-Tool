import React, { useMemo, useState } from 'react';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Printer } from 'lucide-react';
import {
  SCALE_PLUS_MINUS,
  SCALE_STANDARD,
  calculateTestGrade,
  parseStrictNumber,
  percentToLetter,
  roundTo,
} from '../../utils/academicMath';
import { BTN_PRIMARY, CARD, ERROR_TEXT, INPUT, LABEL, RESULT_BOX, WARN_TEXT } from './ui';

/** Blank -> NaN (invalid), never 0. Decimal commas are accepted. */
const toNum = (v: string): number => {
  const n = parseStrictNumber(v);
  return n === null ? NaN : n;
};

export const TestGradeTool: React.FC = () => {
  const [earned, setEarned] = useState('42');
  const [possible, setPossible] = useState('50');
  const [bonus, setBonus] = useState('');
  const [penalty, setPenalty] = useState('');
  const [plus, setPlus] = useState(false);
  const scale = plus ? SCALE_PLUS_MINUS : SCALE_STANDARD;

  const result = useMemo(
    () =>
      calculateTestGrade({
        earned: toNum(earned),
        possible: toNum(possible),
        bonus: bonus.trim() === '' ? 0 : toNum(bonus),
        penalty: penalty.trim() === '' ? 0 : toNum(penalty),
      }),
    [earned, possible, bonus, penalty]
  );

  const band = result.valid ? percentToLetter(roundTo(result.percent, 1), scale) : null;
  const poss = toNum(possible);

  const needed = useMemo(() => {
    if (!result.valid || !Number.isFinite(poss)) return [];
    return scale
      .filter((b) => b.min > 0)
      .map((b) => {
        const pts = Math.ceil((b.min / 100) * poss * 100) / 100;
        return { letter: b.letter, min: b.min, pts, delta: roundTo(pts - result.adjustedEarned, 2) };
      });
  }, [result, poss, scale]);

  const earnedBlank = earned.trim() === '';
  const inputError = !result.valid
    ? earnedBlank
      ? 'Enter the points you earned.'
      : result.error || 'Enter your points to see the result.'
    : null;

  return (
    <div className="space-y-6">
      <section aria-label="Test grade inputs" className={`${CARD} space-y-5 print:hidden`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tg-earned" className={LABEL}>Points earned</label>
            <input id="tg-earned" className={INPUT} type="text" inputMode="decimal" enterKeyHint="next" value={earned} onChange={(e) => setEarned(e.target.value)} />
          </div>
          <div>
            <label htmlFor="tg-possible" className={LABEL}>Points possible</label>
            <input id="tg-possible" className={INPUT} type="text" inputMode="decimal" enterKeyHint="done" value={possible} onChange={(e) => setPossible(e.target.value)} />
          </div>
        </div>

        <details className="group rounded-2xl border border-stone-200 dark:border-slate-700 px-4">
          <summary className="flex items-center min-h-[48px] cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200 select-none">
            Bonus points or late penalty (optional)
          </summary>
          <div className="grid grid-cols-2 gap-4 pb-4 pt-1">
            <div>
              <label htmlFor="tg-bonus" className={LABEL}>Bonus points</label>
              <input id="tg-bonus" className={INPUT} type="text" inputMode="decimal" placeholder="0" value={bonus} onChange={(e) => setBonus(e.target.value)} />
            </div>
            <div>
              <label htmlFor="tg-penalty" className={LABEL}>Penalty points</label>
              <input id="tg-penalty" className={INPUT} type="text" inputMode="decimal" placeholder="0" value={penalty} onChange={(e) => setPenalty(e.target.value)} />
            </div>
          </div>
        </details>

        <SegmentedControl
          ariaLabel="Grading scale"
          prefix="Scale"
          value={plus ? 'plus' : 'standard'}
          onChange={(v) => setPlus(v === 'plus')}
          options={[{ value: 'standard', label: 'A–F' }, { value: 'plus', label: 'Plus / minus' }]}
        />
      </section>

      <section aria-label="Test grade result" className={`${CARD} space-y-5`}>
        {result.valid && band ? (
          <>
            <div className={`${RESULT_BOX} flex flex-wrap items-center justify-between gap-4`} role="status" aria-live="polite" aria-atomic="true">
              <div>
                <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Your test grade</span>
                <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">
                  {roundTo(result.percent, 1)}%
                </strong>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">Letter · GPA points</span>
                <strong className="text-3xl font-extrabold text-teal-950 dark:text-teal-100">{band.letter}</strong>
                <span className="ml-2 text-lg font-bold text-teal-900 dark:text-teal-200 font-mono">{band.gpa.toFixed(1)}</span>
              </div>
            </div>
            {result.warnings.map((w) => (
              <p key={w} className={WARN_TEXT} role="status">{w}</p>
            ))}
            <p className="text-sm text-slate-700 dark:text-slate-300 m-0">
              {result.adjustedEarned} of {poss} points after adjustments
              {result.missed > 0 ? ` · ${roundTo(result.missed, 2)} points missed before bonus` : ''}.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="text-left text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-300 pb-2">
                  Points needed on this test
                </caption>
                <thead>
                  <tr className="text-left text-slate-600 dark:text-slate-300">
                    <th scope="col" className="py-2 pr-3">Grade</th>
                    <th scope="col" className="py-2 pr-3">Minimum</th>
                    <th scope="col" className="py-2 pr-3">Points needed</th>
                    <th scope="col" className="py-2">You are</th>
                  </tr>
                </thead>
                <tbody>
                  {needed.map((n) => (
                    <tr key={n.letter} className="border-t border-slate-200/70 dark:border-slate-800">
                      <th scope="row" className="py-2 pr-3 font-bold">{n.letter}</th>
                      <td className="py-2 pr-3 font-mono">{n.min}%</td>
                      <td className="py-2 pr-3 font-mono">{n.pts}</td>
                      <td className={`py-2 font-mono ${n.delta <= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {n.delta <= 0 ? 'at or above' : `${n.delta} short`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className={ERROR_TEXT} role="alert">{inputError}</p>
        )}
        <button type="button" onClick={() => window.print()} className={`${BTN_PRIMARY} print:hidden`}>
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>Print or save as PDF</span>
        </button>
      </section>
    </div>
  );
};

export default TestGradeTool;
