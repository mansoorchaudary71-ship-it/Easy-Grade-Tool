import React, { useMemo, useState } from 'react';
import { SegmentedControl } from '../ui/SegmentedControl';
import {
  SCALE_PLUS_MINUS,
  SCALE_STANDARD,
  parseStrictNumber,
} from '../../utils/academicMath';
import { CARD, ERROR_TEXT, INPUT, LABEL, RESULT_BOX } from './ui';

type Direction = 'gpaToLetter' | 'letterToGpa';
type ScaleKey = 'standard' | 'plus';

const SCALES: Record<ScaleKey, { letter: string; gpa: number }[]> = {
  standard: SCALE_STANDARD,
  plus: SCALE_PLUS_MINUS,
};

/** Distinct point values on a scale, highest first, with the letters that carry each value. */
function pointSteps(scale: { letter: string; gpa: number }[]) {
  const byPoints = new Map<number, string[]>();
  for (const band of scale) {
    const letters = byPoints.get(band.gpa) ?? [];
    if (!letters.includes(band.letter)) letters.push(band.letter);
    byPoints.set(band.gpa, letters);
  }
  return [...byPoints.entries()]
    .map(([points, letters]) => ({ points, letters }))
    .sort((a, b) => b.points - a.points);
}

export interface GpaLetterToolProps {
  defaultDirection?: Direction;
}

