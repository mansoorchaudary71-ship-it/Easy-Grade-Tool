import React, { useMemo, useState } from 'react';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Link } from '../SlashLink';
import { parseStrictNumber, roundTo } from '../../utils/academicMath';
import { CARD, INPUT, LABEL, RESULT_BOX } from './ui';

/** Blank -> NaN (invalid), never 0. Decimal commas are accepted. */
const toNum = (v: string): number => {
  const n = parseStrictNumber(v);
  return n === null ? NaN : n;
};

type Mode = 'sgpa' | 'pct-gpa' | 'gpa-pct' | 'cgpa';

/**
 * One hub for the four conversions students actually look up: SGPA to
 * percentage (×10), percentage to 4.0 GPA (÷25), 4.0 GPA to percentage (×25)
 * and CGPA to percentage (×10, or ×9.5 on the CBSE pattern). These are
 * generic linear conversions, not any university’s ordinance: where a
 * university publishes its own formula, that formula wins, and the
 * university pages linked below carry it.
 */
export const GpaConverterTool: React.FC = () => {
  const [mode, setMode] = useState<Mode>('sgpa');
  const [value, setValue] = useState('8.2');
  const [cgpaScale, setCgpaScale] = useState<'10' | '9.5'>('10');

  const v = toNum(value);
  const valid =
    Number.isFinite(v) &&
    (mode === 'pct-gpa' || mode === 'gpa-pct' ? v >= 0 && v <= 100 : true) &&
    (mode === 'gpa-pct' ? v >= 0 && v <= 4.0 : true) &&
    (mode === 'sgpa' || mode === 'cgpa' ? v >= 0 && v <= 10 : true);

  const out = useMemo(() => {
    if (!valid) return null;
    switch (mode) {
      case 'sgpa':
        return { label: 'Percentage', text: `${roundTo(v * 10, 2)}%`, formula: 'SGPA × 10' };
      case 'pct-gpa':
        return { label: 'GPA (4.0 scale)', text: roundTo(v / 25, 2).toFixed(2), formula: 'Percentage ÷ 25' };
      case 'gpa-pct':
        return { label: 'Percentage', text: `${roundTo(v * 25, 2)}%`, formula: 'GPA × 25' };
      case 'cgpa':
        return {
          label: 'Percentage',
          text: `${roundTo(v * parseFloat(cgpaScale), 2)}%`,
          formula: `CGPA × ${cgpaScale}`,
        };
    }
  }, [valid, mode, v, cgpaScale]);

  const inputLabel =
    mode === 'sgpa'
      ? 'SGPA (10-point scale)'
      : mode === 'pct-gpa'
        ? 'Percentage (0–100)'
        : mode === 'gpa-pct'
          ? 'GPA (4.0 scale)'
          : 'CGPA (10-point scale)';

  const error = !valid
    ? 'Check the number: SGPA and CGPA run 0–10, percentages run 0–100, and 4.0-scale GPA runs 0–4.0.'
    : null;

  return (
    <div className="space-y-6">
      <div className={CARD}>
        <SegmentedControl
          value={mode}
          onChange={(m) => setMode(m as Mode)}
          options={[
            { value: 'sgpa', label: 'SGPA → %' },
            { value: 'pct-gpa', label: '% → GPA' },
            { value: 'gpa-pct', label: 'GPA → %' },
            { value: 'cgpa', label: 'CGPA → %' },
          ]}
        />
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={LABEL} htmlFor="conv-value">{inputLabel}</label>
            <input
              id="conv-value"
              className={INPUT}
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={mode === 'sgpa' || mode === 'cgpa' ? '8.2' : mode === 'pct-gpa' ? '82' : '3.28'}
            />
          </div>
          {mode === 'cgpa' && (
            <div>
              <label className={LABEL} htmlFor="conv-scale">Conversion pattern</label>
              <SegmentedControl
                value={cgpaScale}
                onChange={(s) => setCgpaScale(s as '10' | '9.5')}
                options={[
                  { value: '10', label: '× 10 (standard)' },
                  { value: '9.5', label: '× 9.5 (CBSE)' },
                ]}
              />
            </div>
          )}
        </div>
        {error ? (
          <p className="text-sm text-rose-700 m-0 mt-4">{error}</p>
        ) : (
          out && (
            <div className={`${RESULT_BOX} mt-4 space-y-2`}>
              <p className="m-0 text-sm text-slate-600">{out.label}</p>
              <p className="m-0 text-4xl font-bold text-slate-900">{out.text}</p>
              <p className="m-0 text-sm text-slate-700">Formula: {out.formula}.</p>
            </div>
          )
        )}
      </div>
      <p className="text-sm text-slate-500 m-0">
        Generic conversions are estimates. If your university publishes its own formula, use the{' '}
        <Link to="/cgpa-to-percentage-calculator/" className="underline">CGPA to percentage calculator</Link>{' '}
        or that university’s own page instead — an official transcript follows the ordinance, not the ×10 shortcut.
      </p>
    </div>
  );
};

export default GpaConverterTool;
