import React, { useId, useRef, useState } from 'react';
import {
  ArrowRight, Calculator, GraduationCap, Banknote, ClipboardCheck, Users,
  ShieldCheck, WifiOff, Printer, Zap,
} from 'lucide-react';
import { Link } from './SlashLink';
import { DecorLines } from './DecorLines';
import { TOOL_GROUPS } from '../data/navItems';
import { preloadForPath } from '../utils/lazyRoutes';

/* -------------------------------------------------------------------------- */
/* Data (every link is an existing page; paths use the trailing-slash form)    */
/* -------------------------------------------------------------------------- */

const CATEGORY_META: Record<string, { icon: typeof Calculator; blurb: string }> = {
  grades: {
    icon: Calculator,
    blurb: 'Weighted grades, the score you need on the final, curves, test scores and letter grades.',
  },
  gpa: {
    icon: GraduationCap,
    blurb: 'GPA, weighted GPA, CGPA to percentage and everyday percentage maths.',
  },
  everyday: {
    icon: Banknote,
    blurb: 'Tip, loan and mortgage calculators, plus a password generator that never leaves your device.',
  },
};

interface Persona {
  id: string;
  tab: string;
  icon: typeof Calculator;
  title: string;
  text: string;
  links: { label: string; path: string }[];
}

const PERSONAS: Persona[] = [
  {
    id: 'students',
    tab: 'Students',
    icon: GraduationCap,
    title: 'Know where you stand before the final',
    text: 'Work out your course grade, see exactly what you need on the final exam and keep your GPA on track.',
    links: [
      { label: 'Weighted grade calculator', path: '/grade-calculator/' },
      { label: 'Final exam grade calculator', path: '/final-exam-grade-calculator/' },
      { label: 'GPA calculator', path: '/gpa-calculator/' },
    ],
  },
  {
    id: 'teachers',
    tab: 'Teachers',
    icon: ClipboardCheck,
    title: 'Grade a stack of tests in minutes',
    text: 'Look up the percentage and letter grade for every number of wrong answers, then print the chart or save it as a PDF.',
    links: [
      { label: 'Quick Grade chart', path: '/' },
      { label: 'Grading scale charts', path: '/grading-scale/' },
      { label: 'Grade curve calculator', path: '/grade-curve-calculator/' },
      { label: 'How many questions can I miss?', path: '/how-many-questions-can-i-miss/' },
    ],
  },
  {
    id: 'everyone',
    tab: 'Everyone',
    icon: Users,
    title: 'Everyday maths without the spreadsheet',
    text: 'Percentages, tips, loans and mortgages: type the numbers and get a clear answer straight away.',
    links: [
      { label: 'Percentage calculator', path: '/percentage-calculator/' },
      { label: 'Tip calculator', path: '/tip-calculator/' },
      { label: 'Loan calculator', path: '/loan-calculator/' },
    ],
  },
];

const TRUST: { icon: typeof Calculator; title: string; text: string }[] = [
  { icon: Zap, title: 'Free, no sign-up', text: 'Open a calculator and start. There is no account, paywall or trial.' },
  { icon: ShieldCheck, title: 'Private by design', text: 'Calculations run in your browser. Nothing you type into a calculator is uploaded.' },
  { icon: WifiOff, title: 'Works offline', text: 'Install it once and your calculators keep working without a connection.' },
  { icon: Printer, title: 'Print or save as PDF', text: 'Take a clean chart or grade report to class, or keep a copy for your records.' },
];

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Landing sections shown under the Quick Grade tool on the home page (Coursera-style):
 *   1. "Explore calculators" category cards   2. "What brings you here today?" tabs   3. "Why people choose" tiles
 * Server-render safe (no window access while rendering). Headings start at h2: the page's single h1 lives in <ToolHeading />.
 */
