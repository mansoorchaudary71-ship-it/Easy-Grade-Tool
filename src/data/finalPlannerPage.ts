import type { ToolPageEntry } from './toolPages';

/**
 * Multi-class final exam planner page. The worked example is computed with the
 * same formula the planner tool uses: required = (target − current × (1 − w)) ÷ w.
 */

interface PlannerExample {
  name: string;
  current: number;
  weight: number;
  target: number;
}

const EXAMPLE_CLASSES: PlannerExample[] = [
  { name: 'Biology', current: 84, weight: 25, target: 90 },
  { name: 'English', current: 78, weight: 30, target: 85 },
  { name: 'Algebra', current: 91, weight: 20, target: 90 },
];

function requiredFinal(c: PlannerExample): number {
  const w = c.weight / 100;
  return (c.target - c.current * (1 - w)) / w;
}

function maxAchievable(c: PlannerExample): number {
  const w = c.weight / 100;
  return c.current * (1 - w) + 100 * w;
}

const exampleRows = EXAMPLE_CLASSES.map((c) => {
  const req = requiredFinal(c);
  return {
    label: `${c.name}: ${c.current}% now, final worth ${c.weight}%, target ${c.target}%`,
    value:
      req <= 0
        ? 'Already secured'
        : req <= 100
          ? `Needs ${req.toFixed(1)}% on the final`
          : `Not possible (max ${maxAchievable(c).toFixed(1)}%)`,
  };
});

export function buildFinalPlannerPage(): ToolPageEntry {
  return {
    slug: 'final-grade-planner',
    path: '/final-grade-planner/',
    navLabel: 'Final grade planner',
    h1: 'Final Grade Planner — Every Class, One Plan',
    title: 'Final Grade Planner — What You Need on Each Final Exam',
    metaDescription:
      'Free final grade planner: enter every class’s current grade, final weight and target to see the final-exam score each class needs.',
    badge: 'Final exams',
    intro:
      'One final exam is a simple calculation. A whole finals week is not — each class has its own current grade, its own final weight and its own target. The planner solves all of them at once: what each final needs, which targets are already secured, and which are out of reach even with a perfect final.',
    keywords: [
      'final grade planner',
      'final exam planner',
      'what grade do i need on my finals',
      'finals week calculator',
      'multiple final exams calculator',
      'what do i need on my final exams',
    ],
    featureList: [
      'Up to 10 classes in one plan',
      'Required final score per class, solved live',
      'Flags targets already secured or impossible',
      'Current grade, final weight and target per class',
      'Free, no sign-up, nothing uploaded',
    ],
    sections: [
      {
        heading: 'How the planner solves each class',
        paragraphs: [
          'For one class the formula is: required final = (target − current grade × (1 − final weight)) ÷ final weight. A class at 84% with a final worth 25% and a 90% target needs (90 − 84 × 0.75) ÷ 0.25 = 108% — impossible, which the planner says plainly instead of printing a number above 100 as if it were a plan.',
          'The planner repeats that calculation for every class, so you can see where to spend revision time: the class that needs 92% deserves more hours than the one already secured or the one that needs 61%.',
        ],
      },
      {
        heading: 'Three answers, and what to do with each',
        paragraphs: [
          'A target is secured when the required final is zero or below — even a 0% on the final keeps the grade, so that class needs only maintenance. A target is possible when the required final is between 0% and 100% — that number is the revision goal. A target is impossible when the required final exceeds 100% — no final score reaches it, so either lower the target or accept the highest achievable grade the planner shows.',
        ],
        bullets: [
          'Secured: protect the grade, spend revision time elsewhere.',
          'Possible: the required score is the goal to revise toward.',
          'Impossible: re-target now, while there is still time to choose.',
        ],
      },
      {
        heading: 'One final vs the whole finals week',
        paragraphs: [
          'Single-final calculators answer one class. Students actually sit several finals, and the binding constraint is total revision time, not any single score. Plan all classes together, rank them by required final score, and put the most hours where the gap between current grade and required final is largest — that is where effort changes outcomes.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: three classes, three different answers',
      scenario: 'Three classes with different current grades, final weights and targets.',
      rows: exampleRows,
      takeaway:
        'The same planner gives three different verdicts: one class needs a strong final, one needs a modest one, and one target is already decided. That spread is the whole point of planning finals together.',
    },
    faqs: [
      {
        question: 'What grade do I need on my finals to keep an A?',
        answer:
          'It depends on each class: the planner needs your current grade, the final’s weight and the target. A class at 91% with a 20% final needs 86% on the final to finish at 90%; a class at 84% with a 25% final cannot reach 90% at all. Enter all your classes to see each answer.',
      },
      {
        question: 'Can a final exam grade be more than 100%?',
        answer:
          'No — and a required score above 100% means the target is impossible, not that you need extra credit. The planner flags this and shows the highest grade a perfect final can actually reach.',
      },
      {
        question: 'What if my final is worth a different weight in each class?',
        answer:
          'That is exactly what the planner handles: each row carries its own final weight, so a 20% final and a 40% final are solved with their own maths instead of one shared assumption.',
      },
      {
        question: 'How is this different from a single final grade calculator?',
        answer:
          'The single calculator solves one class. The planner solves up to ten at once and compares them, so you can rank revision time by where it changes outcomes instead of guessing class by class.',
      },
    ],
    faqHeading: {
      eyebrow: 'Final planner FAQs',
      title: 'Final grade planner questions',
      description: 'How multi-class finals planning works, and what impossible targets mean.',
      ctaText: 'Plan your finals',
    },
    related: [
      { path: '/final-exam-grade-calculator/', label: 'Final exam calculator', blurb: 'One class, one final: the score you need.' },
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Current grade from weighted assessments.' },
      { path: '/semester-gpa-calculator/', label: 'Semester GPA calculator', blurb: 'Turn final grades into a semester GPA.' },
      { path: '/college-gpa-calculator/', label: 'College GPA calculator', blurb: 'Credit-weighted GPA for college courses.' },
    ],
  };
}
