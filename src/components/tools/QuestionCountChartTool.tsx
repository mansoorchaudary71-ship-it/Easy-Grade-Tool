import React, { useMemo, useState } from 'react';
import { Printer } from 'lucide-react';
import { SCALE_PLUS_MINUS, SCALE_STANDARD } from '../../utils/academicMath';
import { buildQuickChart } from '../../utils/gradeCalculations';
import { Link } from '../SlashLink';
import { BTN_PRIMARY, CARD, PILL_OFF, PILL_ON } from './ui';

/** Fixed-size score chart for /grading-scale/N-questions/ pages. */
export const QuestionCountChartTool: React.FC<{ questions: number }> = ({ questions }) => {
  const [plus, setPlus] = useState(false);
  const rows = useMemo(
    () => buildQuickChart({ total: questions, decimals: 1, bands: plus ? SCALE_PLUS_MINUS : SCALE_STANDARD }),
    [questions, plus]
  );

  return (
    <div className="space-y-6">
      <section aria-label="Scale choice" className={`${CARD} print:hidden`}>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Grading scale">
          <button type="button" aria-pressed={!plus} className={!plus ? PILL_ON : PILL_OFF} onClick={() => setPlus(false)}>A–F</button>
          <button type="button" aria-pressed={plus} className={plus ? PILL_ON : PILL_OFF} onClick={() => setPlus(true)}>Plus / minus</button>
          <Link to="/" className={`${PILL_OFF} no-underline`}>Custom cutoffs or another test size</Link>
        </div>
      </section>

      <section aria-label={`${questions}-question score chart`} className={CARD}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="text-left text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-300 pb-2">
              Score chart for {questions} questions ({plus ? 'plus/minus' : 'standard A–F'})
            </caption>
            <thead>
              <tr className="text-left text-slate-600 dark:text-slate-300">
                <th scope="col" className="py-2 pr-3">Wrong</th>
                <th scope="col" className="py-2 pr-3">Correct</th>
                <th scope="col" className="py-2 pr-3">Percent</th>
                <th scope="col" className="py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.wrong} className="border-t border-slate-200/70 dark:border-slate-800">
                  <th scope="row" className="py-2 pr-3 font-bold font-mono">{r.wrong}</th>
                  <td className="py-2 pr-3 font-mono">{r.correct}</td>
                  <td className="py-2 pr-3 font-mono">{r.formattedPercentage}%</td>
                  <td className="py-2 font-bold">{r.letter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={() => window.print()} className={`${BTN_PRIMARY} mt-4 print:hidden`}>
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>Print this chart</span>
        </button>
      </section>
    </div>
  );
};

export default QuestionCountChartTool;
