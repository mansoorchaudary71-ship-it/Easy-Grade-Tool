import React, { useMemo, useState } from 'react';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Printer } from 'lucide-react';
import {
  SCALE_PLUS_MINUS,
  SCALE_STANDARD,
  bandRanges,
  letterToMidpoint,
  mapLetterToScale,
  parseStrictNumber,
  percentToLetter,
} from '../../utils/academicMath';
import { BTN_PRIMARY, CARD, ERROR_TEXT, INPUT, LABEL, RESULT_BOX } from './ui';

type Mode = 'percent' | 'letter';

/** Highest percentage the tool accepts (allows extra credit above 100). */
const MAX_PERCENT = 200;

export const LetterGradeTool: React.FC = () => {
  const [mode, setMode] = useState<Mode>('percent');
  const [plus, setPlus] = useState(false);
  const [percent, setPercent] = useState('89.5');
  const [letter, setLetter] = useState('B');
  const scale = plus ? SCALE_PLUS_MINUS : SCALE_STANDARD;
  const ranges = useMemo(() => bandRanges(scale), [scale]);

  // Always a letter that exists on the active scale, so the select never holds an invalid value.
  const safeLetter = mapLetterToScale(letter, scale);
  const changeScale = (nextPlus: boolean) => {
    const nextScale = nextPlus ? SCALE_PLUS_MINUS : SCALE_STANDARD;
    setLetter((prev) => mapLetterToScale(prev, nextScale));
    setPlus(nextPlus);
  };

  const pctParsed = parseStrictNumber(percent);
  const pctError =
    percent.trim() === ''
      ? 'Enter a percentage.'
      : pctParsed === null
      ? 'Use digits only, for example 89.5.'
      : pctParsed > MAX_PERCENT
      ? `Enter a percentage of ${MAX_PERCENT} or less.`
      : null;
  const band = pctParsed !== null && !pctError ? percentToLetter(pctParsed, scale) : null;
  const letterRange = ranges.find((r) => r.letter.toUpperCase() === safeLetter.toUpperCase());
  const mid = letterToMidpoint(safeLetter, scale);
  const topNote =
    band && pctParsed !== null && pctParsed > 100
      ? 'Above 100%: this counts as the top grade on the scale.'
      : band && pctParsed !== null && pctParsed >= scale[0].min && scale[0].min < 100
      ? `The top grade, ${scale[0].letter}, starts at ${scale[0].min}%.`
      : null;

  return (
    <div className="space-y-6">
      <section aria-label="Letter grade inputs" className={`${CARD} space-y-5 print:hidden`}>
        <SegmentedControl
          ariaLabel="Conversion direction"
          value={mode}
          onChange={(v) => setMode(v)}
          options={[{ value: 'percent', label: 'Percent → letter' }, { value: 'letter', label: 'Letter → percent' }]}
        />
        <SegmentedControl
          ariaLabel="Grading scale"
          value={plus ? 'plus' : 'standard'}
          onChange={(v) => changeScale(v === 'plus')}
          options={[{ value: 'standard', label: 'A–F' }, { value: 'plus', label: 'Plus / minus' }]}
        />

        {mode === 'percent' ? (
          <div>
            <label htmlFor="lg-percent" className={LABEL}>Percentage</label>
            <input
              id="lg-percent"
              className={INPUT}
              type="text"
              inputMode="decimal"
              enterKeyHint="done"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              aria-invalid={pctError ? true : undefined}
              aria-describedby={pctError ? 'lg-percent-err' : undefined}
            />
            {pctError && <p id="lg-percent-err" className={`${ERROR_TEXT} mt-1.5`} role="alert">{pctError}</p>}
          </div>
        ) : (
          <div>
            <label htmlFor="lg-letter" className={LABEL}>Letter grade</label>
            <select id="lg-letter" className={INPUT} value={safeLetter} onChange={(e) => setLetter(e.target.value)}>
              {ranges.map((r) => (
                <option key={r.letter} value={r.letter}>{r.letter}</option>
              ))}
            </select>
          </div>
        )}
      </section>

      <section aria-label="Letter grade result" className={`${CARD} space-y-5`}>
        <div className={RESULT_BOX} role="status" aria-live="polite" aria-atomic="true">
          {mode === 'percent' ? (
            band ? (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-brand-ink block">{pctParsed}% is a</span>
                  <strong className="text-5xl font-bold text-brand-ink">{band.letter}</strong>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-brand-ink block">GPA points (4.0 scale)</span>
                  <strong className="text-3xl font-bold tabular-nums text-brand-ink">{band.gpa.toFixed(1)}</strong>
                </div>
              </div>
            ) : (
              <p className={ERROR_TEXT}>{pctError}</p>
            )
          ) : letterRange ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-brand-ink block">{letterRange.letter} covers</span>
                <strong className="text-3xl sm:text-4xl font-bold tabular-nums text-brand-ink">
                  {letterRange.from}% – {letterRange.to}%
                </strong>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-brand-ink block">Midpoint · GPA points</span>
                <strong className="text-2xl font-bold tabular-nums text-brand-ink">{mid}% · {letterRange.gpa.toFixed(1)}</strong>
              </div>
            </div>
          ) : null}
        </div>
        {topNote && <p className="text-sm text-ink-2 m-0">{topNote}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="text-left text-xs font-semibold text-ink-2 pb-2">
              {plus ? 'Plus/minus' : 'Standard A–F'} grade scale
            </caption>
            <thead>
              <tr className="text-left text-ink-2">
                <th scope="col" className="py-2 pr-3">Letter</th>
                <th scope="col" className="py-2 pr-3">Percentage</th>
                <th scope="col" className="py-2">GPA points</th>
              </tr>
            </thead>
            <tbody>
              {ranges.map((r) => (
                <tr key={r.letter} className="border-t border-line/70">
                  <th scope="row" className="py-2 pr-3 font-bold">{r.letter}</th>
                  <td className="py-2 pr-3 tabular-nums">{r.from}% – {r.to}%</td>
                  <td className="py-2 tabular-nums">{r.gpa.toFixed(1)}</td>
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