export const HomeSections: React.FC = () => {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const persona = PERSONAS[active];
  const PersonaIcon = persona.icon;

  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % PERSONAS.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + PERSONAS.length) % PERSONAS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = PERSONAS.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="mt-10 print:hidden">
      {/* 0. Quick answers: the lookups people search for most */}
      <section aria-labelledby={`${baseId}-quick-answers`} className="cs-section pt-4">
        <p className="cs-eyebrow">Quick answers</p>
        <h2 id={`${baseId}-quick-answers`} className="cs-h2">Grade questions, answered instantly</h2>
        <DecorLines variant="squiggle" className="cs-squiggle" />
        <div className="grid sm:grid-cols-2 gap-3 max-w-4xl">
          {[
            { q: 'What grade is 17 out of 20?', a: '85% — a B on the standard scale.', path: '/test-grade-calculator/' },
            { q: 'What grade is 44 out of 60?', a: '73.3% — a C on the standard scale.', path: '/test-grade-calculator/' },
            { q: 'What grade is 9 out of 10?', a: '90% — an A on the standard scale.', path: '/grading-scale/10-questions/' },
            { q: 'What grade is 23 out of 25?', a: '92% — an A on the standard scale.', path: '/grading-scale/25-questions/' },
          ].map((item) => (
            <Link
              key={item.q}
              to={item.path}
              className="block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 no-underline hover:border-teal-600 transition-colors"
            >
              <span className="block font-bold text-slate-900 dark:text-white">{item.q}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400">{item.a} Check any other score →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 1. Explore calculators */}
      <section aria-labelledby={`${baseId}-explore`} className="cs-section pt-4">
        <p className="cs-eyebrow">Explore</p>
        <h2 id={`${baseId}-explore`} className="cs-h2">Calculators for every kind of grade and number</h2>
        <DecorLines variant="squiggle" className="cs-squiggle" />
        <p className="cs-lead">Pick a category, or press Ctrl+K to search every tool.</p>
        <div className="cs-cat-grid">
          {TOOL_GROUPS.map((group) => {
            const meta = CATEGORY_META[group.id] ?? { icon: Calculator, blurb: '' };
            const Icon = meta.icon;
            return (
              <article key={group.id} className="cs-card cs-cat">
                <span className="cs-cat-icon" aria-hidden="true"><Icon className="size-6" strokeWidth={2} /></span>
                <h3>{group.heading}</h3>
                <p>{meta.blurb}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.path}>
                      <Link to={item.path} title={item.title} onMouseEnter={() => void preloadForPath(item.path)} onFocus={() => void preloadForPath(item.path)}>
                        <span>{item.label}</span>
                        <ArrowRight className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
                {group.items[0] && (
                  <Link to={group.items[0].path} className="cs-card-link">
                    Start with {group.items[0].label} <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* 2. What brings you here today? */}
      <section aria-labelledby={`${baseId}-who`} className="cs-section">
        <h2 id={`${baseId}-who`} className="cs-h2">What brings you here today?</h2>
        <DecorLines variant="squiggle" className="cs-squiggle" />
        <p className="cs-lead">Choose what describes you and jump straight to the tools people like you use most.</p>
        <div role="tablist" aria-label="Who are you?" className="cs-tabs">
          {PERSONAS.map((p, i) => (
            <button
              key={p.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${p.id}`}
              aria-selected={active === i}
              aria-controls={`${baseId}-panel`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onTabKey(e, i)}
              className="cs-tab"
            >
              {p.tab}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${persona.id}`} className="cs-panel">
          <DecorLines variant="arcs" className="cs-panel-arcs" />
          <div>
            <span className="cs-cat-icon" aria-hidden="true"><PersonaIcon className="size-6" strokeWidth={2} /></span>
            <h3>{persona.title}</h3>
            <p>{persona.text}</p>
            <Link to={persona.links[0].path} className="cs-btn cs-btn-primary">
              {persona.links[0].label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="cs-panel-links">
            {persona.links.map((l) => (
              <li key={l.path}>
                <Link to={l.path} onMouseEnter={() => void preloadForPath(l.path)}>
                  <span>{l.label}</span>
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Why people choose Easy Grade Tool */}
      <section aria-labelledby={`${baseId}-why`} className="cs-section pb-2">
        <h2 id={`${baseId}-why`} className="cs-h2">Why people choose Easy Grade Tool</h2>
        <DecorLines variant="squiggle" className="cs-squiggle" />
        <p className="cs-lead">Simple, accurate and respectful of your data.</p>
        <div className="cs-trust">
          {TRUST.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="cs-trust-item">
                <Icon className="size-7" strokeWidth={2} aria-hidden="true" />
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomeSections;
