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
import { QuizGradeTool } from './tools/QuizGradeTool';
import { TargetGpaTool } from './tools/TargetGpaTool';
import { GpaConverterTool } from './tools/GpaConverterTool';
import { GradeCalculator } from './GradeCalculator';
import type { AssessmentItem } from '../types';
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
  // Competitor-gap pages (2026-10-28). Assignment and points reuse the
  // test-grade tool: both are points-based grading with different framing
  // copy, and the tool already carries bonus and penalty inputs.
  'quiz-grade-calculator': QuizGradeTool,
  'target-gpa-calculator': TargetGpaTool,
  'gpa-converter': GpaConverterTool,
  'assignment-grade-calculator': TestGradeTool,
  'points-grade-calculator': TestGradeTool,
  'category-grade-calculator': () => (
    <GradeCalculator
      setToast={() => {}}
      initialMode="weighted"
      initialItems={CATEGORY_ROWS}
      hideHeading
      hideSeo
    />
  ),
};

const CATEGORY_ROWS: AssessmentItem[] = [
  { id: 1, name: 'Homework', score: '85', max: '100', weight: '20' },
  { id: 2, name: 'Quizzes', score: '90', max: '100', weight: '30' },
  { id: 3, name: 'Midterm', score: '78', max: '100', weight: '20' },
  { id: 4, name: 'Final', score: '88', max: '100', weight: '30' },
];

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

/** Journey steps per tool page, worded distinctly per page so banner text stays
    unique across programmatic pages (CHK-08 uniqueness). */
const JOURNEY_STEPS: Record<string, { title: string; sub: string }[]> = {
  'test-grade-calculator': [
    { title: 'Enter total and wrong answers', sub: 'One test, any size.' },
    { title: 'See the percentage and letter grade', sub: 'Instant, for every score.' },
    { title: 'Print the chart or save as PDF', sub: 'Take it to class.' },
  ],
  'grade-curve-calculator': [
    { title: 'Enter your raw scores', sub: 'A list, or one score.' },
    { title: 'See the curved grades instantly', sub: 'Flat, scale-top, or root curve.' },
    { title: 'Print or save the curve', sub: 'Share it with your class.' },
  ],
  'letter-grade-calculator': [
    { title: 'Enter a percentage score', sub: 'Any value from 0 to 100.' },
    { title: 'See the matching letter grade', sub: 'Standard or plus/minus scale.' },
    { title: 'Use it straight in your gradebook', sub: 'No account, no wait.' },
  ],
  'average-grade-calculator': [
    { title: 'Enter your scores', sub: 'As many as you like.' },
    { title: 'See the average instantly', sub: 'Mean, median, and range.' },
    { title: 'Print or save the result', sub: 'Keep it for your records.' },
  ],
  'weighted-gpa-calculator': [
    { title: 'Enter assessments and weights', sub: 'Tests, homework, projects.' },
    { title: 'See the weighted grade', sub: 'Updated as you type.' },
    { title: 'Simulate your final-exam score', sub: 'Know exactly what you need.' },
  ],
  'semester-gpa-calculator': [
    { title: 'Enter your semester courses', sub: 'Grades and credit hours.' },
    { title: 'See your semester GPA', sub: 'On the 4.0 scale.' },
    { title: 'Set next semester\u2019s target', sub: 'Plan the grades you need.' },
  ],
  'cumulative-gpa-calculator': [
    { title: 'Enter your completed semesters', sub: 'GPA and credits each term.' },
    { title: 'See your cumulative GPA', sub: 'Across every semester.' },
    { title: 'Track progress toward graduation', sub: 'Watch it move each term.' },
  ],
  'high-school-gpa-calculator': [
    { title: 'Enter your high-school classes', sub: 'AP, honors, and regular.' },
    { title: 'See your weighted high-school GPA', sub: 'With level weighting applied.' },
    { title: 'Plan for college applications', sub: 'Know where you stand.' },
  ],
  'college-gpa-calculator': [
    { title: 'Enter your college courses', sub: 'Grades and credit hours.' },
    { title: 'See your college GPA', sub: 'On the 4.0 scale.' },
    { title: 'Keep your degree plan on track', sub: 'Spot trouble a term early.' },
  ],
  'final-grade-planner': [
    { title: 'Enter your classes and targets', sub: 'Up to 10 classes at once.' },
    { title: 'See what each class needs', sub: 'Per-class required scores.' },
    { title: 'Spot impossible targets early', sub: 'Flagged honestly, not hidden.' },
  ],
  'how-many-questions-can-i-miss': [
    { title: 'Pick your test size', sub: 'Any number of questions.' },
    { title: 'See how many you can miss', sub: 'For every grade boundary.' },
    { title: 'Print the chart for class', sub: 'One page, every row.' },
  ],
  'grading-scale': [
    { title: 'Pick a test size', sub: 'From 5 to 200 questions.' },
    { title: 'See every score\u2019s grade', sub: 'Percentage and letter, row by row.' },
    { title: 'Save the chart as a PDF', sub: 'Or print it for the wall.' },
  ],
  'gpa-to-letter-grade': [
    { title: 'Enter a GPA value', sub: 'Any 4.0-scale number.' },
    { title: 'See the matching letter grade', sub: 'Converted instantly.' },
    { title: 'Use it for applications', sub: 'Forms, resumes, transcripts.' },
  ],
  'letter-grade-to-gpa': [
    { title: 'Enter a letter grade', sub: 'From A+ down to F.' },
    { title: 'See the GPA value', sub: 'Converted instantly.' },
    { title: 'Use it on applications and forms', sub: 'Transcripts, jobs, admissions.' },
  ],
  'for-schools': [
    { title: 'Pick a calculator to embed', sub: 'Any tool on the site.' },
    { title: 'Copy one line of code', sub: 'Paste it on your school page.' },
    { title: 'It runs free on your site', sub: 'No account, no branding deals.' },
  ],
  'target-gpa-calculator': [
    { title: 'Enter your current GPA and credits', sub: 'Where you stand today.' },
    { title: 'Set the target and remaining credits', sub: 'Where you want to finish.' },
    { title: 'See the average you must hit', sub: 'Or the honest impossible flag.' },
  ],
  'quiz-grade-calculator': [
    { title: 'Enter questions and misses', sub: 'Any quiz size, halves allowed.' },
    { title: 'See the percent and letter grade', sub: 'Plus the miss allowance table.' },
    { title: 'Check what one more miss costs', sub: 'Before the next quiz.' },
  ],
  'assignment-grade-calculator': [
    { title: 'Enter points earned and possible', sub: 'Any assignment size.' },
    { title: 'Add the late penalty and bonus', sub: 'Both applied at once.' },
    { title: 'See the adjusted grade', sub: 'With the unadjusted score beside it.' },
  ],
  'points-grade-calculator': [
    { title: 'Enter points earned and possible', sub: 'Any total, any subject.' },
    { title: 'See the percent and letter grade', sub: 'Instant, no setup.' },
    { title: 'Find the points for the next grade', sub: 'A concrete revision target.' },
  ],
  'category-grade-calculator': [
    { title: 'Enter each category average', sub: 'Homework, quizzes, tests.' },
    { title: 'Set the syllabus weights', sub: 'Copied from your course outline.' },
    { title: 'See the course grade and contributions', sub: 'Which category drags it down.' },
  ],
  'gpa-converter': [
    { title: 'Pick a conversion direction', sub: 'SGPA, CGPA, percent, or 4.0 GPA.' },
    { title: 'Enter the value to convert', sub: 'One field, one answer.' },
    { title: 'Check the university formula', sub: 'Before using it officially.' },
  ],
};

