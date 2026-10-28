import React, { useMemo, useState } from 'react';
import { parseStrictNumber, roundTo } from '../../utils/academicMath';
import { CARD, INPUT, LABEL, RESULT_BOX, WARN_TEXT } from './ui';

/** Blank -> NaN (invalid), never 0. Decimal commas are accepted. */
const toNum = (v: string): number => {
  const n = parseStrictNumber(v);
  return n === null ? NaN : n;
};

/**
 * Target GPA planner: from a current GPA, completed credits, a target GPA
 * and the credits still to take, solve the GPA those remaining credits must
 * average. Formula: required = (target × total credits − current × completed
 * credits) ÷ planned credits. Nothing here changes a transcript: it is a
 * planning number, and the tool says plainly when the target cannot be met.
 */
export const TargetGpaTool: React.FC = () => {
  const [current, setCurrent] = useState('3.2');
  const [completed, setCompleted] = useState('30');
  const [target, setTarget] = useState('3.5');
  const [planned, setPlanned] = useState('15');

  const cur = toNum(current);
  const done = toNum(completed);
  const tgt = toNum(target);
  const plan = toNum(planned);

  const valid =
    Number.isFinite(cur) && cur >= 0 && cur <= 4.0 &&
    Number.isFinite(done) && done > 0 &&
    Number.isFinite(tgt) && tgt >= 0 && tgt <= 4.0 &&
    Number.isFinite(plan) && plan > 0;

  const calc = useMemo(() => {
    if (!valid) return null;
    const total = done + plan;
    const required = (tgt * total - cur * done) / plan;
    const maxAchievable = (cur * done + 4.0 * plan) / total;
    return { total, required, maxAchievable };
  }, [valid, cur, done, tgt, plan]);

  const verdict = !calc
    ? null
    : calc.required <= 0
      ? 'secured'
      : calc.required > 4.0
        ? 'impossible'
        : 'possible';

  const error = !valid
    ? 'Enter a current GPA between 0 and 4.0, a target between 0 and 4.0, and credit counts above 0.'
    : null;

  return (
    <div className="space-y-6">
      <div className={CARD}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL} htmlFor="target-current">Current GPA (4.0 scale)</label>
            <input
              id="target-current"
              className={INPUT}
              inputMode="decimal"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="3.2"
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="target-completed">Credits completed</label>
            <input
              id="target-completed"
              className={INPUT}
              inputMode="decimal"
              value={completed}
              onChange={(e) => setCompleted(e.target.value)}
              placeholder="30"
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="target-goal">Target GPA</label>
            <input
              id="target-goal"
              className={INPUT}
              inputMode="decimal"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="3.5"
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="target-planned">Credits still to take</label>
            <input
              id="target-planned"
              className={INPUT}
              inputMode="decimal"
              value={planned}
              onChange={(e) => setPlanned(e.target.value)}
              placeholder="15"
            />
          </div>
        </div>
        {error ? (
          <p className="text-sm text-rose-700 m-0 mt-4">{error}</p>
        ) : (
          calc && (
            <div className={`${RESULT_BOX} mt-4 space-y-2`}>
              {verdict === 'possible' && (
                <>
                  <p className="m-0 text-sm text-slate-600">GPA needed across your next {plan} credits</p>
                  <p className="m-0 text-4xl font-bold text-slate-900">{roundTo(calc.required, 2)}</p>
                  <p className="m-0 text-sm text-slate-700">
                    Average {roundTo(calc.required, 2)} over the remaining credits and the cumulative GPA
                    lands on {tgt.toFixed(2)}. With straight As it could reach {roundTo(calc.maxAchievable, 2)}.
                  </p>
                </>
              )}
              {verdict === 'secured' && (
                <>
                  <p className="m-0 text-4xl font-bold text-slate-900">Already secured</p>
                  <p className="m-0 text-sm text-slate-700">
                    Even with 0.0 on the remaining {plan} credits the cumulative GPA stays at or above {tgt.toFixed(2)}.
                    The target is met before the next term starts.
                  </p>
                </>
              )}
              {verdict === 'impossible' && (
                <>
                  <p className="m-0 text-4xl font-bold text-slate-900">Not possible at {tgt.toFixed(2)}</p>
                  <p className={`${WARN_TEXT} mt-1`}>
                    The remaining credits would need a {roundTo(calc.required, 2)} average, above the 4.0 ceiling.
                    The highest reachable GPA is {roundTo(calc.maxAchievable, 2)} with straight As — retarget to that
                    number, or add more planned credits.
                  </p>
                </>
              )}
            </div>
          )
        )}
      </div>
      <p className="text-sm text-slate-500 m-0">
        This assumes every planned credit counts equally and uses the 4.0 scale. Retaken courses,
        pass/fail credits and school-specific GPA rules can change the official result — check your
        registrar’s policy for the number that counts.
      </p>
    </div>
  );
};

export default TargetGpaTool;
