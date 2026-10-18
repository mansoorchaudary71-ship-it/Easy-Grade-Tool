/**
 * Educational guide copy for the five grade tools (weighted grade, final exam, test grade, grade curve,
 * letter grade). Each guide keeps the same shape as before: a title (rendered as the card's H2) with the
 * tool photo directly under it, a lead paragraph, then H2/H3 sections. Wording lives here only; rendering
 * lives in components/ToolContentGuide.tsx.
 *
 * A run is [text] or [text, true] when the text is shown in bold.
 */

export type GuideRun = [string] | [string, true];

export type GuideBlock =
  | { t: 'title'; text: string }
  | { t: 'h2'; text: string }
  | { t: 'h3'; text: string }
  | { t: 'p'; runs: GuideRun[] }
  | { t: 'ol'; items: GuideRun[][] }
  | { t: 'ul'; items: GuideRun[][] };

export type ToolGuideKey = 'weighted' | 'final-exam' | 'test-grade' | 'grade-curve' | 'letter-grade';

export interface ToolGuideContent {
  /** key into RAW_GUIDE_IMAGES / GUIDE_PLACEHOLDERS (data/guideImages.ts) */
  imageKey: string;
  imageAlt: string;
  blocks: GuideBlock[];
}

/* ---- small authoring helpers: a run is a plain string, or [text, true] for bold ---- */
type RunInput = string | [string, true];
const toRuns = (xs: RunInput[]): GuideRun[] => xs.map((x) => (typeof x === 'string' ? ([x] as GuideRun) : (x as GuideRun)));
const title = (text: string): GuideBlock => ({ t: 'title', text });
const h2 = (text: string): GuideBlock => ({ t: 'h2', text });
const h3 = (text: string): GuideBlock => ({ t: 'h3', text });
const p = (...runs: RunInput[]): GuideBlock => ({ t: 'p', runs: toRuns(runs) });
const ol = (...items: (RunInput | RunInput[])[]): GuideBlock => ({
  t: 'ol',
  items: items.map((i) => toRuns(Array.isArray(i) && typeof i[0] === 'string' && i[1] !== true ? (i as RunInput[]) : [i as RunInput])),
});
const ul = (...items: (RunInput | RunInput[])[]): GuideBlock => ({
  t: 'ul',
  items: items.map((i) => toRuns(Array.isArray(i) && typeof i[0] === 'string' && i[1] !== true ? (i as RunInput[]) : [i as RunInput])),
});

