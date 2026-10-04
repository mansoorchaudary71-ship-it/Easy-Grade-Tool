import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Calculator,
  Globe2,
  Mail,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SEO } from './SEO';
import { ToolHeading } from './ToolHeading';
import { AmbientAura } from './AmbientAura';
import { SEO_STATIC_PAGES, CONTACT_EMAIL } from '../data/seoConfig';

export const AboutMethodology: React.FC = () => {
  const seo = SEO_STATIC_PAGES.about;
  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        canonicalUrl={seo.canonicalUrl}
        ogImage={seo.ogImagePlaceholder}
        keywords={seo.keywords}
        applicationCategory={seo.applicationCategory}
        featureList={seo.featureList}
      />

      <ToolHeading
        badge="About & Methodology"
        title="Grading Formulas & Academic Methodology"
        description="Clear, transparent explanations of the mathematical models behind our weighted grade, cumulative GPA, and test scoring calculators."
      />

      <div className="relative tool-layout font-sans">
        <AmbientAura />

        <div className="w-full max-w-4xl mx-auto space-y-10">
          {/* Mission & Purpose Card */}
          <section className="bg-gradient-to-r from-slate-50/95 to-blue-50/90 backdrop-blur-xl dark:from-slate-900/95 dark:to-slate-800/90 rounded-3xl border border-white/80 dark:border-white/10 shadow-sm p-6 sm:p-8 md:p-10 w-full space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>Mission &amp; Transparency</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight m-0">
              Why We Built Easy Grade Tool
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              Grading policies vary dramatically across schools, departments, and professors. Some syllabi use pure point totals; others assign percentage weights to exams, lab work, and homework; and colleges evaluate transcripts using weighted GPA credit hours.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              We created <strong>Easy Grade Tool</strong> to provide students, parents, and educators with an immediate, mathematically rigorous, and tracker-free toolset—including our <Link to="/" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Quick Grade Chart</Link>, <Link to="/grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Weighted Grade Calculator</Link>, <Link to="/gpa-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">4.0 GPA Calculator</Link>, and <Link to="/cgpa-to-percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">CGPA to Percentage Calculator</Link>. Every formula on this site is documented below and covered by our <Link to="/privacy" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Client-Side Privacy Policy</Link>.
            </p>
          </section>

          {/* 1. The Standard 4.0 US GPA Scale */}
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-sm p-6 sm:p-8 md:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center text-teal-800 dark:text-teal-300 shrink-0">
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Standard Academic Model
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white m-0">
                  1. The Standard 4.0 US GPA Scale
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              In the United States and many North American institutions, Grade Point Average (GPA) converts letter grades into numerical quality points on a scale ranging from 0.0 to 4.0.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-2 bg-white dark:bg-slate-900">
              <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-y-1.5">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4 rounded-l-2xl">Letter Grade</th>
                    <th className="py-2.5 px-4">Grade Points (Plus/Minus)</th>
                    <th className="py-2.5 px-4">Standard Cutoff (%)</th>
                    <th className="py-2.5 px-4 rounded-r-2xl">Description</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs sm:text-sm">
                  <tr className="bg-emerald-50/60 hover:bg-emerald-50 text-emerald-800 rounded-2xl transition-colors">
                    <td className="py-2.5 px-4 font-bold rounded-l-2xl">
                      <span className="inline-block px-2.5 py-0.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                        A / A+
                      </span>
                    </td>
                    <td className="py-2.5 px-4">4.0</td>
                    <td className="py-2.5 px-4">93.0% – 100%</td>
                    <td className="py-2.5 px-4 font-sans rounded-r-2xl">Excellent / Outstanding</td>
                  </tr>
                  <tr className="bg-emerald-50/60 hover:bg-emerald-50 text-emerald-800 rounded-2xl transition-colors">
                    <td className="py-2.5 px-4 font-bold rounded-l-2xl">
                      <span className="inline-block px-2.5 py-0.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                        A−
                      </span>
                    </td>
                    <td className="py-2.5 px-4">3.7</td>
                    <td className="py-2.5 px-4">90.0% – 92.9%</td>
                    <td className="py-2.5 px-4 font-sans rounded-r-2xl">Superior</td>
                  </tr>
                  <tr className="bg-indigo-50/60 hover:bg-indigo-50 text-indigo-800 rounded-2xl transition-colors">
                    <td className="py-2.5 px-4 font-bold rounded-l-2xl">
                      <span className="inline-block px-2.5 py-0.5 rounded-2xl bg-indigo-50 text-indigo-800 border border-indigo-200">
                        B+
                      </span>
                    </td>
                    <td className="py-2.5 px-4">3.3</td>
                    <td className="py-2.5 px-4">87.0% – 89.9%</td>
                    <td className="py-2.5 px-4 font-sans rounded-r-2xl">Very Good</td>
                  </tr>
                  <tr className="bg-indigo-50/60 hover:bg-indigo-50 text-indigo-800 rounded-2xl transition-colors">
                    <td className="py-2.5 px-4 font-bold rounded-l-2xl">
                      <span className="inline-block px-2.5 py-0.5 rounded-2xl bg-indigo-50 text-indigo-800 border border-indigo-200">
                        B
                      </span>
                    </td>
                    <td className="py-2.5 px-4">3.0</td>
                    <td className="py-2.5 px-4">83.0% – 86.9%</td>
                    <td className="py-2.5 px-4 font-sans rounded-r-2xl">Good / Above Average</td>
                  </tr>
                  <tr className="bg-indigo-50/60 hover:bg-indigo-50 text-indigo-800 rounded-2xl transition-colors">
                    <td className="py-2.5 px-4 font-bold rounded-l-2xl">
                      <span className="inline-block px-2.5 py-0.5 rounded-2xl bg-indigo-50 text-indigo-800 border border-indigo-200">
                        B−
                      </span>
                    </td>
                    <td className="py-2.5 px-4">2.7</td>
                    <td className="py-2.5 px-4">80.0% – 82.9%</td>
                    <td className="py-2.5 px-4 font-sans rounded-r-2xl">Competent</td>
                  </tr>
                  <tr className="bg-amber-50/60 hover:bg-amber-50 text-amber-800 rounded-2xl transition-colors">
                    <td className="py-2.5 px-4 font-bold rounded-l-2xl">
                      <span className="inline-block px-2.5 py-0.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
                        C+
                      </span>
                    </td>
                    <td className="py-2.5 px-4">2.3</td>
                    <td className="py-2.5 px-4">77.0% – 79.9%</td>
                    <td className="py-2.5 px-4 font-sans rounded-r-2xl">Average High</td>
                  </tr>
                  <tr className="bg-amber-50/60 hover:bg-amber-50 text-amber-800 rounded-2xl transition-colors">
                    <td className="py-2.5 px-4 font-bold rounded-l-2xl">
                      <span className="inline-block px-2.5 py-0.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
                        C
                      </span>
                    </td>
                    <td className="py-2.5 px-4">2.0</td>
                    <td className="py-2.5 px-4">73.0% – 76.9%</td>
                    <td className="py-2.5 px-4 font-sans rounded-r-2xl">Satisfactory / Minimum Major Requirement</td>
                  </tr>
                  <tr className="bg-amber-50/60 hover:bg-amber-50 text-amber-800 rounded-2xl transition-colors">
                    <td className="py-2.5 px-4 font-bold rounded-l-2xl">
                      <span className="inline-block px-2.5 py-0.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
                        C−
                      </span>
                    </td>
                    <td className="py-2.5 px-4">1.7</td>
                    <td className="py-2.5 px-4">70.0% – 72.9%</td>
                    <td className="py-2.5 px-4 font-sans rounded-r-2xl">Marginal Pass</td>
                  </tr>
                  <tr className="bg-orange-50/60 hover:bg-orange-50 text-orange-800 rounded-2xl transition-colors">
                    <td className="py-2.5 px-4 font-bold rounded-l-2xl">
                      <span className="inline-block px-2.5 py-0.5 rounded-2xl bg-orange-50 text-orange-800 border border-orange-200">
                        D+ / D
                      </span>
                    </td>
                    <td className="py-2.5 px-4">1.3 / 1.0</td>
                    <td className="py-2.5 px-4">60.0% – 69.9%</td>
                    <td className="py-2.5 px-4 font-sans rounded-r-2xl">Poor / Minimum Credit Pass</td>
                  </tr>
                  <tr className="bg-rose-50/60 hover:bg-rose-50 text-rose-800 rounded-2xl transition-colors">
                    <td className="py-2.5 px-4 font-bold rounded-l-2xl">
                      <span className="inline-block px-2.5 py-0.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200">
                        F
                      </span>
                    </td>
                    <td className="py-2.5 px-4">0.0</td>
                    <td className="py-2.5 px-4">&lt; 60.0%</td>
                    <td className="py-2.5 px-4 font-sans rounded-r-2xl">Failing / No Credit Earned</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60">
              <h3 className="text-xs sm:text-sm font-bold text-teal-900 dark:text-teal-200 m-0 mb-1 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" aria-hidden="true" />
                <span>The Cumulative GPA Formula</span>
              </h3>
              <p className="text-xs sm:text-sm font-mono text-teal-800 dark:text-teal-300 m-0">
                GPA = &Sigma;(Course Grade Points &times; Course Credit Hours) / &Sigma;(Total Credit Hours)
              </p>
              <p className="text-xs text-teal-700 dark:text-teal-300 mt-2 m-0 font-sans">
                Each course grade point is weighted by the credit value of the course. For example, earning an &quot;A&quot; (4.0) in a 4-credit course yields 16.0 quality points, whereas an &quot;A&quot; in a 1-credit lab yields 4.0 quality points.
              </p>
            </div>
          </section>

          {/* 2. The Weighted Grade Formula */}
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-sm p-6 sm:p-8 md:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                <Layers className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Mathematical Breakdown
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white m-0">
                  2. The Weighted Grade Formula
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              When professors assign percentages to categories (e.g., 20% Homework, 30% Midterm, 50% Final), simple averaging produces incorrect results. Our calculator executes a normalized weighted arithmetic mean:
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-slate-100 dark:bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm space-y-3">
              <div className="text-emerald-400 font-semibold">Normalized Weighted Percentage</div>
              <div className="p-3 bg-slate-800/80 rounded-xl text-center font-bold text-white text-sm sm:text-base">
                Final Grade (%) = &Sigma; [ (Earned / Max) &times; Weight ] / &Sigma; [ Total Weight ]
              </div>
              <p className="text-xs text-slate-400 m-0 font-sans leading-relaxed">
                If the weights already sum to 100%, the denominator is 100. If your syllabus weights only sum to 80% so far (because the final has not occurred yet), our engine normalizes the active weight so your current standing is always represented accurately without distortion.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white m-0">
                Final Exam Target Formula
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed m-0">
                To calculate the exact score you need on a final exam to reach a target class grade, we solve the algebraic equation:
              </p>
              <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                Score Needed = [ Target Grade &minus; (Current Grade &times; (1 &minus; Final Weight)) ] / Final Weight
              </div>
            </div>
          </section>

          {/* 3. How International Credit Systems Differ */}
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-sm p-6 sm:p-8 md:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center text-teal-800 dark:text-teal-300 shrink-0">
                <Globe2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Global Academic Equivalencies
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white m-0">
                  3. How International Credit Systems Differ
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              If you study outside the US or are applying for study abroad programs, grade point translations are not 1:1. Here is how standard US scales differ from major global systems:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider font-mono">
                  Europe (ECTS)
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white m-0">
                  European Credit System
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed m-0">
                  ECTS measures student workload (60 credits = 1 academic year, ~1500–1800 hours). Grading uses relative cohorts (top 10% get A, next 25% get B) rather than absolute percentage floors.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider font-mono">
                  United Kingdom
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white m-0">
                  Honours Classification
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed m-0">
                  UK universities use Honours classes: First Class (70%+), Upper Second 2:1 (60–69%), Lower Second 2:2 (50–59%), and Third (40–49%). A 70% in the UK is roughly equivalent to a US &quot;A&quot; (4.0).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider font-mono">
                  Canada &amp; Others
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white m-0">
                  Provincial Scales
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed m-0">
                  Canadian universities often use either a 4.0 or a 4.33/9.0/12.0 point scale with varying percentage cutoffs (an A may start at 85% instead of 90% or 93%).
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Important Note:</strong> Because university registrar rules and international transcript evaluations (such as WES) apply bespoke conversion policies, our tools are intended for academic planning and estimation. Always verify official policies directly with your university registrar.
              </span>
            </div>
          </section>

          {/* 4. Authorship, Maintenance & Contact */}
          <section className="bg-gradient-to-r from-slate-50/95 to-blue-50/90 backdrop-blur-xl dark:from-slate-900/95 dark:to-slate-800/90 rounded-3xl border border-white/80 dark:border-white/10 shadow-sm p-6 sm:p-8 md:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Trust, Authority &amp; Contact
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white m-0">
                  4. Author &amp; Engineering Team
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Easy Grade Tool</strong> is actively designed and maintained by a dedicated software engineer specializing in offline-first web technologies, mathematical algorithms, and student utility tools.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Maintainer &amp; Support</div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Engineering &amp; Editorial Team</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Direct communication: <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">{CONTACT_EMAIL}</a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Release &amp; Audit Status</div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Formulas Verified for Accuracy</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Continuous integration with automated TypeScript regression tests.
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/60 dark:border-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                Have a question about a formula, custom university scale, or found a discrepancy in a course calculation?
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500 text-xs font-bold transition-all shadow-sm shadow-teal-700/20 shrink-0"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Contact Maintainer</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
export default AboutMethodology;
