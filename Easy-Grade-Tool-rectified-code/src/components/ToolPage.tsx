import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from './SlashLink';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { TOOL_PAGES, ToolPageSlug, toolPageCanonical } from '../data/toolPages';
import { OG_IMAGES } from '../data/seoConfig';
import { ACADEMIC_REVIEWER, CONTENT_REVIEWED_ON, SITE_OWNER } from '../data/siteIdentity';
import { TestGradeTool } from './tools/TestGradeTool';
import { GradeCurveTool } from './tools/GradeCurveTool';
import { LetterGradeTool } from './tools/LetterGradeTool';
import { AverageGradeTool } from './tools/AverageGradeTool';
import { WeightedGpaTool } from './tools/WeightedGpaTool';
import { MissCalculatorTool } from './tools/MissCalculatorTool';
import { GradingScaleIndexTool } from './tools/GradingScaleIndexTool';
import { QuestionCountChartTool } from './tools/QuestionCountChartTool';
import { FAQ, PAGE_FAQ_HEADINGS } from './FAQ';
import { ToolContentGuide } from './ToolContentGuide';
import { ToolGuideKey } from '../data/toolGuideContent';

const TOOLS: Record<string, React.ComponentType> = {
  'test-grade-calculator': TestGradeTool,
  'grade-curve-calculator': GradeCurveTool,
  'letter-grade-calculator': LetterGradeTool,
  'average-grade-calculator': AverageGradeTool,
  'weighted-gpa-calculator': WeightedGpaTool,
  'how-many-questions-can-i-miss': MissCalculatorTool,
  'grading-scale': GradingScaleIndexTool,
};

/** Pages that have a long-form guide. Generated pages carry their own sections instead. */
const GUIDES: Record<string, ToolGuideKey> = {
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
  const Tool: React.ComponentType | undefined = TOOLS[slug];
  const guideKey = GUIDES[slug];
  // Same ids the prerender step uses for the FAQPage schema, so visible FAQs and structured data always match.
  const faqItems = entry.faqs.map((f, i) => ({ id: `${slug}-faq-${i}`, category: slug, question: f.question, answer: f.answer }));

  return (
    <article className="flex flex-col gap-8 sm:gap-10">
      <SEO
        title={entry.title}
        description={entry.metaDescription}
        canonicalUrl={toolPageCanonical(entry)}
        ogImage={entry.ogImage ?? OG_IMAGES.quick}
        keywords={entry.keywords}
        featureList={entry.featureList}
        applicationCategory="EducationalApplication"
        schemaType={entry.schemaType}
        name={entry.h1}
        breadcrumbLabel={entry.navLabel}
      />

      <ToolHeading badge={entry.navLabel} title={entry.h1} description={entry.intro} />

      {(entry.questions || Tool) && (
        <section aria-label={`${entry.h1} tool`} data-print-area data-print-title={entry.h1}>
          {entry.questions ? <QuestionCountChartTool questions={entry.questions} /> : Tool ? <Tool /> : null}
        </section>
      )}

      {entry.lookupTables?.map((table) => (
        <section key={table.heading} aria-label={table.heading} className="max-w-4xl space-y-3">
          <h2 className="m-0">{table.heading}</h2>
          {table.intro && <p className="text-base text-ink-2 leading-relaxed m-0">{table.intro}</p>}
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-left text-sm border-collapse bg-surface">
              <thead>
                <tr className="bg-sunken text-ink">
                  {table.columns.map((c) => (
                    <th key={c} scope="col" className="px-4 py-2.5 font-bold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.join('|')} className="border-t border-line text-ink">
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th key={i} scope="row" className="px-4 py-2 font-bold">{cell}</th>
                      ) : (
                        <td key={i} className="px-4 py-2 tabular-nums">{cell}</td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {guideKey ? (
        <ToolContentGuide guide={guideKey} />
      ) : (
        <div className="max-w-4xl space-y-8">
          {entry.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="m-0">{section.heading}</h2>
              {section.paragraphs.map((para) => (
                <p key={para} className="text-base text-ink-2 leading-relaxed m-0">{para}</p>
              ))}
              {section.bullets && (
                <ul className="m-0 pl-5 list-disc text-base text-ink-2 space-y-1">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <section className="panel p-5 space-y-3">
            <h2 className="m-0">{entry.example.heading}</h2>
            <p className="text-sm text-ink-2 m-0">{entry.example.scenario}</p>
            <dl className="m-0 grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {entry.example.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-line/70 py-1.5">
                  <dt className="text-sm text-ink-2">{row.label}</dt>
                  <dd className="m-0 font-bold tabular-nums text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-ink-2 m-0">{entry.example.takeaway}</p>
          </section>
        </div>
      )}

      <div className="max-w-3xl content-auto">
        <FAQ tool="quick" items={faqItems} heading={entry.faqHeading ?? PAGE_FAQ_HEADINGS[slug]} />
      </div>

      <section aria-label="Related calculators" className="space-y-3 print:hidden content-auto">
        <h2 className="m-0">Related grade calculators</h2>
        <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
          {entry.related.map((r) => (
            <li key={r.path}>
              <Link
                to={r.path}
                className="panel block h-full p-4 hover:border-brand-600 transition-colors no-underline"
              >
                <span className="block font-bold text-ink">{r.label}</span>
                <span className="block text-sm text-ink-2">{r.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="max-w-3xl text-xs text-ink-3 flex items-start gap-2 print:hidden">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-brand" aria-hidden="true" />
        <p className="m-0">
          {SITE_OWNER ? `Built and maintained by ${SITE_OWNER.name}, Easy Grade Tool.` : 'Built and maintained by the Easy Grade Tool team.'}
          {ACADEMIC_REVIEWER ? ` Academic review: ${ACADEMIC_REVIEWER.name}, ${ACADEMIC_REVIEWER.credential}.` : ''}{' '}
          Formulas last checked {formatDate(CONTENT_REVIEWED_ON)}. See the <Link to="/about/" className="underline">methodology and corrections policy</Link>.
          Results are estimates; your teacher’s or school’s grading policy decides your official grade.
        </p>
      </footer>
    </article>
  );
};

export default ToolPage;
