import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FAQ, WEIGHTED_COURSE_FAQS } from './FAQ';
import { ManualGradeHowTo } from './ManualGradeHowTo';
import { ToolKey } from '../types';
import { BASE_CANONICAL_ORIGIN, SITE_LAUNCH_DATE, SITE_LAST_MODIFIED, CONTACT_EMAIL } from '../data/seoConfig';
import { GUIDE_IMAGES } from '../data/guideImages';
import { SemanticGuideImage } from './SemanticGuideImage';

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
      name: 'Easy Grade Calculator',
      url: `${cleanOrigin}/`,
      email: CONTACT_EMAIL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Easy Grade Calculator',
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

        <div className="w-full max-w-4xl mx-auto px-4 mb-16">
          <FAQ tool="quick" items={WEIGHTED_COURSE_FAQS} />
        </div>
      </>
    );
  }

  // If activeTool is 'quick' on homepage '/', display the Easy Grade Calculator / EZ Grader educational guide along with Quick Grade FAQs
  if (activeTool === 'quick') {
    return (
      <>
        <section className="seo-content w-full max-w-4xl mx-auto mt-12 mb-16 px-4" aria-labelledby="main-guide-title">
        <article className="seo-article bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 border border-white/60 dark:border-white/10 shadow-sm rounded-3xl p-6 sm:p-10 font-sans">
          <h2
            id="main-guide-title"
            className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-6"
          >
            Easy Grade Calculator: Grading Percentage &amp; Grade Calculator Tool
          </h2>

          <div className="my-6">
            <SemanticGuideImage
              toolKey="quick"
              alt="A hand presses buttons on a pocket calculator next to a paper showing numbers and a percent sign."
            />
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            In the academic world, understanding your performance is crucial for success, ensuring you can achieve your desired letter grade and GPA. An easy grade calculator simplifies this process, allowing students to:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>Keep track of their academic progress with a course grade calculator to monitor improvements over time.</li>
            <li>Compute their current standing using a grading chart.</li>
            <li>Determine what they need to score on their final exam to achieve a desired final grade based on the weight of your final exam.</li>
          </ul>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            This online tool can be a game-changer for helping students manage their studies effectively and know your final grades.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">
            Understanding Grading Systems
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Grading systems are fundamental to academic institutions, providing a standardized method to evaluate student performance and assign a letter grade. These systems often involve a detailed calculation based on various assessments like quizzes, tests, and assignments, each contributing a certain weight to the overall grade, ultimately affecting your final exam to pass. Understanding how your institution’s grading system works is the first step toward effectively using a grade calculator to monitor your academic progress and calculate your grade.
          </p>

          <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Types of Grading Scales
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            There are several types of grading scales employed across educational institutions, each with its own method for converting raw scores into a percentage and letter grade. Common scales include a standard scale that converts raw scores into percentages and a letter grade.
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>Traditional percentage-based systems, where a direct percentage score determines the letter grade, often rely on a simple average of assessments, making it crucial to understand the final exam grade.</li>
            <li>Point-based systems, where points earned out of points possible are converted to a percentage, can be easily managed with a class grade calculator.</li>
            <li>Systems that utilize a weighted average, where different assignments have varying weights, significantly influence the final grade calculation and help students learn how to calculate their grades effectively.</li>
          </ul>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Using a weighted grade calculator can accurately compute your overall course grade under such systems.
          </p>

          <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Importance of Accurate Grading
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Accurate grading is paramount for several reasons, not least of which is providing students with a fair representation of their academic performance based on a standard scale.</strong> An accurate grader ensures that every test score and assignment contributes correctly to the overall grade, preventing discrepancies that could impact a student’s academic standing and leading to a potential failing grade. When grading is precise, students can confidently use a grade calculator to predict their final score and understand exactly what they need on their final exam to secure their desired letter grade and GPA.
          </p>

          <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mt-6 mb-3">
            How Grading Affects Overall GPA
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">The individual course grade you receive directly impacts your overall GPA, a critical metric for academic and professional opportunities on a 4.0 scale.</strong> Each letter grade is assigned a specific grade point value, which is then factored into your cumulative grade point average. Consistently earning higher marks elevates your academic standing, whereas lower scores can reduce it. Simulating potential course outcomes helps you understand how current coursework shapes your transcript and reveals whether strategic adjustments are needed to meet graduation or honor roll benchmarks.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">
            Using a Grade Calculator
          </h2>

          <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mt-6 mb-3">
            What is a Grade Calculator?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A grade calculator is an automated academic utility that aggregates student marks into an overall course percentage and corresponding letter grade. Rather than balancing arithmetic by hand, students and educators can enter scores across homework assignments, quizzes, lab reports, and midterm exams. By factoring in institutional grading thresholds and category weights, the calculator provides an immediate, objective overview of cumulative performance.
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 dark:text-gray-300 leading-relaxed">
            <li>Examinations and midterms with significant percentage weights</li>
            <li>Weekly quizzes and recurring formative assessments</li>
            <li>Individual homework assignments, projects, and lab submissions</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Benefits of an Online Grade Calculator
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            <strong className="font-semibold text-gray-900 dark:text-white">Utilizing an online grade calculator offers numerous benefits for helping students manage their academic journey effectively, including the ability to check your syllabus for grading criteria. It allows for real-time tracking of one's progress, helping students to compute their current overall grade and understand how each test score or assignment contributes to their final grade. Furthermore, a final exam calculator feature can help determine the exact score you need on your final exam to achieve a desired semester grade, providing motivation and a clear academic goal.</strong>
          </p>

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            How to Use an Easy Grader Tool
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Using an easy grader tool is straightforward and intuitive, allowing students to grade instantly and see their scores in both percentage and a letter format. First, input all your points earned and points possible for each assignment, quiz, and test score. Next, if applicable, assign the correct weight to each category according to your course syllabus. The grade calculator will then perform a swift calculation, presenting your current percentage score and corresponding letter grade, thus providing an instant overall course grade update. This process ensures accurate grading throughout the semester, which is vital for maintaining a fair assessment based on a standard scale.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4 tracking-tight">
            Calculating Your Final Grade
          </h2>

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Steps to Calculate Your Final Grade
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            To calculate your final grade manually, follow the structured methodology below. It covers weighted category contributions, points-based sums, and required final exam target scores.
          </p>

          <ManualGradeHowTo className="my-8" />

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Understanding Weighted Grades
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            <strong className="font-semibold text-gray-900 dark:text-white">Understanding weighted grades is paramount for accurate grade calculation, especially when teachers grading practices vary. In courses with weighted categories, different assignments, quizzes, or tests contribute varying percentages to your overall grade, making it crucial to track the number of correct or incorrect answers. A weighted grade calculator is essential here, as it accurately accounts for these differing weights and helps prevent manual math errors.</strong> For instance, a final exam might carry a higher weight than a weekly quiz, significantly impacting your final grade calculation and the percentage you need to achieve on your upcoming test. Correctly applying these weights ensures your percentage and letter grade accurately reflect your performance.
          </p>

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Final Exam Score Calculation
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            <strong className="font-semibold text-gray-900 dark:text-white">Calculating your final exam score is often a critical step for determining your overall course grade. A final exam calculator within a grade calculator helps you determine the exact score you need on your final exam to achieve your desired semester grade.</strong> This calculation takes into account your current percentage score and the weight of the final exam, providing a clear target. This can be a highly motivating factor for helping students focus their study efforts, especially when they can see their potential grade for this test.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4 tracking-tight">
            Calculating Test Scores and Percentages
          </h2>

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            How to Calculate Your Test Grade
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            To calculate your test grade, you typically need to determine the number of correct answers you achieved out of the total points possible for that particular test score, which can be converted to score as a percentage. For instance, if a test has 50 questions and you answer 45 correctly, your raw score is 45 out of 50, which can be converted into a percentage. To convert this into a percentage, you would then use a percentage calculator by dividing 45 by the total number of questions and multiplying by 100, providing your percentage score for that test. This percentage then corresponds to a letter grade on your institution's grading scale, allowing you to compute your test performance.
          </p>

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Using Percentage Calculator for Grades
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            <strong className="font-semibold text-gray-900 dark:text-white">A percentage calculator is an indispensable online tool for helping students understand their academic standing by quickly converting raw scores into a percentage and letter grade.</strong> When you input the points earned and the points possible for any assignment or test score, the calculator performs an instant calculation to provide your percentage. This is crucial for maintaining an accurate overall grade, especially when needing to calculate test scores, quiz grades, or even to compute what you need on your final exam. An easy grader often integrates this functionality to enhance teachers' grading efficiency, allowing them to quickly learn how to calculate final grades.
          </p>

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Determining Grade Average
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Determining your grade average involves summing up all your individual test score percentages and dividing by the number of scores, assuming all assignments carry equal weight. However, for a more accurate overall grade, especially when dealing with weighted grades, a weighted grade calculator is essential for determining your final exam grade. This allows you to compute a weighted average, reflecting how each component contributes to your final grade. A grade average calculator provides a comprehensive view of your academic progress, helping students understand their current standing and their simple average.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4 tracking-tight">
            Advanced Grading Calculations
          </h2>

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Final Grade Calculator Explained
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            <strong className="font-semibold text-gray-900 dark:text-white">A final grade calculator helps students forecast their final standing by evaluating earned coursework against the remaining weight of the final examination.</strong> By entering your current course average alongside the final exam’s syllabus percentage, the tool computes the exact score needed on test day to secure your desired letter grade. This calculation provides focused academic clarity, allowing you to prioritize study hours where they matter most.
          </p>

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Using an EZ Grader for Quick Results
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            <strong className="font-semibold text-gray-900 dark:text-white">An EZ grader simplifies score evaluation by generating an instant grading breakdown from raw assessment figures.</strong> Instructors and students simply enter points earned against points possible—or the total question count alongside missed items. The system immediately outputs the corresponding percentage and letter grade, streamlining paper evaluation and progress monitoring without tedious manual arithmetic.
          </p>

          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Calculating Points per Question
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Calculating points per question is a fundamental step in determining an accurate test score, especially for objective assessments. If a test has 100 points possible and 20 questions, each correct answer is worth 5 points. An easy grader can automate this calculation when you input the total number of questions and the number of questions answered correctly, helping students understand the value of each correct answer while checking their grade for this test. This granular detail aids in comprehending the impact of individual responses on the overall grade and percentage score, ensuring a precise calculation.
          </p>

          <div className="my-8 p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Explore Related Academic &amp; Grading Calculators
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Need to convert university grade points, compute your 4.0 scale semester GPA, or solve percentage changes? Switch to our connected tools:
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/cgpa-to-percentage-calculator"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center transition-colors no-underline"
              >
                CGPA to Percentage Calculator &rarr;
              </Link>
              <Link
                to="/gpa-calculator"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold inline-flex items-center justify-center transition-colors no-underline"
              >
                4.0 Scale GPA Calculator
              </Link>
              <Link
                to="/percentage-calculator"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold inline-flex items-center justify-center transition-colors no-underline"
              >
                Percentage Calculator
              </Link>
            </div>
          </div>

          {/* Interactive Accordion FAQ Component configured for Quick Grade tool */}
          <FAQ tool="quick" />
        </article>
      </section>
      </>
    );
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
