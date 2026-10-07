import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from './SlashLink';
import { FAQ, WEIGHTED_COURSE_FAQS, PAGE_FAQ_HEADINGS } from './FAQ';
import { ManualGradeHowTo } from './ManualGradeHowTo';
import { QuickGradeGuide } from './QuickGradeGuide';
import { ToolKey } from '../types';
import { BASE_CANONICAL_ORIGIN, SITE_LAUNCH_DATE, SITE_LAST_MODIFIED, CONTACT_EMAIL } from '../data/seoConfig';
import { GUIDE_IMAGES } from '../data/guideImages';
import { SemanticGuideImage } from './SemanticGuideImage';
import { GuideArticle, GUIDE_ARTICLES } from './GuideArticle';

export interface EducationalGuideProps {
  activeTool?: ToolKey;
}

/**
 * Generates Schema.org Article structured data for the Educational Guide.
 */
export function getEducationalGuideSchema(
  canonicalOrigin: string = BASE_CANONICAL_ORIGIN,
  routePath: string = '/'
) {
  const cleanOrigin = canonicalOrigin.replace(/\/+$/, '');
  const isWeighted = routePath.replace(/\/+$/, '') === '/grade-calculator';
  const normalizedPath = isWeighted ? '/grade-calculator' : '/';
  const url = `${cleanOrigin}${normalizedPath}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#educational-guide`,
    headline: isWeighted
      ? 'Weighted Course Grade & Final Exam Target Calculator Guide'
      : 'Easy Grade Calculator: Grading Percentage & Grade Calculator Guide',
    name: isWeighted
      ? 'Weighted Course Grade & Final Exam Target Calculator Guide'
      : 'Easy Grade Calculator: Grading Percentage & Grade Calculator Guide',
    description: isWeighted
      ? 'Step-by-step academic guide to weighted syllabus categories, relative weight normalization, points-based course averages, and required final exam target scores.'
      : 'Complete educational guide explaining test score percentages, wrong-answer deductions, EZ grader charts, and institutional grading scales.',
    inLanguage: 'en-US',
    datePublished: SITE_LAUNCH_DATE,
    dateModified: SITE_LAST_MODIFIED,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: `${cleanOrigin}/images/easy-grade-calculator-guide.webp`,
    author: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url: `${cleanOrigin}/`,
      email: CONTACT_EMAIL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url: `${cleanOrigin}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${cleanOrigin}/icon.svg`,
      },
    },
  };
}