export const GpaLetterTool: React.FC<GpaLetterToolProps> = ({ defaultDirection = 'gpaToLetter' }) => {
  const [direction, setDirection] = useState<Direction>(defaultDirection);
  const [scaleKey, setScaleKey] = useState<ScaleKey>('plus');
  const [gpaInput, setGpaInput] = useState('3.7');
  const [letterInput, setLetterInput] = useState('B+');

  const scale = SCALES[scaleKey];
  const steps = useMemo(() => pointSteps(scale), [scale]);
  const letters = scale.map((b) => b.letter);
  const safeLetter = letters.includes(letterInput) ? letterInput : letters[0];

  const gpaParsed = parseStrictNumber(gpaInput);
  const gpaError =
    gpaInput.trim() === ''
      ? 'Enter a GPA.'
      : gpaParsed === null
        ? 'Use digits only, for example 3.7.'
        : gpaParsed < 0 || gpaParsed > 4.0
          ? 'Enter a GPA between 0 and 4.0.'
          : null;

  const gpaResult = useMemo(() => {
    if (gpaParsed === null || gpaError) return null;
    const exact = steps.find((s) => Math.abs(s.points - gpaParsed) < 0.005);
    if (exact) return { kind: 'exact' as const, letters: exact.letters, points: exact.points };
    const above = steps.filter((s) => s.points > gpaParsed);
    const below = steps.filter((s) => s.points < gpaParsed);
    if (above.length === 0) return { kind: 'top' as const, letters: steps[0].letters, points: steps[0].points };
    if (below.length === 0) return { kind: 'bottom' as const, letters: steps[steps.length - 1].letters, points: steps[steps.length - 1].points };
    return {
      kind: 'between' as const,
      upper: above[above.length - 1],
      lower: below[0],
    };
  }, [gpaParsed, gpaError, steps]);

  const letterPoints = useMemo(() => {
    const band = scale.find((b) => b.letter === safeLetter);
    return band ? band.gpa : null;
  }, [scale, safeLetter]);

  return (
    <div className="space-y-6">
      <section aria-label="GPA and letter grade inputs" className={`${CARD} space-y-5 print:hidden`}>
        <SegmentedControl
          ariaLabel="Conversion direction"
          value={direction}
          onChange={(v) => setDirection(v as Direction)}
          options={[
            { value: 'gpaToLetter', label: 'GPA → letter' },
            { value: 'letterToGpa', label: 'Letter → GPA' },
          ]}
        />
        <SegmentedControl
          ariaLabel="Grading scale"
          value={scaleKey}
          onChange={(v) => setScaleKey(v as ScaleKey)}
          options={[
            { value: 'standard', label: 'A–F' },
            { value: 'plus', label: 'Plus / minus' },
          ]}
        />
        {direction === 'gpaToLetter' ? (
          <div>
            <label className={LABEL} htmlFor="gpa-letter-gpa">GPA (0 – 4.0)</label>
            <input
              id="gpa-letter-gpa"
              className={INPUT}
              inputMode="decimal"
              value={gpaInput}
              onChange={(e) => setGpaInput(e.target.value)}
            />
            {gpaError && <p className={ERROR_TEXT}>{gpaError}</p>}
          </div>
        ) : (
          <div>
            <label className={LABEL} htmlFor="gpa-letter-letter">Letter grade</label>
            <select
              id="gpa-letter-letter"
              className={`${INPUT} appearance-auto cursor-pointer`}
              value={safeLetter}
              onChange={(e) => setLetterInput(e.target.value)}
            >
              {letters.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        )}
        <p className="text-sm text-slate-600 m-0">
          Schools differ: some value A+ at 4.33 and some use whole letters only. The A–F tab covers
          whole-letter schools; check your school’s scale for official transcripts.
        </p>
      </section>

      <section aria-label="Conversion result" className={RESULT_BOX}>
        {direction === 'gpaToLetter' ? (
          gpaResult?.kind === 'exact' ? (
            <p className="m-0 text-lg font-bold text-slate-900 ">
              {gpaParsed!.toFixed(2)} GPA = {gpaResult.letters.join(' / ')} on the {scaleKey === 'plus' ? 'plus / minus' : 'A–F'} scale.
            </p>
          ) : gpaResult?.kind === 'between' ? (
            <p className="m-0 text-lg font-bold text-slate-900 ">
              {gpaParsed!.toFixed(2)} GPA falls between {gpaResult.lower.letters.join(' / ')} ({gpaResult.lower.points.toFixed(2)}) and{' '}
              {gpaResult.upper.letters.join(' / ')} ({gpaResult.upper.points.toFixed(2)}).
            </p>
          ) : gpaResult ? (
            <p className="m-0 text-lg font-bold text-slate-900 ">
              {gpaParsed!.toFixed(2)} GPA = {gpaResult.letters.join(' / ')} — the {gpaResult.kind === 'top' ? 'highest' : 'lowest'} grade on this scale.
            </p>
          ) : (
            <p className="m-0 text-slate-600 ">Enter a GPA between 0 and 4.0 to convert it.</p>
          )
        ) : letterPoints !== null ? (
          <p className="m-0 text-lg font-bold text-slate-900 ">
            {safeLetter} = {letterPoints.toFixed(2)} grade points on the {scaleKey === 'plus' ? 'plus / minus' : 'A–F'} scale.
          </p>
        ) : (
          <p className="m-0 text-slate-600 ">Pick a letter grade to see its grade points.</p>
        )}
        {direction === 'gpaToLetter' && gpaResult?.kind === 'between' && (
          <p className="m-0 mt-2 text-sm text-slate-600 ">
            A GPA is an average, so it rarely lands exactly on a letter’s point value. Your transcript
            shows the letter; this tells you which two letters your average sits between.
          </p>
        )}
      </section>

      <section aria-label="Grade point table" className="max-w-4xl">
        <h3 className="text-base font-bold text-slate-900 m-0 mb-2">
          {scaleKey === 'plus' ? 'Plus / minus' : 'A–F'} scale: letter to grade points
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 ">
          <table className="w-full text-left text-sm border-collapse bg-white ">
            <thead>
              <tr className="bg-slate-50 text-slate-800 ">
                <th scope="col" className="px-4 py-2.5 font-bold">Letter</th>
                <th scope="col" className="px-4 py-2.5 font-bold">Grade points</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s) => (
                <tr key={s.points} className="border-t border-slate-200 text-slate-900 ">
                  <th scope="row" className="px-4 py-2 font-bold">{s.letters.join(' / ')}</th>
                  <td className="px-4 py-2 font-mono tabular-nums">{s.points.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default GpaLetterTool;
