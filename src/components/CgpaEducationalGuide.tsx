import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '../utils/helmet';
import {
  CheckCircle2,
  Info,
  Search,
  GraduationCap,
  Calculator,
  Percent,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import {
  CGPA_UNIVERSITIES,
  computeCgpaToPercentage,
} from '../data/cgpaUniversities';
import { FAQ } from './FAQ';
import {
  BASE_CANONICAL_ORIGIN,
  SITE_LAUNCH_DATE,
  SITE_LAST_MODIFIED,
  CONTACT_EMAIL,
} from '../data/seoConfig';
import { preloadTool } from '../utils/toolPreloader';
import { GUIDE_IMAGES } from '../data/guideImages';
import { SemanticGuideImage } from './SemanticGuideImage';

export function getCgpaHowToSchema(canonicalOrigin: string = BASE_CANONICAL_ORIGIN) {
  const cleanOrigin = canonicalOrigin.replace(/\/+$/, '');
  const url = `${cleanOrigin}/cgpa-to-percentage-calculator`;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name: 'How to Convert CGPA to Percentage Across 10.0, 5.0, and 4.0 Grading Scales',
    description:
      'Step-by-step academic instructions for converting Cumulative Grade Point Average (CGPA) into an equivalent percentage using standard UGC/CBSE multipliers or university-specific ordinances.',
    totalTime: 'PT1M',
    datePublished: SITE_LAUNCH_DATE,
    dateModified: SITE_LAST_MODIFIED,
    author: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url,
      email: CONTACT_EMAIL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url: `${cleanOrigin}/`,
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Identify Your Grading Scale (10.0, 5.0, or 4.0)',
        text: 'Check your official university transcript or marksheet to confirm whether your institution grades on a 10.0-point, 5.0-point, or 4.0-point scale.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Select Your University or Conversion Rule',
        text: 'For a 10.0 scale, select your university (such as VTU, Mumbai University, MAKAUT, GTU, SPPU, Anna University, AKTU, or BHU) or choose Normal Calculation (CGPA × 9.5).',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Enter Your Cumulative Grade Point Average (CGPA)',
        text: 'Type your exact CGPA up to two decimal places (for example, 8.45 on a 10.0 scale or 3.60 on a 4.0 scale).',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Review Equivalent Percentage & Academic Division',
        text: 'Read the calculated percentage, step-by-step formula substitution, and academic division (Distinction, First Class, or Second Class), then export a PDF report if needed.',
      },
    ],
  };
}

const REFERENCE_CGPAS_10 = [10.0, 9.5, 9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0];
const REFERENCE_SCALE_4_5 = [
  { cgpa4: 4.0, pct4: 100.0, cgpa5: 5.0, pct5: 100.0, division: 'Distinction' },
  { cgpa4: 3.7, pct4: 92.5, cgpa5: 4.5, pct5: 90.0, division: 'Distinction' },
  { cgpa4: 3.5, pct4: 87.5, cgpa5: 4.25, pct5: 85.0, division: 'Distinction' },
  { cgpa4: 3.3, pct4: 82.5, cgpa5: 4.0, pct5: 80.0, division: 'Distinction' },
  { cgpa4: 3.0, pct4: 75.0, cgpa5: 3.75, pct5: 75.0, division: 'Distinction' },
  { cgpa4: 2.7, pct4: 67.5, cgpa5: 3.5, pct5: 70.0, division: 'First Class' },
  { cgpa4: 2.4, pct4: 60.0, cgpa5: 3.0, pct5: 60.0, division: 'First Class' },
  { cgpa4: 2.0, pct4: 50.0, cgpa5: 2.5, pct5: 50.0, division: 'Second Class' },
];

