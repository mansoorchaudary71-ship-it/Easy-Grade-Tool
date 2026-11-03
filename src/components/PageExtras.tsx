import React from 'react';
import { Link } from './SlashLink';
import { FigureGallery } from './FigureGallery';
import { getCoreEntry } from '../data/coreFigures';

/**
 * Extra on-page SEO blocks for the pages whose content lives in their own component (home, weighted grade,
 * GPA, CGPA, tip, percentage, loan, mortgage, password, final exam): a figure row with descriptive alt text and,
 * where a page had fewer than three internal links, a related-calculators block.
 * Registry pages (ToolPage) render their own figures, so this returns null for them.
 */
export const PageExtras: React.FC<{ pathname: string }> = ({ pathname }) => {
  const entry = getCoreEntry(pathname);
  if (!entry) return null;
  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 pb-8 sm:pb-12">
      <FigureGallery heading={entry.heading} figures={entry.figures} />
      {entry.related && entry.related.length > 0 && (
        <section aria-label="Related calculators" className="max-w-5xl space-y-3 print:hidden content-auto">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">Related calculators</h2>
          <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
            {entry.related.map((r) => (
              <li key={r.path}>
                <Link
                  to={r.path}
                  className="glow-surface block h-full rounded-2xl border border-slate-200 bg-white p-4 hover:border-teal-600 transition-colors no-underline"
                >
                  <span className="block font-bold text-slate-900">{r.label}</span>
                  <span className="block text-sm text-slate-600">{r.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default PageExtras;
