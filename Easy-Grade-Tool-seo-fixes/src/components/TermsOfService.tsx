import React from 'react';
import { Link } from './SlashLink';
import { FileText, ShieldCheck, AlertCircle, Scale, CheckCircle2, Mail, ExternalLink, HardDrive } from 'lucide-react';
import { SEO } from './SEO';
import { ToolHeading } from './ToolHeading';
import { AmbientAura } from './AmbientAura';
import { SEO_STATIC_PAGES, CONTACT_EMAIL, BASE_CANONICAL_ORIGIN } from '../data/seoConfig';

/**
 * Terms of Service view component.
 * Legal text is AI-drafted and should be reviewed by the owner.
 */
export const TermsOfService: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const seo = SEO_STATIC_PAGES.terms;

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
        schemaType={seo.schemaType}
      />

      <ToolHeading
        badge="Legal & Terms"
        title="Terms of Service"
        description="Standard terms of educational use, calculation disclaimers, and warranty limitations."
      />

      <div className="relative tool-layout font-sans">
        <AmbientAura />

        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm p-6 sm:p-8 md:p-10 w-full">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Terms of Service Overview</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              Welcome to <strong>Easy Grade Tool</strong>. By using our site, tools and calculators, you agree to these Terms of Service. If you do not agree with any part of them, please do not use the site.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
              Last updated: September 30, 2026 • Effective immediately
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Free Educational Use</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Free for students, teachers, parents and anyone who wants to learn.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Estimation Disclaimer</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Results are estimates. Check official figures with your school.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Essential Storage Only</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  No tracking cookies. We only save your display settings in your browser.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Terms Document */}
          <article className="seo-article bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm p-6 sm:p-10 font-sans space-y-7">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                By using <strong>Easy Grade Tool</strong> (at <a href={BASE_CANONICAL_ORIGIN} className="text-teal-700 dark:text-teal-400 underline font-semibold">{BASE_CANONICAL_ORIGIN}</a>), you confirm that you have read and agree to these Terms of Service and our <Link to="/privacy" className="text-teal-700 dark:text-teal-400 underline font-semibold">Privacy Policy</Link>.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                2. Educational Use License
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base mb-3">
                You may use Easy Grade Tool for personal, school, classroom and non-commercial learning. You may:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 text-sm">
                <li>Work out single, term or overall grades, weighted averages and the exam scores you need;</li>
                <li>Make and print PDF grade summaries for your own records;</li>
                <li>Use the tools offline once the site is saved on your device as an app.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                3. Accuracy of Results
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                Every calculator on this site is a planning aid. This includes the Quick Grade test chart, the weighted grade calculators, the 4.0 GPA converters, the CGPA tools, the percentage tools and the loan estimators. Schools set their own rounding rules and grading policies, and teachers can use their own judgment. So <strong>results from this site are estimates. Check them with your school office, department or teacher</strong> before you make any big decision about school or money.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                4. Storage &amp; Cookies
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                We do not use tracking cookies or ad IDs. We only use your browser's local storage to remember your light or dark theme and the numbers you typed in. All calculations run on your device. We never collect or send the courses or grades you enter.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                5. Acceptable Use
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base mb-2">
                Please do not use the site to:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 text-sm">
                <li>Get around or switch off our rate limits or security tools on the feedback and calculation services;</li>
                <li>Send harmful code, flood the site with bots, or slow it down for other people;</li>
                <li>Copy, take apart or mirror the service without credit or written consent.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                6. Intellectual Property
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                The design, logos, graphics, guides and code of Easy Grade Tool are protected by copyright and trademark law. You keep full ownership of the course names, grades and notes you enter.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                7. Outside Links &amp; Ads
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                This site has no third-party ad trackers or ad networks. Any links to schools or outside guides are there to help you. We do not back those sites, and we are not responsible for what they say or how they treat your data.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                8. No Warranties (&ldquo;As Is&rdquo;)
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                Easy Grade Tool is offered &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo;, with no warranty of any kind, stated or implied. This includes any promise that it is fit for a given use, or that it does not break anyone's rights. We do not promise that the tools will always work, or be free of errors, in every browser.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                9. Limitation of Liability
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                To the fullest extent the law allows, the people who run or build Easy Grade Tool are not liable for indirect, incidental, special or punitive damages. This includes school penalties, lost scholarships, GPA differences and money lost, whether they come from using the site or from being unable to use it.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                10. Changes to These Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                We may change these terms at any time. When we do, we will update the &ldquo;Last updated&rdquo; date at the top of this page. If you keep using the site after a change, you accept the new terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                11. Governing Law
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                {/* [JURISDICTION]: Governing law placeholder for owner review */}
                These terms follow the laws that apply, without regard to conflict of law rules. Any dispute will go to a court that has the power to hear it.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                <span>12. Contact &amp; Inquiries</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                Questions, feedback or concerns about these terms or how our grading works? Email us at{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-teal-700 dark:text-teal-400 underline font-semibold hover:text-teal-600"
                >
                  {CONTACT_EMAIL}
                </a>{' '}
                or use the contact form in the site footer.
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};
