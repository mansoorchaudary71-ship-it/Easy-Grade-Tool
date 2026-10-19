import React, { useMemo, useState } from 'react';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Printer } from 'lucide-react';
import { SCALE_PLUS_MINUS, SCALE_STANDARD } from '../../utils/academicMath';
import { buildQuickChart } from '../../utils/gradeCalculations';
import { Link } from '../SlashLink';
import { BTN_PRIMARY, CARD, PILL_OFF } from './ui';

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
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            ariaLabel="Grading scale"
            value={plus ? 'plus' : 'standard'}
            onChange={(v) => setPlus(v === 'plus')}
            options={[{ value: 'standard', label: 'A–F' }, { value: 'plus', label: 'Plus / minus' }]}
          />
          <Link to="/" className={`${PILL_OFF} no-underline`}>Custom cutoffs or another test size</Link>
        </div>
      </section>

      <section aria-label={`${questions}-question score chart`} className={CARD}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="text-left text-xs font-semibold text-ink-2 pb-2">
              Score chart for {questions} questions ({plus ? 'plus/minus' : 'standard A–F'})
            </caption>
            <thead>
              <tr className="text-left text-ink-2">
                <th scope="col" className="py-2 pr-3">Wrong</th>
                <th scope="col" className="py-2 pr-3">Correct</th>
                <th scope="col" className="py-2 pr-3">Percent</th>
                <th scope="col" className="py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.wrong} className="border-t border-line/70">
                  <th scope="row" className="py-2 pr-3 font-bold tabular-nums">{r.wrong}</th>
                  <td className="py-2 pr-3 tabular-nums">{r.correct}</td>
                  <td className="py-2 pr-3 tabular-nums">{r.formattedPercentage}%</td>
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
