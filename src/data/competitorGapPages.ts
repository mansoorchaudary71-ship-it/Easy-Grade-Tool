import type { ToolPageEntry } from './toolPages';
import { calculateTestGrade, percentToLetter, roundTo, SCALE_STANDARD } from '../utils/academicMath';

/**
 * Six pages from the 2026-10-28 competitor-gap research. Every number below
 * is computed from the shared math, and every paragraph is original copy:
 * no competitor text is reproduced anywhere in this file.
 */

/* ---------------- (a) Target GPA / GPA planner (one page, both phrases) ---------------- */

const tgtCurrent = 3.2;
const tgtDone = 30;
const tgtTarget = 3.5;
const tgtPlanned = 15;
const tgtTotal = tgtDone + tgtPlanned;
const tgtRequired = (tgtTarget * tgtTotal - tgtCurrent * tgtDone) / tgtPlanned;
const tgtMax = (tgtCurrent * tgtDone + 4.0 * tgtPlanned) / tgtTotal;
// Same target with twice the planned credits, for the retarget contrast.
const tgtRequiredMore = (tgtTarget * (tgtDone + 30) - tgtCurrent * tgtDone) / 30;
// Late in a degree the same effort moves the average less: 90 credits done.
const tgtMaxLate = (tgtCurrent * 90 + 4.0 * 15) / 105;

