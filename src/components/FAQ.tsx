import React, { useState, useId, useEffect } from 'react';
import { ChevronDown, Search, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '../utils/helmet';
import { ToolKey } from '../types';

export interface FAQItem {
  id: string;
  category?: string;
  question: string;
  answer: string;
}

export interface ToolFaqConfig {
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  items: FAQItem[];
}

export const WEIGHTED_COURSE_FAQS: FAQItem[] = [
  {
    id: 'weighted-syllabus-formula',
    category: 'weighted',
    question: 'What is the exact formula for a weighted course grade?',
    answer:
      'A weighted course grade is computed by multiplying each syllabus category score percentage by its assigned syllabus weight, summing those weighted products, and dividing by the sum of active weights: Weighted Grade (%) = Σ(Category Score % × Category Weight) ÷ Σ(Active Category Weights).',
  },
  {
    id: 'final-exam-target-equation',
    category: 'exams',
    question: 'How does the Final Exam Target Grade Calculator determine my required exam score?',
    answer:
      'The Final Exam Target Simulator uses the algebraic formula: Required Final Score = (Target Course Grade − (Current Average × (1 − Final Weight))) ÷ Final Weight. For example, with an 88% current average, a 90% target grade, and a 25% final exam weight, you need (90 − (88 × 0.75)) ÷ 0.25 = 96.0% on the final exam.',
  },
  {
    id: 'incomplete-syllabus-weights',
    category: 'weighted',
    question: 'What happens if my entered category weights add up to less than 100% mid-semester?',
    answer:
      'When your entered category weights sum to less than 100% (such as 75% before taking a 25% final exam), the calculator automatically normalizes your current standing by dividing your earned weighted points by 75% rather than 100%, giving you an accurate mid-semester course average.',
  },
  {
    id: 'dropped-lowest-quiz-score',
    category: 'general',
    question: 'How do I account for dropped lowest quiz or homework scores in a weighted class?',
    answer:
      'Remove or exclude the dropped assignment from that category before averaging the remaining scores for that syllabus bucket, or delete the lowest row directly inside the assessment table so only counted coursework is weighted.',
  },
  {
    id: 'extra-credit-weighted-impact',
    category: 'weighted',
    question: 'How does extra credit affect a weighted syllabus vs. a total-points syllabus?',
    answer:
      'In a weighted syllabus, extra credit points added to a low-weight category (such as 10% Homework) only boost that specific category, whereas extra credit applied to a high-weight exam category (such as 40% Midterms) produces four times the increase in your overall course percentage.',
  },
  {
    id: 'weighted-points-or-percent-mode',
    category: 'weighted',
    question: 'Should I use Weighted (%) mode or Points mode for my class?',
    answer:
      'Check the grading section of your syllabus. If it lists category percentages such as Homework 20% and Exams 50%, use Weighted (%) mode. If your instructor adds up raw points and divides by the total possible, use Points mode. When a syllabus mixes both, turn each category’s points into a percentage first, then enter those percentages with their weights.',
  },
  {
    id: 'weighted-average-to-letter',
    category: 'general',
    question: 'What letter grade does a weighted average of 88.4% earn?',
    answer:
      'On the common 10-point scale an 88.4% is a B, because the B range runs from 80% to 89.99%. On the plus/minus scale it is a B+, which starts at 87%. The calculator shows the letter for whichever scale you select, and your syllabus decides which scale your school applies.',
  },
  {
    id: 'weighted-calculation-in-browser',
    category: 'general',
    question: 'Do I need an account to use the weighted grade calculator?',
    answer:
      'No. You can enter your assessments and weights and see your results straight away without signing up. The arithmetic runs in your browser, so you can try as many what-if scores as you like.',
  },
  {
    id: 'weighted-how-system-works',
    category: 'weighted',
    question: 'How does a weighted grading system work?',
    answer:
      'A weighted grading system splits a course into categories such as homework, quizzes, exams and a final, and gives each category a percentage of the course grade. You average the scores inside each category, multiply each average by its weight and add the results. A category with a higher weight moves your grade more than one with a lower weight, even if it contains fewer assignments.',
  },
  {
    id: 'weighted-category-weight-grading',
    category: 'weighted',
    question: 'What is category weight grading?',
    answer:
      'Category weight grading groups assignments into categories and weights each category instead of each assignment. If homework is 20% of the course, all homework together counts for 20% whether there are five assignments or fifty. The calculator applies the weights you enter to each category’s percentage.',
  },
  {
    id: 'weighted-calc-for-a-class',
    category: 'weighted',
    question: 'How do I calculate my weighted grade for a class?',
    answer:
      'Turn each category score into a percentage, multiply it by the category weight written as a decimal, then add the results. If some categories are not graded yet, divide by the total weight used so far. For example, 92% at 20%, 85% at 20%, 78% at 25% and 88% at 15% add up to 68.1 from 80% of the course, which is an 85.1% weighted grade.',
  },
  {
    id: 'weighted-average-grade-meaning',
    category: 'weighted',
    question: 'What is a weighted average grade?',
    answer:
      'A weighted average grade is an average in which some scores count more than others. A 100% on a quiz worth 10% and a 70% on an exam worth 90% give a weighted average of 73%, compared with a simple average of 85%.',
  },
  {
    id: 'weighted-how-to-calculate-by-hand',
    category: 'weighted',
    question: 'How to calculate weighted grades without a calculator?',
    answer:
      'Multiply each category percentage by its weight as a decimal, write down each product, and add the products. Then divide by the total of the weights you used. Keep one extra decimal place until the last step so rounding does not push you over a letter cutoff.',
  },
  {
    id: 'weighted-by-points',
    category: 'weighted',
    question: 'Can I use a weighted grade calculator with points instead of percentages?',
    answer:
      'Yes. In Points mode the calculator adds every point you earned and divides by every point possible, so no weights are needed. Scores of 45 out of 50, 88 out of 100 and 27 out of 30 give 160 of 180 points, or 88.9%. Use Weighted (%) mode when your syllabus gives each category its own percentage.',
  },
  {
    id: 'weighted-80-20-60-40',
    category: 'weighted',
    question: 'How do I calculate a weighted grade with an 80/20 or 60/40 split?',
    answer:
      'Multiply each part by its weight and add. With 80% coursework and a 20% exam, an 88% coursework average and a 72% exam give 0.80 × 88 + 0.20 × 72 = 84.8%. With 60% exams and 40% homework, a 75% exam average and 95% homework give 83%. Type the weights as 80 and 20, or 60 and 40, to get the same result here.',
  },
  {
    id: 'weighted-extra-credit-calculator',
    category: 'weighted',
    question: 'Does the weighted grade calculator allow extra credit?',
    answer:
      'Yes. Enter a score above the Out Of value, such as 105 out of 100, or add a bonus row. The result is not capped at 100%, so you can see the uncapped grade and then apply your instructor’s rule if extra credit is limited.',
  },
  {
    id: 'weighted-vs-unweighted-difference',
    category: 'general',
    question: 'What is the difference between weighted and unweighted grades?',
    answer:
      'In an unweighted grade every point or assignment counts the same. In a weighted grade each category counts for a set share, so an exam worth 40% moves the course grade far more than homework worth 10%. A weighted GPA is a different idea: it adds bonus points for honors or AP classes, and the GPA calculator handles it.',
  },
  {
    id: 'weighted-high-school-ap-honors',
    category: 'general',
    question: 'Can I use it for high school, AP and honors classes?',
    answer:
      'Yes for the class grade. Enter your teacher’s categories and weights to get the course percentage. AP and honors weighting usually changes the GPA scale rather than the class percentage, so take the resulting letter to the GPA calculator for the weighted GPA.',
  },
  {
    id: 'weighted-college-university-credits',
    category: 'general',
    question: 'How do I calculate a weighted grade for college or university modules with credits?',
    answer:
      'Enter each module’s percentage and use its credit value as the weight, so a 40-credit module counts twice as much as a 20-credit module. The calculator divides by the weights you enter, so they do not need to add up to 100. Grading scales and degree classes differ by country, so check your institution’s table for the final label.',
  },
  {
    id: 'weighted-needed-on-final',
    category: 'exams',
    question: 'What do I need on the final exam to keep my weighted grade?',
    answer:
      'Use needed score = (target − current grade × (1 − final weight)) ÷ final weight. With an 82% current grade, a 30% final and an 80% target, that is (80 − 82 × 0.70) ÷ 0.30 = 75.3%. The target grade simulator under your results does this for you.',
  },
  {
    id: 'weighted-excel-google-sheets',
    category: 'general',
    question: 'How do I make a weighted grade calculator in Excel or Google Sheets?',
    answer:
      'List each category percentage in one column and its weight in the next, then use =SUMPRODUCT(B2:B6, C2:C6) / SUM(C2:C6). It works the same in Excel and Google Sheets. This page gives the same answer without building a sheet, and it adds a letter grade and a final exam target.',
  },
  {
    id: 'weighted-canvas-powerschool-blackboard',
    category: 'general',
    question: 'Can I use it with Canvas, Blackboard or PowerSchool grades?',
    answer:
      'Yes, by typing the numbers in. Copy each category’s percentage or points from your school portal and add the weights from your syllabus. The calculator does not connect to school accounts or import anything, which also lets you test what-if scores before real ones are posted.',
  },
  {
    id: 'weighted-semester-full-year',
    category: 'general',
    question: 'How do I calculate a full-year or semester weighted grade?',
    answer:
      'For one semester, enter your categories and weights. For a full year, enter each term’s grade as a row and give each term the weight your school uses, such as 50 and 50. A term that counts for less gets a smaller weight.',
  },
  {
    id: 'weighted-free-app-teachers',
    category: 'general',
    question: 'Is there a free weighted grade calculator app, and can teachers use it?',
    answer:
      'It is free, needs no account and runs in your browser on a phone or computer. You can add it to your home screen from the browser menu, and it keeps working offline after the first visit. Teachers can use it to check one student’s weighted grade; the average grade calculator is the page for a class mean.',
  },
];

/**
 * Per-page FAQ headings so each academic calculator gets its own eyebrow, title, intro and call to action
 * while sharing the exact same FAQ UI as every other tool. Keys match the page slugs.
 */
export type FaqHeading = Partial<Omit<ToolFaqConfig, 'items'>>;

export const PAGE_FAQ_HEADINGS: Record<string, FaqHeading> = {
  'weighted-grade-calculator': {
    eyebrow: 'Weighted Grade FAQs',
    title: 'Weighted Grade Calculator FAQs',
    description:
      'Straight answers on syllabus weights, points vs percentages, extra credit, college credits, the score needed on the final, and Excel or Google Sheets formulas.',
    ctaText: 'Enter your categories, scores and weights above to see your weighted course grade update instantly.',
  },
  'final-exam-grade-calculator': {
    eyebrow: 'Final Exam Target FAQs',
    title: 'Final Exam Grade Calculator FAQs',
    description:
      'Clear answers about the score you need on a final exam, by percent or points: passing, midterms, quarters, replaced or missing finals, curves, GPA and spreadsheet formulas.',
    ctaText: 'Enter your current grade, target grade and final exam weight above to see the exact score you need.',
  },
  'test-grade-calculator': {
    eyebrow: 'Test & Quiz Scoring FAQs',
    title: 'Test Grade Calculator FAQs',
    description:
      'Quick answers on turning points into a percentage, partial credit and extra credit, late penalties, the points needed to pass, dropping the lowest test and how one test affects your overall grade.',
    ctaText: 'Enter your points earned and points possible above to get your test percentage and letter grade.',
  },
  'grade-curve-calculator': {
    eyebrow: 'Curving & Class Stats FAQs',
    title: 'Grade Curve Calculator FAQs',
    description:
      'Answers on the four curving methods, class mean and median, capping at 100 and how a curve changes each student’s letter grade.',
    ctaText: 'Paste your class scores above and compare all four curving methods side by side.',
  },
  'letter-grade-calculator': {
    eyebrow: 'Grade Scale FAQs',
    title: 'Letter Grade Calculator FAQs',
    description:
      'Answers on percentage cutoffs, plus/minus scales, GPA points per letter and why your school’s scale may differ from the common one.',
    ctaText: 'Enter a percentage or pick a letter above to see its range, GPA points and full scale table.',
  },
  'average-grade-calculator': {
    eyebrow: 'Average Grade FAQs',
    title: 'Average Grade Calculator FAQs',
    description:
      'Answers on the overall average grade formula, averaging scores out of different totals, weights and credits, the average needed on remaining tests, mean versus median, C grades and GPA.',
    ctaText: 'Paste your scores above to see your average, median and letter grade update instantly.',
  },
  'grading-scale': {
    eyebrow: 'Grading Scale FAQs',
    title: 'Grading Scale Chart FAQs',
    description:
      'Answers on how each question is worth a share of 100%, how many answers you can miss for an A, and how rounding works.',
    ctaText: 'Pick your test size above to open the score chart for every number of wrong answers.',
  },
};

export const TOOL_FAQS: Record<ToolKey, ToolFaqConfig> = {
  quick: {
    eyebrow: 'Grading & Weighting FAQs',
    title: 'Grade Calculator & Scoring FAQs',
    description:
      'Clear, mathematically verified answers to common questions about weighted grade averages, grading scales, and final exam target scores.',
    ctaText: 'Test a hypothetical score with our Target Grade Simulator above!',
    items: [
      {
        id: 'how-are-grades-calculated',
        category: 'general',
        question: 'How are grades calculated?',
        answer:
          'Grades are calculated by dividing the total points or weighted percentage earned by the total points or weight possible, then multiplying by 100 to produce a percentage. For points-based systems: Grade % = (Total Points Earned ÷ Total Points Possible) × 100. For weighted systems: Grade % = Σ (Category Score % × Category Weight) ÷ Total Active Weight. The resulting percentage is mapped to an institutional letter grade (e.g., 90–100% for an A, 80–89% for a B).',
      },
      {
        id: 'what-is-weighted-grade',
        category: 'weighted',
        question: 'What is a weighted grade?',
        answer:
          'A weighted grade is a course grading calculation where different assignment categories (such as Homework, Quizzes, Midterms, and Finals) carry varying proportional percentage weights toward your overall course grade, rather than every raw point having equal value. For example, if Quizzes count for 20%, Midterms for 30%, and the Final Exam for 50%, an exam carries 2.5 times the impact of homework on your final GPA.',
      },
      {
        id: 'how-to-calculate-weighted',
        category: 'weighted',
        question: 'How do I calculate my weighted grade average?',
        answer:
          'To calculate a weighted grade average: 1) Convert each assessment score into a percentage (points earned ÷ points possible × 100); 2) Multiply each percentage by its category weight (in decimal or percentage form); 3) Sum all weighted contributions together; and 4) Divide by the total sum of the weights. If your category weights already total 100%, the sum of the weighted scores directly equals your final course grade percentage.',
      },
      {
        id: 'final-exam-target-grade',
        category: 'exams',
        question: 'What grade do I need on my final exam to reach my target grade?',
        answer:
          'You can calculate this with the formula: Required Score = [Target Grade - (Current Grade × Current Weight)] ÷ Final Exam Weight. For example, if you hold an 86% average representing 80% of your course and want an A (90%) with a 20% final exam, you need [90 - (86 × 0.80)] ÷ 0.20 = [90 - 68.8] ÷ 0.20 = 106% (which would require extra credit). Our built-in Target Grade & Simulator above solves this dynamically for you!',
      },
      {
        id: 'points-vs-weighted',
        category: 'general',
        question: 'What is the difference between points-based and weighted grading?',
        answer:
          'In a points-based grading system, every earned point contributes equally to your overall total: your grade is simply total points earned divided by total points possible. In a weighted grading system, assignment categories have fixed percentages (e.g., Homework 20%, Exams 50%), meaning a 10-point quiz in an exam category carries significantly more impact than a 10-point homework assignment.',
      },
      {
        id: 'weights-not-100',
        category: 'weighted',
        question: 'Can I calculate my grade if weights do not add up to 100%?',
        answer:
          'Yes! Our Easy Grade Tool automatically normalizes relative weights. The algorithm divides your accumulated weighted score by the sum of currently active weights entered. This ensures mathematically precise tracking at any point during the semester, even when future assignments or final exam weights have not yet occurred.',
      },
      {
        id: 'rounding-percentages',
        category: 'general',
        question: 'Does this grade calculator round the final percentage?',
        answer:
          'The displayed percentage is rounded to one decimal place (e.g., 89.6%) for clean, clear readability. However, institutional letter grade classifications and trajectory projections are evaluated using unrounded floating-point precision, ensuring your letter grade assignment strictly follows the selected standard or plus/minus scale.',
      },
      {
        id: 'points-to-pass',
        category: 'exams',
        question: 'How many points do I need to pass my class?',
        answer:
          'First check your course syllabus for the minimum passing threshold (typically 60% for a D or 70% for a C). Enter all completed scores into the calculator, then set your target grade to that passing percentage in the Target Grade Simulator to see the exact minimum score and points required on your remaining assignments.',
      },
    ],
  },
  gpa: {
    eyebrow: 'Academic Standing FAQs',
    title: 'How is GPA Calculated? College & University FAQs',
    description:
      'Authoritative answers regarding 4.0 grade point averages, credit weighting, quality points, and registrar transcript policies.',
    ctaText: 'Add your semester courses above to see your cumulative GPA and quality points update in real time.',
    items: [
      {
        id: 'gpa-calculation',
        category: 'gpa',
        question: 'How do I calculate my GPA?',
        answer:
          'Your Grade Point Average (GPA) is calculated on a 4.0 scale by converting each course letter grade into numerical grade points (A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, D = 1.0, F = 0.0). You multiply each grade point value by the course credit hours to obtain "quality points", add all quality points together across all courses, and divide by the total number of credits attempted.',
      },
      {
        id: 'projected-gpa',
        category: 'gpa',
        question: 'How do I calculate a projected GPA?',
        answer:
          'A projected GPA estimates where your GPA will land after the courses you are taking now. Enter your current cumulative GPA and credits earned, add this term\'s courses with the grades you expect, and divide total quality points by total credits. For example, 60 credits at a 3.2 GPA is 192 quality points; adding 15 credits at 3.6 gives 54 more, so (192 + 54) ÷ 75 = 3.28.',
      },
      {
        id: 'gpa-for-73-percent',
        category: 'gpa',
        question: 'What GPA is a 73?',
        answer:
          'A 73% is a C on most grading scales, which is worth 2.0 on the 4.0 scale. On the plus/minus scale 73 is the lowest C (2.0): 70 to 72 is a C- (1.7) and 77 starts a C+ (2.3). Some schools set their own cutoffs, so check your syllabus.',
      },
      {
        id: 'gpa-quality-points-chart',
        category: 'gpa',
        question: 'What is the quality points chart for a 3-credit course?',
        answer:
          'Quality points are grade points multiplied by credits. For a 3-credit course on the 4.0 scale: A (4.0) = 12, A- (3.7) = 11.1, B+ (3.3) = 9.9, B (3.0) = 9, B- (2.7) = 8.1, C+ (2.3) = 6.9, C (2.0) = 6, D (1.0) = 3 and F (0.0) = 0.',
      },
      {
        id: 'weighted-vs-unweighted-gpa',
        category: 'gpa',
        question: 'What is the difference between weighted and unweighted GPA?',
        answer:
          'An unweighted GPA is calculated on a standard 4.0 scale where course difficulty is not considered (an A in a standard class and an A in an advanced course both equate to 4.0). A weighted GPA assigns additional weight (often up to 5.0) to advanced, AP, IB, or Honors courses to reflect increased academic challenge and effort.',
      },
      {
        id: 'quality-points-explained',
        category: 'gpa',
        question: 'What are quality points and how are they calculated?',
        answer:
          'Quality points represent the numerical value of a grade relative to course credit hours. They are determined by multiplying the assigned grade points for the letter grade by the number of credit hours for that course. For instance, an "A" (4.0 points) in a 4-credit course yields 16 quality points (4.0 × 4 = 16), which are then summed across all courses to find your GPA.',
      },
      {
        id: 'semester-vs-cumulative-gpa',
        category: 'gpa',
        question: 'What is the difference between semester GPA and cumulative GPA?',
        answer:
          'A semester GPA reflects your academic performance during a single semester or term. The cumulative GPA represents the overall average of all quality points earned across every semester throughout your entire college or university enrollment.',
      },
      {
        id: 'retaken-courses-gpa',
        category: 'gpa',
        question: 'How do retaken courses affect my GPA?',
        answer:
          'Most institutions have grade forgiveness or repeat policies where the new grade replaces the prior grade in the cumulative GPA calculation, significantly improving your academic standing. However, both course attempts usually remain recorded on your official university transcript.',
      },
      {
        id: 'good-gpa-guidelines',
        category: 'gpa',
        question: 'What is considered a good GPA for college honors and graduate school?',
        answer:
          'Most colleges require a 2.0 GPA for good academic standing. A GPA of 3.0 or above is generally competitive for graduate school programs, while a GPA of 3.5 or higher typically qualifies students for Dean\'s List recognition, honors societies, and academic distinction (cum laude).',
      },
      {
        id: 'gpa-weighted-vs-unweighted',
        category: 'gpa',
        question: 'What is the difference between weighted and unweighted GPA?',
        answer:
          'An unweighted GPA uses the plain 4.0 scale, so an A is 4.0 in every course. A weighted GPA adds bonus points for harder courses, commonly +0.5 for honors and +1.0 for AP or IB, so the scale can reach 5.0. Weighted vs unweighted GPA is mostly a high school distinction, and your transcript may list both.',
      },
      {
        id: 'gpa-unweighted-meaning',
        category: 'gpa',
        question: 'What is the unweighted GPA meaning?',
        answer:
          'Unweighted GPA means a grade point average that ignores course difficulty. Every A counts 4.0, every B 3.0 and so on, whether the class is regular, honors or AP. The calculator above gives an unweighted GPA.',
      },
      {
        id: 'gpa-weighted-calculator',
        category: 'gpa',
        question: 'Is there a weighted GPA calculator here?',
        answer:
          'This calculator works on the 4.0 scale (with an optional 4.33 for A+). To find a weighted GPA, add your school’s bonus, such as +0.5 for honors or +1.0 for AP, to the grade points of those courses, then multiply by credits and divide by total credits. Bonus values vary, so use your school’s weighting table.',
      },
      {
        id: 'gpa-college-admissions',
        category: 'gpa',
        question: 'How does weighted GPA affect college admissions?',
        answer:
          'Many colleges recalculate GPA on their own scale, often unweighted, and look at the rigor of the courses you chose. A weighted GPA shows that you took harder classes, but it is not directly comparable between schools because weighting systems differ. Your school profile explains how your school weights courses.',
      },
      {
        id: 'gpa-high-school-how',
        category: 'gpa',
        question: 'How do I calculate my high school GPA?',
        answer:
          'Convert each final course grade to grade points (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0), multiply by the credit value, add the results and divide by total credits. If every course has the same credit, divide by the number of courses. A student with 4.0, 3.0, 4.0 and 3.0 in four equal courses has a 3.5 GPA.',
      },
      {
        id: 'gpa-high-school-calculator',
        category: 'gpa',
        question: 'Can I use this as a high school GPA calculator?',
        answer:
          'Yes. Enter each course with its letter grade and credit value (use 1.0 for equal credits) to get your semester GPA, then add your prior GPA and credits for a cumulative figure. It gives the unweighted GPA on a 4.0 scale.',
      },
      {
        id: 'gpa-scale-4-high-school',
        category: 'gpa',
        question: 'What is the GPA scale 4.0 high school students use?',
        answer:
          'On the common 4.0 scale an A is 4.0, a B is 3.0, a C is 2.0, a D is 1.0 and an F is 0.0, with plus and minus grades such as A- at 3.7 and B+ at 3.3. Schools that weight courses add bonus points for honors, AP or IB classes on top of this.',
      },
      {
        id: 'gpa-needed-for-college',
        category: 'gpa',
        question: 'What GPA do I need to get into college?',
        answer:
          'It depends on the college. Community colleges and open-admission schools often set no minimum, many state universities report a middle range of roughly 3.0 to 3.8, and the most selective colleges typically admit students close to 4.0 unweighted. Check each school’s admitted-student profile.',
      },
      {
        id: 'gpa-semester-vs-cumulative',
        category: 'gpa',
        question: 'What is the difference between a semester GPA and a cumulative GPA?',
        answer:
          'A semester GPA covers the courses from one term only. A cumulative GPA combines every term by adding all quality points and dividing by all credits attempted. The calculator’s prior GPA and credits fields turn a semester result into a cumulative GPA.',
      },
      {
        id: 'gpa-quality-points',
        category: 'gpa',
        question: 'How do I use a quality points calculator?',
        answer:
          'Quality points are grade points multiplied by credit hours. An A (4.0) in a 3-credit course is 12.0 quality points. Add the quality points for all courses and divide by the total credits to get your GPA. The calculator shows the quality points for each course.',
      },
    ],
  },
  cgpa: {
    eyebrow: 'CGPA Conversion & University FAQs',
    title: 'CGPA to Percentage Conversion FAQs',
    description:
      'Verified answers on converting CGPA to percentage across 10.0, 5.0, and 4.0 grading scales, official university circulars, and SGPA to CGPA formulas.',
    ctaText: 'Select your grading scale and university above to compute your exact percentage and download an official PDF report.',
    items: [
      {
        id: 'how-to-convert-cgpa-to-percentage',
        category: 'cgpa',
        question: 'How do I convert my 10-point CGPA to a percentage?',
        answer:
          'Under the standard UGC and CBSE 10-point grading system, multiply your Cumulative Grade Point Average (CGPA) by 9.5: Percentage = CGPA × 9.5. For example, an 8.2 CGPA equals 8.2 × 9.5 = 77.90%. However, if your university prescribes a specific ordinance (such as VTU, MAKAUT, GTU, Mumbai University, or Anna University), you should apply your institution’s official formula.',
      },
      {
        id: 'vtu-makaut-sppu-formula',
        category: 'cgpa',
        question: 'Why do VTU, MAKAUT, AKTU, and SPPU subtract 0.75 from CGPA before multiplying by 10?',
        answer:
          'Technical universities under AICTE/CBCS frameworks—such as VTU, MAKAUT (WBUT), AKTU, BAMU, and SPPU (2019 CBCS rulebook)—use grade point bands where the midpoint of each letter grade band sits 7.5 percentage points below the band maximum. Subtracting 0.75 from the CGPA and multiplying by 10 aligns the grade point average with the true mark band midpoint: Percentage = (CGPA − 0.75) × 10.',
      },
      {
        id: 'mumbai-university-cgpa-formula',
        category: 'cgpa',
        question: 'What is the official Mumbai University CGPA to percentage formula?',
        answer:
          'For general undergraduate and postgraduate programmes under CBSGS/CBCS, the University of Mumbai prescribes Percentage = (7.1 × CGPA) + 11. For Faculty of Technology (Engineering) programmes from 2015–16 onward, the circular specifies Percentage = (7.4 × CGPA) + 12 for CGPA ≥ 7.0 and Percentage = (7.1 × CGPA) + 12 for CGPA < 7.0.',
      },
      {
        id: 'convert-4-and-5-scale-cgpa',
        category: 'cgpa',
        question: 'How do I convert a 4.0 or 5.0 scale CGPA into a percentage?',
        answer:
          'On a 4.0 grading scale (used in the US, Canada, and Pakistani universities under HEC such as NUST, LUMS, COMSATS, and FAST), the linear conversion formula is Percentage = CGPA × 25 (e.g., 3.40 CGPA = 85.00%). On a 5.0 grading scale, the formula is Percentage = CGPA × 20 (e.g., 4.10 CGPA = 82.00%).',
      },
      {
        id: 'difference-between-sgpa-and-cgpa',
        category: 'cgpa',
        question: 'What is the difference between SGPA and CGPA, and how do I convert SGPA to CGPA?',
        answer:
          'SGPA (Semester Grade Point Average) measures your academic performance in a single semester, whereas CGPA (Cumulative Grade Point Average) is the credit-weighted average of your SGPAs across all completed semesters: CGPA = Σ(Semester SGPA × Semester Credits) ÷ Total Credits. If all semesters carry equal credits, CGPA is the simple arithmetic mean of all semester SGPAs.',
      },
      {
        id: 'which-formula-for-job-applications',
        category: 'cgpa',
        question: 'Which conversion formula should I enter on government job, GATE, CAT, or PSU forms?',
        answer:
          'Always check the reverse side of your university marksheet or official transcript first. Recruitment portals (such as UPSC, GATE, IBPS, and CAT) require you to use the exact conversion formula printed by your university or degree board. Only if your university states that no official conversion formula exists should you apply the standard UGC/AICTE multiplier (typically × 9.5 or × 10 as specified in the exam notification).',
      },
    ],
  },
  tip: {
    eyebrow: 'Gratuity & Etiquette FAQs',
    title: 'Tipping & Bill Splitting FAQs',
    description:
      'Answers to common tipping dilemmas, pre-tax versus post-tax gratuities, mental calculation tricks, and group bill splits.',
    ctaText: 'Use the tip percentage selector and split fields above for instant, fair per-person amounts.',
    items: [
      {
        id: 'standard-tip-percentage',
        category: 'tip',
        question: 'What is the standard tip percentage in restaurants?',
        answer:
          'In North America, standard gratuity for sit-down restaurant dining is 15% to 20% of the bill subtotal. Exceptional service is commonly rewarded with 20% to 25%, while 10% to 15% is reserved for below-average service. For delivery and rideshares, 15% to 20% is also customary.',
      },
      {
        id: 'tip-before-or-after-tax',
        category: 'tip',
        question: 'Should I calculate the tip before or after sales tax?',
        answer:
          'Etiquette experts recommend calculating your tip on the pre-tax bill amount. Sales tax is a government levy rather than compensation for hospitality service, though calculating on the total amount is common when using card terminal presets.',
      },
      {
        id: 'mental-math-20-tip',
        category: 'tip',
        question: 'What is the quickest mental math trick to calculate a 20% tip?',
        answer:
          'Move the decimal point of your bill one space to the left to find 10%, then double that number. For example, on a $54.00 check, 10% is $5.40, and doubling it yields $10.80 for a 20% tip.',
      },
      {
        id: 'how-to-split-bill-fairly',
        category: 'tip',
        question: 'How do I split a restaurant bill evenly among friends?',
        answer:
          'Add the bill subtotal, taxes, and tip together to get the grand total, then divide equally by the number of people dining. Our tip calculator does this instantly and shows both individual shares and total gratuity.',
      },
      {
        id: 'international-tipping-customs',
        category: 'tip',
        question: 'What are international tipping customs in places like Japan or Europe?',
        answer:
          'Tipping norms vary globally. In Japan, tipping is not expected and can even be considered rude or confusing because exceptional service is built into standard wages. In many European nations, service charges are included by law ("service compris"), and patrons simply leave small change or round up by 5% to 10%.',
      },
      {
        id: 'tipping-takeout-counter',
        category: 'tip',
        question: 'Should I tip on takeout or counter-service orders?',
        answer:
          'Tipping on takeout is optional. Leaving 10% or rounding up with change is considered courteous for packing and preparation, especially on large, complex, or customized food orders.',
      },
      {
        id: 'tip-split-bill-calculator',
        category: 'tip',
        question: 'How does the split bill calculator work?',
        answer:
          'Enter the bill, choose a tip percentage and set the number of people. The tip is added to the bill and the total is divided evenly, so you see the tip, the total and the amount each person pays. A $120 bill with an 18% tip split four ways is $35.40 per person.',
      },
    ],
  },
  percentage: {
    eyebrow: 'Math & Formulas FAQs',
    title: 'Percentage Calculation FAQs',
    description:
      'Step-by-step answers on how to calculate a percentage, percentage increase and decrease, percentage difference, reverse percentage, marks and grades.',
    ctaText: 'Use the percentage calculators above to compute increases, decreases, and fractions instantly.',
    items: [
      {
        id: 'percentage-change-formula',
        category: 'math',
        question: 'How do I calculate percentage change (increase or decrease)?',
        answer:
          'To calculate percentage change: subtract the original value from the new value, divide by the absolute value of the original number, and multiply by 100: [ (New - Old) ÷ |Old| ] × 100. A positive result indicates a percentage increase, while a negative result represents a percentage decrease.',
      },
      {
        id: 'what-percent-x-of-y',
        category: 'math',
        question: 'What is the formula to find what percent X is of Y?',
        answer:
          'Divide X by Y, then multiply the result by 100: (X ÷ Y) × 100. For example, to find what percentage 25 is of 80: (25 ÷ 80) × 100 = 31.25%.',
      },
      {
        id: 'calculate-discount-savings',
        category: 'math',
        question: 'How do you calculate a sale discount and savings amount?',
        answer:
          'Multiply the original price by the discount percentage divided by 100 to get your savings. Then subtract that savings amount from the original price to find the final sale price. For example, 30% off $80 is: $80 × 0.30 = $24 savings, leaving a sale price of $56.',
      },
      {
        id: 'percentages-greater-than-100',
        category: 'math',
        question: 'Can percentages be greater than 100%?',
        answer:
          'Yes! A percentage greater than 100% simply means the quantity is larger than the original base reference. For instance, if an investment grows from $100 to $250, that represents a 150% increase and 250% of the original value.',
      },
      {
        id: 'percentage-vs-percentile',
        category: 'math',
        question: 'What is the difference between a percentage and a percentile?',
        answer:
          'A percentage expresses a fraction or proportion out of 100 (e.g., scoring 85% on an exam means 85 out of 100 questions correct). A percentile describes relative rank compared to others (e.g., scoring in the 90th percentile means you scored higher than 90% of test takers).',
      },
      {
        id: 'percentage-percent-change-calculator',
        category: 'percentage',
        question: 'How do I use the percent change calculator?',
        answer:
          'Enter the starting value and the new value. The percent change is (new − old) ÷ old × 100: going from 80 to 100 is a 25% increase, and going from 100 to 80 is a 20% decrease. A positive result means growth and a negative result means a drop.',
      },
      {
        id: 'how-to-use-a-percentage-calculator',
        category: 'percentage',
        question: 'How do I use a percentage calculator?',
        answer:
          'Pick the question that matches your problem and fill in the two blanks. Use the first box for X% of a number, the second for X is what percent of Y, and the third for the percentage change from one value to another. The result updates as you type. For example, 20% of 150 is 30, 30 is 20% of 150, and going from 100 to 125 is a 25% increase.',
      },
      {
        id: 'what-is-a-percentage-calculator',
        category: 'percentage',
        question: 'What is a percentage calculator?',
        answer:
          'A percentage calculator is an online tool that does percent math for you: finding a percentage of a number, working out what percent one number is of another, and measuring how much a value rose or fell in percent. It applies the standard formulas, such as (part ÷ whole) × 100, so you do not have to do the division and multiplication by hand.',
      },
      {
        id: 'how-to-calculate-percentage-increase',
        category: 'percentage',
        question: 'How do I calculate a percentage increase?',
        answer:
          'Subtract the old value from the new value, divide by the old value, and multiply by 100. A price that rises from 40 to 50 is (50 − 40) ÷ 40 × 100 = 25% higher. In the percentage change box, enter 40 as the start and 50 as the end to get +25%.',
      },
      {
        id: 'how-to-calculate-percentage-decrease',
        category: 'percentage',
        question: 'How do I calculate a percentage decrease, reduction or drop?',
        answer:
          'Use the same formula as an increase: (new − old) ÷ old × 100. If the answer is negative, it is a decrease. A value that falls from 200 to 150 is (150 − 200) ÷ 200 × 100 = −25%, so it dropped by 25%. Enter 200 as the start and 150 as the end in the percentage change box to see −25%.',
      },
      {
        id: 'increase-or-decrease-number-by-percentage',
        category: 'percentage',
        question: 'How do I increase or decrease a number by a percentage?',
        answer:
          'To increase a number by a percentage, multiply it by (1 + percent ÷ 100). To decrease it, multiply by (1 − percent ÷ 100). So 120 increased by 15% is 120 × 1.15 = 138, and 120 reduced by 15% is 120 × 0.85 = 102. You can also find 15% of 120 in the first box (18) and add or subtract it.',
      },
      {
        id: 'percentage-difference-between-two-numbers',
        category: 'percentage',
        question: 'How do I find the percentage difference between two numbers?',
        answer:
          'Percentage difference compares two values without treating either as the starting point. Divide the absolute difference by the average of the two numbers, then multiply by 100. For 50 and 75 the difference is 25 and the average is 62.5, so the percentage difference is 40%. Percentage change from 50 to 75 is a different figure, +50%, because it uses 50 as the base.',
      },
      {
        id: 'percentage-change-vs-percentage-difference',
        category: 'percentage',
        question: 'What is the difference between percentage change and percentage difference?',
        answer:
          'Percentage change has a clear starting value and divides by it, so the direction matters: 50 to 75 is +50%, while 75 to 50 is −33.33%. Percentage difference divides by the average of both numbers, so the order does not matter and the result is the same either way. Use change for before and after, and difference when comparing two values side by side.',
      },
      {
        id: 'reverse-percentage-original-value',
        category: 'percentage',
        question: 'How do I find the original number after a percentage increase or discount (reverse percentage)?',
        answer:
          'Divide the final value by the multiplier. After a 20% discount the multiplier is 0.80, so a sale price of 60 came from 60 ÷ 0.80 = 75. After a 20% increase the multiplier is 1.20, so a final value of 60 came from 60 ÷ 1.20 = 50. Do not simply add or subtract 20% from the final price, because the percentage applied to the original number, not the new one.',
      },
      {
        id: 'how-to-calculate-percentage-of-marks-or-grades',
        category: 'percentage',
        question: 'How do I calculate a percentage for marks, test scores or grades?',
        answer:
          'Divide the marks you scored by the total marks and multiply by 100. A score of 45 out of 50 is (45 ÷ 50) × 100 = 90%, and 425 out of 500 is 85%. In the second box, enter your score as X and the total as Y. For a weighted course grade or a letter grade, use the grade calculators on this site.',
      },
      {
        id: 'how-to-calculate-average-percentage',
        category: 'percentage',
        question: 'How do I calculate an average percentage?',
        answer:
          'If every item has the same total, add the percentages and divide by how many there are. If the totals differ, add all the points you earned and divide by all the points possible. For example, 80% on a 50-point quiz and 90% on a 100-point exam is (40 + 90) ÷ (50 + 100) = 86.67%, not the simple average of 85%.',
      },
      {
        id: 'percentage-without-calculator',
        category: 'percentage',
        question: 'How can I calculate a percentage without a calculator?',
        answer:
          'Start from 10% and 1%. To find 10%, move the decimal one place left, and for 1%, move it two places. Then combine them: 15% of 80 is 10% (8) plus half of that (4), which is 12. For 25%, take a quarter, and for 50%, halve the number. Multiply or add these pieces to build any percentage.',
      },
      {
        id: 'convert-percentage-decimal-fraction',
        category: 'percentage',
        question: 'How do I convert a percentage to a decimal or fraction, and back?',
        answer:
          'Divide the percentage by 100 to get a decimal: 15% becomes 0.15, and 75% becomes 0.75. To go from a decimal to a percentage, multiply by 100, so 0.375 is 37.5%. For a fraction, divide the numerator by the denominator and multiply by 100: 3/8 is 0.375, which is 37.5%.',
      },
      {
        id: 'percentage-calculator-weight-loss',
        category: 'percentage',
        question: 'How do I calculate weight loss as a percentage?',
        answer:
          'Subtract your current weight from your starting weight, divide by the starting weight, and multiply by 100. Going from 200 lb to 180 lb is (200 − 180) ÷ 200 × 100 = 10% weight loss. In the percentage change box, enter 200 and 180 and read the result as −10%, which means a 10% loss.',
      },
      {
        id: 'percentage-formulas-excel-google-sheets',
        category: 'percentage',
        question: 'What are the percentage formulas for Excel and Google Sheets?',
        answer:
          'To get what percent A1 is of B1, use =A1/B1 and format the cell as Percentage. For percentage change from A1 to B1, use =(B1-A1)/A1. To increase A1 by 10%, use =A1*(1+10%), and to find 10% of A1, use =A1*10%. Both Excel and Google Sheets use the same formulas.',
      },
      {
        id: 'percentage-points-vs-percent',
        category: 'percentage',
        question: 'What is the difference between percentage points and percent?',
        answer:
          'Percentage points are the plain subtraction of two percentages, while percent change compares them proportionally. If a rate rises from 10% to 12%, that is an increase of 2 percentage points, but it is a 20% increase in the rate itself, because 2 ÷ 10 = 0.20.',
      },
      {
        id: 'markup-vs-margin-percentage',
        category: 'percentage',
        question: 'How do I calculate profit, markup and margin percentages?',
        answer:
          'Markup is profit divided by cost, and margin is profit divided by selling price, both times 100. If an item costs 80 and sells for 100, the profit is 20, so the markup is 20 ÷ 80 = 25% and the margin is 20 ÷ 100 = 20%. Use the second box with profit as X and cost or price as Y.',
      },
    ],
  },
  loan: {
    eyebrow: 'Financing & Interest FAQs',
    title: 'Loan & Amortization FAQs',
    description:
      'Understand how loan amortization schedules work, the impact of APR, and how extra principal payments save money.',
    ctaText: 'Adjust your loan term, interest rate, or principal balance above to see your monthly payment breakdown.',
    items: [
      {
        id: 'monthly-loan-formula',
        category: 'loan',
        question: 'How is a monthly loan payment calculated?',
        answer:
          'Monthly payments are calculated using the standard amortization formula: M = P [i(1 + i)^n] ÷ [(1 + i)^n - 1], where M is monthly payment, P is principal loan amount, i is monthly interest rate (annual APR ÷ 12), and n is total number of monthly payments.',
      },
      {
        id: 'principal-vs-interest',
        category: 'loan',
        question: 'What is the difference between principal and interest?',
        answer:
          'Principal is the actual capital amount you borrowed and owe back to the lender. Interest is the financing fee charged by the lender for the use of their money. Each monthly payment is divided between paying down accrued interest and reducing the principal balance.',
      },
      {
        id: 'loan-amortization-schedule',
        category: 'loan',
        question: 'What is loan amortization?',
        answer:
          'Amortization is the process of paying off debt through regular, scheduled installments over time. In early loan months, the majority of each payment goes toward interest. Over time, as the principal balance decreases, a greater percentage of each payment directly reduces the loan principal.',
      },
      {
        id: 'extra-payments-impact',
        category: 'loan',
        question: 'How does making extra payments shorten loan duration and interest?',
        answer:
          'Any extra payment made beyond the scheduled monthly installment is applied directly to the principal balance. Lowering principal early reduces future compounded interest calculations, saving thousands of dollars in interest and paying off the loan months or years ahead of schedule.',
      },
      {
        id: 'apr-vs-interest-rate',
        category: 'loan',
        question: 'What is the difference between APR and interest rate?',
        answer:
          'The interest rate is the cost of borrowing the principal amount per year. The Annual Percentage Rate (APR) reflects the total cost of credit, combining the interest rate along with lender fees, points, and origination charges.',
      },
    ],
  },
  mortgage: {
    eyebrow: 'Real Estate & Financing FAQs',
    title: 'Mortgage & Home Financing FAQs',
    description:
      'Key facts on PITI payment components, down payment ratios, private mortgage insurance (PMI), and 15 vs 30-year terms.',
    ctaText: 'Calculate your estimated monthly mortgage payment, taxes, and insurance using our tool above.',
    items: [
      {
        id: 'what-is-piti',
        category: 'mortgage',
        question: 'What does PITI stand for in a mortgage payment?',
        answer:
          'PITI stands for Principal, Interest, Taxes, and Insurance. These four elements make up your total monthly housing obligation: Principal repays borrowed loan balance, Interest pays the lender, Property Taxes support local municipality services, and Homeowners Insurance protects the property against damage.',
      },
      {
        id: 'pmi-requirements',
        category: 'mortgage',
        question: 'What is Private Mortgage Insurance (PMI) and when is it required?',
        answer:
          'PMI is insurance that protects the lender if a borrower defaults on a conventional mortgage. It is generally required when a buyer makes a down payment of less than 20% of the home\'s purchase price, and can typically be cancelled once your equity reaches 20%.',
      },
      {
        id: '15-vs-30-year-mortgage',
        category: 'mortgage',
        question: 'What is the difference between a 15-year and 30-year mortgage?',
        answer:
          'A 30-year mortgage has lower monthly payments because loan payoff is spread across 360 months, but results in far higher total interest over the life of the loan. A 15-year mortgage requires higher monthly payments, but has lower interest rates and saves tens of thousands of dollars in overall interest.',
      },
      {
        id: 'closing-costs-budget',
        category: 'mortgage',
        question: 'How much should I budget for mortgage closing costs?',
        answer:
          'Closing costs usually range between 2% and 5% of the total loan amount. These include appraisal fees, title searches, loan origination fees, home inspections, and prepaid escrow deposits.',
      },
      {
        id: 'debt-to-income-rule',
        category: 'mortgage',
        question: 'What is the 28/36 rule in mortgage qualification?',
        answer:
          'The 28/36 rule is a standard lending guideline: your monthly housing costs (PITI) should not exceed 28% of your gross monthly income, and total debt obligations (housing plus car loans, student debt, credit cards) should not exceed 36% of your gross income.',
      },
    ],
  },
  password: {
    eyebrow: 'Password Generator FAQs',
    title: 'Password Generator FAQs: Strong, Safe & Secure Passwords',
    description:
      'Direct answers on how a random password generator works, how long a strong password should be, which passwords to avoid, and where to keep them safe.',
    ctaText: 'Use the password generator above to create a strong, random password with your own length, numbers and symbols.',
    items: [
      {
        id: 'cryptographic-security',
        category: 'security',
        question: 'Do password generators create strong, unique passwords?',
        answer:
          'A good one does. This generator picks every character with your browser\'s cryptographic random source (crypto.getRandomValues), so the result follows no pattern, uses no dictionary words and has nothing to do with your personal details. Generate a fresh password for each account and every one will be unique.',
      },
      {
        id: 'why-strong-passwords',
        category: 'security',
        question: 'Why should passwords be strong?',
        answer:
          'Attackers do not guess by hand. They run automated tools that try leaked passwords, common words and every short combination. A long, random password makes those attacks impractical, and it protects the email, banking and shopping accounts that can be reached through a single weak login.',
      },
      {
        id: 'length-vs-complexity',
        category: 'security',
        question: 'How long should a strong password be: 8, 12, 16 or 20 characters?',
        answer:
          'Use 12 characters as a minimum and 16 or more for important accounts such as email, banking and your password manager. With this generator\'s default character set, 8 characters give about 49 bits of randomness, 12 about 73, 16 about 98 and 20 about 122. Each extra character multiplies the work an attacker needs. Use 8 only where a site forces it.',
      },
      {
        id: 'eight-four-rule',
        category: 'security',
        question: 'What is the 8 4 rule for passwords?',
        answer:
          'It is not an official standard. People usually mean the older composition rule of at least 8 characters containing 4 types: uppercase, lowercase, number and symbol. It is a weak target. A random 8-character password can still be cracked, so aim for 12 to 16 or more characters, and pick length over clever substitutions.',
      },
      {
        id: 'typical-password-requirements',
        category: 'security',
        question: 'What are typical password requirements?',
        answer:
          'Most sites ask for 8 or more characters and a mix of uppercase and lowercase letters, numbers and symbols. Some cap the length or reject certain symbols. Set the length above to the maximum the site allows, then edit the symbols field if a particular character is refused.',
      },
      {
        id: 'no-special-characters',
        category: 'tool',
        question: 'Can I generate a password with no special characters?',
        answer:
          'Yes. Clear the Symbols field and the generator uses only letters and the numbers you list. Because you lose the symbol characters, add length to compensate: a 16-character letters-and-numbers password is stronger than a 10-character one with symbols.',
      },
      {
        id: 'look-alike-characters',
        category: 'tool',
        question: 'Why does the generator leave out I, O, l, 1 and 0?',
        answer:
          'Those five characters are easy to confuse on screen and on paper. Removing them makes a password easier to read aloud, type from a phone and copy by hand, such as a WiFi password or a temporary login. The pool is still large enough to stay strong at a sensible length.',
      },
      {
        id: 'most-hacked-passwords',
        category: 'security',
        question: 'What is the most hacked password, and which passwords should never be used?',
        answer:
          'Breach lists are topped year after year by simple number runs such as 123456 and by the word "password" itself. Never use those, keyboard patterns like qwerty, names, birthdays, pet names, the site\'s own name, or any password you already use elsewhere.',
      },
      {
        id: 'strongest-password',
        category: 'security',
        question: 'What is the strongest password in the world?',
        answer:
          'There is no single strongest password. Strength comes from length and randomness, not from a specific string. A long password generated at random and used on one account only is as strong as passwords get, and adding two-step verification covers the rest.',
      },
      {
        id: 'check-password-secure',
        category: 'security',
        question: 'How can I check if my password is secure?',
        answer:
          'Check three things: it is at least 12 to 16 characters, it is random rather than a word or pattern, and you use it on only one account. You can also check whether it has appeared in a breach with a reputable service such as Have I Been Pwned. Never type a real password into a site you do not trust.',
      },
      {
        id: 'password-managers-safety',
        category: 'security',
        question: 'Is there a free password manager to keep my generated passwords?',
        answer:
          'Yes, several. Open-source options such as KeePass are free, some managers including Bitwarden offer a free tier, and most browsers and phones include a built-in manager. Whichever you choose, pick one that encrypts your vault so the company cannot read it, and protect it with a long master password and two-step verification.',
      },
      {
        id: 'never-hacked-manager',
        category: 'security',
        question: 'Which password manager has never been hacked?',
        answer:
          'No provider can honestly promise that it never will be. What matters is how a manager is built: with zero-knowledge encryption, a breach exposes only encrypted vaults that cannot be opened without your master password. Choose a well-reviewed, independently audited manager and keep your master password strong and unique.',
      },
      {
        id: 'where-not-to-store-passwords',
        category: 'security',
        question: 'Where should you not store passwords?',
        answer:
          'Avoid sticky notes, plain text files, unprotected notes apps, spreadsheets, email drafts and messages to yourself, and the saved-password prompt on a shared or public computer. Keep passwords in an encrypted password manager instead.',
      },
      {
        id: 'password-reuse-danger',
        category: 'security',
        question: 'Why should I never reuse passwords across multiple accounts?',
        answer:
          'When one website suffers a data breach, attackers test the leaked email and password pair against thousands of other services in automated "credential stuffing" attacks. A unique password for every account means a breach on one site cannot unlock your others.',
      },
      {
        id: 'how-often-change-passwords',
        category: 'security',
        question: 'How often should I change my passwords?',
        answer:
          'Current guidance, including NIST\'s, advises against routine forced changes because they push people toward predictable variations. Use long, random, unique passwords, and change one right away if a service reports a breach or you notice suspicious activity.',
      },
    ],
  },
};

interface FAQProps {
  tool?: ToolKey;
  items?: FAQItem[];
  className?: string;
  /** Optional per-page heading (eyebrow, title, description, CTA) layered over the tool's default. */
  heading?: FaqHeading;
}

export const FAQ: React.FC<FAQProps> = ({ tool = 'quick', items, className = '', heading }) => {
  const baseConfig = TOOL_FAQS[tool] || TOOL_FAQS.quick;
  const config: ToolFaqConfig = heading ? { ...baseConfig, ...heading } : baseConfig;
  const activeItems = items || config.items;

  // Open first two items by default
  const defaultOpen = new Set(activeItems.slice(0, 2).map((item) => item.id));
  const [openIds, setOpenIds] = useState<Set<string>>(defaultOpen);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const baseId = useId();

  // Reset open items when tool changes
  React.useEffect(() => {
    setOpenIds(new Set(activeItems.slice(0, 2).map((item) => item.id)));
    setSearchQuery('');
  }, [tool]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenIds(new Set(filteredItems.map((item) => item.id)));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  // Filter items based on search query
  const filteredItems = activeItems.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query)
    );
  });

  // Schema.org FAQPage JSON-LD structured data for rich SEO snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: activeItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // Direct DOM synchronization to ensure document.head contains the updated FAQPage JSON-LD schema
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let scriptTag = document.querySelector('script#schema-org-faq') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('id', 'schema-org-faq');
      document.head.appendChild(scriptTag);
    } else {
      scriptTag.removeAttribute('data-rh');
    }
    scriptTag.textContent = JSON.stringify(faqSchema, null, 2);
    return () => {
      document.querySelector('script#schema-org-faq')?.remove();
    };
  }, [faqSchema]);

  return (
    <>
      {/* Schema.org FAQPage structured data injected into <head> for Google 'People Also Ask' rich snippets */}
      {typeof window === 'undefined' && (
        <Helmet>
          <script id="schema-org-faq" type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        </Helmet>
      )}

      <section
        className={`faq-section guide-shell ${className}`.trim()}
        aria-labelledby={`${baseId}-faq-title`}
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <div className="guide-card font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono mb-1">
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              <span>{config.eyebrow}</span>
            </div>
            <h2
              id={`${baseId}-faq-title`}
              className="faq-title"
            >
              {config.title}
            </h2>
            <p className="faq-desc">
              {config.description}
            </p>
          </div>

          {/* Expand / Collapse Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={expandAll}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 rounded-full transition-all border border-slate-200/60 dark:border-slate-700/60 shadow-xs cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 rounded-full transition-all border border-slate-200/60 dark:border-slate-700/60 shadow-xs cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search frequently asked questions"
            placeholder={`Search ${config.title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 rounded-2xl pl-11 pr-4 py-3.5 shadow-inner text-base sm:text-sm placeholder-slate-400 font-medium transition-all duration-200"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-3" role="region" aria-label="Questions and Answers List">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No questions found matching &ldquo;{searchQuery}&rdquo;. Try another search term.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800/90 rounded-full hover:bg-slate-200 transition-all border border-slate-200/60 dark:border-slate-700/60 shadow-xs cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOpen = openIds.has(item.id);
              const questionId = `${baseId}-q-${item.id}`;
              const answerId = `${baseId}-a-${item.id}`;

              return (
                <div
                  key={item.id}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  className={`overflow-hidden bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-xs rounded-2xl mb-3 transition-all hover:shadow-md ${
                    isOpen
                      ? 'ring-2 ring-teal-500/20 dark:ring-teal-500/20 border-teal-500/30 dark:border-teal-500/30'
                      : ''
                  }`}
                >
                  <button
                    type="button"
                    id={questionId}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 cursor-pointer"
                  >
                    <span
                      itemProp="name"
                      className="faq-q tracking-tight"
                    >
                      {item.question}
                    </span>
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-200 shrink-0 ${
                        isOpen
                          ? 'rotate-180 bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </button>

                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                    className={`overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
                  >
                    <div
                      itemProp="text"
                      className="faq-a px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80"
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Helpful User Support Footer Card */}
        <div className="mt-8 p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center shrink-0 shadow-md shadow-slate-900/20">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Interactive Tools Available
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {config.ctaText}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-5 py-2.5 text-xs font-bold text-slate-900 dark:text-white bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 rounded-full hover:bg-slate-200/90 dark:hover:bg-slate-700/90 transition-all shrink-0 shadow-xs cursor-pointer"
          >
            Back to Top Calculator ↑
          </button>
        </div>
        </div>
      </section>
    </>
  );
};

/**
 * Returns formatted Schema.org FAQPage JSON-LD object for a specific calculator tool.
 */
export function getFaqSchema(tool: ToolKey) {
  const config = TOOL_FAQS[tool] || TOOL_FAQS.quick;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
