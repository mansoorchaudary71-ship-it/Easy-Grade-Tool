import { DEFAULT_BONUS, calculateWeightedGpa, pointsForLetter } from '../utils/gpaMath';
import type { ToolPageEntry } from './toolPages';

/**
 * High-school and college GPA pages. Worked examples are computed with
 * calculateWeightedGpa — the same maths the weighted GPA tool uses — so the
 * numbers on the page can never disagree with the calculator.
 */

const HS_COURSES = [
  { name: 'AP Calculus', letter: 'A', credits: 1, level: 'ap' as const },
  { name: 'Honors English', letter: 'B+', credits: 1, level: 'honors' as const },
  { name: 'US History', letter: 'A', credits: 1, level: 'regular' as const },
  { name: 'AP Biology', letter: 'B', credits: 1, level: 'ap' as const },
  { name: 'Spanish II', letter: 'A', credits: 1, level: 'regular' as const },
];

const COLLEGE_COURSES = [
  { name: 'Biology', letter: 'A', credits: 4, level: 'regular' as const },
  { name: 'English Composition', letter: 'A-', credits: 3, level: 'regular' as const },
  { name: 'College Algebra', letter: 'B+', credits: 3, level: 'regular' as const },
  { name: 'History', letter: 'B', credits: 3, level: 'regular' as const },
  { name: 'Art', letter: 'A', credits: 2, level: 'regular' as const },
];

const hsResult = calculateWeightedGpa(HS_COURSES, DEFAULT_BONUS)!;
const collegeResult = calculateWeightedGpa(COLLEGE_COURSES, DEFAULT_BONUS)!;
const collegeYear1Points = collegeResult.unweighted * collegeResult.totalCredits;
const collegeYear2Points = 4.0 * 15;
const collegeCombinedGpa = (collegeYear1Points + collegeYear2Points) / (collegeResult.totalCredits + 15);

const hsRelated: ToolPageEntry['related'] = [
  { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'The same honors and AP bonuses on your own courses.' },
  { path: '/college-gpa-calculator/', label: 'College GPA calculator', blurb: 'What changes when credits replace equal-weighted courses.' },
  { path: '/cumulative-gpa-calculator/', label: 'Cumulative GPA calculator', blurb: 'How semesters combine across a whole degree.' },
  { path: '/blog/high-school-vs-college-gpa/', label: 'High school vs college GPA', blurb: 'The same grades computed three ways.' },
];

const collegeRelated: ToolPageEntry['related'] = [
  { path: '/semester-gpa-calculator/', label: 'Semester GPA calculator', blurb: 'One term of courses, grades and credit hours.' },
  { path: '/cumulative-gpa-calculator/', label: 'Cumulative GPA calculator', blurb: 'Add this semester to everything before it.' },
  { path: '/high-school-gpa-calculator/', label: 'High school GPA calculator', blurb: 'Where the GPA you arrived with came from.' },
  { path: '/final-grade-planner/', label: 'Final grade planner', blurb: 'What every class needs on its final exam.' },
];