export const EducationalGuide: React.FC<EducationalGuideProps> = ({ activeTool = 'quick' }) => {
  const location = useLocation();
  const isWeightedRoute = location.pathname.replace(/\/+$/, '') === '/grade-calculator';
  const guideSchema = getEducationalGuideSchema(BASE_CANONICAL_ORIGIN, location.pathname);

  // Direct DOM synchronization guarantees document.head contains updated Article JSON-LD without duplication
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (activeTool !== 'quick') {
      document.querySelector('script#schema-org-guide-article')?.remove();
      return;
    }
    let scriptTag = document.querySelector('script#schema-org-guide-article') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('id', 'schema-org-guide-article');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(guideSchema, null, 2);
    return () => {
      document.querySelector('script#schema-org-guide-article')?.remove();
    };
  }, [guideSchema, activeTool]);

  if (activeTool === 'quick' && isWeightedRoute) {
    return (
      <>
        <section className="seo-content w-full max-w-4xl mx-auto mt-12 mb-16 px-4" aria-labelledby="weighted-guide-title">
          <article className="seo-article bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 border border-white/60 dark:border-white/10 shadow-sm rounded-3xl p-6 sm:p-10 font-sans">
            <h2
              id="weighted-guide-title"
              className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-6"
            >
              Weighted Course Grade &amp; Final Exam Target Calculator Guide
            </h2>

            <div className="my-6">
              <SemanticGuideImage
                toolKey="quick"
                alt="A hand presses buttons on a pocket calculator next to a paper showing weighted course syllabus percentages and final exam targets."
              />
            </div>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              University and high school syllabi rarely treat every assignment equally. Our <strong>Weighted Grade Calculator</strong> and <strong>Final Exam Target Simulator</strong> compute your exact mid-semester course standing by weighting each assessment category—such as Homework, Labs, Quizzes, Midterm Exams, and Final Projects—according to its syllabus percentage. If you need to grade a single test by question count instead, switch to our <Link to="/" className="text-emerald-700 dark:text-emerald-400 font-semibold underline hover:text-emerald-600">Easy Grade Calculator &amp; EZ Grader Chart</Link>.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-8 mb-3">
              How Weighted Syllabus Grading Works
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              In a weighted grading system, each syllabus bucket is assigned a percentage share of the final course grade (typically totaling 100%). Your weighted average is calculated by multiplying each category&apos;s percentage score by its syllabus weight and dividing by the sum of active weights:
            </p>
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-6">
              Weighted Course Grade (%) = Σ (Category Score % × Category Weight) ÷ Σ (Active Category Weights)
            </div>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              When you calculate your standing mid-semester before the final exam has been graded, your completed category weights may only add up to 70% or 80%. The calculator automatically normalizes your earned weighted points against the active weight sum so your current letter grade reflects only completed coursework.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-8 mb-3">
              Calculating What Score You Need on Your Final Exam
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              To find the exact percentage required on a comprehensive final exam to earn a target course grade (such as 90% for an A or 80% for a B), the Target Grade Simulator solves the algebraic linear equation:
            </p>
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-6">
              Required Final Exam Score (%) = [ Target Course % − (Current Grade % × (1 − Final Weight)) ] ÷ Final Weight
            </div>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              For example, if your current course average is <strong>87.5%</strong> across completed categories worth <strong>75%</strong> of your grade, and your final exam is worth <strong>25%</strong>, reaching a <strong>90.0% (A-)</strong> requires <code className="font-mono text-xs bg-slate-200/70 dark:bg-slate-800 px-1.5 py-0.5 rounded">(90 − (87.5 × 0.75)) ÷ 0.25 = 97.5%</code> on the final exam.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-8 mb-3">
              Weighted Syllabus vs. Points-Based Grading Systems
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              You can toggle the calculator above between <strong>Weighted (%)</strong> mode and <strong>Points</strong> mode at any time:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base text-slate-600 dark:text-slate-300 mb-6">
              <li>
                <strong>Weighted Category Mode:</strong> Ideal when your syllabus specifies category percentages (e.g., Homework 15%, Labs 20%, Midterms 35%, Final Exam 30%). A 10-point quiz inside a high-weight Exam bucket carries more impact than a 100-point assignment in a low-weight Homework bucket.
              </li>
              <li>
                <strong>Total Points Mode:</strong> Ideal when your instructor grades by cumulative raw points (e.g., 420 points earned out of 500 possible points = 84.0% B). Every point carries identical weight regardless of assignment type.
              </li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-8 mb-3">
              Connecting Course Grades to Your Cumulative GPA
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Once you determine your projected letter grade for each class, enter your credit hours and letter grades into our <Link to="/gpa-calculator" className="text-emerald-700 dark:text-emerald-400 font-semibold underline hover:text-emerald-600">4.0 &amp; 5.0 Weighted GPA Calculator</Link> to see how this semester affects your cumulative college transcript, or convert international 10-point grades using the <Link to="/cgpa-to-percentage-calculator" className="text-emerald-700 dark:text-emerald-400 font-semibold underline hover:text-emerald-600">CGPA to Percentage Calculator</Link>. For standalone ratio and score increase checks, use the <Link to="/percentage-calculator" className="text-emerald-700 dark:text-emerald-400 font-semibold underline hover:text-emerald-600">Percentage Calculator</Link>.
            </p>
          </article>
        </section>

        <GuideArticle article={GUIDE_ARTICLES['weighted-grade-calculator']} className="max-w-4xl mx-auto mb-16 px-4" />

        <div className="w-full max-w-4xl mx-auto px-4 mb-16">
          <FAQ tool="quick" items={WEIGHTED_COURSE_FAQS} heading={PAGE_FAQ_HEADINGS['weighted-grade-calculator']} />
        </div>
      </>
    );
  }

  // Homepage: lean, teacher-first guide (long student-oriented copy lives on /grade-calculator/)
  if (activeTool === 'quick') {
    return <QuickGradeGuide />;
  }

  // For other tool pages, render the tool-specific FAQ accordion in an accessible SEO container
  return (
    <section className="seo-content w-full max-w-4xl mx-auto mt-12 mb-16 px-4">
      <article className="seo-article bg-gradient-to-br from-white/90 to-slate-50/85 dark:from-slate-900/90 dark:to-slate-950/85 backdrop-blur-xl border border-white/80 dark:border-slate-800/80 shadow-[0_15px_50px_rgba(0,0,0,0.06)] rounded-3xl p-6 sm:p-10 font-sans">
        <FAQ tool={activeTool} />
      </article>
    </section>
  );
};
