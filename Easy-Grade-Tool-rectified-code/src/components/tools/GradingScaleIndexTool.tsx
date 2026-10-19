import React from 'react';
import { Link } from '../SlashLink';
import { GRADING_SCALE_SIZES, gradingScalePath } from '../../data/gradingScaleSizes';
import { CARD } from './ui';

/** Hub for every /grading-scale/N-questions/ page. */
export const GradingScaleIndexTool: React.FC = () => (
  <section aria-label="Choose a test size" className={CARD}>
    <h2 className="m-0 mb-1">Choose the number of questions</h2>
    <p className="text-sm text-ink-2 mt-0 mb-4">Each link opens a chart with the percentage and letter grade for every score.</p>
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 list-none p-0 m-0">
      {GRADING_SCALE_SIZES.map((n) => (
        <li key={n}>
          <Link
            to={gradingScalePath(n)}
            className="flex flex-col justify-center min-h-[48px] rounded-2xl border border-line bg-surface px-4 py-3 hover:border-brand-600 transition-colors no-underline"
          >
            <span className="font-bold text-ink">{n} questions</span>
            <span className="text-xs text-ink-2 tabular-nums">{Number((100 / n).toFixed(2))}% each</span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default GradingScaleIndexTool;
