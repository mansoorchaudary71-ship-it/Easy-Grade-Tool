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
import { GuideArticle, GUIDE_ARTICLES } from './GuideArticle';
import { FAQ, PAGE_FAQ_HEADINGS } from './FAQ';

const TOOLS: Record<ToolPageSlug, React.ComponentType> = {
  'test-grade-calculator': TestGradeTool,
  'grade-curve-calculator': GradeCurveTool,
  'letter-grade-calculator': LetterGradeTool,
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
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400 print:hidden">
          <ol className="flex flex-wrap items-center gap-1.5 list-none p-0 m-0">
            <li><Link to="/" className="hover:underline">Easy Grade Tool</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link to="/grade-calculator/" className="hover:underline">Grade calculators</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="font-semibold text-slate-700 dark:text-slate-200">{entry.navLabel}</li>
          </ol>
        </nav>
        <span className="inline-block text-[11px] font-mono font-bold tracking-widest uppercase text-teal-700 dark:text-teal-400">{entry.badge}</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance] m-0">{entry.h1}</h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl m-0">{entry.intro}</p>
      </header>

      <section aria-label={`${entry.h1} tool`} data-print-area data-print-title={entry.h1}>
        <Tool />
      </section>

      <div className="grid gap-10 content-auto">
        {entry.sections.map((s) => (
          <section key={s.heading} className="space-y-3 max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white m-0">{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 m-0">{p}</p>
            ))}
            {s.bullets && (
              <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                {s.bullets.map((b) => (<li key={b}>{b}</li>))}
              </ul>
            )}
          </section>
        ))}

        <section className={`glow-surface ${'max-w-3xl'} rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 sm:p-7 space-y-3`}>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white m-0">{entry.example.heading}</h2>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 m-0">{entry.example.scenario}</p>
          <dl className="grid gap-2 m-0">
            {entry.example.rows.map((r) => (
              <div key={r.label} className="flex flex-wrap justify-between gap-x-4 border-t border-slate-200/70 dark:border-slate-800 pt-2">
                <dt className="text-sm text-slate-600 dark:text-slate-400">{r.label}</dt>
                <dd className="text-sm font-bold font-mono text-slate-900 dark:text-white m-0">{r.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 m-0">{entry.example.takeaway}</p>
        </section>
      </div>

      <GuideArticle article={GUIDE_ARTICLES[slug]} className="max-w-4xl content-auto" />

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
