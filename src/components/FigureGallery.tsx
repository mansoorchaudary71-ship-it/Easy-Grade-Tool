import React from 'react';
import { resolveAssetUrl } from '../data/guideImages';
import { FIGURE_WIDTH, FIGURE_HEIGHT, type FigureSpec } from '../data/pageFigures';

interface FigureGalleryProps {
  heading: string;
  figures: FigureSpec[];
}

/** Row of captioned figures. Every <img> has descriptive alt text, fixed dimensions (no layout shift) and lazy loading. */
export const FigureGallery: React.FC<FigureGalleryProps> = ({ heading, figures }) => {
  if (figures.length === 0) return null;
  return (
    <section aria-label={heading} className="max-w-5xl space-y-3 print:hidden content-auto">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((fig) => (
          <figure key={fig.file} className="m-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img
              src={resolveAssetUrl(`images/${fig.file}`)}
              alt={fig.alt}
              width={FIGURE_WIDTH}
              height={FIGURE_HEIGHT}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
            <figcaption className="px-3 py-2 text-sm text-slate-600">{fig.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default FigureGallery;
