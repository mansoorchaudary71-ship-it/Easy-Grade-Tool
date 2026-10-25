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
import { SemesterGpaTool } from './tools/SemesterGpaTool';
import { CumulativeGpaTool } from './tools/CumulativeGpaTool';
import { ForSchoolsEmbedTool } from './tools/ForSchoolsEmbedTool';
import { MissCalculatorTool } from './tools/MissCalculatorTool';
import { GradingScaleIndexTool } from './tools/GradingScaleIndexTool';
import { QuestionCountChartTool } from './tools/QuestionCountChartTool';
import { GpaLetterTool } from './tools/GpaLetterTool';
import type { SemesterGpaRow } from './tools/SemesterGpaTool';
import type { WeightedGpaRow } from './tools/WeightedGpaTool';
import { FinalPlannerTool } from './tools/FinalPlannerTool';
import { UniversityCgpaTool } from './tools/UniversityCgpaTool';
import { CGPA_UNIVERSITY_PAGES } from '../data/cgpaUniversityPages';
import { FAQ, PAGE_FAQ_HEADINGS } from './FAQ';
import { ToolContentGuide } from './ToolContentGuide';
import { ToolGuideKey } from '../data/toolGuideContent';

const TOOLS: Record<string, React.ComponentType> = {
  'test-grade-calculator': TestGradeTool,
  'grade-curve-calculator': GradeCurveTool,
  'letter-grade-calculator': LetterGradeTool,
  'average-grade-calculator': AverageGradeTool,
  'weighted-gpa-calculator': WeightedGpaTool,
  'semester-gpa-calculator': SemesterGpaTool,
  'cumulative-gpa-calculator': CumulativeGpaTool,
  'for-schools': ForSchoolsEmbedTool,
  'how-many-questions-can-i-miss': MissCalculatorTool,
  'grading-scale': GradingScaleIndexTool,
  'gpa-to-letter-grade': GpaLetterTool,
  'letter-grade-to-gpa': () => <GpaLetterTool defaultDirection="letterToGpa" />,
  // Wrappers with their own default rows and storage keys, so these pages
  // never render the same tool defaults — or read the same saved rows — as
  // the weighted / semester pages they complement.
  'high-school-gpa-calculator': () => (
    <WeightedGpaTool
      startRows={HIGH_SCHOOL_ROWS}
      storageKey="egt-high-school-gpa-v1"
      inputsLabel="High school GPA inputs"
    />
  ),
  'college-gpa-calculator': () => (
    <SemesterGpaTool
      startRows={COLLEGE_ROWS}
      storageKey="egt-college-gpa-v1"
      inputsLabel="College GPA inputs"
    />
  ),
  'final-grade-planner': FinalPlannerTool,
};

const HIGH_SCHOOL_ROWS: WeightedGpaRow[] = [
  { id: 1, name: 'AP Calculus', letter: 'A', credits: '1', level: 'ap' },
  { id: 2, name: 'Honors English', letter: 'B+', credits: '1', level: 'honors' },
  { id: 3, name: 'US History', letter: 'A', credits: '1', level: 'regular' },
  { id: 4, name: 'AP Biology', letter: 'B', credits: '1', level: 'ap' },
  { id: 5, name: 'Spanish II', letter: 'A', credits: '1', level: 'regular' },
];

const COLLEGE_ROWS: SemesterGpaRow[] = [
  { id: 1, name: 'Biology', letter: 'A', credits: '4' },
  { id: 2, name: 'English Composition', letter: 'A-', credits: '3' },
  { id: 3, name: 'College Algebra', letter: 'B+', credits: '3' },
  { id: 4, name: 'History', letter: 'B', credits: '3' },
  { id: 5, name: 'Art', letter: 'A', credits: '2' },
];

/** One converter per verified university, with that university's formula baked in. */
const UNIVERSITY_TOOLS: Record<string, React.ComponentType> = Object.fromEntries(
  CGPA_UNIVERSITY_PAGES.map((uni) => [
    `cgpa-to-percentage/${uni.id}`,
    () => <UniversityCgpaTool university={uni} />,
  ]),
);

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
  const Tool: React.ComponentType | undefined = TOOLS[slug] ?? UNIVERSITY_TOOLS[slug];
  const guideKey = GUIDES[slug];
  // Same ids the prerender step uses for the FAQPage schema, so visible FAQs and structured data always match.
  const faqItems = entry.faqs.map((f, i) => ({ id: `${slug}-faq-${i}`, category: slug, question: f.question, answer: f.answer }));

  return (
    <article className="w-full max-w-5xl mx-auto py-4 sm:py-8 font-sans space-y-10 sm:space-y-14">
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

      <p className="max-w-4xl text-sm text-slate-500 dark:text-slate-400 -mt-6 m-0">
        {SITE_OWNER ? <>By <span className="font-semibold text-slate-700 dark:text-slate-200">{SITE_OWNER.name}</span>, {SITE_OWNER.jobTitle.toLowerCase()} · </> : null}
        Last updated {formatDate(CONTENT_REVIEWED_ON)}
      </p>

      {(entry.questions || Tool) && (
        <section aria-label={`${entry.h1} tool`} data-print-area data-print-title={entry.h1}>
          {entry.questions ? <QuestionCountChartTool questions={entry.questions} /> : Tool ? <Tool /> : null}
        </section>
      )}

      {entry.lookupTables?.map((table) => (
        <section key={table.heading} aria-label={table.heading} className="max-w-4xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white m-0">{table.heading}</h2>
          {table.intro && <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed m-0">{table.intro}</p>}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm border-collapse bg-white dark:bg-slate-900">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {table.columns.map((c) => (
                    <th key={c} scope="col" className="px-4 py-2.5 font-bold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.join('|')} className="border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th key={i} scope="row" className="px-4 py-2 font-bold">{cell}</th>
                      ) : (
                        <td key={i} className="px-4 py-2 font-mono tabular-nums">{cell}</td>
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
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white m-0">{section.heading}</h2>
              {section.paragraphs.map((para) => (
                <p key={para} className="text-base text-slate-700 dark:text-slate-300 leading-relaxed m-0">{para}</p>
              ))}
              {section.bullets && (
                <ul className="m-0 pl-5 list-disc text-base text-slate-700 dark:text-slate-300 space-y-1">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white m-0">{entry.example.heading}</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 m-0">{entry.example.scenario}</p>
            <dl className="m-0 grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {entry.example.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800 py-1.5">
                  <dt className="text-sm text-slate-700 dark:text-slate-300">{row.label}</dt>
                  <dd className="m-0 font-bold font-mono text-slate-900 dark:text-white">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-slate-700 dark:text-slate-300 m-0">{entry.example.takeaway}</p>
          </section>
        </div>
      )}

      <div className="max-w-4xl content-auto">
        <FAQ tool="quick" items={faqItems} heading={entry.faqHeading ?? PAGE_FAQ_HEADINGS[slug]} />
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