export function buildHighSchoolGpaPage(): ToolPageEntry {
  return {
    slug: 'high-school-gpa-calculator',
    path: '/high-school-gpa-calculator/',
    navLabel: 'High school GPA calculator',
    h1: 'High School GPA Calculator',
    title: 'High School GPA Calculator — Weighted & Unweighted',
    metaDescription:
      'Free high school GPA calculator: enter courses with regular, honors and AP levels to see weighted and unweighted GPA side by side, on the 4.0 scale.',
    badge: 'High school GPA',
    intro: `High school GPA comes in two versions: unweighted (every A is 4.0, whatever the course) and weighted (honors and AP courses earn bonus points). The example below gives ${hsResult.unweighted.toFixed(2)} unweighted and ${hsResult.weighted.toFixed(2)} weighted — enter your own courses and the calculator shows both, with the bonus values your school uses.`,
    keywords: [
      'high school gpa calculator',
      'weighted high school gpa calculator',
      'unweighted gpa calculator',
      'ap gpa calculator',
      'honors gpa calculator',
      'high school weighted gpa',
    ],
    featureList: [
      'Regular, honors and AP course levels',
      'Weighted and unweighted GPA side by side',
      'Adjustable honors and AP bonuses',
      'Courses saved on this device only',
      'Free, no sign-up, nothing uploaded',
    ],
    sections: [
      {
        heading: 'How high school GPA works',
        paragraphs: [
          'Unweighted GPA treats every course the same: A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0, averaged over courses. Weighted GPA adds a bonus for harder courses — the common model adds 0.5 for honors and 1.0 for AP/IB, so an A in AP Calculus counts as 5.0 instead of 4.0. That is why weighted GPAs can rise above 4.0.',
          'The catch: bonus values differ by district. Some schools add 0.5 for AP instead of 1.0, some weight only AP and not honors, and some report weighted GPA on a 5.0 scale. The calculator lets you change both bonuses, so set them to your school’s table before trusting the weighted figure officially.',
        ],
      },
      {
        heading: 'Weighted vs unweighted: which do colleges see?',
        paragraphs: [
          'Usually both. Your transcript normally shows the school’s own GPA, and many colleges recompute an unweighted GPA from your letter grades so applicants from different weighting systems compare fairly. A weighted GPA above 4.0 signals course rigor; an unweighted GPA signals raw grades. Neither alone tells the whole story, which is why this calculator shows both side by side.',
        ],
        bullets: [
          'Unweighted GPA: pure grades, capped at 4.0.',
          'Weighted GPA: grades plus difficulty bonuses, can exceed 4.0.',
          'Class rank, where a school reports it, usually uses the weighted figure.',
        ],
      },
      {
        heading: 'High school GPA without credit hours',
        paragraphs: [
          'Most high school courses carry equal weight — one credit each — so the calculator treats every course as one credit by default. If your school weights a course differently (a double-period lab, for example), change its credit value and the average follows the same quality-points maths as a college GPA.',
        ],
      },
      {
        heading: 'AP, IB and dual enrollment',
        paragraphs: [
          'AP and IB courses are the usual source of weighting bonuses, and the calculator treats them the same way: pick the AP level for AP and IB courses and the bonus applies. Dual enrollment is different — those are real college courses taken during high school, so they often appear on both a high school transcript and a future college transcript. How the bonus applies to them is set by the high school, and whether the college counts them again is set by the college, so confirm both before assuming either.',
        ],
      },
      {
        heading: 'Class rank and the weighted GPA',
        paragraphs: [
          'Where a school reports class rank, it usually ranks on the weighted GPA, because that is the figure that rewards harder courses. That also means rank depends on the cohort: the same weighted GPA can rank differently in a class full of AP students than in one with few. Some schools have stopped ranking entirely for exactly that reason, reporting deciles or nothing at all. Rank is a comparison inside one school, never a national measure.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: five courses, weighted and unweighted',
      scenario: 'Five one-credit courses, two of them weighted (AP Calculus and AP Biology) and one honors.',
      rows: [
        ...HS_COURSES.map((c) => ({
          label: `${c.name}: ${c.letter} (${c.level})`,
          value: c.level === 'ap' ? 'AP bonus +1.0' : c.level === 'honors' ? 'Honors bonus +0.5' : 'No bonus',
        })),
        { label: 'Unweighted GPA', value: hsResult.unweighted.toFixed(2) },
        { label: 'Weighted GPA', value: hsResult.weighted.toFixed(2) },
      ],
      takeaway:
        'The same grades give two different GPAs: weighting lifts the result because two of the five courses are AP. Change the bonuses to your school’s table and both figures update.',
    },
    faqs: [
      {
        question: 'What is a good high school GPA?',
        answer:
          'On the unweighted 4.0 scale, 3.0 is a B average and 3.5 or above is strong at most schools; on a weighted scale the same record reads higher because of AP and honors bonuses. Colleges compare your GPA with your school’s profile and course rigor, not against one national cutoff.',
      },
      {
        question: 'How is weighted high school GPA calculated?',
        answer:
          'Add the bonus to each weighted course’s grade points (commonly +0.5 for honors, +1.0 for AP/IB), multiply by credits, add the quality points and divide by total credits. The calculator does this with bonuses you can change to match your district.',
      },
      {
        question: 'Can weighted GPA go above 4.0?',
        answer:
          'Yes. Because AP courses can count as 5.0, a student with mostly AP As can hold a weighted GPA above 4.0 — sometimes above 5.0 on a 5.0 scale. Unweighted GPA never exceeds 4.0.',
      },
      {
        question: 'Do colleges use weighted or unweighted GPA?',
        answer:
          'Both, in different ways. Many colleges recompute an unweighted GPA from your grades for fair comparison, while also noting course rigor from the weighted figure and your transcript. Report the GPA your school prints, and let the college recompute.',
      },
      {
        question: 'Does dual enrollment boost weighted GPA?',
        answer:
          'It depends on the high school: some weight dual enrollment like AP, some like honors, and some not at all. The calculator lets you pick the level per course, so set dual enrollment courses to whatever your school’s table says rather than assuming the AP bonus.',
      },
      {
        question: 'Do colleges recalculate my high school GPA?',
        answer:
          'Many do, usually to an unweighted 4.0 figure from your letter grades, so that applicants from different weighting systems compare fairly. That is why the calculator shows both figures: the weighted one your school reports, and the unweighted one colleges often derive.',
      },
    ],
    faqHeading: {
      eyebrow: 'High school GPA FAQs',
      title: 'High school GPA questions',
      description: 'Weighted vs unweighted, AP bonuses, and what colleges actually use.',
      ctaText: 'Calculate a high school GPA',
    },
    related: hsRelated,
  };
}

export function buildCollegeGpaPage(): ToolPageEntry {
  return {
    slug: 'college-gpa-calculator',
    path: '/college-gpa-calculator/',
    navLabel: 'College GPA calculator',
    h1: 'College GPA Calculator',
    title: 'College GPA Calculator — Semester & Cumulative, 4.0 Scale',
    metaDescription:
      'Free college GPA calculator: enter courses, letter grades and credit hours to get your semester GPA on the 4.0 scale, then combine it into a cumulative GPA.',
    badge: 'College GPA',
    intro: `College GPA is credit-weighted: a 4-credit course moves your GPA more than a 2-credit one with the same grade. The example below totals ${collegeResult.totalCredits} credits for a GPA of ${collegeResult.unweighted.toFixed(2)}. Enter your own courses and credits, then add your previous GPA and credits for the cumulative figure.`,
    keywords: [
      'college gpa calculator',
      'university gpa calculator',
      'calculate college gpa',
      'semester gpa college',
      'college grade point average',
    ],
    featureList: [
      'Credit-hour weighting, the way colleges compute it',
      'Letter grades on the full plus/minus scale',
      'Semester result plus cumulative with prior GPA',
      'Courses saved on this device only',
      'Free, no sign-up, nothing uploaded',
    ],
    sections: [
      {
        heading: 'How college GPA is calculated',
        paragraphs: [
          'Convert each letter grade to grade points (A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0 and so on), multiply by the course’s credit hours to get quality points, add all quality points and divide by total credit hours. That quotient is the semester GPA. The cumulative GPA repeats the same calculation across every semester, so early semesters count just as much as later ones.',
        ],
        bullets: [
          'Credits decide weight: 4 credits of A beat 2 credits of A, twice over.',
          'Pass/fail courses are normally excluded from GPA — leave them out.',
          'Withdrawals usually do not count either, unless your catalog says otherwise.',
          'Repeated courses follow your catalog: replacement or averaging, never both.',
        ],
      },
      {
        heading: 'Semester GPA vs cumulative GPA',
        paragraphs: [
          'The semester GPA describes one term. The cumulative GPA describes your whole record, and it moves slowly once you have many credits banked: a single strong semester lifts a first-year cumulative a lot and a final-year cumulative only a little. If your cumulative is below a goal (a scholarship, a program cutoff, good standing), the semester GPA you need is higher than the goal itself — work backwards from the cumulative calculator before the semester starts.',
        ],
      },
      {
        heading: 'What college GPA do you need?',
        paragraphs: [
          'It depends on the goal, and the honest answer is that thresholds differ: many schools set good standing around 2.0, many scholarships and programs ask for 3.0 or higher, and competitive graduate programs often look for 3.5 and above. Check your catalog and your program’s page rather than trusting a single number — then use the target-GPA solver on the cumulative calculator to see what each future semester must deliver.',
        ],
      },
      {
        heading: 'College GPA by year: why early semesters weigh more',
        paragraphs: [
          `Cumulative GPA is a running average, so each new semester joins everything before it. Take the example above: ${collegeResult.totalCredits} credits at ${collegeResult.unweighted.toFixed(2)} give ${collegeYear1Points.toFixed(1)} quality points. Add a perfect 15-credit semester (60.0 quality points) and the cumulative becomes ${collegeCombinedGpa.toFixed(2)} — strong, but not 4.00, because the first ${collegeResult.totalCredits} credits are still in the average. The same perfect semester in the final year, with 90 credits already banked, would move the cumulative far less. Early semesters deserve disproportionate attention for exactly this reason.`,
        ],
      },
      {
        heading: 'Transfer GPA: what moves with you',
        paragraphs: [
          'Transfer credits usually move as credits earned toward the degree, but the GPA at the new school is usually computed from courses taken there, not imported from the old transcript. That means a transfer student often starts with a fresh GPA at the new institution while keeping the credits. Policies differ — some programs factor transfer grades into program GPA — so the receiving school’s catalog, not a general rule, decides.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: a five-course college semester',
      scenario: `Five courses, ${collegeResult.totalCredits} credit hours in total. Quality points are grade points × credits.`,
      rows: [
        ...COLLEGE_COURSES.map((c) => ({
          label: `${c.name}: ${c.letter}, ${c.credits} credits`,
          value: `${((pointsForLetter(c.letter) ?? 0) * c.credits).toFixed(1)} quality points`,
        })),
        { label: 'Total quality points', value: (collegeResult.unweighted * collegeResult.totalCredits).toFixed(1) },
        { label: 'Semester GPA', value: collegeResult.unweighted.toFixed(2) },
      ],
      takeaway:
        'Credit hours decide the result: the 4-credit A contributes more than the 2-credit A. Swap any grade or credit value and the GPA follows the same formula.',
    },
    faqs: [
      {
        question: 'How do I calculate my college GPA?',
        answer:
          'Multiply each course’s grade points by its credit hours, add the quality points, and divide by total credit hours. The semester calculator does exactly this; add prior GPA and credits for the cumulative figure.',
      },
      {
        question: 'What is a good college GPA?',
        answer:
          'Around 3.0 is a B average and the usual floor for many scholarships and programs; 3.5 and above is strong for competitive graduate programs. The binding number is always your school’s or program’s own cutoff, not a national standard.',
      },
      {
        question: 'Do pass/fail courses affect GPA?',
        answer:
          'Normally no: pass/fail courses are excluded from both quality points and total credits in GPA maths. If your school counts them differently, its catalog governs.',
      },
      {
        question: 'Can I raise my cumulative GPA quickly?',
        answer:
          'Only slowly once many credits are banked, because each new semester is averaged with everything before it. The fastest honest levers are strong grades in high-credit courses and, where your school allows it, retaking a low grade under a replacement policy.',
      },
      {
        question: 'Do transfer credits affect my GPA?',
        answer:
          'Usually not at the new school: transfer credits normally count toward the degree while the new GPA is computed from courses taken there. Some programs are exceptions and factor transfer grades into a program GPA, so check the receiving school’s catalog.',
      },
      {
        question: 'Can I retake a course to raise my GPA?',
        answer:
          'Where your school allows it, yes — but the mechanism matters. Under replacement, the new grade replaces the old one in the GPA; under averaging, both grades count. The catalog states which applies, and some schools limit how many retakes or which grades qualify.',
      },
      {
        question: 'Does a minor affect my GPA?',
        answer:
          'Minor courses count in your overall GPA exactly like any other courses, because the overall GPA averages everything. A program or major GPA is a separate figure that averages only the courses in that program, so a minor can lift or lower the overall GPA while leaving the major GPA untouched.',
      },
    ],
    faqHeading: {
      eyebrow: 'College GPA FAQs',
      title: 'College GPA questions',
      description: 'Credit hours, semester vs cumulative, and the goals that actually matter.',
      ctaText: 'Calculate a college GPA',
    },
    related: collegeRelated,
  };
}