export const CgpaEducationalGuide: React.FC = () => {
  const [uniFilter, setUniFilter] = useState('');
  const howToSchema = useMemo(() => getCgpaHowToSchema(), []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    let scriptTag = document.querySelector('script#schema-org-cgpa-howto') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('id', 'schema-org-cgpa-howto');
      document.head.appendChild(scriptTag);
    } else {
      scriptTag.removeAttribute('data-rh');
    }
    scriptTag.textContent = JSON.stringify(howToSchema, null, 2);
    return () => {
      document.querySelector('script#schema-org-cgpa-howto')?.remove();
    };
  }, [howToSchema]);

  const filteredUniversities = useMemo(() => {
    const q = uniFilter.trim().toLowerCase();
    if (!q) return CGPA_UNIVERSITIES;
    return CGPA_UNIVERSITIES.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.formulaLabel.toLowerCase().includes(q) ||
        u.sourceNote.toLowerCase().includes(q)
    );
  }, [uniFilter]);

  return (
    <>
      {typeof window === 'undefined' && (
        <Helmet>
          <script id="schema-org-cgpa-howto" type="application/ld+json">
            {JSON.stringify(howToSchema)}
          </script>
        </Helmet>
      )}

      {/* Related Tools Cross-Navigation Banner */}
      <section
        aria-label="Related Academic and Percentage Calculators"
        className="w-full max-w-4xl mx-auto mt-10 px-4 print:hidden"
      >
        <div className="bg-gradient-to-r from-slate-50/90 to-blue-50/80 dark:from-slate-900/90 dark:to-slate-800/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                Connected Academic Suite
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white m-0 mt-0.5">
                Related Grade &amp; GPA Calculators
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Instant zero-reload switching
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/gpa-calculator"
              onMouseEnter={() => preloadTool('gpa')}
              onFocus={() => preloadTool('gpa')}
              className="group p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-700/70 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between no-underline shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" aria-hidden="true" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white m-0">
                  4.0 Scale GPA Calculator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 m-0 leading-relaxed">
                  Calculate semester &amp; cumulative college GPA from letter grades (A, B+, C) and credit hours.
                </p>
              </div>
            </Link>

            <Link
              to="/grade-calculator"
              onMouseEnter={() => preloadTool('quick')}
              onFocus={() => preloadTool('quick')}
              className="group p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-700/70 hover:border-teal-400 dark:hover:border-teal-500 transition-all flex flex-col justify-between no-underline shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Calculator className="w-4 h-4" aria-hidden="true" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white m-0">
                  Weighted Grade Calculator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 m-0 leading-relaxed">
                  Compute weighted course averages, points totals, and required final exam target scores.
                </p>
              </div>
            </Link>

            <Link
              to="/percentage-calculator"
              onMouseEnter={() => preloadTool('percentage')}
              onFocus={() => preloadTool('percentage')}
              className="group p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-700/70 hover:border-rose-400 dark:hover:border-rose-500 transition-all flex flex-col justify-between no-underline shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Percent className="w-4 h-4" aria-hidden="true" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white m-0">
                  Percentage Calculator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 m-0 leading-relaxed">
                  Find X% of Y, raw marks to percentage, and percentage increase or decrease.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Educational & Reference Article */}
      <section
        className="seo-content w-full max-w-4xl mx-auto mt-12 mb-16 px-4"
        aria-labelledby="cgpa-guide-heading"
      >
        <article className="seo-article bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 border border-white/60 dark:border-white/10 shadow-sm rounded-3xl p-6 sm:p-10 font-sans">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Complete Academic Reference Guide</span>
          </div>

          <h2
            id="cgpa-guide-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-4"
          >
            How to Convert CGPA to Percentage: Formulas, Scales &amp; University Rules
          </h2>

          <div className="my-6">
            <SemanticGuideImage
              toolKey="cgpa"
              alt="A hand holds a calculator over a paper with course grade points and percentage conversions visible."
            />
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Whether you are filling out a campus placement portal, applying for postgraduate admissions abroad, or registering for competitive examinations like GATE, CAT, UPSC, or PSU recruitments, applications frequently ask for your marks as a <strong>percentage</strong> even when your transcript lists a <strong>Cumulative Grade Point Average (CGPA)</strong>. Because universities across India, Pakistan, the UAE, Europe, and North America grade on different point scales and apply distinct mathematical ordinances, using the right conversion formula is essential.
          </p>

          {/* 10-Point Side-by-Side Comparison Table */}
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3 tracking-tight">
            10-Point CGPA to Percentage Conversion Table
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
            The reference chart below compares equivalent percentages for common 10-point CGPAs across the five most widely used university conversion formulas:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 mb-8 shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3.5 font-mono">CGPA (10.0)</th>
                  <th className="py-3 px-3.5">Standard / CBSE (× 9.5)</th>
                  <th className="py-3 px-3.5">VTU / MAKAUT / SPPU ((CGPA − 0.75) × 10)</th>
                  <th className="py-3 px-3.5">GTU / BPUT ((CGPA − 0.5) × 10)</th>
                  <th className="py-3 px-3.5">Mumbai Univ (7.1 × CGPA + 11)</th>
                  <th className="py-3 px-3.5">Anna / DU / VIT (× 10)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                {REFERENCE_CGPAS_10.map((val) => {
                  const normalPct = computeCgpaToPercentage(val, 10, 'normal').percentage;
                  const vtuPct = computeCgpaToPercentage(val, 10, 'vtu').percentage;
                  const gtuPct = computeCgpaToPercentage(val, 10, 'gtu').percentage;
                  const muPct = computeCgpaToPercentage(val, 10, 'mumbai-university').percentage;
                  const directPct = computeCgpaToPercentage(val, 10, 'anna-university').percentage;
                  return (
                    <tr key={val} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3.5 font-bold text-teal-700 dark:text-teal-400">
                        {val.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3.5">{normalPct.toFixed(2)}%</td>
                      <td className="py-2.5 px-3.5">{vtuPct.toFixed(2)}%</td>
                      <td className="py-2.5 px-3.5">{gtuPct.toFixed(2)}%</td>
                      <td className="py-2.5 px-3.5">{muPct.toFixed(2)}%</td>
                      <td className="py-2.5 px-3.5">{directPct.toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Understanding the 3 Major Grading Scales */}
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3 tracking-tight">
            Converting CGPA Across 10.0, 5.0, and 4.0 Grading Scales
          </h2>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-5 mb-2">
            1. The 10.0-Point Grading Scale (UGC, CBSE &amp; Indian Universities)
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Under the University Grants Commission (UGC) Choice Based Credit System (CBCS) and Central Board of Secondary Education (CBSE), students receive letter grades mapped to a 10-point scale (where O = 10, A+ = 9, A = 8, B+ = 7, B = 6, C = 5, P = 4). Because the top grade band spans 91–100 marks with an average midpoint of 95, dividing 95 by 10 yields the standard multiplier of <strong>9.5</strong>:
          </p>
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-4">
            Percentage (%) = CGPA × 9.5 &nbsp;&nbsp;|&nbsp;&nbsp; Example: 8.4 CGPA × 9.5 = 79.80%
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-5 mb-2">
            2. The 4.0-Point Grading Scale (US, Canada, UAE &amp; HEC Pakistan)
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Universities in the United States, Canada, the UAE, and Pakistani institutions regulated by the Higher Education Commission (HEC)—including NUST, LUMS, COMSATS, FAST-NUCES, and UET—primarily evaluate cumulative performance on a <strong>4.00 scale</strong>. For linear percentage conversion on a 4.0 scale, each grade point represents 25 percentage points:
          </p>
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-4">
            Percentage (%) = CGPA × 25 &nbsp;&nbsp;|&nbsp;&nbsp; Example: 3.36 CGPA × 25 = 84.00%
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-5 mb-2">
            3. The 5.0-Point Grading Scale
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            In institutions and international high schools operating on a 5.0 maximum grade scale, each full grade point corresponds to 20% of the total possible score:
          </p>
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-6">
            Percentage (%) = CGPA × 20 &nbsp;&nbsp;|&nbsp;&nbsp; Example: 4.15 CGPA × 20 = 83.00%
          </div>

          {/* 4.0 & 5.0 Scale Reference Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 mb-8 shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-4 font-mono">4.0 Scale CGPA</th>
                  <th className="py-2.5 px-4 font-mono">4.0 Scale % (× 25)</th>
                  <th className="py-2.5 px-4 font-mono">5.0 Scale CGPA</th>
                  <th className="py-2.5 px-4 font-mono">5.0 Scale % (× 20)</th>
                  <th className="py-2.5 px-4">Academic Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                {REFERENCE_SCALE_4_5.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-4 font-bold text-indigo-700 dark:text-indigo-400">
                      {row.cgpa4.toFixed(2)}
                    </td>
                    <td className="py-2 px-4">{row.pct4.toFixed(2)}%</td>
                    <td className="py-2 px-4 font-bold text-teal-700 dark:text-teal-400">
                      {row.cgpa5.toFixed(2)}
                    </td>
                    <td className="py-2 px-4">{row.pct5.toFixed(2)}%</td>
                    <td className="py-2 px-4 font-sans font-medium">{row.division}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Searchable University Formula Directory */}
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3 tracking-tight">
            University-Specific CGPA Conversion Directory &amp; Verification Status
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
            Every institution in our database is audited against official examination ordinances. Formulas confirmed from published university notifications are marked <strong>Verified</strong>; universities without a single uniform public circular default transparently to the <strong>Standard estimate (CGPA × 9.5)</strong>.
          </p>

          <div className="relative mb-4">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Filter university conversion formulas"
              placeholder="Search university name or formula (e.g. VTU, Mumbai, BHU, 0.75)..."
              value={uniFilter}
              onChange={(e) => setUniFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 rounded-2xl pl-10 pr-4 py-3.5 shadow-inner text-base sm:text-sm placeholder:text-slate-400"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 mb-8 max-h-[440px] overflow-y-auto shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4">University / Board</th>
                  <th className="py-3 px-4 font-mono">10-Point Formula</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Source / Ordinance Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredUniversities.map((uni) => (
                  <tr key={uni.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {uni.name}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                      {uni.formulaLabel}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {uni.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60">
                          <Info className="w-3 h-3" aria-hidden="true" />
                          <span>Standard estimate</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {uni.sourceNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SGPA to CGPA Section */}
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3 tracking-tight">
            How to Calculate CGPA from Semester SGPA Scores
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Your <strong>SGPA (Semester Grade Point Average)</strong> reflects your grade point average for a single academic term, while your <strong>CGPA</strong> aggregates performance across all completed semesters weighted by each semester&apos;s total credit hours:
          </p>
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-4">
            CGPA = &Sigma;(Semester SGPA &times; Semester Credits) &divide; &Sigma;(Total Semester Credits)
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            For example, if you earned an SGPA of <strong>8.10</strong> in Semester 1 (22 credits) and <strong>8.50</strong> in Semester 2 (24 credits), your cumulative GPA is <code>[(8.10 × 22) + (8.50 × 24)] ÷ (22 + 24) = (178.2 + 204.0) ÷ 46 = 8.31 CGPA</code>. You can use the built-in <strong>SGPA to CGPA &amp; Percentage Calculator</strong> panel above to compute this automatically across up to 12 semesters. Need to compute US 4.0 letter-grade GPA from course credits, calculate weighted syllabus grades, or check raw percentage differences? Explore our <Link to="/gpa-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">4.0 GPA Calculator</Link>, <Link to="/grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Weighted Grade Calculator</Link>, and <Link to="/percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Percentage Calculator</Link>.
          </p>

          {/* FAQ Section */}
          <FAQ tool="cgpa" />
        </article>
      </section>
    </>
  );
};
