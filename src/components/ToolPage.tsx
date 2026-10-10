import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from './SlashLink';
import { SEO } from './SEO';
import { TOOL_PAGES, toolPageCanonical } from '../data/toolPages';
import type { ToolPageEntry } from '../data/toolPages';
import { OG_IMAGES } from '../data/seoConfig';
import { ACADEMIC_REVIEWER, CONTENT_REVIEWED_ON } from '../data/siteIdentity';
import { TestGradeTool } from './tools/TestGradeTool';
import { GradeCurveTool } from './tools/GradeCurveTool';
import { LetterGradeTool } from './tools/LetterGradeTool';
import { AverageGradeTool } from './tools/AverageGradeTool';
import { GradingScaleIndexTool } from './tools/GradingScaleIndexTool';
import { QuestionCountChartTool } from './tools/QuestionCountChartTool';
import { FAQ, PAGE_FAQ_HEADINGS } from './FAQ';
import { ToolContentGuide } from './ToolContentGuide';
import { ContentSection } from './GuideShell';
import { ToolGuideKey } from '../data/toolGuideContent';

/**
 * One template for every dedicated academic page:
 *  - core pages (test grade, grade curve, letter grade) show the supplied Word-document guide,
 *  - generated pages (average grade, grading-scale index, /grading-scale/N-questions/) show the
 *    sections + worked example from data/gradingScalePages.ts,
 * and every page ends with the shared FAQ and related-links blocks.
 */

const SIMPLE_TOOLS: Record<string, React.ComponentType> = {
  'test-grade-calculator': TestGradeTool,
  'grade-curve-calculator': GradeCurveTool,
  'letter-grade-calculator': LetterGradeTool,
  'average-grade-calculator': AverageGradeTool,
  'grading-scale': GradingScaleIndexTool,
};

/** Pages whose long-form copy comes from the Word documents (data/toolGuideContent.ts). */
const GUIDES: Record<string, ToolGuideKey> = {
  'test-grade-calculator': 'test-grade',
  'grade-curve-calculator': 'grade-curve',
  'letter-grade-calculator': 'letter-grade',
};

export interface ToolPageProps {
  /** e.g. 'test-grade-calculator', 'average-grade-calculator', 'grading-scale', 'grading-scale/25-questions' */
  slug: string;
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

const H2 = 'text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight first:mt-0';
const P = 'text-slate-600 dark:text-slate-300 leading-relaxed mb-4';
const UL = 'list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed mb-4';

const renderTool = (slug: string, entry: ToolPageEntry): React.ReactNode => {
  if (typeof entry.questions === 'number') return <QuestionCountChartTool questions={entry.questions} />;
  const Tool = SIMPLE_TOOLS[slug];
  return Tool ? <Tool /> : null;
};

/** Sections + worked example for the generated pages. */
const GeneratedContent: React.FC<{ entry: ToolPageEntry }> = ({ entry }) => (
  <ContentSection guide={entry.slug}>
    {entry.sections.map((s) => (
      <React.Fragment key={s.heading}>
        <h2 className={H2}>{s.heading}</h2>
        {s.paragraphs.map((p, i) => (
          <p key={i} className={P}>{p}</p>
        ))}
        {s.bullets && s.bullets.length > 0 && (
          <ul className={UL}>
            {s.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </React.Fragment>
    ))}

    <h2 className={H2}>{entry.example.heading}</h2>
    <p className={P}>{entry.example.scenario}</p>
    <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 mb-4 m-0">
      {entry.example.rows.map((r) => (
        <React.Fragment key={r.label}>
          <dt className="text-sm text-slate-600 dark:text-slate-300">{r.label}</dt>
          <dd className="text-sm font-bold text-slate-900 dark:text-white m-0 text-right">{r.value}</dd>
        </React.Fragment>
      ))}
    </dl>
    <p className={P}>{entry.example.takeaway}</p>
  </ContentSection>
);

export const ToolPage: React.FC<ToolPageProps> = ({ slug }) => {
  const entry = TOOL_PAGES[slug];
  // Unknown slug: render nothing instead of crashing the whole route.
  if (!entry) return null;

  const guide = GUIDES[slug];
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
        {renderTool(slug, entry)}
      </section>

      {guide ? <ToolContentGuide guide={guide} /> : <GeneratedContent entry={entry} />}

      <FAQ tool="quick" items={faqItems} heading={entry.faqHeading ?? PAGE_FAQ_HEADINGS[slug] ?? (slug.startsWith('grading-scale/') ? PAGE_FAQ_HEADINGS['grading-scale'] : undefined)} />

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
