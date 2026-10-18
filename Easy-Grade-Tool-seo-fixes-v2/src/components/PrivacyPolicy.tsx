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
        schemaType={seo.schemaType}
      />

      <ToolHeading
        badge="Legal & Privacy"
        title="Privacy Policy"
        description="Transparent disclosure of how our calculation suite operates locally in your browser and how voluntary form submissions are processed and stored."
      />

      <div className="relative tool-layout font-sans">
        <AmbientAura />

        <div className="w-full max-w-4xl mx-auto space-y-8 min-w-0 [overflow-wrap:anywhere]">
          {/* Key Privacy Highlights Card */}
          <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm p-6 sm:p-8 md:p-10 w-full">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Core Privacy Architecture</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              Easy Grade Tool gives you fast school tools and is open about how it works. Calculations run in your browser. Things you choose to send us, such as newsletter sign-ups and support messages, are handled on our server and kept for a set time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <Laptop className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">In-Browser Calculations</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Grades, weights, GPA, loan amounts and test scores stay in your device&apos;s memory. They are never sent to our servers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Voluntary Submissions</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  When you send a newsletter sign-up, feedback or issue report, we store only what you submit.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Local Cryptography</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Password generation uses your browser&apos;s built-in Web Cryptography tool. It makes no network requests.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Policy Article */}
          <article className="seo-article bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm p-6 sm:p-10 font-sans space-y-8">
            
            {/* 1. In-Browser Calculator Processing */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">1</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">Calculators Run Locally in the Browser</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Every calculator on this site, including the <Link to="/" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Quick Grade Chart</Link>, <Link to="/grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Weighted Grade Calculator</Link>, <Link to="/gpa-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">GPA Calculator</Link>, <Link to="/cgpa-to-percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">CGPA to Percentage Calculator</Link>, <Link to="/percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Percentage Calculator</Link>, <Link to="/tip-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Tip Calculator</Link>, <Link to="/loan-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Loan &amp; Mortgage Calculator</Link>, and <Link to="/password-generator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Password Generator</Link>, runs fully in your web browser using JavaScript and HTML5.
              </p>
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Nothing you calculate is sent to our servers:</strong> Course names, scores, weights, GPA scales, loan amounts, interest rates and passwords stay in your browser.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>No accounts or logins:</strong> You do not need to sign up, give your name or log in to use any calculator.</span>
                </div>
              </div>
            </div>

            {/* 2. Voluntary Data Submissions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">2</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">What We Collect and Store</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We only get and keep personal data when you choose to send it through one of our forms. Below is every place where we collect data:
              </p>

              <div className="space-y-4">
                {/* 2.1 Newsletter */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>A. Newsletter &amp; Product Updates (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/subscribe</code>)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    When you sign up for updates with the footer form, your details travel to our server over a secure HTTPS link.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li><strong>What we store:</strong> Your email address, the time you signed up and a sign-up ID.</li>
                    <li><strong>Why:</strong> To email you about new calculators, grading scale updates and major new features.</li>
                    <li><strong>Email service:</strong> If email sending is turned on, we use our email provider (Resend) only to deliver the message you asked for.</li>
                  </ul>
                </div>

                {/* 2.2 Contact / Feedback */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>B. Contact &amp; Feedback Form (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/contact</code>)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    When you write to us through the Contact &amp; Feedback form, your message goes to our server so a person can read it.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li><strong>What we store:</strong> Your name (or &quot;Anonymous Learner&quot; if left blank), email, subject, feedback type, message, optional rating, the time sent and your browser&apos;s User-Agent text.</li>
                    <li><strong>Why:</strong> To answer your request, help with calculations and read user feedback.</li>
                  </ul>
                </div>

                {/* 2.3 Report an Issue */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>C. Formula Error &amp; Bug Report (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/report-issue</code>)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    When you report a formula error or bug with the Report Issue form:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li><strong>What we store:</strong> The calculator name, issue title and details, expected result, actual result, your email (if you give one), a ticket ID and the time.</li>
                    <li><strong>Why:</strong> To find and fix formula errors and school grading scales, and to tell you when the issue is fixed.</li>
                  </ul>
                </div>

                {/* 2.4 Feature Suggestion */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <Laptop className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>D. Feature Suggestions (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/suggest-feature</code>)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    We store the feature name, type, description, your email (optional) and the time. We use these to decide which tools to build next on our public roadmap.
                  </p>
                </div>

                {/* 2.5 Operational & Status Endpoints */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span>E. Status &amp; Counter Endpoints</span>
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li><strong>Health &amp; Stats (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">GET /api/health</code>, <code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">GET /api/stats</code>):</strong> Public checks that show server uptime, the number of calculators and total submissions. They never show student data or personal records.</li>
                    <li><strong>Share Counter (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/share</code>):</strong> Adds one to a plain counter when someone clicks Share. We store no user ID or IP address with it.</li>
                    <li><strong>Backup Check (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">POST /api/backup-data</code>):</strong> Counts the items in a data export from your browser. We do not keep your calculation data.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Storage Location & Security */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">3</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">Where Your Data Is Stored &amp; How We Protect It</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Form submissions are saved in JSON files inside a protected folder (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">server-data/</code>) on our hosting server:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-4">
                <li><code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">subscribers.json</code>: Newsletter subscriber records (email, time, sign-up ID).</li>
                <li><code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">contacts.json</code>: Contact, feedback and support messages.</li>
                <li><code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">issues.json</code>: Bug tickets and formula error reports.</li>
                <li><code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">suggestions.json</code>: Tool suggestions from visitors.</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                <strong>Security:</strong> All transfers use HTTPS. We clean text inputs to remove harmful characters and HTML code. Forms have rate limits (15 requests per 5 minutes per connection) to stop bots and abuse.
              </p>
            </div>

            {/* 4. Data Retention */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">4</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">Data Retention Policy</h2>
              </div>
              <div className="w-full">
                <table className="block sm:table w-full text-left text-xs sm:text-sm border-collapse">
                  <thead className="hidden sm:table-header-group">
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
                      <th className="py-2.5 pr-4">Data Type</th>
                      <th className="py-2.5 px-4">Storage File</th>
                      <th className="py-2.5 px-4">Retention Period</th>
                      <th className="py-2.5 pl-4">Trigger for Deletion</th>
                    </tr>
                  </thead>
                  <tbody className="block sm:table-row-group sm:divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
                    <tr className="block sm:table-row rounded-xl sm:rounded-none border border-slate-200 dark:border-slate-700 sm:border-0 p-3 sm:p-0 mb-3 sm:mb-0">
                      <td data-label="Data Type" className="block sm:table-cell py-1 sm:py-2.5 sm:pr-4 font-semibold text-slate-800 dark:text-slate-200 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Newsletter Email</td>
                      <td data-label="Storage File" className="block sm:table-cell py-1 sm:py-2.5 sm:px-4 font-mono text-xs before:content-[attr(data-label)] before:mr-2 before:font-sans before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">subscribers.json</td>
                      <td data-label="Retention Period" className="block sm:table-cell py-1 sm:py-2.5 sm:px-4 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Until unsubscribed</td>
                      <td data-label="Trigger for Deletion" className="block sm:table-cell py-1 sm:py-2.5 sm:pl-4 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Unsubscribe or deletion request</td>
                    </tr>
                    <tr className="block sm:table-row rounded-xl sm:rounded-none border border-slate-200 dark:border-slate-700 sm:border-0 p-3 sm:p-0 mb-3 sm:mb-0">
                      <td data-label="Data Type" className="block sm:table-cell py-1 sm:py-2.5 sm:pr-4 font-semibold text-slate-800 dark:text-slate-200 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Contact / Feedback</td>
                      <td data-label="Storage File" className="block sm:table-cell py-1 sm:py-2.5 sm:px-4 font-mono text-xs before:content-[attr(data-label)] before:mr-2 before:font-sans before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">contacts.json</td>
                      <td data-label="Retention Period" className="block sm:table-cell py-1 sm:py-2.5 sm:px-4 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Up to 12 months</td>
                      <td data-label="Trigger for Deletion" className="block sm:table-cell py-1 sm:py-2.5 sm:pl-4 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Request answered, or you ask us to delete it</td>
                    </tr>
                    <tr className="block sm:table-row rounded-xl sm:rounded-none border border-slate-200 dark:border-slate-700 sm:border-0 p-3 sm:p-0 mb-3 sm:mb-0">
                      <td data-label="Data Type" className="block sm:table-cell py-1 sm:py-2.5 sm:pr-4 font-semibold text-slate-800 dark:text-slate-200 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Issue Reports</td>
                      <td data-label="Storage File" className="block sm:table-cell py-1 sm:py-2.5 sm:px-4 font-mono text-xs before:content-[attr(data-label)] before:mr-2 before:font-sans before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">issues.json</td>
                      <td data-label="Retention Period" className="block sm:table-cell py-1 sm:py-2.5 sm:px-4 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Until formula is fixed</td>
                      <td data-label="Trigger for Deletion" className="block sm:table-cell py-1 sm:py-2.5 sm:pl-4 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Bug fixed or checked</td>
                    </tr>
                    <tr className="block sm:table-row rounded-xl sm:rounded-none border border-slate-200 dark:border-slate-700 sm:border-0 p-3 sm:p-0 mb-3 sm:mb-0">
                      <td data-label="Data Type" className="block sm:table-cell py-1 sm:py-2.5 sm:pr-4 font-semibold text-slate-800 dark:text-slate-200 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Feature Suggestions</td>
                      <td data-label="Storage File" className="block sm:table-cell py-1 sm:py-2.5 sm:px-4 font-mono text-xs before:content-[attr(data-label)] before:mr-2 before:font-sans before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">suggestions.json</td>
                      <td data-label="Retention Period" className="block sm:table-cell py-1 sm:py-2.5 sm:px-4 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Roadmap lifecycle</td>
                      <td data-label="Trigger for Deletion" className="block sm:table-cell py-1 sm:py-2.5 sm:pl-4 before:content-[attr(data-label)] before:mr-2 before:font-bold before:text-slate-900 dark:before:text-white sm:before:content-none">Feature launched, or you ask us to delete it</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. How to Unsubscribe and Delete Data */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">5</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">How to Unsubscribe or Delete Your Data</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Your information is yours. You can ask to see the data we hold about your email, ask us to fix it, or ask us to delete it for good.
              </p>
              <div className="p-5 rounded-2xl bg-teal-100/80 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 space-y-3">
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200">How to Ask Us to Delete Your Data</h3>
                    <p className="text-xs sm:text-sm text-teal-800/90 dark:text-teal-300/90 leading-relaxed mt-1">
                      To unsubscribe from emails or have your contact history deleted from our server:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-teal-800/90 dark:text-teal-300/90 mt-2">
                      <li>Email us at <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline hover:text-teal-950 dark:hover:text-white">{CONTACT_EMAIL}</a>.</li>
                      <li>Use this subject line: <code className="font-mono bg-teal-100 dark:bg-teal-900 px-1 py-0.5 rounded font-bold">Data Deletion Request</code> or <code className="font-mono bg-teal-100 dark:bg-teal-900 px-1 py-0.5 rounded font-bold">Unsubscribe</code>.</li>
                      <li>Tell us which email address to remove.</li>
                    </ol>
                    <p className="text-xs text-teal-800/80 dark:text-teal-300/80 font-medium mt-2">
                      We will remove your records from <code className="font-mono">subscribers.json</code>, <code className="font-mono">contacts.json</code> and related files within <strong>3 business days</strong>. We will confirm by email, free of charge.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Cookies and Local Storage */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">6</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">Browser Storage &amp; Cookies</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                We do <strong>not</strong> use tracking cookies, cross-site ad IDs or third-party marketing tags. We use your browser&apos;s <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">localStorage</code> only to save simple display settings between visits:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                <li><strong>Theme mode:</strong> Your light, dark or system choice.</li>
                <li><strong>Active tool tab:</strong> The calculator tab you last used, for this visit.</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm mt-3">
                You can clear all stored data at any time in your browser&apos;s site settings or with the &quot;Clear Cache&quot; option in our footer.
              </p>
            </div>

            {/* 7. Third-Party Network Services (Google Fonts & PWA) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">7</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">Fonts &amp; Offline App</h2>
              </div>
              <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                <p>
                  <strong>Fonts:</strong> The Plus Jakarta Sans and Inter fonts are served from our own site. Your browser does not contact Google or any other outside font service to load them.
                </p>
                <p>
                  <strong>Offline app (PWA):</strong> A small service worker saves the site&apos;s pages, scripts, styles and icons on your device. This lets the calculators work without internet. It runs only on your device and sends no analytics or tracking data.
                </p>
              </div>
            </div>

            {/* 8. Contact Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-sm font-bold">8</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">Contact Us</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-xs sm:text-sm">
                Questions about this policy? Want to see or delete your data? Contact us:
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