export const TOOL_GUIDE_CONTENT: Record<ToolGuideKey, ToolGuideContent> = {
  /* ------------------------------------------------------------------ /grade-calculator/ */
  weighted: {
    imageKey: 'weighted',
    imageAlt:
      'Hand pressing a pocket calculator beside a syllabus listing weighted grade percentages.',
    blocks: [
      title('Weighted Grade Calculator: How to Calculate Weighted Grades'),
      p(
        'A ',
        ['weighted grade calculator', true],
        ' turns your syllabus into one course percentage. Instead of adding every point together, it gives each category (homework, quizzes, projects, midterms and the final exam) its own share of the grade, so you can see where you stand today and what you still need to earn. This free online tool works for school, high school and college classes, with weights or with total points.',
      ),

      h2('How to Calculate Weighted Grades'),
      p(
        'Weighted grades follow one idea: a category that is worth more in the syllabus moves your course grade more. The steps below work for any class, on paper or in the calculator.',
      ),
      h3('How do I calculate my weighted grade for a class?'),
      ol(
        'Turn each category score into a percentage: points earned ÷ points possible × 100.',
        'Write each syllabus weight as a decimal (20% becomes 0.20) and multiply it by that category’s percentage.',
        'Add the results. The total is your weighted average grade.',
        'If some categories are not graded yet, divide the total by the sum of the weights you have used so far.',
      ),
      p(
        'Example: homework 92% (weight 20%), quizzes 85% (20%), a midterm 78% (25%) and a project 88% (15%) give 18.4 + 17.0 + 19.5 + 13.2 = 68.1 points from 80% of the course. Divide 68.1 by 0.80 and your current weighted grade is ',
        ['85.1%', true],
        '.',
      ),
      h3('Weighted average grade vs. simple average'),
      p(
        'A simple average treats every score the same. A weighted average grade does not. If you score 100% on a quiz worth 10% of the course and 70% on an exam worth 90%, the simple average of the two scores is 85%, but the weighted average is 0.10 × 100 + 0.90 × 70 = 73%. The weights decide the outcome, which is why reading the syllabus first matters.',
      ),

      h2('How Does a Weighted Grading System Work?'),
      p(
        'In a weighted grading system the instructor splits the course into categories and gives each one a percentage, with the percentages adding up to 100%. Category weight grading usually works in two layers: first you average the scores inside each category (by total points, or equally, depending on the course), then you apply the category weight.',
      ),
      h3('Category weight grading in practice'),
      p(
        'A typical syllabus reads: homework 20%, quizzes 15%, projects 15%, midterm 20%, final exam 30%. Because the final exam alone is worth 30%, one weak exam can outweigh a semester of strong homework. Policies such as dropping the lowest quiz or capping extra credit change the category average before the weight is applied, so enter your scores after those rules.',
      ),
      h3('When the weights do not add up to 100%'),
      p(
        'Mid-semester only some categories are graded. The calculator divides by the weights you have entered, so a partial-term result shows your current standing instead of a number dragged down by work that does not exist yet.',
      ),

      h2('Weighted Grade Calculator with Points or Percentages'),
      h3('How does a weighted grade calculator work with total points?'),
      p(
        'Some courses skip category weights and simply add up points: every point counts the same, and the grade is points earned divided by points possible. Switch the calculator to Points mode for that. Scores of 45 out of 50, 88 out of 100 and 27 out of 30 give 160 of 180 points, or 88.9%. In Weighted (%) mode the same rows would each need a weight instead.',
      ),
      h3('Weighted grade calculator by percent: 80/20 and 60/40 splits'),
      p(
        'Two-part syllabi are the easiest to check by hand. With coursework worth 80% and an exam worth 20%, a coursework average of 88% and an exam score of 72% give 0.80 × 88 + 0.20 × 72 = 84.8%. With exams worth 60% and homework worth 40%, a 75% exam average and 95% homework give 0.60 × 75 + 0.40 × 95 = 83%. Enter the weights as 80 and 20, or 60 and 40, and the calculator returns the same totals.',
      ),
      h3('Weighted grade calculator with extra credit'),
      p(
        'To add extra credit, type a score that is higher than the Out Of value for that row, such as 105 out of 100, or add a separate bonus row. The calculator does not cap the result at 100%, so you can see the uncapped course grade and then apply your instructor’s rule if the class limits extra credit.',
      ),

      h2('Weighted vs. Unweighted Grades'),
      h3('What is the difference between weighted and unweighted grades?'),
      p(
        'An unweighted grade treats every point or every assignment equally. A weighted grade lets some categories count more, so a 90% exam can lift your course grade more than a 90% homework set. The word also appears in GPA: a weighted GPA adds extra points for honors or AP classes, which is a separate idea from category weights. Use the GPA calculator for that, and this page for the course percentage.',
      ),
      h3('Weighted grade calculator for high school, AP and honors classes'),
      p(
        'High school teachers usually weight categories such as homework, tests and projects, and the calculator handles that directly. AP and honors weighting normally affects the GPA scale, not the class percentage, so calculate the course grade here first and then enter the letter in the GPA calculator.',
      ),
      h3('Weighted grade calculator for college and university modules'),
      p(
        'College and university courses often weight coursework, midterms and a final, and modules can carry different credit values. For one course, enter each component with its weight. To combine modules, enter each module’s percentage and use its credit value as the weight: a 40-credit module counts twice as much as a 20-credit module, whatever each result is. Grading scales and degree classifications differ by country, so use the percentage as the reliable result and check your institution’s own table for the letter or class.',
      ),

      h2('What Grade Do I Need on the Final?'),
      h3('How to find the score you need on a weighted final exam'),
      p(
        'Use the target grade simulator under your results. Enter the grade you want and the weight of the final, and it solves for the exam score. The formula behind it is: needed score = (target − current grade × (1 − final weight)) ÷ final weight. With an 82% current grade, a 30% final and an 80% target, that is (80 − 82 × 0.70) ÷ 0.30 = 75.3%. For a full walkthrough, open the final exam grade calculator.',
      ),

      h2('Weighted Grade Calculator in Excel, Google Sheets, Canvas, PowerSchool'),
      h3('How do I make a weighted grade calculator in Excel or Google Sheets?'),
      p(
        'Put each category percentage in one column and its weight in the next. Then use =SUMPRODUCT(B2:B6, C2:C6) / SUM(C2:C6), where column B holds the percentages and column C the weights, and the result is your weighted grade. The formula works the same in Excel and Google Sheets. This page does the same sum without any setup, which is handy when you only need a quick answer or a what-if score.',
      ),
      h3('Can I use it with Canvas, Blackboard or PowerSchool grades?'),
      p(
        'Yes, by typing the numbers in. Read each category’s percentage or points from your school portal, then enter them with the weights from your syllabus. The calculator does not connect to a school account, so nothing is imported, and nothing you type is sent anywhere. That also means you can test what-if scores before your teacher posts the real ones.',
      ),
      h3('Semester or full-year weighted grades'),
      p(
        'For a semester, enter your categories with their weights. For a full year made of two semesters or terms, enter each term’s grade as a row and give each the weight your school uses, such as 50 and 50. If a term counts for less, give it a smaller weight, and the calculator scales the total to match.',
      ),

      h2('Using the Weighted Grade Calculator'),
      ol(
        'Add one row per category or assignment with the score you earned, the points possible and the syllabus weight.',
        'Check that the weights match your syllabus; the running total is shown next to the list.',
        'Read your weighted percentage and letter grade, which update as you type.',
        'Open the target grade simulator to test a hypothetical exam score and see the course grade it would produce.',
      ),
      p(
        'To work backwards from a goal, use the final exam grade calculator, which reverses the same formula to give the exact score you need on the final. For a single quiz or test, the test grade calculator gives the percentage and letter grade first.',
      ),

      h2('Common Weighted Grade Mistakes'),
      ul(
        'Adding raw points from different categories as if every point counted the same.',
        'Typing a weight as a whole number in the formula (20 instead of 0.20).',
        'Rounding each category before adding, which can move the final result across a letter cutoff.',
        'Forgetting that extra credit and dropped scores change a category average before it is weighted.',
      ),
    ],
  },

  /* ------------------------------------------------------------------ /final-exam-grade-calculator/ */
  'final-exam': {
    imageKey: 'final-exam',
    imageAlt:
      'Notebook, calculator and pen on a desk for working out the score needed on a final exam.',
    blocks: [
      title('Final Exam Grade Calculator: Find the Score You Need on the Final'),
      p(
        'A ',
        ['final exam grade calculator', true],
        ' (also called a final grade calculator) answers the question every student asks in finals week: what score do I need on the final exam to finish the course with the grade I want? Enter your current grade, the weight of the final and your target, and the calculator solves for the final exam score needed. It works for college and high school classes, and for courses graded by percentages or by points.',
      ),

      h2('How Do I Calculate What I Need on My Final?'),
      p(
        'The calculation reverses the weighted-average formula. Your coursework has already banked a number of points, and the final has to supply the rest.',
      ),
      ol(
        'Find your current grade in your gradebook or with the weighted grade calculator.',
        'Find the final exam weight in the syllabus and write it as a decimal (25% is 0.25).',
        'Choose your target course grade, for example 80%.',
        'Apply the formula: required score = (target − current grade × (1 − weight)) ÷ weight.',
      ),
      p(
        'With a current grade of 84%, a final worth 25% and a target of 80%, the coursework banks 84 × 0.75 = 63 points. Then (80 − 63) ÷ 0.25 = ',
        ['68%', true],
        ', so a 68% on the final secures an 80% course grade.',
      ),

      h2('What Grade Do I Need on My Final Exam to Pass?'),
      p(
        'Passing is just another target. Set the target grade to the lowest passing mark in your syllabus (often 60% for a D, or 70% where a C is required) and read the result.',
      ),
      h3('What score do I need to pass?'),
      p(
        'Take a student with a 72% average and a final worth 30%. To finish at 60%, the coursework banks 72 × 0.70 = 50.4 points, and (60 − 50.4) ÷ 0.30 = 32%. A 32% on the exam is enough to pass. If the program requires 70%, the same student needs (70 − 50.4) ÷ 0.30 = 65.3%.',
      ),
      h3('Grade needed on final for an A, B or C'),
      p(
        'Using the 84% current grade and 25% final from the example above, a B (80%) needs 68% on the exam, a B+ (86%) needs 92%, and an A (90%) would need 108%, which is impossible without extra credit or a curve. Always compare the answer with 100% before you plan around it.',
      ),

      h2('Final Exam Grade Calculator by Points'),
      h3('How do I find the final exam grade I need when my class uses points?'),
      p(
        'You can skip percentages and work in points. Multiply your target percentage by the total points in the course, then subtract the points you have already earned. A student with 412 of 500 points, a 100-point final and an 80% target needs 0.80 × 600 − 412 = 68 points, which is ',
        ['68 out of 100', true],
        '. To use the calculator instead, enter the current percentage (82.4%) and the final’s share of the total points (100 ÷ 600, or 16.7%).',
      ),

      h2('Final Exam Grade Calculator for College and High School'),
      h3('How do I include a midterm and other graded work?'),
      p(
        'Everything graded before the final belongs in your current grade. Homework worth 20% at 90% and a midterm worth 30% at 70% bank 18 + 21 = 39 points out of the 50 that are graded, so the current grade is 78%. With a final worth the other 50% and a goal of 80%, the exam must earn (80 − 39) ÷ 0.50 = 82%. If you do not know your current grade, the weighted grade calculator finds it.',
      ),
      h3('What if the year has quarters, or the final has two parts?'),
      p(
        'For two quarters worth 40% each and an exam worth 20%, quarter grades of 85% and 78% give a current grade of 81.5%. Reaching 80% then takes (80 − 81.5 × 0.80) ÷ 0.20 = 74% on the exam. When a high school final is split into an exam and a culminating task, add the two weights and treat them as one block. The answer is the average score you need across both parts.',
      ),
      h3('What is the lowest final exam score that still earns a C?'),
      p(
        'Choose the lowest C on your scale as the target. With a 76% current grade and a 20% final, the work so far banks 60.8 points, and (70 − 60.8) ÷ 0.20 = 46%. The same method gives the minimum for any letter: change the target and read the new score.',
      ),

      h2('Dropped, Replaced or Missing Final Exams'),
      h3('How does a final exam that replaces my lowest test work?'),
      p(
        'The final’s score takes the place of the lowest test, so your course grade rises by the gap between the two scores multiplied by that test’s weight. If each test is worth 10%, the lowest was 60% and the final earns 85%, the course grade gains 0.10 × 25 = 2.5 points. To plan it, enter your tests in the weighted grade calculator and swap in a hypothetical exam score for the low one.',
      ),
      h3('How do I calculate a semester grade without a final exam?'),
      p(
        'With no final, your semester grade is the weighted average of everything that was graded, so there is nothing to solve for. The weighted grade calculator handles that case. If a dropped score changes your current grade, recalculate before using this page.',
      ),
      h3('What if my instructor curves the final?'),
      p(
        'Compare the required score with your expected score after the curve. A raw 70% with a 5-point curve counts as 75%, so aim for the raw score that, with the curve added, reaches the number the calculator shows. The grade curve calculator compares four common curving methods.',
      ),

      h2('How Much Does the Final Exam Affect My Grade?'),
      p(
        'Every point on the exam moves your course grade by the exam weight. On a 25% final, ten extra points on the exam add 2.5 points to the course grade, and on a 40% final they add 4. After you know your course percentage, the GPA calculator turns the letter into grade points for your semester or cumulative GPA.',
      ),
      h3('Final exam grade formula for Excel or Google Sheets'),
      p(
        'Put the current grade in A1, the target in B1 and the final weight as a decimal in C1, then use =(B1-A1*(1-C1))/C1. The inputs 84, 80 and 0.25 return 68. A negative result means the target is already secured, and a result above 100 means it is out of reach without extra credit.',
      ),

      h2('How to Read the Final Exam Score Needed'),
      ul(
        'Below 0%: you have already locked in that grade. Even a zero on the final would not pull you under it.',
        'Between 0% and 100%: this is your target. Study toward it with a margin of a few points.',
        'Above 100%: the target is out of reach with regular exam points. Pick the next realistic grade or ask your instructor about extra credit.',
      ),

      h2('Final Grade Calculator vs. Weighted Grade Calculator'),
      p(
        'A weighted grade calculator tells you where you stand now by combining every graded category. A final exam grade calculator tells you what the last assessment must deliver. Use both: find your current weighted average first, then feed it to the final exam calculator.',
      ),

      h2('Turn the Number into a Study Plan'),
      ul(
        'Convert the required percentage into points on the exam (65% on a 120-point exam is 78 points).',
        'Spend the most time on the topics that carry the most points, not the ones you enjoy most.',
        'Recalculate after every graded assignment, or when your instructor drops a score.',
        'If the result is above 100%, talk to your instructor early rather than after the exam.',
      ),
    ],
  },

  /* ------------------------------------------------------------------ /test-grade-calculator/ */
  'test-grade': {
    imageKey: 'test-grade',
    imageAlt:
      'Printed test score reports and a desk calculator used to work out a test grade percentage.',
    blocks: [
      title('Test Grade Calculator: Test Percentage and Letter Grade'),
      p(
        'A ',
        ['test grade calculator', true],
        ' turns points into a percentage and a letter grade in one step. Enter the points you earned and the points possible, add any extra credit, bonus points or late penalty, and see how your score compares with each grade cutoff. It is free, works for school and college tests and quizzes, and shows the points you needed for the next grade up.',
      ),

      h2('How to Calculate Test Percentage'),
      p(
        'Every test percentage uses one formula: points earned ÷ points possible × 100. The sections below show how it works in the situations students and teachers meet most often.',
      ),
      h3('How to calculate grade percentage'),
      p(
        'A grade percentage is the share of the available points you earned. If a test is worth 50 points and you scored 42, divide 42 by 50 to get 0.84 and multiply by 100 for ',
        ['84%', true],
        '.',
      ),
      h3('How do I calculate a test score percentage?'),
      ol(
        'Write down the points you earned.',
        'Write down the points possible. Use the number of questions only if every question is worth one point.',
        'Divide the points earned by the points possible.',
        'Multiply by 100 and round the way your teacher does.',
      ),
      h3('Points possible to percentage for common test sizes'),
      ul(
        '17 out of 20 points is 85%.',
        '22 out of 25 points is 88%.',
        '26 out of 30 points is 86.7%.',
        '33 out of 40 points is 82.5%.',
      ),
      h3('What percentage is X out of Y questions?'),
      p(
        'Replace X with the questions you got right and Y with the total number of questions: percentage = X ÷ Y × 100. For example, 18 out of 24 questions is 75%, and 47 out of 60 questions is 78.3%.',
      ),
      h3('Wrong answers to percentage'),
      p(
        'If you only know how many questions you missed, subtract them first: (total − wrong) ÷ total × 100. Missing 4 questions on a 25-question test gives 21 ÷ 25 = 84%. Each question on a 25-question test is worth 4 percentage points, so every extra miss costs 4%.',
      ),

      h2('Test Grade Calculator Based on Points or Number of Questions'),
      h3('How does a test grade calculator based on points work?'),
      p(
        'Many tests give questions different values, such as 2-point multiple choice, 5-point short answers and a 10-point essay. Add up every point you earned, then divide by the total points available. Scores of 12, 20 and 9 on three sections worth 15, 25 and 10 points give 41 out of 50 points, or 82%. Type the two totals into the calculator and it does the rest.',
      ),
      h3('Multiple choice test grade calculator: how much is each question worth?'),
      p(
        'When every question is worth one point, divide 100 by the number of questions to find what each one is worth:',
      ),
      ul(
        '20 questions: each is worth 5%, so 18 correct is 90%.',
        '40 questions: each is worth 2.5%, so 34 correct is 85%.',
        '50 questions: each is worth 2%, so 45 correct is 90%.',
      ),
      h3('Test grade calculator with partial credit and half points'),
      p(
        'Add partial credit to your points earned as a decimal before you divide. A paper with 38.5 points out of 50 is 77%. The points earned box accepts decimals such as 7.5, so half points and quarter points need no rounding.',
      ),

      h2('Using the Test Score Percentage Calculator'),
      ol(
        'Type the points earned and the points possible.',
        'Add bonus points if your teacher gave extra credit. They are added to the points earned only.',
        'Enter a late penalty in points if your teacher deducts them.',
        'Choose the standard or plus/minus grading scale, then read the percentage, the letter grade and the points needed for the next grade up.',
      ),

      h2('What Test Grade Do I Need? Points to Pass and Points for Each Letter'),
      h3('What test grade do I need to pass?'),
      p(
        'Multiply the points possible by the pass mark. A 60% pass mark on a 50-point test is 30 points, a 70% pass mark on a 40-point test is 28 points, and 60% on a 25-point test is 15 points. Your syllabus sets the pass mark, so check it before you plan.',
      ),
      h3('How many points do I need for an A, B, C or D?'),
      p('On a 50-point test with the common 10-point scale, the cutoffs are:'),
      ul(
        'A (90%): 45 points',
        'B (80%): 40 points',
        'C (70%): 35 points',
        'D (60%): 30 points',
      ),
      p(
        'The “points needed” table under the calculator builds this list for any test size and for the plus/minus scale.',
      ),
      h3('How many questions can I miss and still get a B?'),
      p(
        'Take 20% of the points possible and round down. On a 25-question test you can miss 5 questions and keep 80%, and on a 50-question test you can miss 10.',
      ),

      h2('From Test Percentage to Letter Grade'),
      p(
        'The percentage is math; the letter is policy. On the common 10-point scale 90% and up is an A, 80–89% a B, 70–79% a C, 60–69% a D and anything below 60% an F. On a plus/minus scale the same 88% becomes a B+. Your syllabus decides which scale applies, which is why the calculator lets you switch.',
      ),

      h2('Test Grade Calculator with Extra Credit, Bonus Points and Penalties'),
      ul(
        'Extra credit raises the points earned only, so a score can pass 100%. Some teachers cap it at 100%.',
        'A penalty in points is subtracted before dividing. A percentage penalty is taken off the finished result.',
        'Round only at the end. Rounding early can push a score across a grade cutoff by mistake.',
      ),
      p(
        'Example: 42 points on a 50-point test plus 2 bonus points is 44 ÷ 50 = ',
        ['88%', true],
        ', and a 5-point late penalty on the original 42 would give 37 ÷ 50 = 74%.',
      ),

      h2('What If? How a Test Score Affects Your Overall Grade'),
      h3('What if I get a certain score on my next test?'),
      p(
        'Type the score you hope for into the points earned box and read the percentage and letter, or compare it with the points-needed table to see the lowest score that reaches your target. Because every field updates as you type, you can try several scores in a few seconds.',
      ),
      h3('How much will one test affect my overall grade?'),
      p(
        'A test moves your course grade by its weight times the change in your score. If a test counts for 20% of the course, a 90% instead of a 70% adds 0.20 × 20 = 4 percentage points to the course grade. This calculator grades one test, so enter the test as an assessment in the weighted grade calculator to see the effect on the whole course.',
      ),
      h3('Dropping the lowest test or replacing it with the final exam'),
      p(
        'Work out each test percentage first. To drop the lowest, remove it and average the others: 72%, 85%, 90% and 88% average 83.75%, but without the 72% they average 87.7%. If the final exam replaces your lowest test, put the final percentage in its place when it is higher. The average grade calculator and the final exam calculator handle the next step.',
      ),
      h3('Weighted test grades: tests versus quizzes'),
      p(
        'When tests count more than quizzes, average each group, multiply by its weight and add the results. A test average of 84% at 70% weight and a quiz average of 92% at 30% weight give 0.70 × 84 + 0.30 × 92 = 86.4%.',
      ),

      h2('Test Grade Calculator for Teachers, Students, High School and College'),
      p(
        'Students use a test grade calculator to check a score before the grade is posted and to see what a retake or extra-credit question would change. Teachers use it to grade one paper at a time, and the Quick Grade chart lists the score for every number of wrong answers when a whole class needs grading from one sheet. The math is the same in high school and college. The scale and any rounding rule come from your syllabus.',
      ),
      h3('Is this the right calculator for AP, SAT or IELTS scores?'),
      p(
        'No. Those exams are scored with official conversion tables, not with a simple points-over-possible percentage. This page is for classroom tests, quizzes and exams marked in points. To see how a single test fits into the semester, use the weighted grade calculator, and use the final exam calculator to plan the last big score.',
      ),
    ],
  },

  /* ------------------------------------------------------------------ /grade-curve-calculator/ */
  'grade-curve': {
    imageKey: 'grade-curve',
    imageAlt: 'Score charts and a desk calculator on a wooden desk, used to curve grades with a bell curve.',
    blocks: [
      title('Grade Curve Calculator: How to Curve Grades and Test Scores'),
      p(
        'A ',
        ['grade curve calculator', true],
        ' adjusts raw test scores with a rule applied to every student, then shows the before-and-after scores, the class mean and median, and the letter grade each student ends up with. It helps teachers choose a fair curve and helps students estimate what a curve might do. This free online tool curves four ways and works for any maximum score.',
      ),

      h2('What Is a Grade Curve?'),
      p(
        'Curving means changing raw scores with one consistent rule, usually because a test turned out harder than intended or a question was unclear. It is an instructor decision, not something a student can claim.',
      ),
      h3('Curve vs. bell curve'),
      p(
        'The four methods below move every score by a fixed rule, so the order of students and the gaps between them stay recognizable. A bell-curve policy assigns letters by rank or by distance from the class mean and standard deviation, which can leave some students lower than their raw score. This calculator never lowers a score.',
      ),

      h2('How to Curve Grades: The Four Methods'),
      h3('How do you grade on a curve with flat points?'),
      p('Add the same number of points to everyone: curved score = raw score + k. A +5 curve turns a 70 into a 75 and keeps every gap between students the same, which makes it a linear grade curve.'),
      h3('How do you curve a test so the top score is 100?'),
      p('Add the difference between the maximum score and the highest raw score: curved score = raw score + (maximum − highest score). If the best score was 85 out of 100, everyone gains 15 points.'),
      h3('What is a square root grade curve?'),
      p('For a 100-point test, curved score = 10 × √raw score. A 64 becomes 80 and a 36 becomes 60, so low scores gain the most and the spread of the class narrows. A cube-root curve works the same way with a stronger lift, but this calculator offers the square root.'),
      h3('How do you curve grades using the class average?'),
      p('Shift every score by the gap between your target mean and the actual mean: curved score = raw score + (target − mean). If the class mean is 64 and the department expects 75, add 11 points to each score, so a 58 becomes 69.'),

      h2('Grade Curve Calculator with Mean, Median and Standard Deviation'),
      h3('How do I find the class mean and median?'),
      p('The mean is the sum of all scores divided by the number of scores, and the median is the middle score once they are sorted. For 55, 62, 70, 78 and 85 both come to 70. The calculator shows the mean and median before and after the curve, so you can see how far each method moves the class.'),
      h3('How do I curve grades using the mean and standard deviation?'),
      p('Convert each score to a z-score, (score − mean) ÷ standard deviation, then rebuild it with the mean and spread you want: new score = target mean + target spread × z. With a class mean of 70 and a standard deviation of 10, an 80 has z = 1, so a target mean of 78 and spread of 8 gives 86. This calculator does not compute standard deviation, so work that step out in a spreadsheet with STDEV and use the target-average method here when you only need to move the mean.'),

      h2('How to Use the Grade Curve Calculator'),
      ol(
        'Paste the raw scores, one per line or separated by commas.',
        'Set the maximum score if the test was not out of 100 points.',
        'Choose a curving method and enter its setting (points to add, or the target average).',
        'Decide whether scores should be capped at the maximum.',
        'Compare the before-and-after table, the mean, the median and the letter grades, then print the result.',
      ),

      h2('Grade Curve Calculator from Points, for Exams and Final Grades'),
      h3('How do I curve a test that is not out of 100?'),
      p('Enter the points the test was worth as the maximum score. The square-root curve then becomes maximum × √(raw ÷ maximum), so a 36 on a 50-point test becomes 42.4, and the cap and top-score method use your maximum too.'),
      h3('Can I curve a final exam or a final grade?'),
      p('Yes. Paste the final exam scores and apply the curve, then enter the curved scores in the weighted grade calculator to see course grades. Many schools curve single assessments rather than the finished course grade, so check the policy first.'),
      h3('What is my letter grade after the curve?'),
      p('Every curved score in the results table carries a letter on the A–F or plus/minus scale. A raw 74 with a +8 curve becomes 82, which is a B on the A–F scale and a B- on plus/minus.'),

      h2('Choosing a Fair Curve'),
      ul(
        'Use flat points when one question was ambiguous or a topic was not taught.',
        'Use top score to 100 when the test was harder than intended and nobody reached full marks.',
        'Use the square-root curve when many scores are low and you want to lift the bottom most.',
        'Use the target average when your department expects a particular class mean.',
      ),
      p(
        'Capping at the maximum hides what happens at the top: scores of 97 and 99 can both become 100 after a +5 curve. View the uncapped values first, then decide what your gradebook should record.',
      ),

      h2('How to Grade on a Curve in Excel or Google Sheets'),
      p(
        'Put the raw scores in column A. A flat +5 curve capped at 100 is =MIN(100, A2+5), a target average of 78 is =MIN(100, A2+(78-AVERAGE($A$2:$A$30))), and the square-root curve is =10*SQRT(A2). Fill the formula down the column. The calculator does the same sum without setup and adds the mean, median and letters.',
      ),

      h2('Curved Grades and the Gradebook'),
      p(
        'After curving, enter the curved scores in the weighted grade calculator to see course grades, and check the cutoffs behind each letter with the letter grade calculator. Teachers can compare all four curves on the same class before posting grades, and students in high school or college can paste the scores they know to estimate the effect. The official curve is always the instructor’s decision.',
      ),
    ],
  },

  /* ------------------------------------------------------------------ /letter-grade-calculator/ */
  'letter-grade': {
    imageKey: 'letter-grade',
    imageAlt: 'Graduation cap beside a transcript and calculator, showing percent-to-letter-grade conversion.',
    blocks: [
      title('Letter Grade Calculator: Percent to Letter Grade, GPA and A–F Scale'),
      p(
        'A ',
        ['letter grade calculator', true],
        ' converts any percentage into a letter and 4.0 GPA points, or shows the percentage range behind a letter. It works as a ',
        ['percent to letter grade calculator', true],
        ' for high school and college classes, on the A–F grading scale most US schools use and on the common plus/minus version.',
      ),

      h2('Understanding the A–F Grading Scale'),
      h3('How does the A to F grading scale work?'),
      p(
        'The A to F grading scale sorts percentages into five bands. On the common 10-point scale an A is 90–100%, a B is 80–89%, a C is 70–79%, a D is 60–69% and an F is anything below 60%. Each letter carries GPA points: A = 4.0, B = 3.0, C = 2.0, D = 1.0 and F = 0.0.',
      ),
      h3('Letter grade percentage chart'),
      ul(
        'A: 90–100% (4.0 GPA points)',
        'B: 80–89% (3.0)',
        'C: 70–79% (2.0)',
        'D: 60–69% (1.0)',
        'F: below 60% (0.0)',
      ),
      p(
        'The plus/minus version splits each band into thirds: A+ starts at 97, A at 93, A- at 90, B+ at 87, B at 83, B- at 80, and so on down to D- at 60.',
      ),
      h3('What percentage is an A grade?'),
      p(
        'On the standard scale an A is 90% or higher. On the plus/minus scale a plain A runs from 93% to 96.99%, with A- starting at 90% and A+ at 97%.',
      ),
      h3('What percentage do you need to get an A?'),
      p(
        'Most classes need 90%, and some schools require 93%. Check your syllabus: under a 93 cutoff a 91.5% is an A-, not an A, and the rounding rule decides what happens to an 89.5%.',
      ),
      h3('What percentage is a B grade?'),
      p(
        'A B is 80–89% on the standard scale. On the plus/minus scale a B- is 80–82.99%, a B is 83–86.99% and a B+ is 87–89.99%.',
      ),

      h2('Percent to Letter Grade: How the Calculator Works'),
      ol(
        'Enter the percentage. Use your unrounded course average if you have it.',
        'Pick the standard or the plus/minus scale.',
        'Read the letter, the GPA points and how far you are from the next cutoff.',
        'To go the other way, choose a letter to see its percentage range and midpoint.',
      ),
      h3('How do I calculate my letter grade?'),
      p(
        'First turn your score into a percentage: points earned ÷ points possible × 100. Then match the percentage to your scale. For example, 42 out of 50 is 42 ÷ 50 × 100 = 84%, which is a B on both common scales.',
      ),
      h3('How do I convert points or a score to a letter grade?'),
      p(
        'Points, scores and numbers all work the same way: divide by the total possible, multiply by 100, and enter the percentage. If you have several assessments with different weights, build the course percentage in the weighted grade calculator first.',
      ),

      h2('What Letter Grade Is My Score? Common Percentages'),
      ul(
        '96% (48 out of 50): A on the standard scale (4.0), A on plus/minus (4.0)',
        '93%: A (4.0) on both scales',
        '88%: B (3.0) on the standard scale, B+ (3.3) on plus/minus',
        '85%: B (3.0) on both scales',
        '80%: B (3.0) on the standard scale, B- (2.7) on plus/minus',
        '73%: C (2.0) on both scales',
        '70% (35 out of 50): C (2.0) on the standard scale, C- (1.7) on plus/minus',
        '66%: D (1.0) on both scales',
        '60% (30 out of 50): D (1.0) on the standard scale, D- (0.7) on plus/minus',
      ),
      h3('Is 80% what letter grade?'),
      p(
        'An 80% is a B on the standard scale and a B- on the plus/minus scale, because 80 is the lowest B- there. It is the bottom of the B range on both.',
      ),
      h3('Is a 93% an A or a B?'),
      p(
        'A 93% is an A on both common scales. It is a B only if your school uses a very high A cutoff such as 94 or 95.',
      ),
      h3('What letter grade is 70%, and is a 30 out of 50 a bad grade?'),
      p(
        'A 70% (35 out of 50) is a C on the standard scale and a C- on the plus/minus scale. A 30 out of 50 is 60%, a D or a D-, which passes at most schools but only just. For comparison, 48 out of 50 is 96%, an A.',
      ),
      h3('What letter grade is an 85 in college?'),
      p(
        'An 85% is a B (3.0) at most colleges, on both the standard and the plus/minus scale. Some colleges publish their own table, so the course syllabus decides.',
      ),

      h2('Letter Grade to GPA Calculator: Points on the 4.0 Scale'),
      h3('How do I convert a percentage to a 4.0 GPA?'),
      p(
        'Convert the percentage to a letter, then read the points for that letter. The calculator shows both at once. A 92% is an A (4.0) on the standard scale and an A- (3.7) on the plus/minus scale.',
      ),
      h3('How many GPA points does each letter grade earn?'),
      ul(
        'A+ and A: 4.0, A-: 3.7',
        'B+: 3.3, B: 3.0, B-: 2.7',
        'C+: 2.3, C: 2.0, C-: 1.7',
        'D+: 1.3, D: 1.0, D-: 0.7',
        'F: 0.0',
      ),
      h3('Is GPA determined by letter grade?'),
      p(
        'Yes. Each course’s letter becomes grade points, the points are multiplied by the course’s credit hours, and the total is divided by the total credits. The percentage behind the letter is not part of the GPA, only the letter is.',
      ),
      h3('Is a 3.9 GPA an A, and are all B’s a 3.5 GPA?'),
      p(
        'A 3.9 is an A average. With equal-credit courses, one B among ten A grades gives exactly 3.9. All B grades give a 3.0, not a 3.5: a 3.5 needs about half A grades and half B grades.',
      ),
      h3('Is a 2.7 GPA a B-?'),
      p(
        'On the common plus/minus scale a 2.7 is worth a B-. A 2.75 sits slightly above a B- and below a B (3.0).',
      ),
      h3('Will one C ruin a 4.0 GPA?'),
      p(
        'No. One C among ten equal-credit A courses gives a 3.8, and among forty courses it gives a 3.95. The more credits you have, the less a single grade moves your GPA.',
      ),

      h2('Letter Grades for College, High School and Teachers'),
      p(
        'Colleges and universities often use the plus/minus scale and weight each course by its credit hours. Many high schools use the plain A–F scale, and some add extra points for honors or AP courses, which this calculator does not include. Teachers can use the same cutoff table to turn a class percentage into a report-card letter.',
      ),
      p(
        'Outside the US the rules differ. Canadian schools often use a 4.0 or 4.3 letter scale that varies by province and university, and many Australian universities grade with High Distinction, Distinction, Credit and Pass instead of A–F. Use your institution’s published table for those.',
      ),

      h2('Why Your School’s Scale May Differ'),
      p(
        'Seven-point scales that start an A at 93, cutoffs at 94 or 95, and an A+ worth 4.3 all exist, and so do different rounding rules. When your syllabus lists cutoffs, they override any generic chart, including this one.',
      ),

      h2('From Letter Grade to GPA and Final Grade'),
      p(
        'A letter turns into grade points, and grade points are weighted by credit hours. Take the letters you find here to the GPA calculator to get your semester and cumulative GPA. To apply a curve before converting, use the grade curve calculator, and to find the final exam score you need for a target letter, use the final exam grade calculator.',
      ),
    ],
  },
};
