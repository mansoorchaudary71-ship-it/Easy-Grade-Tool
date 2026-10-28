import React, { useMemo, useState } from 'react';
import { SegmentedControl } from '../ui/SegmentedControl';
import {
  SCALE_PLUS_MINUS,
  SCALE_STANDARD,
  calculateTestGrade,
  parseStrictNumber,
  percentToLetter,
  roundTo,
} from '../../utils/academicMath';
import { CARD, INPUT, LABEL, RESULT_BOX } from './ui';

/** Blank -> NaN (invalid), never 0. Decimal commas are accepted. */
const toNum = (v: string): number => {
  const n = parseStrictNumber(v);
  return n === null ? NaN : n;
};

/**
 * Quiz grading by question count: questions on the quiz and questions
 * missed. Decimal "wrong" values are allowed, so a half-credit miss can be
 * entered as 0.5. Distinct from the points-based test tool: everything here
 * is counted in questions, and the table shows how many questions may be
 * missed for every grade boundary.
 */
export const QuizGradeTool: React.FC = () => {
  const [questions, setQuestions] = useState('20');
  const [wrong, setWrong] = useState('3');
  const [plus, setPlus] = useState(false);
  const scale = plus ? SCALE_PLUS_MINUS : SCALE_STANDARD;

  const q = toNum(questions);
  const w = toNum(wrong);
  const valid = Number.isFinite(q) && q >= 1 && Number.isFinite(w) && w >= 0 && w <= q;

  const result = useMemo(
    () => (valid ? calculateTestGrade({ earned: q - w, possible: q }) : null),
    [valid, q, w]
  );
  const band = result && result.valid ? percentToLetter(roundTo(result.percent, 1), scale) : null;
  const perQuestion = valid ? roundTo(100 / q, 2) : 0;

  const allowance = useMemo(() => {
    if (!valid) return [];
    return scale
      .filter((b) => b.min > 0)
      .map((b) => {
        const maxWrong = Math.floor((q * (100 - b.min)) / 100);
        const pct = roundTo(((q - maxWrong) / q) * 100, 1);
        return { letter: b.letter, min: b.min, maxWrong, pct };
      });
  }, [valid, q, scale]);

  const error = !valid
    ? questions.trim() === ''
      ? 'Enter the number of questions on the quiz.'
      : wrong.trim() === ''
        ? 'Enter how many questions were missed.'
        : 'Check the numbers: missed questions cannot exceed total questions.'
    : null;

  return (
    <div className="space-y-6">
      <div className={CARD}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL} htmlFor="quiz-questions">Questions on the quiz</label>
            <input
              id="quiz-questions"
              className={INPUT}
              inputMode="decimal"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="20"
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="quiz-wrong">Questions missed</label>
            <input
              id="quiz-wrong"
              className={INPUT}
              inputMode="decimal"
              value={wrong}
              onChange={(e) => setWrong(e.target.value)}
              placeholder="3"
            />
          </div>
        </div>
        <div className="mt-4">
          <SegmentedControl
            value={plus ? 'plus' : 'standard'}
            onChange={(v) => setPlus(v === 'plus')}
            options={[{ value: 'standard', label: 'A–F' }, { value: 'plus', label: 'Plus / minus' }]}
          />
        </div>
        {error ? (
          <p className="text-sm text-rose-700 m-0 mt-4">{error}</p>
        ) : (
          result &&
          band && (
            <div className={`${RESULT_BOX} mt-4 space-y-2`}>
              <p className="m-0 text-sm text-slate-600">
                {roundTo(q - w, 2)} correct out of {q} questions
              </p>
              <p className="m-0 text-4xl font-bold text-slate-900">
                {roundTo(result.percent, 1)}% <span className="text-2xl">· {band.letter}</span>
              </p>
              <p className="m-0 text-sm text-slate-700">
                Each question is worth {perQuestion}% on a {q}-question quiz.
              </p>
            </div>
          )
        )}
      </div>

      {valid && allowance.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-800">
                <th scope="col" className="px-4 py-2.5 font-bold">Grade</th>
                <th scope="col" className="px-4 py-2.5 font-bold">Needs at least</th>
                <th scope="col" className="px-4 py-2.5 font-bold">Most questions you can miss</th>
                <th scope="col" className="px-4 py-2.5 font-bold">Score at that limit</th>
              </tr>
            </thead>
            <tbody>
              {allowance.map((row) => (
                <tr key={row.letter} className="border-t border-slate-200 text-slate-900">
                  <th scope="row" className="px-4 py-2 font-bold">{row.letter}</th>
                  <td className="px-4 py-2 font-mono tabular-nums">{row.min}%</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{row.maxWrong}</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{row.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-sm text-slate-500 m-0">
        Half credit counts as half a missed question: enter 0.5 for one half-credit miss.
        Your teacher’s scale and rounding rule decide the official grade.
      </p>
    </div>
  );
};

export default QuizGradeTool;