const CGPA_STEPS: { title: string; sub: string }[] = [
  { title: 'Enter your CGPA', sub: 'On your university\u2019s scale.' },
  { title: 'See the percentage instantly', sub: 'By the verified formula.' },
  { title: 'Use it for applications and forms', sub: 'Jobs, admissions, visas.' },
];

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

      <ToolHeading
        badge={entry.navLabel}
        title={entry.h1}
        description={entry.intro}
        steps={JOURNEY_STEPS[slug] ?? (slug.startsWith('cgpa-to-percentage/') ? CGPA_STEPS : undefined)}
      />

      <p className="max-w-4xl text-sm text-slate-500 -mt-6 m-0">
        {SITE_OWNER ? <>By <span className="font-semibold text-slate-700 ">{SITE_OWNER.name}</span>, {SITE_OWNER.jobTitle.toLowerCase()} · </> : null}
        Last updated {formatDate(CONTENT_REVIEWED_ON)}
      </p>

      {(entry.questions || Tool) && (
        <section aria-label={`${entry.h1} tool`} data-print-area data-print-title={entry.h1}>
          {entry.questions ? <QuestionCountChartTool questions={entry.questions} /> : Tool ? <Tool /> : null}
        </section>
      )}

      {entry.lookupTables?.map((table) => (
        <section key={table.heading} aria-label={table.heading} className="max-w-4xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">{table.heading}</h2>
          {table.intro && <p className="text-base text-slate-700 leading-relaxed m-0">{table.intro}</p>}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 ">
            <table className="w-full text-left text-sm border-collapse bg-white ">
              <thead>
                <tr className="bg-slate-50 text-slate-800 ">
                  {table.columns.map((c) => (
                    <th key={c} scope="col" className="px-4 py-2.5 font-bold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.join('|')} className="border-t border-slate-200 text-slate-900 ">
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
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">{section.heading}</h2>
              {section.paragraphs.map((para) => (
                <p key={para} className="text-base text-slate-700 leading-relaxed m-0">{para}</p>
              ))}
              {section.bullets && (
                <ul className="m-0 pl-5 list-disc text-base text-slate-700 space-y-1">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 m-0">{entry.example.heading}</h2>
            <p className="text-sm text-slate-700 m-0">{entry.example.scenario}</p>
            <dl className="m-0 grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {entry.example.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-slate-200/70 py-1.5">
                  <dt className="text-sm text-slate-700 ">{row.label}</dt>
                  <dd className="m-0 font-bold font-mono text-slate-900 ">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-slate-700 m-0">{entry.example.takeaway}</p>
          </section>
        </div>
      )}

      <div className="max-w-4xl content-auto">
        <FAQ tool="quick" items={faqItems} heading={entry.faqHeading ?? PAGE_FAQ_HEADINGS[slug]} />
      </div>

      <section aria-label="Related calculators" className="space-y-3 print:hidden content-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">Related grade calculators</h2>
        <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
          {entry.related.map((r) => (
            <li key={r.path}>
              <Link
                to={r.path}
                className="glow-surface block h-full rounded-2xl border border-slate-200 bg-white p-4 hover:border-teal-600 transition-colors no-underline"
              >
                <span className="block font-bold text-slate-900 ">{r.label}</span>
                <span className="block text-sm text-slate-600 ">{r.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="max-w-3xl text-xs text-slate-500 flex items-start gap-2 print:hidden">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-teal-700 " aria-hidden="true" />
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
