import { figureFileName, type FigureSpec } from './pageFigures';

/**
 * Figures and extra related links for the ten pages that are NOT part of the TOOL_PAGES registry:
 * the home page, the weighted grade page, GPA, CGPA, tip, percentage, loan, mortgage, password and final exam.
 * Every number in a worked example is computed here, never typed by hand, so the picture and the maths agree.
 */

const f1 = (n: number) => n.toFixed(1);
const f2 = (n: number) => n.toFixed(2);
const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function monthlyPayment(principal: number, annualPct: number, years: number): number {
  const r = annualPct / 100 / 12;
  const n = years * 12;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

function describeRows(rows: { label: string; value: string }[]): string {
  return rows.map((r) => `${r.label} ${r.value}`).join(', ');
}

function letter(pct: number): string {
  return pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';
}

/* ---------- home: quick grade chart ---------- */
const chartRows = [0, 1, 2, 3, 4, 5].map((wrong) => {
  const pct = ((20 - wrong) / 20) * 100;
  return [String(wrong), `${f1(pct)}%`, letter(pct)];
});

/* ---------- weighted grade ---------- */
const weighted = [
  { name: 'Homework', score: 92, weight: 20 },
  { name: 'Quizzes', score: 85, weight: 15 },
  { name: 'Midterm', score: 78, weight: 25 },
  { name: 'Project', score: 90, weight: 15 },
  { name: 'Final exam', score: 84, weight: 25 },
];
const weightedTotal = weighted.reduce((s, a) => s + (a.score * a.weight) / 100, 0);
const weightedRows = [
  ...weighted.map((a) => ({ label: `${a.name} ${a.score}% × ${a.weight}%`, value: f2((a.score * a.weight) / 100) })),
  { label: 'Course grade', value: `${f2(weightedTotal)}% (${letter(weightedTotal)})` },
];

/* ---------- GPA ---------- */
const courses = [
  { name: 'Calculus A', pts: 4.0, credits: 4 },
  { name: 'Chemistry B+', pts: 3.3, credits: 4 },
  { name: 'English A−', pts: 3.7, credits: 3 },
  { name: 'History B', pts: 3.0, credits: 3 },
];
const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
const totalPoints = courses.reduce((s, c) => s + c.pts * c.credits, 0);
const gpaRows = [
  ...courses.map((c) => ({ label: `${c.name} (${f1(c.pts)}) × ${c.credits} credits`, value: f1(c.pts * c.credits) })),
  { label: `Semester GPA (${f1(totalPoints)} ÷ ${totalCredits})`, value: f2(totalPoints / totalCredits) },
];

/* ---------- CGPA ---------- */
const cgpaTable = [7.0, 7.5, 8.0, 8.5, 9.0, 9.5].map((c) => [f1(c), `${f2(c * 9.5)}%`, `${f2((c - 0.75) * 10)}%`]);

/* ---------- tip ---------- */
const bill = 84;
const tip = bill * 0.18;
const tipRows = [
  { label: 'Bill', value: money(bill) },
  { label: 'Tip at 18%', value: money(tip) },
  { label: 'Total', value: money(bill + tip) },
  { label: 'Split between 4 people', value: money((bill + tip) / 4) },
];

/* ---------- percentage ---------- */
const pctRows = [
  { label: '15% of 240', value: f1((15 / 100) * 240) },
  { label: '36 is what % of 240', value: `${f1((36 / 240) * 100)}%` },
  { label: 'Change from 80 to 100', value: `+${f1(((100 - 80) / 80) * 100)}%` },
  { label: 'Change from 100 to 80', value: `${f1(((80 - 100) / 100) * 100)}%` },
];

/* ---------- loan and mortgage ---------- */
const loanPay = monthlyPayment(20000, 6, 5);
const loanRows = [
  { label: 'Loan amount', value: money(20000) },
  { label: 'Rate and term', value: '6% a year, 60 months' },
  { label: 'Monthly payment', value: money(loanPay) },
  { label: 'Total interest', value: money(loanPay * 60 - 20000) },
];
const mortLoan = 300000 * 0.8;
const mortPay = monthlyPayment(mortLoan, 6.5, 30);
const mortRows = [
  { label: 'Home price, 20% down', value: `${money(300000)}, ${money(60000)}` },
  { label: 'Loan amount', value: money(mortLoan) },
  { label: 'Rate and term', value: '6.5% a year, 30 years' },
  { label: 'Monthly principal and interest', value: money(mortPay) },
  { label: 'Total interest over the term', value: money(mortPay * 360 - mortLoan) },
];

/* ---------- password ---------- */
const bits = (len: number, pool: number) => len * Math.log2(pool);
const pwRows = [
  { label: '12 lowercase letters (pool 26)', value: `${f1(bits(12, 26))} bits` },
  { label: '16 letters and digits (pool 62)', value: `${f1(bits(16, 62))} bits` },
  { label: '20 mixed characters (pool 94)', value: `${f1(bits(20, 94))} bits` },
];

/* ---------- final exam ---------- */
const needed = (target: number) => (target - 84 * 0.75) / 0.25;
const finalRows = [
  { label: 'Target A (90%)', value: `${f1(needed(90))}% (not reachable)` },
  { label: 'Target B+ (86%)', value: `${f1(needed(86))}% on the final` },
  { label: 'Target B (80%)', value: `${f1(needed(80))}% on the final` },
];

interface CoreEntry {
  figures: FigureSpec[];
  heading: string;
  related?: { path: string; label: string; blurb: string }[];
}

const mk = (slug: string, suffix: string, spec: Omit<FigureSpec, 'file'>): FigureSpec => ({
  file: figureFileName(slug, suffix),
  ...spec,
});

export const CORE_FIGURES: Record<string, CoreEntry> = {
  '/': {
    heading: 'EZ grader chart: formula, example and features',
    figures: [
      mk('home', 'formula', {
        kind: 'formula',
        title: 'Easy grade calculator formula',
        subtitle: 'Easy Grade Calculator',
        lines: ['Percent = (questions − wrong) ÷ questions × 100'],
        rows: [{ label: '20 questions, 3 wrong', value: `${f1(((20 - 3) / 20) * 100)}% (${letter(85)})` }],
        alt: 'Formula used by the easy grade calculator: percent equals questions minus wrong answers, divided by questions, times 100. Example: 20 questions with 3 wrong gives 85.0%, a B.',
        caption: 'The formula behind the easy grade calculator',
      }),
      mk('home', 'chart', {
        kind: 'table',
        title: 'EZ grader chart for a 20-question test',
        subtitle: 'Easy Grade Calculator',
        table: { columns: ['Wrong answers', 'Percent', 'Letter grade'], rows: chartRows },
        alt: 'EZ grader chart for a 20-question test on the 90/80/70/60 scale: 0 wrong is 100.0% (A), 1 wrong 95.0% (A), 2 wrong 90.0% (A), 3 wrong 85.0% (B), 4 wrong 80.0% (B), 5 wrong 75.0% (C).',
        caption: 'Quick grade chart: 20 questions',
      }),
      mk('home', 'features', {
        kind: 'checklist',
        title: 'What the easy grade calculator covers',
        subtitle: 'Easy Grade Calculator',
        items: [
          'Free, no sign-up',
          'Private: runs in your browser',
          'Print the chart or save it as a PDF',
          'Percent and letter grade for every number of wrong answers',
        ],
        alt: 'Checklist of what the easy grade calculator covers: free with no sign-up, private and runs in the browser, print or save as PDF, percent and letter grade for every number of wrong answers.',
        caption: 'What the easy grade calculator covers',
      }),
    ],
  },
  '/grade-calculator': {
    heading: 'Weighted grade calculator: formula, example and features',
    figures: [
      mk('grade-calculator', 'formula', {
        kind: 'formula',
        title: 'Weighted grade calculator formula',
        subtitle: 'Weighted Grade Calculator',
        lines: ['Course grade = Σ (score × weight) ÷ Σ weights'],
        rows: [{ label: 'Needed on a final worth 25%', value: '(Target − Current × 0.75) ÷ 0.25' }],
        alt: 'Formula used by the weighted grade calculator: course grade equals the sum of each score times its weight, divided by the sum of the weights. The needed final exam score is the target minus current grade times remaining weight, divided by the final weight.',
        caption: 'The weighted grade formula',
      }),
      mk('grade-calculator', 'example', {
        kind: 'example',
        title: 'Weighted grade example: five categories',
        subtitle: 'Weighted Grade Calculator',
        rows: weightedRows,
        footer: 'Each score is multiplied by its weight, then the contributions are added.',
        alt: `Weighted grade calculator example with five categories: ${describeRows(weightedRows)}.`,
        caption: 'Weighted grade worked example',
      }),
      mk('grade-calculator', 'features', {
        kind: 'checklist',
        title: 'What the weighted grade calculator covers',
        subtitle: 'Weighted Grade Calculator',
        items: [
          'Any number of assessments with their own weights',
          'Weighted average and letter grade',
          'Score needed on the final exam',
          'Print or save the report',
        ],
        alt: 'Checklist of what the weighted grade calculator covers: any number of assessments with weights, weighted average and letter grade, score needed on the final exam, print or save the report.',
        caption: 'What the weighted grade calculator covers',
      }),
    ],
  },
  '/gpa-calculator': {
    heading: 'GPA calculator: formula, example and features',
    figures: [
      mk('gpa-calculator', 'formula', {
        kind: 'formula',
        title: 'GPA calculator formula',
        subtitle: 'GPA Calculator',
        lines: ['GPA = Σ (grade points × credits) ÷ Σ credits'],
        rows: [{ label: 'Quality points', value: 'grade points × credit hours' }],
        alt: 'Formula used by the GPA calculator: GPA equals the sum of grade points times credit hours, divided by the total credit hours.',
        caption: 'The GPA formula',
      }),
      mk('gpa-calculator', 'example', {
        kind: 'example',
        title: 'GPA example: four courses',
        subtitle: 'GPA Calculator',
        rows: gpaRows,
        footer: 'Quality points are grade points times credits; the total is divided by total credits.',
        alt: `GPA calculator example with four courses: ${describeRows(gpaRows)}.`,
        caption: 'GPA worked example',
      }),
      mk('gpa-calculator', 'features', {
        kind: 'checklist',
        title: 'What the GPA calculator covers',
        subtitle: 'GPA Calculator',
        items: ['Semester GPA', 'Cumulative GPA', 'Credit hours for every class', 'Results update in real time'],
        alt: 'Checklist of what the GPA calculator covers: semester GPA, cumulative GPA, credit hours for every class, results that update in real time.',
        caption: 'What the GPA calculator covers',
      }),
    ],
  },
  '/cgpa-to-percentage-calculator': {
    heading: 'CGPA to percentage calculator: formulas, table and features',
    figures: [
      mk('cgpa-to-percentage-calculator', 'formula', {
        kind: 'formula',
        title: 'CGPA to percentage formulas',
        subtitle: 'CGPA to Percentage Calculator',
        lines: ['Standard (UGC / CBSE): Percentage = CGPA × 9.5', 'VTU: Percentage = (CGPA − 0.75) × 10'],
        rows: [{ label: 'CGPA 8.2', value: `${f2(8.2 * 9.5)}% standard, ${f2((8.2 - 0.75) * 10)}% VTU` }],
        alt: 'CGPA to percentage formulas: standard UGC and CBSE multiply CGPA by 9.5, VTU subtracts 0.75 and multiplies by 10. Example: CGPA 8.2 is 77.90% standard and 74.50% VTU.',
        caption: 'CGPA to percentage formulas',
      }),
      mk('cgpa-to-percentage-calculator', 'table', {
        kind: 'table',
        title: 'CGPA to percentage table',
        subtitle: 'CGPA to Percentage Calculator',
        table: { columns: ['CGPA', '× 9.5 (UGC / CBSE)', 'VTU (CGPA − 0.75) × 10'], rows: cgpaTable },
        alt: 'CGPA to percentage table: CGPA 7.0 is 66.50% standard and 62.50% VTU, CGPA 8.0 is 76.00% and 72.50%, CGPA 9.0 is 85.50% and 82.50%, CGPA 9.5 is 90.25% and 87.50%.',
        caption: 'CGPA to percentage lookup table',
      }),
      mk('cgpa-to-percentage-calculator', 'features', {
        kind: 'checklist',
        title: 'What the CGPA converter covers',
        subtitle: 'CGPA to Percentage Calculator',
        items: [
          '10.0, 5.0 and 4.0 scale CGPA',
          'University formulas: VTU, Mumbai University, MAKAUT, GTU, SPPU, Anna University, BHU',
          'Standard UGC and CBSE multipliers',
        ],
        alt: 'Checklist of what the CGPA to percentage calculator covers: 10.0, 5.0 and 4.0 scale CGPA, university formulas for VTU, Mumbai University, MAKAUT, GTU, SPPU, Anna University and BHU, and the standard UGC and CBSE multipliers.',
        caption: 'What the CGPA converter covers',
      }),
    ],
    related: [
      { path: '/gpa-calculator/', label: 'GPA Calculator', blurb: 'Work out a semester or cumulative GPA from credits and grades.' },
      { path: '/gpa-converter/', label: 'GPA Converter', blurb: 'Switch between SGPA, CGPA, percentage and 4.0 GPA.' },
      { path: '/cgpa-to-percentage/vtu/', label: 'VTU CGPA to Percentage', blurb: 'The (CGPA − 0.75) × 10 formula used by VTU.' },
      { path: '/grade-calculator/', label: 'Weighted Grade Calculator', blurb: 'Find a course grade from weighted assessments.' },
    ],
  },
  '/tip-calculator': {
    heading: 'Tip calculator: formula, example and features',
    figures: [
      mk('tip-calculator', 'formula', {
        kind: 'formula',
        title: 'Tip calculator formula',
        subtitle: 'Tip Calculator',
        lines: ['Tip = bill × tip %', 'Per person = (bill + tip) ÷ people'],
        rows: [{ label: '18% tip on $84.00', value: money(tip) }],
        alt: 'Tip calculator formulas: tip equals the bill times the tip percentage, and the amount per person equals bill plus tip divided by the number of people. Example: an 18% tip on $84.00 is $15.12.',
        caption: 'The tip and bill split formulas',
      }),
      mk('tip-calculator', 'example', {
        kind: 'example',
        title: 'Tip example: split between 4 people',
        subtitle: 'Tip Calculator',
        rows: tipRows,
        footer: 'The tip is added to the bill and the total is divided evenly.',
        alt: `Tip calculator example: ${describeRows(tipRows)}.`,
        caption: 'Tip and split worked example',
      }),
      mk('tip-calculator', 'features', {
        kind: 'checklist',
        title: 'What the tip calculator covers',
        subtitle: 'Tip Calculator',
        items: ['Gratuity percentage', 'Quick restaurant presets', 'Per-person bill split'],
        alt: 'Checklist of what the tip calculator covers: gratuity percentage, quick restaurant presets, per-person bill split.',
        caption: 'What the tip calculator covers',
      }),
    ],
    related: [
      { path: '/percentage-calculator/', label: 'Percentage Calculator', blurb: 'Find X% of any number or a percent change.' },
      { path: '/loan-calculator/', label: 'Loan Calculator', blurb: 'Estimate monthly loan payments and total interest.' },
      { path: '/mortgage-calculator/', label: 'Mortgage Calculator', blurb: 'Estimate a monthly home loan payment.' },
      { path: '/', label: 'Easy Grade Calculator', blurb: 'EZ grader chart for any test length.' },
    ],
  },
  '/percentage-calculator': {
    heading: 'Percentage calculator: formulas, examples and features',
    figures: [
      mk('percentage-calculator', 'formula', {
        kind: 'formula',
        title: 'Percentage calculator formulas',
        subtitle: 'Percentage Calculator',
        lines: ['X% of Y = Y × X ÷ 100', 'Percent = part ÷ whole × 100', 'Change % = (new − old) ÷ old × 100'],
        alt: 'Percentage calculator formulas: X percent of Y equals Y times X divided by 100, percent equals part divided by whole times 100, and percent change equals new minus old divided by old times 100.',
        caption: 'The three percentage formulas',
      }),
      mk('percentage-calculator', 'example', {
        kind: 'example',
        title: 'Percentage examples',
        subtitle: 'Percentage Calculator',
        rows: pctRows,
        footer: 'Percent change is measured against the starting value.',
        alt: `Percentage calculator examples: ${describeRows(pctRows)}.`,
        caption: 'Percentage worked examples',
      }),
      mk('percentage-calculator', 'features', {
        kind: 'checklist',
        title: 'What the percentage calculator covers',
        subtitle: 'Percentage Calculator',
        items: ['X% of a number', 'What percent one number is of another', 'Percentage increase and decrease'],
        alt: 'Checklist of what the percentage calculator covers: X percent of a number, what percent one number is of another, percentage increase and decrease.',
        caption: 'What the percentage calculator covers',
      }),
    ],
  },
  '/loan-calculator': {
    heading: 'Loan calculator: formula, example and features',
    figures: [
      mk('loan-calculator', 'formula', {
        kind: 'formula',
        title: 'Loan payment formula',
        subtitle: 'Loan Calculator',
        lines: ['M = P × r ÷ (1 − (1 + r)^−n)', 'P = amount, r = monthly rate, n = months'],
        alt: 'Loan payment formula used by the loan calculator: monthly payment M equals principal P times monthly rate r, divided by one minus (1 plus r) to the power of minus n, where n is the number of months.',
        caption: 'The monthly loan payment formula',
      }),
      mk('loan-calculator', 'example', {
        kind: 'example',
        title: 'Loan example: $20,000 over 5 years',
        subtitle: 'Loan Calculator',
        rows: loanRows,
        footer: 'Early payments are mostly interest; later payments are mostly principal.',
        alt: `Loan calculator example: ${describeRows(loanRows)}.`,
        caption: 'Loan worked example',
      }),
      mk('loan-calculator', 'features', {
        kind: 'checklist',
        title: 'What the loan calculator covers',
        subtitle: 'Loan Calculator',
        items: ['Monthly payment', 'Total loan cost', 'Principal versus interest', 'Amortization table'],
        alt: 'Checklist of what the loan calculator covers: monthly payment, total loan cost, principal versus interest, amortization table.',
        caption: 'What the loan calculator covers',
      }),
    ],
    related: [
      { path: '/mortgage-calculator/', label: 'Mortgage Calculator', blurb: 'Estimate a monthly home loan payment.' },
      { path: '/percentage-calculator/', label: 'Percentage Calculator', blurb: 'Work out interest or rate changes as percentages.' },
      { path: '/tip-calculator/', label: 'Tip Calculator', blurb: 'Split a bill and add a gratuity.' },
    ],
  },
  '/mortgage-calculator': {
    heading: 'Mortgage calculator: formula, example and features',
    figures: [
      mk('mortgage-calculator', 'formula', {
        kind: 'formula',
        title: 'Mortgage payment formula',
        subtitle: 'Mortgage Calculator',
        lines: ['M = P × r ÷ (1 − (1 + r)^−n)', 'P = loan, r = monthly rate, n = months'],
        alt: 'Mortgage payment formula used by the mortgage calculator: monthly payment M equals loan P times monthly rate r, divided by one minus (1 plus r) to the power of minus n, where n is the number of monthly payments.',
        caption: 'The mortgage payment formula',
      }),
      mk('mortgage-calculator', 'example', {
        kind: 'example',
        title: 'Mortgage example: $300,000 home',
        subtitle: 'Mortgage Calculator',
        rows: mortRows,
        footer: 'Taxes, insurance and fees come on top of principal and interest.',
        alt: `Mortgage calculator example: ${describeRows(mortRows)}.`,
        caption: 'Mortgage worked example',
      }),
      mk('mortgage-calculator', 'features', {
        kind: 'checklist',
        title: 'What the mortgage calculator covers',
        subtitle: 'Mortgage Calculator',
        items: ['Monthly home loan payment', 'Principal and interest split', 'Total interest paid', '15-year or 30-year term'],
        alt: 'Checklist of what the mortgage calculator covers: monthly home loan payment, principal and interest split, total interest paid, 15-year or 30-year term.',
        caption: 'What the mortgage calculator covers',
      }),
    ],
    related: [
      { path: '/loan-calculator/', label: 'Loan Calculator', blurb: 'Personal, auto and student loan payments.' },
      { path: '/percentage-calculator/', label: 'Percentage Calculator', blurb: 'Down payment and rate changes as percentages.' },
      { path: '/tip-calculator/', label: 'Tip Calculator', blurb: 'Split a bill and add a gratuity.' },
      { path: '/', label: 'Easy Grade Calculator', blurb: 'EZ grader chart for any test length.' },
    ],
  },
  '/password-generator': {
    heading: 'Password generator: strength formula, examples and features',
    figures: [
      mk('password-generator', 'formula', {
        kind: 'formula',
        title: 'Password strength formula',
        subtitle: 'Password Generator',
        lines: ['Entropy (bits) = length × log₂(pool size)'],
        rows: [{ label: 'Pool size', value: 'number of possible characters' }],
        alt: 'Password strength formula used by the password generator: entropy in bits equals the password length times the base-2 logarithm of the number of possible characters.',
        caption: 'How password strength is measured',
      }),
      mk('password-generator', 'example', {
        kind: 'example',
        title: 'Password entropy examples',
        subtitle: 'Password Generator',
        rows: pwRows,
        footer: 'Longer passwords and larger character pools both raise the entropy.',
        alt: `Password entropy examples: ${describeRows(pwRows)}.`,
        caption: 'Password entropy examples',
      }),
      mk('password-generator', 'features', {
        kind: 'checklist',
        title: 'What the password generator covers',
        subtitle: 'Password Generator',
        items: [
          'Cryptographically secure random passwords',
          'Generated locally in the browser',
          'Look-alike characters (I, O, l, 1, 0) excluded',
        ],
        alt: 'Checklist of what the password generator covers: cryptographically secure random passwords, generated locally in the browser, look-alike characters I, O, l, 1 and 0 excluded.',
        caption: 'What the password generator covers',
      }),
    ],
    related: [
      { path: '/tip-calculator/', label: 'Tip Calculator', blurb: 'Split a bill and add a gratuity.' },
      { path: '/percentage-calculator/', label: 'Percentage Calculator', blurb: 'Percent of a number and percent change.' },
      { path: '/loan-calculator/', label: 'Loan Calculator', blurb: 'Estimate monthly loan payments.' },
      { path: '/grade-calculator/', label: 'Weighted Grade Calculator', blurb: 'Find a course grade from weighted assessments.' },
    ],
  },
  '/final-exam-grade-calculator': {
    heading: 'Final exam grade calculator: formula, example and features',
    figures: [
      mk('final-exam-grade-calculator', 'formula', {
        kind: 'formula',
        title: 'Final exam grade formula',
        subtitle: 'Final Exam Grade Calculator',
        lines: ['Needed = (Target − Current × (1 − w)) ÷ w', 'w = weight of the final exam'],
        alt: 'Formula used by the final exam grade calculator: the needed score equals the target grade minus the current grade times the remaining weight, divided by the weight of the final exam.',
        caption: 'The final exam grade formula',
      }),
      mk('final-exam-grade-calculator', 'example', {
        kind: 'example',
        title: 'Final exam example: 84% with a 25% final',
        subtitle: 'Final Exam Grade Calculator',
        rows: finalRows,
        footer: 'A result above 100% means the target needs extra credit or a lower goal.',
        alt: `Final exam grade calculator example with a current grade of 84% and a final worth 25%: ${describeRows(finalRows)}.`,
        caption: 'Final exam worked example',
      }),
      mk('final-exam-grade-calculator', 'features', {
        kind: 'checklist',
        title: 'What the final exam calculator covers',
        subtitle: 'Final Exam Grade Calculator',
        items: [
          'Minimum score needed on the final',
          'Step-by-step walkthrough',
          'Print and PDF friendly',
          'No account, runs in the browser',
        ],
        alt: 'Checklist of what the final exam grade calculator covers: minimum score needed on the final, step-by-step walkthrough, print and PDF friendly, no account and runs in the browser.',
        caption: 'What the final exam calculator covers',
      }),
    ],
  },
};

export function getCoreEntry(rawPath: string): CoreEntry | undefined {
  const clean = (rawPath.split(/[?#]/)[0].replace(/\/+$/, '') || '/').toLowerCase();
  return CORE_FIGURES[clean];
}
