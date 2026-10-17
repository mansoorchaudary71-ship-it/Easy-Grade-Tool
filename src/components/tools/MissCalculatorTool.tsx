import React, { useMemo, useState } from 'react';
import { SegmentedControl } from '../ui/SegmentedControl';
import { SCALE_PLUS_MINUS, SCALE_STANDARD, parseStrictNumber, roundTo } from '../../utils/academicMath';
import { validateQuestionCount } from '../../utils/gradeCalculations';
import { buildMissTable, maxWrongForMinPercent } from '../../utils/missMath';
import { CARD, ERROR_TEXT, INPUT, LABEL, RESULT_BOX } from './ui';

const SELECT = `${INPUT} appearance-auto cursor-pointer`;

export const MissCalculatorTool: React.FC = () => {
  const [totalRaw, setTotalRaw] = useState('25');
  const [plus, setPlus] = useState(false);
  const [target, setTarget] = useState('A');
  const [customRaw, setCustomRaw] = useState('70');

  const scale = plus ? SCALE_PLUS_MINUS : SCALE_STANDARD;
  const totalCheck = validateQuestionCount(totalRaw);
  const total = totalCheck.value;

  const passingBands = useMemo(() => scale.filter((b) => b.min > 0), [scale]);
  const targetValue = passingBands.some((b) => b.letter === target) || target === 'custom' ? target : passingBands[0].letter;

  const custom = parseStrictNumber(customRaw);
  const customError = targetValue === 'custom' && (custom === null || custom <= 0 || custom > 100) ? 'Enter a percentage from 1 to 100.' : null;
  const minPercent = targetValue === 'custom' ? (custom ?? 0) : (passingBands.find((b) => b.letter === targetValue)?.min ?? 0);

  const maxWrong = total !== null && !customError ? maxWrongForMinPercent(total, minPercent) : null;
  const table = useMemo(() => (total !== null ? buildMissTable(total, scale) : []), [total, scale]);
  const each = total !== null ? roundTo(100 / total, 2) : null;
  const atMax = total !== null && maxWrong !== null ? roundTo(((total - maxWrong) / total) * 100, 1) : null;

  return (
    <div className="space-y-6">
      <section aria-label="How many can I miss inputs" className={`${CARD} space-y-5 print:hidden`}>
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
          <div>
            <label htmlFor="mc-total" className={LABEL}>Questions on the test</label>
            <input id="mc-total" className={INPUT} type="text" inputMode="numeric" enterKeyHint="done" value={totalRaw}
              onChange={(e) => setTotalRaw(e.target.value)} aria-invalid={totalCheck.error ? true : undefined}
              aria-describedby={totalCheck.error ? 'mc-total-err' : undefined} />
            {totalCheck.error && <p id="mc-total-err" className={`${ERROR_TEXT} mt-1.5`} role="alert">{totalCheck.error}</p>}
          </div>
          <div>
            <label htmlFor="mc-target" className={LABEL}>Grade you want</label>
            <select id="mc-target" className={SELECT} value={targetValue} onChange={(e) => setTarget(e.target.value)}>
              {passingBands.map((b) => <option key={b.letter} value={b.letter}>{b.letter} ({b.min}% or higher)</option>)}
              <option value="custom">Custom percentage</option>
            </select>
          </div>
          {targetValue === 'custom' && (
            <div>
              <label htmlFor="mc-custom" className={LABEL}>Minimum percentage</label>
              <input id="mc-custom" className={INPUT} type="text" inputMode="decimal" enterKeyHint="done" value={customRaw}
                onChange={(e) => setCustomRaw(e.target.value)} aria-invalid={customError ? true : undefined}
                aria-describedby={customError ? 'mc-custom-err' : undefined} />
              {customError && <p id="mc-custom-err" className={`${ERROR_TEXT} mt-1.5`} role="alert">{customError}</p>}
            </div>
          )}
        </div>
        <SegmentedControl
          ariaLabel="Grading scale"
          value={plus ? 'plus' : 'standard'}
          onChange={(v) => setPlus(v === 'plus')}
          options={[{ value: 'standard', label: 'A–F' }, { value: 'plus', label: 'Plus / minus' }]}
        />
      </section>

      <section aria-label="How many you can miss" className={`${CARD} space-y-5`}>
        {total !== null && maxWrong !== null && atMax !== null && each !== null ? (
          <>
            <div className={RESULT_BOX} role="status" aria-live="polite" aria-atomic="true">
              <span className="text-xs font-semibold tracking-widest text-teal-900 dark:text-teal-300 uppercase block">
                To get {targetValue === 'custom' ? `${minPercent}% or higher` : `${/^[AEFHILMNORSX]/i.test(targetValue) ? 'an' : 'a'} ${targetValue} (${minPercent}% or higher)`}
              </span>
              <strong className="text-4xl sm:text-5xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tabular-nums">
                miss up to {maxWrong}
              </strong>
              <p className="text-sm text-teal-950 dark:text-teal-100 mt-2 m-0">
                On a {total}-question test each question is worth {each}%. Missing {maxWrong} leaves {atMax}%.
                {maxWrong < total ? ` Missing ${maxWrong + 1} leaves ${roundTo(((total - maxWrong - 1) / total) * 100, 1)}%, below the cutoff.` : ''}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <caption className="text-left font-bold text-slate-900 dark:text-white pb-2">Most you can miss for each grade on a {total}-question test</caption>
                <thead>
                  <tr className="text-slate-700 dark:text-slate-300">
                    <th scope="col" className="py-2 pr-4">Grade</th>
                    <th scope="col" className="py-2 pr-4">Minimum</th>
                    <th scope="col" className="py-2 pr-4">Most you can miss</th>
                    <th scope="col" className="py-2">Score then</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((r) => (
                    <tr key={r.letter} className="border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                      <th scope="row" className="py-2 pr-4 font-bold">{r.letter}</th>
                      <td className="py-2 pr-4 font-mono">{r.min}%</td>
                      <td className="py-2 pr-4 font-mono">{r.maxWrong}</td>
                      <td className="py-2 font-mono">{r.percentAtMax}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className={ERROR_TEXT} role="status">Enter the number of questions and a valid target to see how many you can miss.</p>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-300 m-0">
          This uses the common {plus ? 'plus/minus' : '90/80/70/60'} scale. Your teacher or school may use different cutoffs, so check your syllabus.
        </p>
      </section>
    </div>
  );
};

export default MissCalculatorTool;
