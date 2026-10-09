import React from 'react';
import { TOOL_GUIDE_CONTENT, ToolGuideKey, GuideRun, GuideBlock } from '../data/toolGuideContent';
import { SemanticGuideImage } from './SemanticGuideImage';

/** Same type scale as the homepage / weighted guide (QuickGradeGuide.tsx, EducationalGuide.tsx). */
const H2_MAIN = 'text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 tracking-tight';
const H2 = 'text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight';
const H3 = 'text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100';
const P = 'text-slate-600 dark:text-slate-300 leading-relaxed mb-4';
const OL = 'list-decimal pl-6 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed mb-4';
const UL = 'list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed mb-4';

const Runs: React.FC<{ runs: GuideRun[] }> = ({ runs }) => (
  <>
    {runs.map((r, i) => (r[1] ? <strong key={i}>{r[0]}</strong> : <React.Fragment key={i}>{r[0]}</React.Fragment>))}
  </>
);

export interface ToolContentGuideProps {
  guide: ToolGuideKey;
}

/**
 * Content section for the five grade tools. The first block is the guide title (rendered as the
 * card's H2) and the photo sits directly under it, exactly like the other tools' guides.
 */
export const ToolContentGuide: React.FC<ToolContentGuideProps> = ({ guide }) => {
  const content = TOOL_GUIDE_CONTENT[guide];
  const titleId = `${guide}-guide-title`;
  const [first, ...rest] = content.blocks;
  const title = first && first.t === 'title' ? first.text : '';
  const body: GuideBlock[] = first && first.t === 'title' ? rest : content.blocks;

  // The first paragraph is the lead-in and stays with the title and photo.
  const leadIndex = body.findIndex((b) => b.t === 'p');
  const lead = leadIndex === 0 ? body[0] : null;
  const remaining = lead ? body.slice(1) : body;

  const renderBlock = (b: GuideBlock, i: number) => {
    switch (b.t) {
      case 'h2':
        return <h2 key={i} className={H2} style={{ marginTop: 32 }}>{b.text}</h2>;
      case 'h3':
        return <h3 key={i} className={H3}>{b.text}</h3>;
      case 'p':
        return <p key={i} className={P}><Runs runs={b.runs} /></p>;
      case 'ol':
        return (
          <ol key={i} className={OL}>
            {b.items.map((it, j) => (<li key={j}><Runs runs={it} /></li>))}
          </ol>
        );
      case 'ul':
        return (
          <ul key={i} className={UL}>
            {b.items.map((it, j) => (<li key={j}><Runs runs={it} /></li>))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <section
      className="seo-content w-full max-w-4xl mx-auto content-auto print:hidden"
      aria-labelledby={titleId}
      data-tool-guide={guide}
    >
      <article className="seo-article bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 border border-white/60 dark:border-white/10 shadow-sm rounded-3xl p-6 sm:p-10 font-sans">
        <div>
          <h2 id={titleId} className={H2_MAIN}>{title}</h2>
          <div className="my-6">
            <SemanticGuideImage toolKey={content.imageKey} alt={content.imageAlt} />
          </div>
          {lead && lead.t === 'p' && <p className={P}><Runs runs={lead.runs} /></p>}
        </div>
        {remaining.map(renderBlock)}
      </article>
    </section>
  );
};

export default ToolContentGuide;
