import React, { useMemo, useState } from 'react';
import { parseStrictNumber } from '../../utils/academicMath';
import type { CgpaUniversity } from '../../data/cgpaUniversities';
import { CARD, ERROR_TEXT, INPUT, LABEL, RESULT_BOX } from './ui';

export interface UniversityCgpaToolProps {
  university: CgpaUniversity;
}

/**
 * Single-university CGPA converter. The formula comes from the university's own
 * entry in src/data/cgpaUniversities.ts — this component never invents one.
 */
export const UniversityCgpaTool: React.FC<UniversityCgpaToolProps> = ({ university }) => {
  const [cgpaInput, setCgpaInput] = useState('8.5');
  const parsed = parseStrictNumber(cgpaInput);
  const error =
    cgpaInput.trim() === ''
      ? 'Enter a CGPA.'
      : parsed === null
        ? 'Use digits only, for example 8.5.'
        : parsed < 0 || parsed > 10
          ? 'Enter a CGPA between 0 and 10.'
          : null;

  const percentage = useMemo(() => {
    if (parsed === null || error) return null;
    try {
      const value = university.compute(parsed);
      return Number.isFinite(value) ? value : null;
    } catch {
      return null;
    }
  }, [parsed, error, university]);

  const backToCgpa = useMemo(() => {
    if (percentage === null) return null;
    try {
      const value = university.inverse(percentage);
      return Number.isFinite(value) ? value : null;
    } catch {
      return null;
    }
  }, [percentage, university]);

  return (
    <div className="space-y-6">
      <section aria-label={`${university.name} CGPA inputs`} className={`${CARD} space-y-5 print:hidden`}>
        <div>
          <label className={LABEL} htmlFor="uni-cgpa">CGPA (0 – 10)</label>
          <input
            id="uni-cgpa"
            className={INPUT}
            inputMode="decimal"
            value={cgpaInput}
            onChange={(e) => setCgpaInput(e.target.value)}
          />
          {error && <p className={ERROR_TEXT}>{error}</p>}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 m-0">
          Formula: <strong className="text-slate-900 dark:text-white">{university.formulaLabel}</strong>
          <br />
          {university.sourceNote}
        </p>
      </section>

      <section aria-label="Conversion result" className={RESULT_BOX}>
        {percentage !== null ? (
          <>
            <p className="m-0 text-lg font-bold text-slate-900 dark:text-white">
              {parsed!.toFixed(2)} CGPA at {university.name} = {percentage.toFixed(2)}%.
            </p>
            {backToCgpa !== null && (
              <p className="m-0 mt-2 text-sm text-slate-600 dark:text-slate-400">
                Check: {percentage.toFixed(2)}% converts back to {backToCgpa.toFixed(2)} CGPA.
              </p>
            )}
          </>
        ) : (
          <p className="m-0 text-slate-600 dark:text-slate-400">Enter a CGPA between 0 and 10 to convert it.</p>
        )}
        <p className="m-0 mt-3 text-sm text-slate-600 dark:text-slate-400">
          University ordinances change. For an official transcript, confirm the current formula with
          the university — this page follows the ordinance noted above.
        </p>
      </section>
    </div>
  );
};

export default UniversityCgpaTool;