const targetGpaPage: ToolPageEntry = {
  slug: 'target-gpa-calculator',
  path: '/target-gpa-calculator/',
  navLabel: 'Target GPA calculator',
  h1: 'Target GPA Calculator',
  title: 'Target GPA Calculator — Plan the Grades You Need',
  metaDescription:
    'Free target GPA calculator: enter your current GPA, completed credits and target to see the GPA you need next term — and whether it is still possible.',
  badge: 'GPA planning',
  intro:
    'A target GPA is a backwards question: not "what GPA will I get?" but "what GPA must I average from here to finish where I want?" Enter your current GPA, the credits already behind you, the target, and the credits still to take. The planner solves the required average — and says plainly when no average can reach it.',
  keywords: [
    'target gpa calculator',
    'gpa planner',
    'raise my gpa calculator',
    'how to raise my gpa',
    'what gpa do i need',
    'gpa goal calculator',
    'target gpa',
    'gpa calculator with target',
  ],
  featureList: [
    'Required GPA across your remaining credits, solved live',
    'Honest impossible-target flag with the highest reachable GPA',
    'Already-secured verdict when the target is met early',
    'Works on the 4.0 scale with any credit counts',
    'Free, no sign-up, nothing uploaded',
  ],
  sections: [
    {
      heading: 'The formula behind a target GPA',
      paragraphs: [
        'A cumulative GPA is a credit-weighted average: every credit you have taken contributes its grade points, and every credit still to take will contribute its own. To solve for the unknown part, rearrange that average. Required GPA = (target GPA × total credits − current GPA × completed credits) ÷ planned credits.',
        `With a current GPA of ${tgtCurrent.toFixed(1)} over ${tgtDone} credits, a target of ${tgtTarget.toFixed(1)} and ${tgtPlanned} credits still to take, the arithmetic is (${tgtTarget.toFixed(1)} × ${tgtTotal} − ${tgtCurrent.toFixed(1)} × ${tgtDone}) ÷ ${tgtPlanned} = ${tgtRequired.toFixed(2)}. That is the average the remaining credits must hit — every one of them, on average.`,
      ],
    },
    {
      heading: 'When the target is impossible — and what to do',
      paragraphs: [
        'A required average above 4.0 is not a challenge, it is arithmetic saying no: even straight As cannot lift the cumulative GPA to the target with the credits available. In the example above the highest reachable GPA is only ' +
          `${tgtMax.toFixed(2)}, because the completed credits anchor the average. Pretending otherwise wastes a term chasing a number that cannot arrive.`,
        `Two honest moves remain. Retarget to the reachable number — ${tgtMax.toFixed(2)} in the example — and plan toward that instead. Or add planned credits: with 30 credits still to take instead of ${tgtPlanned}, the same target needs only ${tgtRequiredMore.toFixed(2)}, which is demanding but possible. More runway is the only thing that makes an impossible target possible.`,
      ],
    },
    {
      heading: 'Raising a GPA: where effort pays most',
      paragraphs: [
        'Completed credits dilute every new grade. Early in a degree a strong term moves the average a long way, because the new credits are a large share of the total. Late in a degree the same strong term barely moves it: with 90 credits already done at 3.2, even 15 credits of straight As only reach ' +
          `${tgtMaxLate.toFixed(2)}. That is not a reason to give up — it is the reason to plan early, when each credit still carries weight.`,
        'Within a term, the same logic applies per course: a four-credit course moves the term average twice as far as a two-credit course at the same grade. Put the most revision hours where the credits are, not where the subject feels easiest.',
      ],
    },
    {
      heading: 'Target GPA, GPA planner, semester GPA: three different questions',
      paragraphs: [
        'A target GPA calculator and a GPA planner answer the same forward-looking question — what must I average from here? — so this page serves both phrases with one tool. A semester GPA calculator answers a backward-looking one: what did one term actually produce? And a cumulative GPA calculator totals every term so far without asking what comes next.',
        'Use them in order: the cumulative calculator for where you stand, this planner for what the remaining credits must average, and the semester calculator at the end of each term to check whether the plan is holding.',
      ],
    },
  ],
  example: {
    heading: 'Worked example: 3.2 now, aiming for 3.5',
    scenario: `A student holds a ${tgtCurrent.toFixed(1)} GPA over ${tgtDone} credits and wants to finish at ${tgtTarget.toFixed(1)} with ${tgtPlanned} credits still to take.`,
    rows: [
      { label: 'Required average over remaining credits', value: `${tgtRequired.toFixed(2)} (above the 4.0 ceiling)` },
      { label: 'Highest reachable GPA with straight As', value: tgtMax.toFixed(2) },
      { label: 'Credits counted in the plan', value: `${tgtTotal}` },
    ],
    takeaway: `The 3.5 target cannot be met with ${tgtPlanned} credits left, even with straight As. Retarget to ${tgtMax.toFixed(2)}, or extend the plan to 30 remaining credits, where the required average drops to ${tgtRequiredMore.toFixed(2)} and the target becomes possible.`,
  },
  faqs: [
    {
      question: 'What GPA do I need next semester to reach 3.5?',
      answer:
        'It depends on your current GPA and how many credits you have already completed, because completed credits anchor the average. Enter your current GPA, completed credits, target of 3.5 and next semester’s credits above: the planner returns the exact average those credits must hit, or tells you the target is out of reach.',
    },
    {
      question: 'Can I raise my GPA from 3.0 to 3.8 in one semester?',
      answer:
        'Usually not, and the formula shows why. With 30 credits done at 3.0 and 15 credits planned, reaching 3.8 needs (3.8 × 45 − 3.0 × 30) ÷ 15 = 5.40, far above the 4.0 ceiling. A jump that large needs several strong terms, or many more planned credits, not one good semester.',
    },
    {
      question: 'Is it better to take more credits or earn higher grades?',
      answer:
        'Both move the number, but through different levers. Higher grades raise the numerator directly, while more planned credits give those grades more weight against the completed credits. If the required average is already above 4.0, only more credits can fix it; if it is within reach, higher grades are the faster lever.',
    },
    {
      question: 'What if my required GPA is above 4.0?',
      answer:
        'Then the target cannot be met with the credits available, no matter the grades. Retarget to the highest reachable GPA the planner shows, or add planned credits and recompute. Do not round the required average down to 4.0 and call it a plan — that plan fails by construction.',
    },
    {
      question: 'Do retaken courses change the calculation?',
      answer:
        'It depends on your school’s policy, and policies differ. Some schools replace the old grade, some average the attempts, and some count both. This planner assumes planned credits add to completed credits, so if your school replaces grades, compute the target from the replaced transcript instead and treat the planner’s number as an estimate.',
    },
    {
      question: 'What is the difference between a target GPA calculator and a GPA planner?',
      answer:
        'In practice, none that matters: both solve the average your remaining credits must hit to reach a chosen cumulative GPA. Planners sometimes stretch across several terms, while a target calculator solves one planning block. This page solves one block; run it again per term to keep a multi-term plan on track.',
    },
  ],
  faqHeading: {
    eyebrow: 'Target GPA FAQs',
    title: 'Target GPA questions',
    description: 'How required averages are solved, when targets are impossible, and what retakes do to the maths.',
    ctaText: 'Plan your target GPA',
  },
  related: [
    { path: '/semester-gpa-calculator/', label: 'Semester GPA calculator', blurb: 'One term of courses, grades and credits.' },
    { path: '/cumulative-gpa-calculator/', label: 'Cumulative GPA calculator', blurb: 'Where your GPA stands across every term.' },
    { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'Honors, AP and IB bonus points included.' },
    { path: '/college-gpa-calculator/', label: 'College GPA calculator', blurb: 'Credit-weighted GPA for college courses.' },
    { path: '/gpa-converter/', label: 'GPA converter', blurb: 'SGPA, CGPA, percentage and 4.0 GPA in one place.' },
    { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Course grades from weighted assessments.' },
  ],
};

/* ---------------- (b) Quiz grade calculator ---------------- */

const quizQuestions = 20;
const quizWrong = 3;
const quizEx = calculateTestGrade({ earned: quizQuestions - quizWrong, possible: quizQuestions });
const quizLetter = percentToLetter(quizEx.percent, SCALE_STANDARD).letter;

const quizPage: ToolPageEntry = {
  slug: 'quiz-grade-calculator',
  path: '/quiz-grade-calculator/',
  navLabel: 'Quiz grade calculator',
  h1: 'Quiz Grade Calculator',
  title: 'Quiz Grade Calculator — Score, Percent & Letter Grade',
  metaDescription:
    'Free quiz grade calculator: enter the number of questions and how many you missed to get the percent, letter grade and how many more you can miss.',
  badge: 'Quizzes',
  intro:
    'A quiz is a small test, and small tests punish every miss: one wrong answer on a 10-question quiz costs 10 points, while the same miss on a 100-question test costs 1. Enter the number of questions and how many were missed to get the percent, the letter grade, and the miss allowance for every grade boundary.',
  keywords: [
    'quiz grade calculator',
    'quiz score calculator',
    'quiz percentage calculator',
    'how to grade a quiz',
    'quiz grade percentage',
    'grade a quiz',
  ],
  featureList: [
    'Percent and letter grade from questions and misses',
    'Miss allowance for every grade boundary',
    'Per-question value shown for any quiz size',
    'Standard and plus/minus scales',
    'Half-credit misses as 0.5 wrong',
  ],
  sections: [
    {
      heading: 'How a quiz grade is worked out',
      paragraphs: [
        'Count the correct answers, divide by the number of questions, and multiply by 100. On a 20-question quiz with 3 wrong, that is 17 ÷ 20 × 100 = 85%. The letter then comes from your scale: 85% is a B on the standard scale and a B on the plus/minus scale too.',
        'The same division gives the value of one question: 100 ÷ number of questions. On a 20-question quiz each question is worth 5 points; on a 10-question quiz each is worth 10. That single number explains why short quizzes feel so unforgiving.',
      ],
    },
    {
      heading: 'How many can I miss for each grade?',
      paragraphs: [
        'The allowance table under the calculator answers this for every boundary at once. The rule behind it is simple: the most questions you can miss for a grade is the largest whole number of misses that still keeps the score at or above that grade’s cutoff.',
        `On a ${quizQuestions}-question quiz the allowances are: A, at most ${Math.floor((quizQuestions * 10) / 100)} wrong; B, at most ${Math.floor((quizQuestions * 20) / 100)}; C, at most ${Math.floor((quizQuestions * 30) / 100)}; D, at most ${Math.floor((quizQuestions * 40) / 100)}. Change the quiz size above and the whole table recomputes.`,
      ],
    },
    {
      heading: 'Why small quizzes swing grades',
      paragraphs: [
        'A quiz grade is a coarse measurement: with only 10 questions there are just 11 possible scores, and each miss moves the result a full letter step in places. Two students who both understand most of the material can land a full grade apart on one unlucky question.',
        'Teachers handle this by weighting quizzes lightly, dropping the lowest quiz, or averaging several quizzes before the score counts. If your syllabus drops a lowest score, average the rest first and grade that average — grading each quiz separately and then dropping one gives the same result only when every quiz has the same number of questions.',
      ],
    },
    {
      heading: 'Partial credit on quizzes',
      paragraphs: [
        'A half-credit answer is half a miss: enter 0.5 in the missed field for each question that earned half marks. Two half-credit answers equal one full miss, and the percent follows the same division as always.',
        'If your teacher awards partial credit per question rather than per quiz, add the partial points together first. Three questions at half credit each are 1.5 missed, not 3 — entering 3 would understate the score by a full question’s value.',
      ],
    },
  ],
  example: {
    heading: `Worked example: ${quizWrong} wrong on a ${quizQuestions}-question quiz`,
    scenario: `A ${quizQuestions}-question quiz with ${quizWrong} wrong answers, graded on the standard scale.`,
    rows: [
      { label: 'Correct answers', value: `${quizQuestions - quizWrong} of ${quizQuestions}` },
      { label: 'Percentage', value: `${roundTo(quizEx.percent, 1)}%` },
      { label: 'Letter grade', value: quizLetter },
      { label: 'Each question worth', value: `${roundTo(100 / quizQuestions, 1)}%` },
      { label: 'Most misses still an A', value: `${Math.floor((quizQuestions * 10) / 100)} wrong (90%)` },
    ],
    takeaway: `Three misses on a ${quizQuestions}-question quiz cost ${quizWrong * (100 / quizQuestions)} points, landing at ${roundTo(quizEx.percent, 1)}% — a ${quizLetter}. One fewer miss would have reached 90% and an A.`,
  },
  faqs: [
    {
      question: 'How do I grade a quiz fast?',
      answer:
        'Count the wrong answers, subtract from the number of questions, divide by the number of questions and multiply by 100. On a 20-question quiz, 3 wrong is 17 ÷ 20 × 100 = 85%. The calculator above does the same step and adds the letter grade and the miss allowance table.',
    },
    {
      question: 'What is 17 out of 20 as a grade?',
      answer:
        '17 out of 20 is 85%, which is a B on the standard A–F scale and a B on the plus/minus scale. Each question on that quiz is worth 5%, so one more correct answer would have been 90% and an A.',
    },
    {
      question: 'How many questions can I miss on a 10-question quiz and still get an A?',
      answer:
        'One. Each question is worth 10%, so 9 out of 10 is 90%, exactly the A cutoff on the standard scale, and 8 out of 10 is 80%, a B. Short quizzes leave almost no room: a single additional miss drops a full letter.',
    },
    {
      question: 'Do quizzes count as much as tests?',
      answer:
        'Almost never. A syllabus usually weights quizzes far below tests — for example, all quizzes together might be worth 20% of the course grade while tests are worth 50%. To see how a quiz score moves your course grade, enter it as a category in the category grade calculator.',
    },
    {
      question: 'How do I handle half credit on a quiz?',
      answer:
        'Enter each half-credit answer as 0.5 missed. Two half-credit answers equal one full miss. Add the partial amounts together first: three half-credit answers are 1.5 missed, and the percent is computed from that total, not from 3.',
    },
    {
      question: 'What is a good quiz score?',
      answer:
        'There is no universal number: it depends on your scale and on how the quiz is weighted. As a rough guide, 90% and above is an A, 80–89% a B, and 70–79% a C on the standard scale. A single low quiz matters less than the pattern across the term, especially if your syllabus drops the lowest one.',
    },
  ],
  faqHeading: {
    eyebrow: 'Quiz grade FAQs',
    title: 'Quiz grade questions',
    description: 'How quiz scores are computed, what each miss costs, and how partial credit works.',
    ctaText: 'Grade a quiz',
  },
  related: [
    { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Points-based grading for tests of any size.' },
    { path: '/grading-scale/', label: 'Grading scale charts', blurb: 'Score charts for tests of 5 to 100 questions.' },
    { path: '/how-many-questions-can-i-miss/', label: 'How many can I miss', blurb: 'Miss allowances for every test size.' },
    { path: '/category-grade-calculator/', label: 'Category grade calculator', blurb: 'Turn quiz, homework and test scores into a course grade.' },
    { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Course grades from weighted assessments.' },
  ],
};

/* ---------------- (c) Assignment grade calculator (late penalty + extra credit) ---------------- */

const asgEx = calculateTestGrade({ earned: 45, possible: 50, bonus: 3, penalty: 5 });
const asgPlain = calculateTestGrade({ earned: 45, possible: 50 });
const asgLetter = percentToLetter(asgEx.percent, SCALE_STANDARD).letter;
const asgPlainLetter = percentToLetter(asgPlain.percent, SCALE_STANDARD).letter;

const assignmentPage: ToolPageEntry = {
  slug: 'assignment-grade-calculator',
  path: '/assignment-grade-calculator/',
  navLabel: 'Assignment grade calculator',
  h1: 'Assignment Grade Calculator',
  title: 'Assignment Grade Calculator — Late & Extra Credit',
  metaDescription:
    'Free assignment grade calculator: grade points-based assignments with late penalties and extra credit, and see the percent and letter grade instantly.',
  badge: 'Assignments',
  intro:
    'Assignments are rarely graded on raw points alone: a late penalty comes off, extra credit goes on, and the order of those two adjustments confuses almost everyone. Enter the points earned, the points possible, any penalty and any bonus. The calculator applies both and shows the percent and letter grade — and what the score would have been without them.',
  keywords: [
    'assignment grade calculator',
    'assignment score calculator',
    'grade an assignment',
    'assignment percentage calculator',
    'late penalty grade calculator',
    'extra credit assignment',
  ],
  featureList: [
    'Points earned and points possible, any assignment size',
    'Late penalties subtracted before dividing',
    'Extra credit added, with or without a 100% cap',
    'Percent and letter grade on standard and plus/minus scales',
    'Score with and without adjustments, side by side',
  ],
  sections: [
    {
      heading: 'Points, penalties and bonus: the three inputs',
      paragraphs: [
        'The whole calculation is one line: adjusted points = points earned − late penalty + extra credit, and the percent is adjusted points ÷ points possible × 100. A 45 out of 50 with a 5-point late penalty and 3 bonus points becomes (45 − 5 + 3) ÷ 50 = 86%.',
        'The order of the penalty and the bonus does not change the answer, because both are additions and subtractions on the same total. Teachers who apply the penalty first and teachers who add the bonus first arrive at the same adjusted points — the only thing that matters is that both are applied once.',
      ],
    },
    {
      heading: 'Late policies teachers actually use',
      paragraphs: [
        'The most common policies are a fixed points deduction per day late, a percentage taken off the earned score, and a zero after a final deadline. A grace period — often the rest of the day the work is due — is also common, and it means a paper handed in during that window counts as on time.',
        'Whichever policy applies, convert it to points before dividing. A "10% off" penalty on a 45 out of 50 means 4.5 points off, giving 40.5 out of 50, or 81% — not 45% minus 10 points. Mixing a percent penalty with a points total is the most frequent late-work error.',
      ],
    },
    {
      heading: 'Extra credit without confusion',
      paragraphs: [
        'Extra credit usually adds to the points earned while the points possible stay fixed, which is how a score can pass 100%. Whether the gradebook keeps that value or caps it at 100% is a policy choice: the calculator shows the uncapped percent, so you can see both the earned result and the capped one.',
        'Extra credit also changes averages unevenly. Three bonus points on a 20-point assignment are worth 15 percentage points; the same three points on a 100-point assignment are worth 3. Keeping the points possible in view is what stops a small bonus from looking like a large improvement.',
      ],
    },
    {
      heading: 'From assignment grade to course grade',
      paragraphs: [
        'One assignment grade is only an input to the course grade. Assignments usually sit inside a category — homework, for example — and the category has a weight in the syllabus. To combine assignments, average them within their category first, then weight the categories.',
        'The category grade calculator does exactly that step: enter each category’s average and its syllabus weight, and it returns the course grade. The weighted grade calculator handles the same job assessment by assessment when no categories are used.',
      ],
    },
  ],
  example: {
    heading: 'Worked example: 45 out of 50, late penalty, extra credit',
    scenario: 'An assignment worth 50 points: the student earns 45, loses 5 points for lateness, and gains 3 bonus points.',
    rows: [
      { label: 'Points without adjustments', value: `45 of 50 (${roundTo(asgPlain.percent, 1)}%, ${asgPlainLetter})` },
      { label: 'Points after penalty and bonus', value: `${asgEx.adjustedEarned} of 50` },
      { label: 'Percentage with adjustments', value: `${roundTo(asgEx.percent, 1)}%` },
      { label: 'Letter grade (standard scale)', value: asgLetter },
    ],
    takeaway: `The penalty and bonus together move the score from ${roundTo(asgPlain.percent, 1)}% (${asgPlainLetter}) to ${roundTo(asgEx.percent, 1)}% (${asgLetter}). The net change is −2 points, which is why the letter drops even though bonus points were earned.`,
  },
  faqs: [
    {
      question: 'How do I apply a late penalty to an assignment grade?',
      answer:
        'Convert the penalty to points, subtract it from the points earned, and then divide by the points possible. A 5-point penalty on 45 out of 50 gives 40 out of 50, or 80%. If the penalty is a percentage, take that percentage of the earned score first: 10% off 45 is 4.5 points, giving 40.5 out of 50.',
    },
    {
      question: 'Is extra credit added before or after the late penalty?',
      answer:
        'It makes no difference to the result. Adjusted points equal points earned minus the penalty plus the bonus, and addition and subtraction in any order give the same total. Apply whichever order your teacher describes; the percent comes out identical.',
    },
    {
      question: 'Can an assignment grade exceed 100%?',
      answer:
        'Yes, when extra credit is added without raising the points possible. A 50 out of 50 plus 5 bonus points is 110% before any cap. Many gradebooks cap the recorded value at 100%, so the uncapped number is the earned result and the capped number is the recorded one — check which your teacher uses.',
    },
    {
      question: 'What if the assignment is graded with a rubric, not questions?',
      answer:
        'Use the rubric points as the points: points earned is the rubric total awarded, points possible is the rubric maximum. A rubric worth 24 points with 19 awarded is 19 ÷ 24 × 100 = 79.2%, whatever the criteria were. Rubric levels only matter through the points they carry.',
    },
    {
      question: 'How do I convert an assignment score to a letter grade?',
      answer:
        'Divide points earned by points possible and multiply by 100, apply any penalty and bonus first, then compare with your scale. On the standard scale 86% is a B; on the plus/minus scale it is also a B, because B covers 83–86.99%. The letter always follows the percent, never the raw points.',
    },
    {
      question: 'What happens if I hand work in during a grace period?',
      answer:
        'A grace period means the work counts as on time, so no penalty applies at all. If the work arrives after the grace period ends, the late policy starts from the original deadline or from the end of grace, depending on the syllabus — the difference is usually one day of deduction, so read the exact wording.',
    },
  ],
  faqHeading: {
    eyebrow: 'Assignment grade FAQs',
    title: 'Assignment grade questions',
    description: 'Late penalties, extra credit, rubric points, and what grace periods actually mean.',
    ctaText: 'Grade an assignment',
  },
  related: [
    { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Percentage and letter for one test, with bonus points.' },
    { path: '/points-grade-calculator/', label: 'Points grade calculator', blurb: 'Any points score as a percent and letter.' },
    { path: '/category-grade-calculator/', label: 'Category grade calculator', blurb: 'Combine assignments into a course grade by category.' },
    { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Course grades from weighted assessments.' },
    { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Percent, letter and GPA points on common scales.' },
  ],
};

/* ---------------- (d) Points grade calculator ---------------- */

const ptsEx = calculateTestGrade({ earned: 137, possible: 160 });
const ptsLetter = percentToLetter(ptsEx.percent, SCALE_STANDARD).letter;
const ptsForA = Math.ceil(0.9 * 160);

const pointsPage: ToolPageEntry = {
  slug: 'points-grade-calculator',
  path: '/points-grade-calculator/',
  navLabel: 'Points grade calculator',
  h1: 'Points Grade Calculator',
  title: 'Points Grade Calculator — Points to Percent & Letter',
  metaDescription:
    'Free points grade calculator: enter points earned and points possible to get the percentage, letter grade and points needed for the next grade.',
  badge: 'Points based',
  intro:
    'Most gradebooks think in points, not percents: an assignment is 137 out of 160, a project is 88 out of 100, and the percent is something you work out afterwards. Enter the two point values to get the percent, the letter grade, and the points still needed for the next grade up.',
  keywords: [
    'points grade calculator',
    'grade calculator by points',
    'points to grade calculator',
    'points to percentage calculator',
    'score to grade calculator',
    'points earned calculator',
  ],
  featureList: [
    'Percent and letter grade from any points values',
    'Points needed for A, B, C and D on any total',
    'Standard and plus/minus letter scales',
    'Bonus points and penalties included',
    'Works for tests, assignments and projects alike',
  ],
  sections: [
    {
      heading: 'Points to percent: the one formula',
      paragraphs: [
        'Percent = points earned ÷ points possible × 100. That is the entire conversion, and it works for any total: 137 out of 160 is 137 ÷ 160 × 100 = 85.6%, and 88 out of 100 is 88.0%. The letter grade then follows from the scale your class uses.',
        'The formula also runs backwards. To find the points needed for a target percent, multiply the target by the points possible: 90% of 160 is 144 points. Anything at or above that total earns at least an A on the standard scale.',
      ],
    },
    {
      heading: 'Points needed for the next grade',
      paragraphs: [
        'A points total makes the next grade concrete in a way a percent does not. "You need 7 more points" is a plan; "you need 4.4% more" is not. The table under the calculator lists the points needed for every grade boundary on the total you entered, rounded up to whole points where the total is whole.',
        `On a 160-point total, an A starts at ${ptsForA} points. A student at 137 points is ${ptsForA - 137} points short — one strong answer, or a few partial-credit points, depending on how the work is marked.`,
      ],
    },
    {
      heading: 'Why points beat percentages for grading',
      paragraphs: [
        'Percentages hide size. A 90% on a 10-point quiz and a 90% on a 200-point exam look identical, but the exam result rests on twenty times as much evidence. Points keep that size visible, which is why gradebooks store points and only display percents.',
        'Points also make combining work honest. Adding two percents and averaging them treats a quiz and an exam as equals, which they are not. Adding their points — total earned over total possible — weights each piece by its size automatically.',
      ],
    },
    {
      heading: 'Points versus percent in gradebooks',
      paragraphs: [
        'If your gradebook shows a percent but asks for points, enter the points: the percent is computed from them, and rounding the percent first can shift the letter at a boundary. A stored 89.6% and a stored 90% are different grades, but both round to "about 90" in conversation.',
        'When a gradebook shows only a letter, work backwards through the scale’s cutoff. A B on the standard scale means the percent was somewhere from 80% to 89.99%; the exact points are unrecoverable from the letter alone, so keep the points whenever you can.',
      ],
    },
  ],
  example: {
    heading: 'Worked example: 137 out of 160 points',
    scenario: 'A project worth 160 points, graded on the standard scale.',
    rows: [
      { label: 'Percentage', value: `${roundTo(ptsEx.percent, 1)}%` },
      { label: 'Letter grade', value: ptsLetter },
      { label: 'Points needed for an A (90%)', value: `${ptsForA} points` },
      { label: 'Points short of an A', value: `${ptsForA - 137} points` },
    ],
    takeaway: `137 out of 160 is ${roundTo(ptsEx.percent, 1)}%, a ${ptsLetter}. Seven more points would have reached ${ptsForA}, the 90% cutoff for an A — a concrete target for revision or partial credit.`,
  },
  faqs: [
    {
      question: 'How do I convert points to a grade?',
      answer:
        'Divide the points earned by the points possible and multiply by 100, then match the percent to your scale. 137 out of 160 is 85.6%, which is a B on the standard scale. The calculator above does the division and the letter together.',
    },
    {
      question: 'What is 137 out of 160 as a percentage?',
      answer:
        '137 ÷ 160 × 100 = 85.6% (85.625% before rounding). On the standard scale that is a B, and on the plus/minus scale it is also a B, since B covers 83–86.99%. Seven more points would reach 90% and an A.',
    },
    {
      question: 'How many points do I need for an A?',
      answer:
        'Multiply the A cutoff by the points possible and round up to a whole point. For 90% on a 160-point total that is 0.90 × 160 = 144 points. On a 50-point total it is 45 points, and on a 25-point total it is 22.5, which rounds up to 23 in practice.',
    },
    {
      question: 'Are points or percentages better for grading?',
      answer:
        'Points, for combining work: they preserve the size of each piece, so a 200-point exam correctly outweighs a 10-point quiz. Percentages are better for comparing across different totals. Grade in points, report in percent, and you get both advantages.',
    },
    {
      question: 'How do I add points across assignments?',
      answer:
        'Add all the points earned together and all the points possible together, then divide. Three assignments of 45/50, 38/40 and 90/100 total 173 earned out of 190 possible, which is 91.1%. This weights each assignment by its size; if the syllabus weights them differently, use the category or weighted calculator instead.',
    },
    {
      question: 'What if my points total is not a round number?',
      answer:
        'The formula does not care: divide earned by possible and multiply by 100 whatever the total is. 73 out of 87 is 83.9%, and 29 out of 34 is 85.3%. Unusual totals usually come from rubrics or partial-credit marking, and the division handles them exactly the same way.',
    },
  ],
  faqHeading: {
    eyebrow: 'Points grade FAQs',
    title: 'Points grade questions',
    description: 'Converting points to percent and letter, points needed per grade, and combining assignments.',
    ctaText: 'Convert points to a grade',
  },
  related: [
    { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Percentage and letter for one test, with bonus points.' },
    { path: '/quiz-grade-calculator/', label: 'Quiz grade calculator', blurb: 'Question-count grading for quizzes.' },
    { path: '/assignment-grade-calculator/', label: 'Assignment grade calculator', blurb: 'Late penalties and extra credit included.' },
    { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Percent, letter and GPA points on common scales.' },
    { path: '/average-grade-calculator/', label: 'Average grade calculator', blurb: 'Mean and median for a list of scores.' },
  ],
};

/* ---------------- (e) Category grade calculator ---------------- */

const catRows = [
  { name: 'Homework', score: 85, weight: 20 },
  { name: 'Quizzes', score: 90, weight: 30 },
  { name: 'Tests', score: 78, weight: 50 },
];
const catTotal = catRows.reduce((a, r) => a + (r.score * r.weight) / 100, 0);
const catLetter = percentToLetter(catTotal, SCALE_STANDARD).letter;

const categoryPage: ToolPageEntry = {
  slug: 'category-grade-calculator',
  path: '/category-grade-calculator/',
  navLabel: 'Category grade calculator',
  h1: 'Category Grade Calculator',
  title: 'Category Grade Calculator — Weighted Course Grades',
  metaDescription:
    'Free category grade calculator: group homework, quizzes, tests and exams into weighted categories and see your course grade update as you type.',
  badge: 'Weighted categories',
  intro:
    'Most syllabuses do not grade assessment by assessment: they grade by category — homework worth this much, quizzes that much, tests the rest. Enter each category’s average score and its syllabus weight, and the calculator returns the course grade, with each category’s contribution shown separately.',
  keywords: [
    'category grade calculator',
    'weighted grade calculator',
    'grade calculator with weights',
    'weighted categories calculator',
    'course grade by category',
  ],
  featureList: [
    'Course grade from weighted categories',
    'Each category’s point contribution shown',
    'Weights are relative — they need not total 100',
    'Add, remove and rename categories freely',
    'Free, no sign-up, nothing uploaded',
  ],
  sections: [
    {
      heading: 'How category weights work',
      paragraphs: [
        'A category grade is a weighted average: multiply each category’s average score by its weight, add the results, and divide by the total weight. With homework at 85% weighted 20, quizzes at 90% weighted 30 and tests at 78% weighted 50, the course grade is (85 × 20 + 90 × 30 + 78 × 50) ÷ 100 = 83.0%.',
        'The contribution column is what makes this useful: homework contributes 17.0 points of the 83, quizzes 27.0 and tests 39.0. When a category drags the total down, its contribution shows exactly how much of the damage it does.',
      ],
    },
    {
      heading: 'Choosing weights that match your syllabus',
      paragraphs: [
        'Copy the weights from your syllabus exactly — do not guess them. Syllabuses differ widely: one course weights tests at 60% and homework at 10%, another splits evenly across four categories, and a third weights a final exam alone at 40%. The calculator cannot know your syllabus, so the weights you enter are the whole calculation.',
        'If your syllabus lists weights as fractions or decimals instead of percents, convert them first: a weight of 0.25 is 25%. What matters is the ratio between categories, not the unit they are written in.',
      ],
    },
    {
      heading: 'Several items inside one category',
      paragraphs: [
        'A category usually holds several pieces of work: five quizzes, say, or eight homework sets. Average those pieces first — total points earned over total points possible across the category — and enter that single average as the category score.',
        'Averaging by points, not by percents, is what keeps the category honest. Five quizzes worth 10 points each and one worth 50 should not count equally; the points average weights the 50-point quiz five times as heavily, which is exactly what its size deserves.',
      ],
    },
    {
      heading: 'Weights that do not add to 100',
      paragraphs: [
        'Weights are relative, so a set that totals 90 or 110 works exactly like one that totals 100: the calculator divides by the total weight you entered. Weights of 20, 30 and 40 (total 90) give the same course grade as 22.2, 33.3 and 44.4 (total 100), because the ratios are identical.',
        'That also means a missing category does not break the calculation — it rescales the rest. If a category has no scores yet, leave it out rather than entering zero: a zero drags the average down, while an omitted category simply lets the graded work speak for itself.',
      ],
    },
  ],
  example: {
    heading: 'Worked example: homework, quizzes and tests',
    scenario: 'A course with three categories: homework averaging 85% at weight 20, quizzes at 90% at weight 30, tests at 78% at weight 50.',
    rows: [
      ...catRows.map((r) => ({
        label: `${r.name}: ${r.score}% × weight ${r.weight}`,
        value: `${roundTo((r.score * r.weight) / 100, 1)} points`,
      })),
      { label: 'Course grade', value: `${roundTo(catTotal, 1)}% (${catLetter})` },
    ],
    takeaway: `Tests dominate this course: at weight 50 they contribute ${roundTo((78 * 50) / 100, 1)} of the ${roundTo(catTotal, 1)} points. Raising the test average by 5 points would lift the course grade by 2.5 points; the same improvement in homework would lift it by only 1.0.`,
  },
  faqs: [
    {
      question: 'How do I calculate a grade with categories?',
      answer:
        'Average the work inside each category, multiply each category average by its syllabus weight, add those products, and divide by the total weight. Homework 85% at weight 20, quizzes 90% at weight 30 and tests 78% at weight 50 give (85 × 20 + 90 × 30 + 78 × 50) ÷ 100 = 83.0%.',
    },
    {
      question: 'What if my weights add to 90, not 100?',
      answer:
        'Nothing breaks: weights are relative, so the calculator divides by the total weight you entered. Weights of 20, 30 and 40 give the same course grade as 22.2, 33.3 and 44.4, because the ratios are identical. Only the ratios matter, not the total.',
    },
    {
      question: 'Should homework count as much as tests?',
      answer:
        'Your syllabus decides, not this calculator. Most syllabuses weight tests and exams above homework, because exams measure the material under controlled conditions. Copy the published weights exactly; inventing equal weights when the syllabus says otherwise gives a comforting but wrong number.',
    },
    {
      question: 'How do I average several quizzes into one category?',
      answer:
        'Add the points earned across all the quizzes and divide by the total points possible across them. Five 10-point quizzes and one 50-point quiz total 100 points possible; if you earned 85 of them, the category average is 85%. Averaging percents instead would wrongly give the small quizzes equal weight.',
    },
    {
      question: 'What is the difference between category grades and weighted GPA?',
      answer:
        'A category grade is a course percent built from weighted categories of work. A weighted GPA is a grade-point average across courses, where harder courses earn bonus points. One measures a single course, the other measures a whole transcript — different jobs, different tools.',
    },
    {
      question: 'What if a category has no grades yet?',
      answer:
        'Leave it out. An empty category entered as zero drags the average down as if the work were failed, which it is not. Omitting it rescales the remaining categories to their relative weights, which is the honest picture of the work graded so far.',
    },
  ],
  faqHeading: {
    eyebrow: 'Category grade FAQs',
    title: 'Category grade questions',
    description: 'How category weights work, what to do with missing categories, and how categories differ from GPA.',
    ctaText: 'Build a category grade',
  },
  related: [
    { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Course grades from weighted assessments.' },
    { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'Honors, AP and IB bonus points included.' },
    { path: '/assignment-grade-calculator/', label: 'Assignment grade calculator', blurb: 'Late penalties and extra credit included.' },
    { path: '/final-grade-planner/', label: 'Final grade planner', blurb: 'What each final exam needs across all classes.' },
    { path: '/target-gpa-calculator/', label: 'Target GPA calculator', blurb: 'Plan the GPA your remaining credits must average.' },
  ],
};

/* ---------------- (f) GPA converter hub: SGPA, CGPA, percentage, 4.0 GPA ---------------- */

const convSgpa = 8.2;
const convPct = roundTo(convSgpa * 10, 2);
const convGpa = roundTo(convPct / 25, 2);

const converterPage: ToolPageEntry = {
  slug: 'gpa-converter',
  path: '/gpa-converter/',
  navLabel: 'GPA converter',
  h1: 'GPA Converter — SGPA, CGPA, Percentage & 4.0 GPA',
  title: 'GPA Converter — SGPA, CGPA & Percent in One Place',
  metaDescription:
    'Free GPA converter: convert SGPA to percentage, percentage to 4.0 GPA, GPA to percentage and CGPA to percentage — with the formula shown for each.',
  badge: 'All conversions',
  intro:
    'SGPA, CGPA, percentage and 4.0 GPA are four ways of writing the same achievement, and every application form seems to ask for a different one. This hub converts between all four with the formula shown each time — and says plainly where a university’s own formula overrules the generic conversion.',
  keywords: [
    'gpa converter',
    'sgpa to percentage',
    'percentage to gpa',
    'cgpa to percentage',
    'gpa to percentage',
    'sgpa calculator',
    'convert sgpa to percentage',
    'percentage to gpa calculator',
  ],
  featureList: [
    'SGPA to percentage (×10)',
    'Percentage to 4.0 GPA (÷25)',
    '4.0 GPA to percentage (×25)',
    'CGPA to percentage (×10 or ×9.5)',
    'Every formula shown next to its result',
  ],
  sections: [
    {
      heading: 'The four conversions on this page',
      paragraphs: [
        'SGPA to percentage multiplies by 10: an SGPA of 8.2 is 82%. Percentage to 4.0 GPA divides by 25: 82% is 3.28. GPA to percentage multiplies by 25: a 3.28 GPA is 82%. CGPA to percentage multiplies by 10 on the standard pattern, or by 9.5 on the CBSE pattern — the converter offers both, because the two patterns disagree by a full 4 points on an 8.0 CGPA.',
        'These are straight-line conversions: they assume each GPA point is worth the same number of percentage points across the whole scale. That assumption is a convenience, not a law of nature, which is why the next section matters.',
      ],
    },
    {
      heading: 'Why universities disagree',
      paragraphs: [
        'A university’s ordinance is the only conversion that counts for its own students. One university multiplies CGPA by 10, another by 9.5, a third uses a piecewise formula with different multipliers above and below a threshold, and a fourth publishes no formula at all and expects the CGPA to stand on its own.',
        'That is why this site carries one verified page per university with that university’s own formula, and why this hub links to them. Use the generic conversion for a quick sense of scale; use the university page — or the university itself — for anything official.',
      ],
    },
    {
      heading: 'Which direction do application forms want?',
      paragraphs: [
        'Read the form, not the habit. Job portals in India usually ask for percentage; universities abroad usually ask for GPA on a 4.0 scale; Indian transcripts usually print CGPA or SGPA. Converting in the wrong direction — percentage into CGPA when the form wanted a 4.0 GPA — is a paperwork error, not a maths error, and it is caught late.',
        'When a form gives no scale at all, write the number with its scale attached: "82% (SGPA 8.2, 10-point scale)". A number with its scale can be re-converted by whoever reads it; a bare number cannot.',
      ],
    },
    {
      heading: 'Rounding: how many decimals?',
      paragraphs: [
        'Convert from the unrounded value, then round the answer to two decimals. Rounding the SGPA first — 8.24 down to 8.2 — and then converting throws away 0.4 percentage points before the conversion even starts, and the error compounds if the result is converted back.',
        'Two decimals are the usual standard for converted results: 82.00%, 3.28 GPA. More decimals look precise but claim an accuracy the linear conversion does not have, especially across different university patterns.',
      ],
    },
  ],
  example: {
    heading: 'Worked example: SGPA 8.2, three directions',
    scenario: `One value carried through three conversions: SGPA ${convSgpa.toFixed(1)} on a 10-point scale.`,
    rows: [
      { label: 'SGPA to percentage (×10)', value: `${convPct.toFixed(2)}%` },
      { label: 'Percentage to 4.0 GPA (÷25)', value: convGpa.toFixed(2) },
      { label: 'GPA back to percentage (×25)', value: `${roundTo(convGpa * 25, 2).toFixed(2)}%` },
    ],
    takeaway: `The round trip returns exactly to ${convPct.toFixed(2)}% here, because 82 ÷ 25 = 3.28 exactly. That is not guaranteed: convert from unrounded values, or rounding at each step compounds — 82.4% becomes 3.30 GPA, and back again 82.50%. Round once, at the end.`,
  },
  faqs: [
    {
      question: 'How do I convert SGPA to percentage?',
      answer:
        'Multiply the SGPA by 10 on the standard pattern: SGPA 8.2 is 82%. That is the generic conversion. If your university publishes its own formula, use that instead — the university pages on this site carry the verified formulas, and the generic ×10 is only an estimate where no ordinance is published.',
    },
    {
      question: 'How do I convert percentage to GPA on a 4.0 scale?',
      answer:
        'Divide the percentage by 25: 82% is 3.28 on a 4.0 scale, and 90% is 3.60. This is a linear conversion, so it treats every percentage point as worth 0.04 GPA points. Admissions offices sometimes use their own conversion tables, so treat the result as an approximation for applications.',
    },
    {
      question: 'Is SGPA to percentage always ×10?',
      answer:
        'No. ×10 is the standard pattern, but the CBSE pattern uses ×9.5, and several universities use piecewise formulas with different multipliers in different CGPA ranges. On an 8.0 CGPA the two patterns differ by 4 percentage points (80% versus 76%), which is large enough to matter on a form — check your university’s ordinance.',
    },
    {
      question: 'What is the difference between SGPA and CGPA?',
      answer:
        'SGPA is the grade point average for one semester; CGPA is the cumulative average across all semesters so far, credit-weighted. One semester’s SGPA becomes part of the CGPA the moment the next semester’s results are added, and the CGPA moves more slowly the more semesters it already contains.',
    },
    {
      question: 'How do I convert CGPA to GPA?',
      answer:
        'On a linear estimate, divide the 10-point CGPA by 10 and multiply by 4: CGPA 8.2 is roughly 3.28 on a 4.0 scale. This is the same arithmetic as percentage ÷ 25, because CGPA × 10 is the percentage. Universities and admissions offices may use their own tables, so use the estimate for orientation and the official table for forms.',
    },
    {
      question: 'Should I round my SGPA before converting?',
      answer:
        'No — convert from the unrounded value and round only the answer, to two decimals. Rounding 8.24 down to 8.2 first loses 0.4 percentage points before conversion, and converting back afterwards cannot recover them. Keep full precision through the calculation and round once, at the end.',
    },
  ],
  faqHeading: {
    eyebrow: 'GPA converter FAQs',
    title: 'GPA converter questions',
    description: 'SGPA, CGPA, percentage and 4.0 GPA conversions, and when a university formula overrules them.',
    ctaText: 'Convert a GPA',
  },
  related: [
    { path: '/cgpa-to-percentage-calculator/', label: 'CGPA to percentage calculator', blurb: 'Every university and scale in one converter.' },
    { path: '/cgpa-to-percentage/vtu/', label: 'VTU CGPA to %', blurb: 'Visvesvaraya Technological University formula.' },
    { path: '/cgpa-to-percentage/mumbai-university/', label: 'Mumbai University CGPA to %', blurb: 'University of Mumbai formula.' },
    { path: '/cgpa-to-percentage/makaut/', label: 'MAKAUT CGPA to %', blurb: 'Maulana Abul Kalam Azad University formula.' },
    { path: '/cgpa-to-percentage/gtu/', label: 'GTU CGPA to %', blurb: 'Gujarat Technological University formula.' },
    { path: '/cgpa-to-percentage/sppu/', label: 'SPPU CGPA to %', blurb: 'Savitribai Phule Pune University formula.' },
    { path: '/gpa-to-letter-grade/', label: 'GPA to letter grade', blurb: 'Convert a GPA back to its letter grade.' },
    { path: '/target-gpa-calculator/', label: 'Target GPA calculator', blurb: 'Plan the GPA your remaining credits must average.' },
  ],
};

export const COMPETITOR_GAP_PAGES: ToolPageEntry[] = [targetGpaPage, quizPage, assignmentPage, pointsPage, categoryPage, converterPage];
