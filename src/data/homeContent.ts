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
      'Press Print chart for a clean printout, or Download PDF to save the chart as a file. Either way the page contains only the chart, without the site navigation, so you can keep it beside you while you grade.',
  },
  {
    id: 'home-privacy',
    category: 'quick-grade',
    question: 'Are my scores stored or sent anywhere?',
    answer:
      'No. The calculation runs in your browser and nothing you type into the calculator is uploaded.',
  },
  {
    id: 'home-what-is-ez-grader-chart',
    category: 'quick-grade',
    question: 'What is an EZ grader chart and who uses it?',
    answer:
      'An EZ grader chart is a table that lists the percentage and letter grade for every possible number of wrong answers on a test of a given size. Teachers use it to grade a stack of objective tests quickly, and students use it to check a score.',
  },
  {
    id: 'home-ezgrader-online',
    category: 'quick-grade',
    question: 'Is this the same as EZGrader or an EZ grader online?',
    answer:
      'Yes, it is a free online EZ grader. Whether you search for ezgrader, EZ grader online or an easy grader, you get the same thing: a chart of the percentage and letter grade for every number of wrong answers, built for any test size and grading scale.',
  },
  {
    id: 'home-easy-grader-for-teachers',
    category: 'teachers',
    question: 'Is this an easy grader for teachers?',
    answer:
      'Yes. Enter the number of questions, pick your grading scale and read each paper’s grade straight from the chart. You can print the chart, set your own letter cutoffs, and use the other tools on this site for weighted course grades, curves and final exams.',
  },
  {
    id: 'home-best-free-grading-tool',
    category: 'teachers',
    question: 'What is the best free grading tool for teachers?',
    answer:
      'The best free grading tool is the one that fits the job. A chart-based easy grader is fastest for objective tests, a weighted grade calculator suits whole courses, and a curve calculator helps after a hard exam. Look for tools that need no account, let you set your own scale and keep student scores on your device.',
  },
  {
    id: 'home-ez-grader-vs-calculator',
    category: 'teachers',
    question: 'What is the difference between an EZ grader and an online grade calculator?',
    answer:
      'An EZ grader chart lists every score for one test size, so it is built for speed across many papers. An online grade calculator computes one result from any points and weights, so it is built for flexibility. This site has both.',
  },
  {
    id: 'home-online-grader-faster',
    category: 'teachers',
    question: 'Is an online grader faster than grading by hand?',
    answer:
      'For tests with right and wrong answers, yes. Looking up a row in the chart takes seconds, while dividing and converting to a letter for every paper takes much longer and invites rounding mistakes. Grading by hand still fits essays and rubric-based work.',
  },
  {
    id: 'home-easiest-way-to-grade',
    category: 'teachers',
    question: 'What is the easiest way for a teacher to grade tests?',
    answer:
      'Build the chart first: choose the test size and grading scale, print it, then mark each paper by counting wrong answers and reading across the row. Use a calculator only for bonus points, weighted categories or penalties.',
  },
  {
    id: 'home-test-score-percent',
    category: 'quick-grade',
    question: 'How do I turn wrong answers into a percentage?',
    answer:
      'Subtract the wrong answers from the number of questions, divide by the number of questions and multiply by 100. Missing 3 questions on a 25-question test gives 22 ÷ 25 × 100 = 88%.',
  },
  {
    id: 'home-spelling-variants',
    category: 'quick-grade',
    question: 'Is EasyGradeCalculator the same as EasyGrade, EasyGrader or EZgrade?',
    answer:
      'Yes. These are different spellings of one free grading tool. Teachers who type ez grade and students who look for an easy grades calculator all want the same thing: a chart that turns the number of questions on a test into percentages and letter grades.',
  },
  {
    id: 'home-free-online',
    category: 'quick-grade',
    question: 'Is there a free easy grader online?',
    answer:
      'Yes. This is a free easy grader online with nothing to install, no account and no limit on how many tests are checked. It also turns up as an online easy grader, an easy online grader or an easy grader free online, and it works as a free EZ grader on a phone as well as a laptop. Students who ask for an EZ grader free of charge, an EZ grader online free or an online easy grader free of sign-ups land on the same page.',
  },
  {
    id: 'home-free-grader',
    category: 'quick-grade',
    question: 'Is there a free grader that works without sign-up?',
    answer:
      'Yes. This page runs in the browser, so scores can be checked straight away. For anyone who wants a free grading calculator or a grading calculator free of subscriptions, the main tools are the test-size chart, the weighted grade calculator and the GPA calculator.',
  },
  {
    id: 'home-teacher-tool',
    category: 'teachers',
    question: 'Is this a grade calculator for teachers and a teacher grading tool?',
    answer:
      'Yes. Teachers use it as a grading calculator for teachers with a stack of papers, as a teacher grade calculator for a class list and as a teacher grading calculator for quizzes. Some describe it as a teachers grading calculator or a teacher easy grader, others as a grading helper. A teacher calculator for grades and a teacher percentage calculator both come down to the same chart and the same percentage formula.',
  },
  {
    id: 'home-quick-names',
    category: 'quick-grade',
    question: 'Is this the same as QuickGrade, a quick grader or quick grading?',
    answer:
      'Yes. Whether it is called a quick grader, an easy quick grader or quick grading, the idea is the same: enter the number of questions and read the grade for each wrong-answer count. A QuickGrade calculator needs no setup.',
  },
  {
    id: 'home-calculator-names',
    category: 'quick-grade',
    question: 'Can it be used as an easy grader calculator or an EZ grader calculator?',
    answer:
      'Yes. An easy grader calculator, an EZ grader calculator and an EZ grade calculator are the same tool, and so are an easy grading calculator, an online grading calculator and an online grader calculator. It is also a calculator for grading any test, a grades calculator, a grade checker for a single score and a grade calculator easy enough to use between classes. People who type ezgrader online, online ezgrader or grade calculator ez grader get the same chart.',
  },
  {
    id: 'home-half-points',
    category: 'quick-grade',
    question: 'Does the easy grade calculator with half points option save time?',
    answer:
      'Yes. Turning on half points lets a half-credit answer count as half of a full question, so partial marks can be entered without changing the chart. The easy grade calculator with half points handles whole stacks of tests without a second spreadsheet.',
  },
];
