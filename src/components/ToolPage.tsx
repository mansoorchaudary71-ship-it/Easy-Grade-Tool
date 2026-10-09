import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from './SlashLink';
import { SEO } from './SEO';
import { TOOL_PAGES, ToolPageSlug, toolPageCanonical } from '../data/toolPages';
import { OG_IMAGES } from '../data/seoConfig';
import { ACADEMIC_REVIEWER, CONTENT_REVIEWED_ON } from '../data/siteIdentity';
import { TestGradeTool } from './tools/TestGradeTool';
import { GradeCurveTool } from './tools/GradeCurveTool';
import { LetterGradeTool } from './tools/LetterGradeTool';
import { FAQ, PAGE_FAQ_HEADINGS } from './FAQ';
import { ToolContentGuide } from './ToolContentGuide';
import { ToolGuideKey } from '../data/toolGuideContent';

const TOOLS: Record<ToolPageSlug, React.ComponentType> = {
  'test-grade-calculator': TestGradeTool,
  'grade-curve-calculator': GradeCurveTool,
  'letter-grade-calculator': LetterGradeTool,
};

const GUIDES: Record<ToolPageSlug, ToolGuideKey> = {
  'test-grade-calculator': 'test-grade',
  'grade-curve-calculator': 'grade-curve',
  'letter-grade-calculator': 'letter-grade',
};

export interface ToolPageProps {
  slug: ToolPageSlug;
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const ToolPage: React.FC<ToolPageProps> = ({ slug }) => {
  const entry = TOOL_PAGES[slug];
  const Tool = TOOLS[slug];
  // Same ids the prerender step uses for the FAQPage schema, so visible FAQs and structured data always match.
  const faqItems = entry.faqs.map((f, i) => ({ id: `${slug}-faq-${i}`, category: slug, question: f.question, answer: f.answer }));

  return (
    <article className="w-full max-w-5xl mx-auto py-4 sm:py-8 font-sans space-y-10 sm:space-y-14">
      <SEO
        title={entry.title}
        description={entry.metaDescription}
        canonicalUrl={toolPageCanonical(entry)}
        ogImage={OG_IMAGES.quick}
        keywords={entry.keywords}
        featureList={entry.featureList}
        applicationCategory="EducationalApplication"
      />

      <header className="space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance] m-0">{entry.h1}</h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl m-0">{entry.intro}</p>
      </header>

      <section aria-label={`${entry.h1} tool`} data-print-area data-print-title={entry.h1}>
        <Tool />
      </section>

      <ToolContentGuide guide={GUIDES[slug]} />

      <div className="max-w-4xl content-auto">
        <FAQ tool="quick" items={faqItems} heading={PAGE_FAQ_HEADINGS[slug]} />
      </div>

      <section aria-label="Related calculators" className="space-y-3 print:hidden content-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white m-0">Related grade calculators</h2>
        <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
          {entry.related.map((r) => (
            <li key={r.path}>
              <Link
                to={r.path}
                className="glow-surface block h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-teal-600 transition-colors no-underline"
              >
                <span className="block font-bold text-slate-900 dark:text-white">{r.label}</span>
                <span className="block text-sm text-slate-600 dark:text-slate-400">{r.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="max-w-3xl text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2 print:hidden">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
        <p className="m-0">
          Built and maintained by the Easy Grade Tool team.
          {ACADEMIC_REVIEWER ? ` Academic review: ${ACADEMIC_REVIEWER.name}, ${ACADEMIC_REVIEWER.credential}.` : ''}{' '}
          Formulas last checked {formatDate(CONTENT_REVIEWED_ON)}. See the <Link to="/about/" className="underline">methodology and corrections policy</Link>.
          Results are estimates; your teacher’s or school’s grading policy decides your official grade.
        </p>
      </footer>
    </article>
  );
};

export default ToolPage;
