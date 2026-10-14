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
      'A hand presses buttons on a pocket calculator next to a paper showing weighted course syllabus percentages and final exam targets.',
    blocks: [
      title('Weighted Grade Calculator: How to Calculate Weighted Grades'),
      p(
        'A ',
        ['weighted grade calculator', true],
        ' turns your syllabus into one course percentage. Instead of adding every point together, it gives each category (homework, quizzes, projects, midterms and the final exam) its own share of the grade, so you can see where you stand today and what you still need to earn.',
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
      'Study desk with a notebook of course grades, a calculator and a pen, set up to work out the score needed on a final exam.',
    blocks: [
      title('Final Grade Calculator: Find the Final Exam Score You Need'),
      p(
        'A ',
        ['final grade calculator', true],
        ' answers the question every student asks in finals week: what score do I need on the final exam to finish the course with the grade I want? Enter your current grade, the weight of the final and your target, and the calculator solves for the final exam score needed.',
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
      'Printed test score reports and a desk calculator on a wooden desk, used to calculate a test grade percentage.',
    blocks: [
      title('Test Grade Calculator: How to Calculate Test Percentage'),
      p(
        'A ',
        ['test grade calculator', true],
        ' turns points into a percentage and a letter grade in one step. Enter the points you earned and the points possible, add any bonus points or late penalty, and see how your score compares with each grade cutoff.',
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

      h2('Using the Test Score Percentage Calculator'),
      ol(
        'Type the points earned and the points possible.',
        'Add bonus points if your teacher gave extra credit. They are added to the points earned only.',
        'Enter a late penalty in points if your teacher deducts them.',
        'Choose the standard or plus/minus grading scale, then read the percentage, the letter grade and the points needed for the next grade up.',
      ),

      h2('From Test Percentage to Letter Grade'),
      p(
        'The percentage is math; the letter is policy. On the common 10-point scale 90% and up is an A, 80–89% a B, 70–79% a C, 60–69% a D and anything below 60% an F. On a plus/minus scale the same 88% becomes a B+. Your syllabus decides which scale applies, which is why the calculator lets you switch.',
      ),

      h2('Extra Credit, Penalties and Rounding'),
      ul(
        'Extra credit raises the points earned only, so a score can pass 100%. Some teachers cap it at 100%.',
        'A penalty in points is subtracted before dividing. A percentage penalty is taken off the finished result.',
        'Round only at the end. Rounding early can push a score across a grade cutoff by mistake.',
      ),

      h2('Test Grades and Your Course Grade'),
      p(
        'One test is only part of the course grade. To see how it moves your overall average, add it as an assessment in the weighted grade calculator, and use the final exam calculator to plan the last big score.',
      ),
    ],
  },

  /* ------------------------------------------------------------------ /grade-curve-calculator/ */
  'grade-curve': {
    imageKey: 'grade-curve',
    imageAlt: 'Score charts and a desk calculator on a wooden desk, used to curve grades with a bell curve.',
    blocks: [
      title('Grade Curve Calculator: Four Ways to Curve Test Scores'),
      p(
        'A ',
        ['grade curve calculator', true],
        ' adjusts raw test scores with a rule applied to every student, then shows the before-and-after scores, the class mean and median, and the letter grade each student ends up with. It helps teachers choose a fair curve and helps students estimate what a curve might do.',
      ),

      h2('What Is a Grade Curve?'),
      p(
        'Curving means changing raw scores with one consistent rule, usually because a test turned out harder than intended or a question was unclear. It is an instructor decision, not something a student can claim.',
      ),
      h3('Curve vs. bell curve'),
      p(
        'The four methods below move every score by a fixed rule, so the order of students and the gaps between them stay recognizable. A bell-curve policy assigns letters by rank or by distance from the mean, which can leave some students lower. This calculator never lowers a score.',
      ),

      h2('The Four Curving Methods'),
      h3('Flat points'),
      p('Add the same number of points to everyone: curved score = raw score + k. A +5 curve turns a 70 into a 75 and keeps every gap between students the same.'),
      h3('Top score to 100'),
      p('Add the difference between 100 and the highest raw score: curved score = raw score + (100 − highest score). If the best score was 85, everyone gains 15 points.'),
      h3('Square-root curve'),
      p('For a 100-point test, curved score = 10 × √raw score. A 64 becomes 80 and a 36 becomes 60, so low scores gain the most and the spread of the class narrows.'),
      h3('Target class average'),
      p('Shift every score by the gap between your target mean and the actual mean: curved score = raw score + (target − mean). Raising a class mean of 70 to 78 adds 8 points to each score.'),

      h2('How to Use the Grade Curve Calculator'),
      ol(
        'Paste the raw scores, one per line or separated by commas.',
        'Choose a curving method and enter its setting (points to add, or the target average).',
        'Decide whether scores should be capped at 100.',
        'Compare the before-and-after table, the mean, the median and the letter grades, then print the result.',
      ),

      h2('Choosing a Fair Curve'),
      ul(
        'Use flat points when one question was ambiguous or a topic was not taught.',
        'Use top score to 100 when the test was harder than intended and nobody reached full marks.',
        'Use the square-root curve when many scores are low and you want to lift the bottom most.',
        'Use the target average when your department expects a particular class mean.',
      ),
      p(
        'Capping at 100 hides what happens at the top: scores of 97 and 99 can both become 100 after a +5 curve. View the uncapped values first, then decide what your gradebook should record.',
      ),

      h2('Curved Grades and the Gradebook'),
      p(
        'After curving, enter the curved scores in the weighted grade calculator to see course grades, and check the cutoffs behind each letter with the letter grade calculator.',
      ),
    ],
  },

  /* ------------------------------------------------------------------ /letter-grade-calculator/ */
  'letter-grade': {
    imageKey: 'letter-grade',
    imageAlt: 'Graduation cap beside an academic transcript and calculator, showing how percentages convert to letter grades.',
    blocks: [
      title('Letter Grade Calculator: Percent to Letter Grade and the A–F Scale'),
      p(
        'A ',
        ['letter grade calculator', true],
        ' converts any percentage into a letter and 4.0 GPA points, or shows the percentage range behind a letter. It follows the A–F grading scale most US schools use, plus the common plus/minus version.',
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

      h2('Percent to Letter Grade: How the Calculator Works'),
      ol(
        'Enter the percentage. Use your unrounded course average if you have it.',
        'Pick the standard or the plus/minus scale.',
        'Read the letter, the GPA points and how far you are from the next cutoff.',
        'To go the other way, choose a letter to see its percentage range and midpoint.',
      ),

      h2('Why Your School’s Scale May Differ'),
      p(
        'Seven-point scales that start an A at 93, cutoffs at 94 or 95, and an A+ worth 4.3 all exist, and so do different rounding rules. When your syllabus lists cutoffs, they override any generic chart, including this one.',
      ),

      h2('From Letter Grade to GPA'),
      p(
        'A letter turns into grade points, and grade points are weighted by credit hours. Take the letters you find here to the GPA calculator to get your semester and cumulative GPA.',
      ),
    ],
  },
};
