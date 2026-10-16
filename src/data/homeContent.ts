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
  {
    id: 'home-what-is-ez-grader-chart',
    category: 'quick-grade',
    question: 'What is an EZ grader chart and who uses it?',
    answer:
      'An EZ grader chart is a table that lists the percentage and letter grade for every possible number of wrong answers on a test of a given size. Teachers use it to grade a stack of objective tests quickly, and students use it to check a score.',
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
    id: 'home-how-to-use-easy-grade-calculator',
    category: 'quick-grade',
    question: 'How do I use an online easy grade calculator?',
    answer:
      'Type the number of questions on the test, then read the percentage and letter grade next to the number of wrong answers on each paper. To grade one student at a time, enter that student’s wrong answers in the grading panel; the class tally and average update as you go.',
  },
  {
    id: 'home-simplest-way-course-grade',
    category: 'students',
    question: 'What is the simplest way to calculate my current course grade?',
    answer:
      'For a single test, divide the questions you got right by the total and multiply by 100. For a whole course, list each score with its weight in the weighted grade calculator, which adds them up for you and shows the letter grade.',
  },
  {
    id: 'home-score-needed-on-final',
    category: 'students',
    question: 'How do I find the score I need on a final exam to reach a target grade?',
    answer:
      'Take your target course grade, subtract your current average times the share of the grade already earned, then divide by the weight of the final. The final exam calculator does this and tells you when a target is already secured or out of reach.',
  },
  {
    id: 'home-grade-average-categories',
    category: 'students',
    question: 'How do I understand my grade average with different assignment categories?',
    answer:
      'Each category, such as homework, quizzes or exams, counts for a share of the course grade. Find your percentage in each category, multiply it by that category’s weight and add the results. The weighted grade calculator on this site handles that step.',
  },
  {
    id: 'home-half-points',
    category: 'quick-grade',
    question: 'Does the easy grade calculator work with half points?',
    answer:
      'Yes. Turn on Half points in the advanced settings and you can enter wrong answers in steps of 0.5, such as 2.5 wrong on a 40-question test, so partial credit shows up in the percentage and the letter grade.',
  },
  {
    id: 'home-number-correct',
    category: 'quick-grade',
    question: 'Can I enter the number of correct answers instead of wrong ones?',
    answer:
      'The chart is organized by wrong answers, but the correct count is shown beside every row, so you can look up either number. If you only know the correct count, subtract it from the question total to get the wrong answers, or use the test grade calculator, which takes points earned and points possible.',
  },
  {
    id: 'home-test-scores-percentage',
    category: 'quick-grade',
    question: 'How do I turn test scores into percentages for a whole class?',
    answer:
      'Use the grading panel: enter each student’s wrong answers and press Next student. The percentage and letter are logged, the class average and letter counts update, and you can download the list as a CSV file when you are done.',
  },
  {
    id: 'home-export-spreadsheet',
    category: 'teachers',
    question: 'Can I export class grades to a spreadsheet?',
    answer:
      'Yes. After grading a few papers, press Download CSV or Copy for spreadsheet in the class tally and paste the rows into Excel or Google Sheets. The tally stays in your browser tab, so download it before you close the page.',
  },
  {
    id: 'home-high-school-students',
    category: 'students',
    question: 'Is this a simple grade calculator for high school and college students?',
    answer:
      'Yes. Students can enter the number of questions on a quiz or exam and find their own percentage and letter in seconds. The same site also covers weighted course grades, final exam targets, GPA and CGPA conversion for high school and college classes.',
  },
  {
    id: 'home-mobile-free-no-download',
    category: 'students',
    question: 'Is there a free easy grade calculator app, and do I need to download anything?',
    answer:
      'It is free and runs in your browser on a phone, tablet or computer, with no account and no download. If you want an app icon, use your browser’s install option to add it to your home screen, and it keeps working offline after the first visit.',
  },
  {
    id: 'home-gpa-tracking',
    category: 'students',
    question: 'Can I track my GPA with an easy grade calculator?',
    answer:
      'Grade each course here or in the weighted calculator, then enter the letter grades and credit hours in the GPA calculator for a semester or cumulative GPA. The tools are separate pages, and nothing is saved to an account.',
  },
];
