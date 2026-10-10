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
      'Straight answers on syllabus weights, weighted averages, partial-semester standings and how extra credit changes a weighted course grade.',
    ctaText: 'Enter your categories, scores and weights above to see your weighted course grade update instantly.',
  },
  'final-exam-grade-calculator': {
    eyebrow: 'Final Exam Target FAQs',
    title: 'Final Exam Grade Calculator FAQs',
    description:
      'Clear answers about the score you need on a final exam, how exam weight works, and what to do when your target grade is out of reach.',
    ctaText: 'Enter your current grade, target grade and final exam weight above to see the exact score you need.',
  },
  'test-grade-calculator': {
    eyebrow: 'Test & Quiz Scoring FAQs',
    title: 'Test Grade Calculator FAQs',
    description:
      'Quick answers on turning points into a percentage, adding extra credit, applying late penalties and finding the letter grade for a single test.',
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
        question: 'How is my GPA calculated?',
        answer:
          'Your Grade Point Average (GPA) is calculated on a 4.0 scale by converting each course letter grade into numerical grade points (A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, D = 1.0, F = 0.0). You multiply each grade point value by the course credit hours to obtain "quality points", add all quality points together across all courses, and divide by the total number of credits attempted.',
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
    ],
  },
  percentage: {
    eyebrow: 'Math & Formulas FAQs',
    title: 'Percentage Calculation FAQs',
    description:
      'Clear explanations and step-by-step mathematical formulas for percentage changes, proportions, and sales discounts.',
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
    eyebrow: 'Cybersecurity & Privacy FAQs',
    title: 'Password Security & Privacy FAQs',
    description:
      'Best practices for generating high-entropy passwords, password manager security, and protecting digital accounts against credential stuffing.',
    ctaText: 'Use the password generator above to create cryptographically strong passwords with custom length and symbols.',
    items: [
      {
        id: 'cryptographic-security',
        category: 'security',
        question: 'What makes a password cryptographically secure?',
        answer:
          'A secure password possesses high entropy: it should be at least 16 characters in length, combine uppercase and lowercase letters, numbers, and symbols, and contain no dictionary words, personal details, or predictable keyboard patterns.',
      },
      {
        id: 'length-vs-complexity',
        category: 'security',
        question: 'Why is password length more important than complexity alone?',
        answer:
          'Password length increases brute-force search space exponentially. An 8-character password with mixed characters can be cracked in hours or days by modern GPU clusters, whereas a 16-character random password requires septillions of guesses, taking centuries to crack.',
      },
      {
        id: 'password-managers-safety',
        category: 'security',
        question: 'Are password managers safe to store generated passwords?',
        answer:
          'Yes! Reputable password managers employ end-to-end encryption using military-grade standards (like AES-256). Even if the service\'s servers are breached, your data cannot be decrypted without your private master password and secret recovery key.',
      },
      {
        id: 'password-reuse-danger',
        category: 'security',
        question: 'Why should I never reuse passwords across multiple accounts?',
        answer:
          'When one website suffers a data breach, hackers test the leaked email/password pair against thousands of other popular services in automated "credential stuffing" attacks. Using a unique password for every account guarantees that a breach on one site never compromises your other accounts.',
      },
      {
        id: 'how-often-change-passwords',
        category: 'security',
        question: 'How often should I change my passwords?',
        answer:
          'Current cybersecurity standards (including NIST guidelines) advise against routine arbitrary password changes, as this encourages users to pick predictable variations. Instead, create long, random passwords stored in a password manager, and only change them immediately if a specific service notifies you of a breach or suspicious activity.',
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
