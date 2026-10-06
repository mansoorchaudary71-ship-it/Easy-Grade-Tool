import React from 'react';
import { Link } from './SlashLink';
import {
  ShieldCheck,
  Lock,
  Mail,
  Laptop,
  Database,
  Trash2,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { SEO } from './SEO';
import { ToolHeading } from './ToolHeading';
import { AmbientAura } from './AmbientAura';
import { SEO_STATIC_PAGES, CONTACT_EMAIL } from '../data/seoConfig';

export const PrivacyPolicy: React.FC = () => {
  const seo = SEO_STATIC_PAGES.privacy;

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
        badge="Legal & Privacy"
        title="Privacy Policy"
        description="Transparent disclosure of how our calculation suite operates locally in your browser and how voluntary form submissions are processed and stored."
      />

      <div className="relative tool-layout font-sans">
        <AmbientAura />

        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Key Privacy Highlights Card */}
          <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm p-6 sm:p-8 md:p-10 w-full">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>Core Privacy Architecture</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              Easy Grade Tool is designed to provide powerful, immediate academic tools while maintaining complete transparency. Calculations execute directly within your browser, while voluntary communications (such as newsletter subscriptions and support tickets) are handled securely on our server with defined retention limits.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <Laptop className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">In-Browser Calculations</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Grades, weights, GPA, loan amounts, and test scores run 100% in your device&apos;s local memory and are never transmitted to our servers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Voluntary Submissions</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  When you submit a newsletter subscription, feedback message, or issue report, only your submitted details are stored on our server.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Local Cryptography</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Password generation uses your browser&apos;s native Web Cryptography API locally without any network requests.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Policy Article */}
          <article className="seo-article bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm p-6 sm:p-10 font-sans space-y-8">
            
            {/* 1. In-Browser Calculator Processing */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">1</span>
                <span>Calculators Run Locally in the Browser</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                All calculation tools provided on this website—including the <Link to="/" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Quick Grade Chart</Link>, <Link to="/grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Weighted Grade Calculator</Link>, <Link to="/gpa-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">GPA Calculator</Link>, <Link to="/cgpa-to-percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">CGPA to Percentage Calculator</Link>, <Link to="/percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Percentage Calculator</Link>, <Link to="/tip-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Tip Calculator</Link>, <Link to="/loan-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Loan &amp; Mortgage Calculator</Link>, and <Link to="/password-generator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Password Generator</Link>—execute entirely within your device&apos;s web browser using JavaScript and HTML5.
              </p>
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>No calculation inputs are transmitted to our servers:</strong> Your course names, quiz scores, assignment weights, GPA scales, loan balances, interest rates, and generated passwords remain strictly inside your browser memory.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>No user accounts or logins:</strong> You are not required to create an account, provide identification, or log in to use any calculator.</span>
                </div>
              </div>
            </div>

            {/* 2. Voluntary Data Submissions */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">2</span>
                <span>Data Collection Points: What Is Sent to Our Server and Stored</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We only receive and store personal data when you explicitly and voluntarily submit information through our interactive forms. The following section audits every data collection point and backend endpoint in our application:
              </p>

              <div className="space-y-4">
                {/* 2.1 Newsletter */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>A. Newsletter &amp; Product Updates (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/subscribe</code>)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    When you subscribe to academic updates via the newsletter form in the footer, your submission is transmitted over an encrypted HTTPS connection to our backend server.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li><strong>Data Collected &amp; Stored:</strong> Your submitted email address, submission timestamp, and a generated subscriber identifier.</li>
                    <li><strong>Purpose:</strong> To send email notifications regarding new calculators, updated grading scale ordinances, or major academic feature releases.</li>
                    <li><strong>Third-Party Email Relay:</strong> If transactional email delivery is enabled, messages are relayed securely via our transactional email provider (Resend API) solely to transmit the requested message.</li>
                  </ul>
                </div>

                {/* 2.2 Contact / Feedback */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>B. Contact &amp; Feedback Form (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/contact</code>)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    When you contact our development team through the Contact &amp; Feedback modal, your message is transmitted to our server for human review.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li><strong>Data Collected &amp; Stored:</strong> Your name (or &quot;Anonymous Learner&quot; if left blank), email address, subject line, feedback category, message text, optional numerical rating, submission timestamp, and browser User-Agent string.</li>
                    <li><strong>Purpose:</strong> To respond to your support request, provide calculation assistance, and review user feedback.</li>
                  </ul>
                </div>

                {/* 2.3 Report an Issue */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>C. Calculation Discrepancy &amp; Bug Report (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/report-issue</code>)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    When you flag a formula discrepancy or software bug via the Report Issue modal:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li><strong>Data Collected &amp; Stored:</strong> Target calculator name, issue title, issue description, expected result, actual result, reporter email (if provided), generated ticket ID, and timestamp.</li>
                    <li><strong>Purpose:</strong> To debug formula edge cases, correct institution grading scales, and notify you when the issue is resolved.</li>
                  </ul>
                </div>

                {/* 2.4 Feature Suggestion */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <Laptop className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>D. Feature Suggestions (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/suggest-feature</code>)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Collects the suggested feature name, category, description, optional email address, and timestamp to prioritize upcoming tools on our public roadmap.
                  </p>
                </div>

                {/* 2.5 Operational & Status Endpoints */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span>E. Operational &amp; Analytics Endpoints</span>
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li><strong>System Health &amp; Stats (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">GET /api/health</code>, <code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">GET /api/stats</code>):</strong> Public diagnostic queries that return server uptime, active calculator count, and aggregate submission totals. These endpoints never return individual student data or personal records.</li>
                    <li><strong>Anonymous Share Counter (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/share</code>):</strong> Increments an anonymous integer counter when users click the share button. No user identifier or IP address is stored with the counter.</li>
                    <li><strong>Backup Verification (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/backup-data</code>):</strong> Validates the item count of a user&apos;s client-side data export payload; calculation data is not retained on the server.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Storage Location & Security */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">3</span>
                <span>Where Submitted Data Is Stored &amp; How It Is Protected</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Voluntary form submissions are stored securely in dedicated JSON files located within the application&apos;s protected server directory (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">server-data/</code>) on our hosting server:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-4">
                <li><code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">subscribers.json</code>: Stores newsletter subscriber records (email, timestamp, subscription ID).</li>
                <li><code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">contacts.json</code>: Stores contact, feedback, and support inquiries.</li>
                <li><code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">issues.json</code>: Stores calculation bug tickets and formula error reports.</li>
                <li><code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">suggestions.json</code>: Stores community tool suggestions.</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                <strong>Technical Security Measures:</strong> All transmissions are encrypted using standard TLS/HTTPS. All text inputs are sanitized to strip malicious control characters and HTML injection. Submission endpoints are protected by rate limiting (default 15 requests per 5 minutes per connection) to prevent automated abuse and denial-of-service attempts.
              </p>
            </div>

            {/* 4. Data Retention */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">4</span>
                <span>Data Retention Policy</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
                      <th className="py-2.5 pr-4">Data Type</th>
                      <th className="py-2.5 px-4">Storage File</th>
                      <th className="py-2.5 px-4">Retention Period</th>
                      <th className="py-2.5 pl-4">Trigger for Deletion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-200">Newsletter Email</td>
                      <td className="py-2.5 px-4 font-mono text-xs">subscribers.json</td>
                      <td className="py-2.5 px-4">Until unsubscribed</td>
                      <td className="py-2.5 pl-4">Unsubscribe request or deletion inquiry</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-200">Contact / Feedback</td>
                      <td className="py-2.5 px-4 font-mono text-xs">contacts.json</td>
                      <td className="py-2.5 px-4">Up to 12 months</td>
                      <td className="py-2.5 pl-4">Support inquiry resolution or user request</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-200">Issue Reports</td>
                      <td className="py-2.5 px-4 font-mono text-xs">issues.json</td>
                      <td className="py-2.5 px-4">Until formula is fixed</td>
                      <td className="py-2.5 pl-4">Bug resolution or verification</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-200">Feature Suggestions</td>
                      <td className="py-2.5 px-4 font-mono text-xs">suggestions.json</td>
                      <td className="py-2.5 px-4">Roadmap lifecycle</td>
                      <td className="py-2.5 pl-4">Feature launch or user request</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. How to Unsubscribe and Delete Data */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">5</span>
                <span>How to Unsubscribe, Access, or Delete Your Data</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                You maintain complete ownership of your personal information. You have the right to request access to the data we hold regarding your email address, request corrections, or request permanent deletion of all records associated with you.
              </p>
              <div className="p-5 rounded-2xl bg-teal-100/80 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 space-y-3">
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200">Step-by-Step Data Removal Request</h3>
                    <p className="text-xs sm:text-sm text-teal-800/90 dark:text-teal-300/90 leading-relaxed mt-1">
                      To unsubscribe from email communications or permanently delete your contact history from our server storage:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-teal-800/90 dark:text-teal-300/90 mt-2">
                      <li>Send an email to <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline hover:text-teal-950 dark:hover:text-white">{CONTACT_EMAIL}</a>.</li>
                      <li>Use the subject line: <code className="font-mono bg-teal-100 dark:bg-teal-900 px-1 py-0.5 rounded font-bold">Data Deletion Request</code> or <code className="font-mono bg-teal-100 dark:bg-teal-900 px-1 py-0.5 rounded font-bold">Unsubscribe</code>.</li>
                      <li>Specify the email address you wish to have removed.</li>
                    </ol>
                    <p className="text-xs text-teal-800/80 dark:text-teal-300/80 font-medium mt-2">
                      Our engineering team will purge your record from <code className="font-mono">subscribers.json</code>, <code className="font-mono">contacts.json</code>, and related files within <strong>3 business days</strong> and confirm completion via reply email without charging any fee.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Cookies and Local Storage */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">6</span>
                <span>Browser Storage &amp; Cookies</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                This application does <strong>not</strong> use tracking cookies, cross-site advertising identifiers, or third-party marketing beacons. We use standard browser <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">localStorage</code> solely to preserve your non-sensitive interface preferences across visits:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                <li><strong>Theme Mode:</strong> Stores your light, dark, or system appearance preference.</li>
                <li><strong>Active Tool Tab:</strong> Preserves the active calculator sub-tab for your immediate session convenience.</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm mt-3">
                You can purge all browser-stored data at any time through your web browser&apos;s site settings or by using the &quot;Clear Cache&quot; option in our website footer.
              </p>
            </div>

            {/* 7. Third-Party Network Services (Google Fonts & PWA) */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">7</span>
                <span>Third-Party Network Requests &amp; Offline PWA</span>
              </h2>
              <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                <p>
                  <strong>Google Fonts:</strong> To provide legible, high-performance typography, our site loads the Plus Jakarta Sans and Inter font families from Google&apos;s Content Delivery Network (<code className="font-mono text-xs">fonts.googleapis.com</code> and <code className="font-mono text-xs">fonts.gstatic.com</code>). When your browser downloads font files, standard HTTP request metadata (your IP address and browser User-Agent) is transmitted to Google LLC as necessary to serve web assets. No calculation inputs, grades, or personal identifiers are ever transmitted to Google.
                </p>
                <p>
                  <strong>Progressive Web App (PWA) Offline Caching:</strong> We register a local service worker that caches the application&apos;s static HTML, JavaScript bundles, CSS stylesheets, and icon assets on your device. This allows all calculators to function seamlessly offline without an active internet connection. The service worker executes entirely on your device and transmits zero analytics or telemetry.
                </p>
              </div>
            </div>

            {/* 8. Contact Information */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">8</span>
                <span>Contact Email &amp; Inquiries</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-xs sm:text-sm">
                If you have questions regarding this Privacy Policy, wish to exercise your data access or deletion rights, or have inquiries regarding our data handling practices, please contact us directly:
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-teal-600 text-white text-xs sm:text-sm font-semibold hover:bg-black dark:hover:bg-teal-500 transition-colors shadow-xs active:scale-95"
                >
                  <Mail className="w-4 h-4 text-teal-400 dark:text-white" aria-hidden="true" />
                  <span>{CONTACT_EMAIL}</span>
                </a>
                <Link
                  to="/terms"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <span>Terms of Service &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Last Updated line updated to today */}
            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/80 text-xs font-mono text-slate-600 dark:text-slate-400">
              Last updated: October 4, 2026. Effective immediately for all visitors worldwide.
            </div>
          </article>
        </div>
      </div>
    </>
  );
};
