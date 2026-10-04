import React from 'react';
import { Link } from 'react-router-dom';
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
              <Scale className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>Terms of Service Overview</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              Welcome to <strong>Easy Grade Tool</strong>. By accessing or using our website, tools, and calculators, you agree to comply with and be bound by these Terms of Service. If you disagree with any portion of these terms, please do not use our services.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
              Last updated: September 30, 2026 • Effective immediately
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Free Educational Use</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  100% free access for students, teachers, parents, and lifelong learners.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Estimation Disclaimer</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Results are computational estimates; verify official figures with your school.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Essential Storage Only</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  No tracking cookies. Only local UI preferences stored in your browser.
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
                By visiting, viewing, or interacting with <strong>Easy Grade Tool</strong> (located at <a href={BASE_CANONICAL_ORIGIN} className="text-teal-700 dark:text-teal-400 underline font-semibold">{BASE_CANONICAL_ORIGIN}</a>), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service and our accompanying <Link to="/privacy" className="text-teal-700 dark:text-teal-400 underline font-semibold">Privacy Policy</Link>.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                2. Educational Use License
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base mb-3">
                Permission is hereby granted to access and use Easy Grade Tool for personal, academic, classroom, and non-commercial educational purposes. Under this grant of license, you may:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 text-sm">
                <li>Calculate individual, semester, or cumulative grades, weighted course averages, and target exam scores;</li>
                <li>Generate and print PDF grade report summaries for academic recordkeeping;</li>
                <li>Utilize the suite in offline mode via our Progressive Web Application (PWA) cache on personal devices.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                3. Calculation Accuracy &amp; Estimation Disclaimer
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                All calculation tools provided on this website—including the Quick Grade test chart, weighted grade calculators, 4.0 GPA converters, CGPA ordinances, percentage utilities, and loan estimators—are computational models provided for informational and planning purposes only. Because university syllabi, institutional rounding thresholds, faculty discretion, and departmental policies vary substantially, <strong>results generated by this site are estimates and must be verified directly with your school registrar, department chair, or professor</strong> before making formal academic, enrollment, or financial decisions.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                4. Essential Storage &amp; Cookie Disclosure
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                This application does not use tracking cookies or advertising identifiers; only essential client-side localStorage is utilized to retain your light/dark theme preference and temporary calculator inputs on your device. All calculations execute within client memory, and your entered coursework or transcript data is never collected, mined, or transmitted to any remote database.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                5. Acceptable Use
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base mb-2">
                You agree not to use the application to:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 text-sm">
                <li>Attempt to bypass, disable, or tamper with rate limits or security mechanisms on backend feedback or calculation endpoints;</li>
                <li>Transmit malicious payloads, automated crawler abuse, or scripts designed to degrade service performance;</li>
                <li>Decompile, reverse-engineer, or mirror the service without proper attribution or written consent.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                6. Intellectual Property
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                The user interface design, logos, graphics, instructional guides, and algorithmic implementations of Easy Grade Tool are protected by applicable copyright and trademark laws. You retain full, exclusive ownership of any original course names, grades, or personal notes you enter into the application.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                7. Third-Party Links &amp; Advertising
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                This website currently operates free of third-party advertising trackers and marketing networks. If any external links to universities, academic reference standards, or external documentation are provided, they are for your convenience only. We do not endorse or assume responsibility for the content, privacy practices, or terms of third-party websites.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                8. No Warranties (&ldquo;As Is&rdquo;)
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                Easy Grade Tool is provided strictly on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis, without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that calculations will be uninterrupted, error-free, or entirely bug-free under all browser configurations.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                9. Limitation of Liability
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                In no event shall the authors, operators, or contributors of Easy Grade Tool be liable for any indirect, incidental, consequential, special, or punitive damages—including academic penalties, loss of scholarship eligibility, GPA recalculation discrepancies, or financial losses—arising out of or related to your use of or inability to use this site or its calculation models.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                10. Changes to These Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                We reserve the right to revise or update these Terms of Service at any time. When modifications occur, the &ldquo;Last updated&rdquo; date at the top of this page will be revised. Continued use of the application following published revisions constitutes your acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                11. Governing Law
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                {/* [JURISDICTION]: Governing law placeholder for owner review */}
                These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law principles. Any dispute arising under these terms shall be resolved in a court of competent jurisdiction.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                <span>12. Contact &amp; Inquiries</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                If you have questions, feedback, or concerns regarding these Terms of Service or our grading methodology, please reach out to our team at{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-teal-700 dark:text-teal-400 underline font-semibold hover:text-teal-600"
                >
                  {CONTACT_EMAIL}
                </a>{' '}
                or submit an inquiry via our contact form in the site footer.
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};
