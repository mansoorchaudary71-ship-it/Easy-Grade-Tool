import { FAQItem } from '../components/FAQ';

/** Visible FAQ on the homepage. The same array feeds the FAQPage JSON-LD, so text always matches 1:1. */
export const HOME_FAQS: FAQItem[] = [
  {
    id: 'home-what-is-quick-grade',
    category: 'quick-grade',
    question: 'What is a Quick Grade (EZ Grader) chart?',
    answer:
      'It is the digital version of the cardboard EZ-grader wheel. You enter how many questions the test has, and the chart lists the percentage and letter grade for every possible number of wrong answers, so you can grade a stack of papers by looking up one row.',
  },
  {
    id: 'home-formula',
    category: 'quick-grade',
    question: 'How is the percentage calculated?',
    answer:
      'Percentage = (questions − wrong answers) ÷ questions × 100. On a 20-question test, 2 wrong answers gives 18 ÷ 20 × 100 = 90%.',
  },
  {
    id: 'home-change-scale',
    category: 'quick-grade',
    question: 'Can I change the grading scale?',
    answer:
      'Yes. Choose the standard A–F scale or the plus/minus scale, or set your own minimum percentage for each letter under Customize Scale Cutoffs. The chart updates immediately.',
  },
  {
    id: 'home-print',
    category: 'quick-grade',
    question: 'How do I print the chart?',
    answer:
      'Press Print Chart. The printed page contains only the chart, without the site navigation, so you can keep it beside you while you grade.',
  },
  {
    id: 'home-privacy',
    category: 'quick-grade',
    question: 'Are my scores stored or sent anywhere?',
    answer:
      'No. The calculation runs in your browser and nothing you type into the calculator is uploaded.',
  },
];
