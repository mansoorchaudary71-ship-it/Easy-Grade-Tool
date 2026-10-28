import type { ToolPageEntry } from './toolPages';
import { aOrAn } from './gradingScaleSizes';
import { SCALE_PLUS_MINUS, SCALE_STANDARD, roundTo } from '../utils/academicMath';
import { DEFAULT_BONUS, GPA_LETTERS, WeightedCourse, calculateWeightedGpa, pointsForLetter } from '../utils/gpaMath';
import { buildMissTable, maxWrongForMinPercent } from '../utils/missMath';

/**
 * Pages added by the SEO fix kit: the weighted GPA calculator (tool), the weighted vs unweighted GPA guide
 * and the "how many questions can I miss" calculator. Every number in the copy is computed from the same
 * helpers the tools use (utils/gpaMath.ts, utils/missMath.ts), never typed by hand.
 */

const EXAMPLE_COURSES: (WeightedCourse & { name: string })[] = [
  { name: 'AP Calculus', letter: 'A', credits: 1, level: 'ap' },
  { name: 'Honors English', letter: 'B', credits: 1, level: 'honors' },
  { name: 'US History', letter: 'A', credits: 1, level: 'regular' },
];
const exampleResult = calculateWeightedGpa(EXAMPLE_COURSES, DEFAULT_BONUS)!;
const bonusOf = (level: WeightedCourse['level']) => (level === 'honors' ? DEFAULT_BONUS.honors : level === 'ap' ? DEFAULT_BONUS.ap : 0);
const levelLabel = (level: WeightedCourse['level']) => (level === 'honors' ? 'Honors' : level === 'ap' ? 'AP / IB' : 'Regular');
const gap = roundTo(exampleResult.weighted - exampleResult.unweighted, 2).toFixed(2);

const SCHEDULE_COURSES: (WeightedCourse & { name: string })[] = [
  { name: 'AP Biology', letter: 'A', credits: 1, level: 'ap' },
  { name: 'Honors English', letter: 'A-', credits: 1, level: 'honors' },
  { name: 'US History', letter: 'B+', credits: 1, level: 'regular' },
  { name: 'Algebra II', letter: 'B', credits: 1, level: 'regular' },
  { name: 'Spanish', letter: 'A', credits: 1, level: 'regular' },
  { name: 'AP Psychology', letter: 'B', credits: 1, level: 'ap' },
];
const scheduleResult = calculateWeightedGpa(SCHEDULE_COURSES, DEFAULT_BONUS)!;
const straightA = (levels: WeightedCourse['level'][]) =>
  calculateWeightedGpa(levels.map((level) => ({ letter: 'A', credits: 1, level })), DEFAULT_BONUS)!.weighted.toFixed(2);

export function buildWeightedGpaPage(): ToolPageEntry {
  return {
    slug: 'weighted-gpa-calculator',
    path: '/weighted-gpa-calculator/',
    navLabel: 'Weighted GPA calculator',
    h1: 'Weighted GPA Calculator',
    title: 'Weighted GPA Calculator — Honors, AP & IB Bonus Points',
    metaDescription:
      'Free weighted GPA calculator: add your school’s honors, AP and IB bonus points and see weighted and unweighted GPA side by side.',
    badge: 'Weighted GPA',
    intro: `A weighted GPA adds bonus points for harder courses, so an A in an AP class can count above 4.0. Add each course with your school’s bonus and see your weighted and unweighted GPA side by side. Example: an A in AP Calculus, a B in Honors English and an A in US History give a weighted GPA of ${exampleResult.weighted.toFixed(2)} and an unweighted GPA of ${exampleResult.unweighted.toFixed(2)}.`,
    keywords: [
      'weighted gpa calculator',
      'weighted grade calculator',
      'high school gpa calculator',
      'ap gpa calculator',
      'honors gpa calculator',
      'calculate weighted gpa',
    ],
    featureList: [
      'Honors and AP/IB bonus points you set yourself',
      'Weighted and unweighted GPA side by side',
      'Credit-weighted average',
      'Plus/minus letter grades',
      'Your courses are saved on this device, so they are here when you come back',
      'Runs in your browser, nothing is uploaded',
    ],
    sections: [
      {
        heading: 'Weighted grade vs weighted GPA: the same word, two jobs',
        paragraphs: [
          'Teachers and students use "weighted" for two different calculations, and mixing them up is the most common weighted-grade error. A weighted grade weights assessments inside one course — homework at 20%, quizzes at 30%, tests at 50% — and produces a course percent. A weighted GPA weights courses across a transcript — bonus points for honors, AP or IB — and produces a grade-point average above 4.0.',
          'This page does the second job: it takes course letters and credits, adds bonus points, and returns a weighted GPA. For the first job, use the weighted grade calculator, which takes assessment scores and weights inside a single course and returns a percent. The category grade calculator sits between the two: it weights categories of work inside one course, then reports the course grade.',
          'The tell is the unit. If the answer should be a percent for one course, you need weights on assessments. If the answer should be a GPA for a whole transcript, you need bonus points on courses. Same word, different inputs, different answers.',
        ],
      },
      {
        heading: 'How to calculate a weighted GPA',
        paragraphs: [
          'A weighted GPA is a credit-weighted average of grade points, where harder courses get bonus points added first. The formula is: weighted GPA = the sum of (grade points + bonus) × credits, divided by total credits.',
        ],
        bullets: [
          'Turn each letter grade into 4.0-scale points (A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0 and so on).',
          'Add your school’s bonus if the course is honors, AP or IB.',
          'Multiply the result by the course credits.',
          'Add those products together and divide by the total credits.',
        ],
      },
      {
        heading: 'Which bonus points should you use?',
        paragraphs: [
          'Use the numbers your school publishes in its grading policy or course catalog. This calculator starts at 0.5 for honors and 1.0 for AP or IB because many schools use those values, but they are only starting points. Some schools use smaller bonuses, apply them only to certain courses or grades, or do not weight GPA at all.',
          'This calculator gives no bonus to a course graded F, because a bonus on a failing grade would reward a failed course. If your school handles that differently, your official GPA will differ from the result here.',
        ],
      },
      {
        heading: 'Why the number on your transcript may not be the number a college uses',
        paragraphs: [
          'Some colleges recalculate GPA from your transcript with their own rules, for example by using only core academic courses or by removing school-specific bonus points. Check the admissions pages of the colleges you apply to to see which GPA they ask for.',
        ],
      },
      {
        heading: 'Worked example: a full six-course schedule',
        paragraphs: [
          `One A in an AP class is easy to follow. A real schedule is not, so here is a complete semester worked end to end with the same bonuses this calculator starts with (honors ${DEFAULT_BONUS.honors}, AP/IB ${DEFAULT_BONUS.ap.toFixed(1)}), one credit per course.`,
          `Adding the six weighted values gives ${SCHEDULE_COURSES.map((c) => ((pointsForLetter(c.letter) ?? 0) + bonusOf(c.level)).toFixed(1)).join(' + ')} = ${SCHEDULE_COURSES.reduce((a, c) => a + (pointsForLetter(c.letter) ?? 0) + bonusOf(c.level), 0).toFixed(1)} points over 6 credits, a weighted GPA of ${scheduleResult.weighted.toFixed(2)}. The same grades with no bonuses total ${SCHEDULE_COURSES.reduce((a, c) => a + (pointsForLetter(c.letter) ?? 0), 0).toFixed(1)} points, an unweighted GPA of ${scheduleResult.unweighted.toFixed(2)}. The two AP courses and one honors course lift the result by ${roundTo(scheduleResult.weighted - scheduleResult.unweighted, 2).toFixed(2)}.`,
        ],
        bullets: SCHEDULE_COURSES.map(
          (c) => `${c.name} (${levelLabel(c.level)}): ${c.letter} = ${(pointsForLetter(c.letter) ?? 0).toFixed(1)} points${bonusOf(c.level) ? ` + ${bonusOf(c.level).toFixed(1)} bonus` : ''} = ${((pointsForLetter(c.letter) ?? 0) + bonusOf(c.level)).toFixed(1)} weighted points`,
        ),
      },
      {
        heading: 'How many AP classes does it take to reach a 4.5 weighted GPA?',
        paragraphs: [
          'With straight As in six one-credit courses, the table below shows how the weighted GPA climbs as regular courses are swapped for honors and AP ones. Three AP courses are enough to pass 4.5, because each AP A contributes 5.0 instead of 4.0.',
          'Real schedules include Bs, and a B in an AP course counts 4.0 weighted, exactly the same as an A in a regular course. That is why counselors say an AP B rarely hurts a weighted GPA, while it does lower the unweighted one.',
        ],
      },
      {
        heading: 'Common mistakes when calculating a weighted GPA',
        paragraphs: [
          'Most wrong answers come from one of these five slips. All of them are easy to avoid once you know to look for them.',
        ],
        bullets: [
          'Using another school’s bonus. A 0.5/1.0 split is common but not universal; your school’s course catalog is the only source that counts.',
          'Forgetting the credits. A two-credit course moves the average twice as much as a one-credit course, in either direction.',
          'Adding a bonus to an F. Most schools, and this calculator, give no bonus on a failing grade.',
          'Mixing semester and year grades. Pick one set of final grades and use it consistently; do not average a semester GPA with year-long course grades.',
          'Comparing weighted GPAs across schools. Different bonuses and different ceilings (some schools cap at 4.5, others allow 5.0+) make the numbers non-comparable. Colleges know this and often recalculate.',
        ],
      },
      {
        heading: 'Weighted GPA on the 5.0 scale: what the ceiling really is',
        paragraphs: [
          'A weighted GPA is often described as “out of 5.0”, but 5.0 is only reachable if every course carries the full 1.0 bonus and every grade is an A. A student with a normal mix of regular, honors and AP courses has a personal ceiling well below 5.0, so a 4.3 from a mostly-regular schedule can represent stronger grades than a 4.3 built on bonuses.',
          'When a college application asks for your GPA “on a 5.0 scale”, report the weighted number your school prints on your transcript, exactly as printed. Do not rescale it yourself: admissions teams compare it against the school profile your counselor sends, which explains the bonus rules behind it.',
        ],
      },
    ],
    lookupTables: [
      {
        heading: 'Grade points by course level',
        intro: `Every letter grade converted to points, with the starting bonuses used above (honors +${DEFAULT_BONUS.honors}, AP/IB +${DEFAULT_BONUS.ap.toFixed(1)}). An F earns no bonus. If your school uses different bonuses, the regular column still applies and the other two shift by the same amount.`,
        columns: ['Letter grade', 'Regular', 'Honors', 'AP / IB'],
        rows: GPA_LETTERS.map((l) => {
          const pts = pointsForLetter(l) ?? 0;
          const isF = l === 'F';
          return [l, pts.toFixed(1), (pts + (isF ? 0 : DEFAULT_BONUS.honors)).toFixed(1), (pts + (isF ? 0 : DEFAULT_BONUS.ap)).toFixed(1)];
        }),
      },
      {
        heading: 'Straight As in six courses: weighted GPA by schedule',
        intro: 'Six one-credit courses, an A in every one. Only the course levels change, which isolates exactly what the bonus points are worth.',
        columns: ['Schedule', 'Weighted GPA'],
        rows: [
          ['6 regular', straightA(['regular', 'regular', 'regular', 'regular', 'regular', 'regular'])],
          ['4 regular, 2 honors', straightA(['regular', 'regular', 'regular', 'regular', 'honors', 'honors'])],
          ['4 regular, 2 AP', straightA(['regular', 'regular', 'regular', 'regular', 'ap', 'ap'])],
          ['2 regular, 1 honors, 3 AP', straightA(['regular', 'regular', 'honors', 'ap', 'ap', 'ap'])],
          ['6 AP', straightA(['ap', 'ap', 'ap', 'ap', 'ap', 'ap'])],
        ],
      },
    ],
    example: {
      heading: 'Worked example: same grades, two GPAs',
      scenario: `Three one-credit courses with an honors bonus of ${DEFAULT_BONUS.honors} and an AP/IB bonus of ${DEFAULT_BONUS.ap.toFixed(1)}: AP Calculus (A), Honors English (B) and US History (A, regular).`,
      rows: [
        ...EXAMPLE_COURSES.map((c) => ({
          label: `${c.name}: ${c.letter}, ${levelLabel(c.level)}`,
          value: `${((pointsForLetter(c.letter) ?? 0) + bonusOf(c.level)).toFixed(1)} points`,
        })),
        { label: 'Unweighted GPA', value: exampleResult.unweighted.toFixed(2) },
        { label: 'Weighted GPA', value: exampleResult.weighted.toFixed(2) },
      ],
      takeaway: `The same three grades give ${exampleResult.unweighted.toFixed(2)} unweighted and ${exampleResult.weighted.toFixed(2)} weighted, a difference of ${gap} from the bonus points alone.`,
    },
    faqs: [
      {
        question: 'How do I calculate my weighted GPA?',
        answer:
          'Convert each grade to points, add your school’s bonus for honors or AP/IB courses, multiply by the credits, add the results and divide by your total credits. This calculator does those steps for every course you enter.',
      },
      {
        question: 'Can a weighted GPA be higher than 4.0?',
        answer:
          'Yes. Bonus points are added on top of the 4.0-scale points, so a weighted GPA can go above 4.0. With a 1.0 bonus on every AP or IB course the highest possible value is 5.0, but the ceiling depends on your school’s bonus rules.',
      },
      {
        question: 'Do honors and AP classes get a bonus for an F?',
        answer:
          'This calculator adds no bonus to an F. Schools differ on this, so follow your school’s published policy for your official number.',
      },
      {
        question: 'Does this calculator save my courses?',
        answer:
          'Yes, on this device only. Your courses and bonus settings are stored in your own browser (local storage) so they are still there when you return, and you can clear them any time by resetting the example courses or clearing site data. Nothing is uploaded to a server or shared with anyone.',
      },
      {
        question: 'What is a good weighted GPA?',
        answer:
          'It depends on your school’s ceiling. On a schedule where 5.0 is possible, a weighted GPA above 4.0 means mostly As with some advanced courses, and above 4.3 is strong at most schools. Because bonuses differ between schools, colleges judge the number against your school’s profile and the courses you chose, not against a national cutoff.',
      },
      {
        question: 'Does a B in an AP class hurt my weighted GPA?',
        answer:
          'Less than most students fear. With a 1.0 AP bonus, a B in an AP course is worth 4.0 weighted points, the same as an A in a regular course. It lowers your unweighted GPA, but on the weighted number it is neutral compared with taking the easier class and earning an A.',
      },
      {
        question: 'Should I enter semester grades or year grades?',
        answer:
          'Enter the grades that appear on your transcript, and use one consistent set. If your transcript lists final year grades, use those with the full course credits. If it lists each semester separately, enter each semester as its own row with its own credits.',
      },
    ],
    related: [
      { path: '/weighted-vs-unweighted-gpa/', label: 'Weighted vs unweighted GPA', blurb: 'What each one means, with a side-by-side example.' },
      { path: '/semester-gpa-calculator/', label: 'Semester GPA calculator', blurb: 'One semester of courses on the 4.0 scale.' },
      { path: '/cumulative-gpa-calculator/', label: 'Cumulative GPA calculator', blurb: 'Combine your previous GPA with this semester.' },
      { path: '/gpa-calculator/', label: 'GPA calculator', blurb: 'Semester and cumulative GPA on the 4.0 scale.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Turn a percentage into a letter and GPA points.' },
      { path: '/high-school-gpa-calculator/', label: 'High school GPA calculator', blurb: 'Weighted and unweighted GPA, side by side.' },
      { path: '/college-gpa-calculator/', label: 'College GPA calculator', blurb: 'Credit-weighted GPA for college courses.' },
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Build a course percentage from every assessment.' },
    ],
  };
}

export function buildWeightedVsUnweightedPage(): ToolPageEntry {
  const rows = EXAMPLE_COURSES.map((c) => {
    const pts = pointsForLetter(c.letter) ?? 0;
    return [c.name, c.letter, levelLabel(c.level), pts.toFixed(1), (pts + bonusOf(c.level)).toFixed(1)];
  });
  rows.push(['GPA (average of the three)', '', '', exampleResult.unweighted.toFixed(2), exampleResult.weighted.toFixed(2)]);
  return {
    slug: 'weighted-vs-unweighted-gpa',
    path: '/weighted-vs-unweighted-gpa/',
    navLabel: 'Weighted vs unweighted GPA',
    h1: 'Weighted vs Unweighted GPA',
    title: 'Weighted vs Unweighted GPA: Differences & Examples',
    metaDescription:
      'Weighted vs unweighted GPA explained: what each one means, how each is calculated, and a worked example with the same grades.',
    badge: 'GPA guide',
    schemaType: 'WebPage',
    intro: `An unweighted GPA counts every class the same on a 4.0 scale. A weighted GPA adds bonus points for harder courses such as honors, AP and IB, so the same grades produce a higher number. With one A in AP, one B in honors and one A in a regular class, the unweighted GPA is ${exampleResult.unweighted.toFixed(2)} and the weighted GPA is ${exampleResult.weighted.toFixed(2)}.`,
    keywords: [
      'weighted vs unweighted gpa',
      'difference between weighted and unweighted gpa',
      'unweighted gpa meaning',
      'what is an unweighted gpa',
      'what is a weighted gpa',
    ],
    featureList: ['Plain-language definitions', 'Side-by-side worked example', 'Link to a weighted GPA calculator'],
    sections: [
      {
        heading: 'What unweighted GPA means',
        paragraphs: [
          'An unweighted GPA ignores how hard a course is. Every course is graded on the same scale, so an A is worth 4.0 in a regular class and in an AP class. On the standard scale the top value is 4.0, which makes unweighted GPAs easy to compare across students and schools.',
        ],
      },
      {
        heading: 'What weighted GPA means',
        paragraphs: [
          'A weighted GPA gives extra points for advanced courses. The school adds a bonus, often called a weight, to the 4.0-scale points of each honors, AP or IB course before averaging. Because the bonus is added on top, a weighted GPA can be higher than 4.0.',
          'The size of the bonus and the courses that qualify are set by each school or district, so two students with identical grades can have different weighted GPAs at different schools.',
        ],
      },
      {
        heading: 'Do colleges use weighted or unweighted GPA?',
        paragraphs: [
          'It varies. Some colleges recalculate GPA from your transcript using their own method, often on core academic courses and sometimes without school-specific bonus points. The admissions page of each college you apply to is the place to check.',
        ],
      },
      {
        heading: 'Which GPA should you look at?',
        paragraphs: [
          'Use your school’s weighted GPA when it is the one used for class rank or honors, and your unweighted GPA when you want a like-for-like number across schools. To see both for your own courses, use the weighted GPA calculator and enter your school’s bonus points.',
        ],
      },
      {
        heading: 'Which GPA goes on your transcript and your applications?',
        paragraphs: [
          'Most transcripts print one official GPA, and at schools that weight grades it is usually the weighted one. Some transcripts print both. When an application asks for your GPA it also asks for the scale, so a 4.17 is reported as “4.17 on a 5.0 weighted scale”, never as a bare number.',
          'Class rank is normally calculated from the weighted GPA, because rank is meant to reward students who took harder courses. Honor roll and Latin honors (cum laude, magna cum laude) vary: some schools use the weighted number, others set unweighted cutoffs. Your student handbook states which one your school uses.',
        ],
      },
      {
        heading: 'Can you convert a weighted GPA to an unweighted one?',
        paragraphs: [
          'Not from the headline number alone. A weighted 4.17 could be straight As with two AP bonuses, or a mix of As and Bs with more bonuses, and those two transcripts have different unweighted GPAs. The conversion only works course by course: remove each bonus, convert each grade back to the 4.0 scale and average again.',
          'That is exactly what the weighted GPA calculator shows. Enter the same courses once and it reports both numbers, which is the honest way to “convert”: recompute from the grades, never estimate from the weighted total.',
        ],
      },
      {
        heading: 'When the two GPAs tell opposite stories',
        paragraphs: [
          'The two numbers can rank two students in opposite orders, and that is the clearest proof that they measure different things. Take two students with four courses each. The first takes four regular courses and earns four As: unweighted 4.00, weighted 4.00. The second takes four AP courses with a 1.0 bonus and earns two As and two Bs: unweighted ' +
            `${((4.0 + 4.0 + 3.0 + 3.0) / 4).toFixed(2)}, weighted ${((5.0 + 5.0 + 4.0 + 4.0) / 4).toFixed(2)}.`,
          'Read the weighted column and the second student wins; read the unweighted column and the first student wins. Neither ranking is dishonest — the weighted column rewards course difficulty, the unweighted column rewards raw grades. A college that recalculates GPAs on its own table is, in effect, choosing which of those two stories to believe, which is why the same transcript can look stronger at one college than at another.',
        ],
      },
    ],
    lookupTables: [
      {
        heading: 'Side-by-side example',
        intro: `Three one-credit courses with an honors bonus of ${DEFAULT_BONUS.honors} and an AP/IB bonus of ${DEFAULT_BONUS.ap.toFixed(1)}. These bonus values are an example, not a rule.`,
        columns: ['Course', 'Grade', 'Level', 'Unweighted points', 'Weighted points'],
        rows,
      },
    ],
    example: {
      heading: 'Same grades, two GPAs',
      scenario: 'The table above, averaged over three equal-credit courses.',
      rows: [
        { label: 'Unweighted GPA', value: exampleResult.unweighted.toFixed(2) },
        { label: 'Weighted GPA', value: exampleResult.weighted.toFixed(2) },
        { label: 'Difference', value: gap },
      ],
      takeaway: 'The difference comes entirely from the bonus points on the honors and AP courses.',
    },
    faqs: [
      {
        question: 'What is the difference between weighted and unweighted GPA?',
        answer:
          'An unweighted GPA counts every course on the same 4.0 scale. A weighted GPA adds bonus points for honors, AP or IB courses, so a harder class with the same letter grade counts for more.',
      },
      {
        question: 'What does unweighted GPA mean?',
        answer:
          'It is your GPA when no course gets extra points for difficulty. An A is worth the same in every class, and on the usual 4.0 scale the highest possible value is 4.0.',
      },
      {
        question: 'Can an unweighted GPA be above 4.0?',
        answer:
          'Not on a standard 4.0 scale. A few schools give an A+ extra points, so check how your school scores it.',
      },
      {
        question: 'Is a weighted GPA better than an unweighted GPA?',
        answer:
          'Neither is better. A weighted GPA rewards taking harder courses, while an unweighted GPA is easier to compare across schools.',
      },
      {
        question: 'Is a 4.2 weighted GPA good?',
        answer:
          'At most schools, yes. A 4.2 weighted usually means a mix of As and Bs in a schedule with several honors or AP courses, and it sits above the 4.0 ceiling of an unweighted scale because of the bonuses. How selective colleges read it depends on your school’s bonus rules and how demanding your course choices were, which is why they also look at the unweighted grades behind it.',
      },
      {
        question: 'Can I convert my weighted GPA to an unweighted GPA?',
        answer:
          'Only by recalculating from your individual grades: remove the bonus from each course, convert each letter to the plain 4.0 scale and average with credits. There is no reliable shortcut from the weighted total alone, because the same weighted GPA can be built from different grade mixes. The weighted GPA calculator reports both numbers from the same course list.',
      },
    ],
    related: [
      { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'Enter your courses and your school’s bonus points.' },
      { path: '/gpa-calculator/', label: 'GPA calculator', blurb: 'Semester and cumulative GPA on the 4.0 scale.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Percent to letter and GPA points.' },
      { path: '/high-school-gpa-calculator/', label: 'High school GPA calculator', blurb: 'Weighted and unweighted GPA, side by side.' },
      { path: '/grade-calculator/', label: 'Weighted grade calculator', blurb: 'Build a course percentage from every assessment.' },
    ],
  };
}

export function buildMissCalculatorPage(): ToolPageEntry {
  // The tool opens on a 25-question test; the written examples use odd sizes so they do not repeat the grading-scale chart pages.
  const total = 25;
  const std = buildMissTable(total, SCALE_STANDARD);
  const get = (l: string) => std.find((r) => r.letter === l)!;

  const exTotal = 28;
  const exStd = buildMissTable(exTotal, SCALE_STANDARD);
  const exPlus = buildMissTable(exTotal, SCALE_PLUS_MINUS);
  const exGet = (l: string) => exStd.find((r) => r.letter === l)!;
  const exPlusGet = (l: string) => exPlus.find((r) => r.letter === l)!;
  const pctAfter = (n: number, wrong: number) => roundTo(((n - wrong) / n) * 100, 1);

  const longTotal = 37;
  const longB = maxWrongForMinPercent(longTotal, 80)!;
  const bigTotal = 64;
  const bigC = maxWrongForMinPercent(bigTotal, 70)!;
  const roughA = Math.floor(exTotal * 0.1);

  return {
    slug: 'how-many-questions-can-i-miss',
    path: '/how-many-questions-can-i-miss/',
    navLabel: 'How many can I miss',
    h1: 'How Many Questions Can I Miss?',
    title: 'How Many Questions Can You Miss on a Test? Calculator',
    metaDescription:
      'Find the most questions you can get wrong on a test and still earn an A, B or C. Enter the number of questions and your target grade.',
    badge: 'Wrong answers allowed',
    intro: `Type in the length of the test and the grade you are aiming for, and the calculator names the largest number of wrong answers that still keeps that grade. ${aOrAn(total, true)} ${total}-question test on the usual 90/80/70/60 scale leaves room for ${get('A').maxWrong} misses at A level, ${get('B').maxWrong} at B level, ${get('C').maxWrong} at C level and ${get('D').maxWrong} at D level.`,
    keywords: [
      'how many questions can you miss',
      'how many questions can you get wrong',
      'how many can i miss on a test',
      'wrong answers allowed calculator',
      'how many wrong for an A',
    ],
    featureList: [
      'Any test size from 1 to 1000 questions',
      'Standard A–F and plus/minus scales',
      'Custom target percentage',
      'Table of the most you can miss for every grade',
    ],
    sections: [
      {
        heading: 'How the wrong-answer limit is worked out',
        paragraphs: [
          'Start with the score you would have after a given number of misses: correct answers divided by total questions, times 100, rounded to one decimal place. Keep adding one miss at a time until that rounded score slips under the minimum for your target grade. The last count that still cleared the bar is your limit.',
          'The rounding step matters because it is the figure printed on a score report. A raw 89.96% shows as 90.0%, so it counts as an A, which is the same rule the Quick Grade chart follows.',
        ],
      },
      {
        heading: 'Why the limit is always a whole number',
        paragraphs: [
          `Nobody can miss half a question, so the limit lands on the last whole miss that stays above the line, and the score at that point usually sits a little higher than the cutoff itself. On ${aOrAn(exTotal)} ${exTotal}-question quiz an A needs ${SCALE_STANDARD[0].min}%, yet the most you can miss is ${exGet('A').maxWrong}, which leaves ${exGet('A').percentAtMax}%. The gap between ${exGet('A').percentAtMax}% and ${SCALE_STANDARD[0].min}% is score you cannot spend.`,
          `The next miss costs a full step: ${exGet('A').maxWrong + 1} wrong would leave ${pctAfter(exTotal, exGet('A').maxWrong + 1)}% and drop the result a letter.`,
        ],
      },
      {
        heading: 'A rough way to estimate in your head',
        paragraphs: [
          `For an A on the 90% line, a tenth of the questions is a fair first guess: ${exTotal} questions suggests about ${roughA}. The exact answer from the calculator is ${exGet('A').maxWrong}, so the shortcut happens to agree here. It can be off by one when the tenth is not a clean number, which is why the exact figure is worth checking before a high-stakes exam.`,
        ],
      },
      {
        heading: 'Tests that do not weigh every question equally',
        paragraphs: [
          'This page assumes one point per question. A paper with a few heavy essay items and many one-mark items needs points instead of a head count: add up the marks you could lose and compare them with the points possible. The test grade calculator handles that case and also accepts bonus points.',
        ],
      },
      {
        heading: 'Turning the limit into a study plan',
        paragraphs: [
          'Treat the limit as a budget. If you are allowed four misses, you do not need to master every topic, but you do need to avoid spending that budget on material you could have learned. Many students rank the topics, secure the high-value ones first and accept that the weakest area may cost a miss or two.',
          'The limit is arithmetic, not a prediction. It tells you the margin on paper, and your teacher still decides the official grade, including any curve, rounding policy or partial credit.',
        ],
      },
    ],
    example: {
      heading: `Worked example: ${aOrAn(exTotal)} ${exTotal}-question quiz`,
      scenario: `With ${exTotal} questions, a single miss moves the score by ${roundTo(100 / exTotal, 2)} points. Here is the largest miss count that holds each grade on the A–F scale, followed by two plus/minus grades.`,
      rows: [
        ...exStd.map((r) => ({ label: `Hold ${/^[AEHILMNORSX]/i.test(r.letter) ? 'an' : 'a'} ${r.letter} (${r.min}%)`, value: `${r.maxWrong} wrong, ${r.percentAtMax}% left` })),
        { label: `Hold an A- (${exPlusGet('A-').min}%)`, value: `${exPlusGet('A-').maxWrong} wrong, ${exPlusGet('A-').percentAtMax}% left` },
        { label: `Hold a B+ (${exPlusGet('B+').min}%)`, value: `${exPlusGet('B+').maxWrong} wrong, ${exPlusGet('B+').percentAtMax}% left` },
      ],
      takeaway: `Going one past each limit costs a letter, so the room for an A on this quiz is only ${exGet('A').maxWrong} questions while the room for a C is ${exGet('C').maxWrong}.`,
    },
    faqs: [
      {
        question: `What is my wrong-answer allowance for a B on ${aOrAn(longTotal)} ${longTotal}-question exam?`,
        answer: `Multiply ${longTotal} by 0.20 and round down, then confirm with the rounded score. You can miss ${longB} and still hold ${pctAfter(longTotal, longB)}%. A single extra miss leaves ${pctAfter(longTotal, longB + 1)}%, which falls under the B line on the 90/80/70/60 scale.`,
      },
      {
        question: `If a paper has ${bigTotal} questions, how many can I get wrong and still reach a C?`,
        answer: `Up to ${bigC}. That leaves ${pctAfter(bigTotal, bigC)}% against a C minimum of 70%. Long papers give more breathing room because one wrong answer is worth only ${roundTo(100 / bigTotal, 2)} points.`,
      },
      {
        question: 'Why does the calculator allow fewer misses than my own estimate?',
        answer:
          'Most hand estimates skip the rounding step. The calculator rounds the score to one decimal first, then compares that displayed number with the cutoff, so a score that looks just short in your head may be a pass, and the reverse can also happen. Check your teacher’s rounding rule if the margin is one question.',
      },
      {
        question: 'Can I use it for a pass mark that is not a letter grade?',
        answer:
          'Yes. Pick Custom percentage and type the pass mark, for example 65. The result is the largest number of wrong answers that keeps the rounded score at or above that figure, which suits licensing tests and course entry exams.',
      },
      {
        question: 'Does a curve change how many I can miss?',
        answer:
          'A curve moves scores, not the arithmetic. If your instructor has announced a lower cutoff, enter it as a custom percentage. If marks are added after grading, estimate the curved score with the grade curve calculator first and then work backwards.',
      },
    ],
    related: [
      { path: '/grading-scale/', label: 'Grading scale charts', blurb: 'Printable charts for common test lengths.' },
      { path: '/grading-scale/25-questions/', label: '25-question chart', blurb: 'The full table for a test of exactly 25 items.' },
      { path: '/test-grade-calculator/', label: 'Test grade calculator', blurb: 'Use marks instead of a head count, with bonus points.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Turn a percentage into a letter and GPA points.' },
    ],
  };
}


/* ------------------------------------------------------------------ */
/* Semester GPA calculator page                                        */
/* ------------------------------------------------------------------ */

const SEMESTER_COURSES: (WeightedCourse & { name: string })[] = [
  { name: 'Biology', letter: 'A', credits: 4, level: 'regular' },
  { name: 'English Composition', letter: 'A-', credits: 3, level: 'regular' },
  { name: 'College Algebra', letter: 'B+', credits: 3, level: 'regular' },
  { name: 'World History', letter: 'B', credits: 3, level: 'regular' },
  { name: 'Intro Psychology', letter: 'A', credits: 2, level: 'regular' },
];
const semesterResult = calculateWeightedGpa(SEMESTER_COURSES, DEFAULT_BONUS)!;
const semesterPoints = SEMESTER_COURSES.reduce((a, c) => a + (pointsForLetter(c.letter) ?? 0) * c.credits, 0);

export function buildSemesterGpaPage(): ToolPageEntry {
  return {
    slug: 'semester-gpa-calculator',
    path: '/semester-gpa-calculator/',
    navLabel: 'Semester GPA calculator',
    h1: 'Semester GPA Calculator',
    title: 'Semester GPA Calculator — One Semester, 4.0 Scale',
    metaDescription:
      'Free semester GPA calculator: enter this semester’s courses, grades and credits to get your semester GPA on the 4.0 scale, with quality points shown.',
    badge: 'Semester GPA',
    intro: `Your semester GPA is the credit-weighted average of one semester’s grades on the 4.0 scale. Add each course with its grade and credits and the calculator does the quality-points maths for you. Example: five courses totalling ${semesterResult.totalCredits} credits give a semester GPA of ${semesterResult.unweighted.toFixed(2)}.`,
    keywords: [
      'semester gpa calculator',
      'calculate semester gpa',
      'term gpa calculator',
      'gpa calculator for one semester',
      'semester grade point average',
    ],
    featureList: [
      'Letter grades on the full plus/minus scale',
      'Credit-weighted quality points, shown in the result',
      'Add up to 20 courses',
      'Your courses are saved on this device only',
      'Runs in your browser, nothing is uploaded',
    ],
    sections: [
      {
        heading: 'How to calculate your semester GPA',
        paragraphs: [
          'Convert each letter grade to grade points (A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0 and so on), multiply by the course credits to get quality points, add the quality points together and divide by the total credits. That is the whole formula: semester GPA = total quality points ÷ total credits.',
        ],
        bullets: [
          'Use final semester grades, not midterm estimates, for an official-style result.',
          'Credits matter: a 4-credit course moves your GPA more than a 1-credit course with the same grade.',
          'Courses graded pass/fail are normally excluded from GPA. Leave them out here too.',
          'Repeated courses follow your school’s policy: some replace the first grade, some average both. Follow your catalog.',
        ],
      },
      {
        heading: 'Semester GPA vs cumulative GPA',
        paragraphs: [
          'The semester GPA covers one term only. Your cumulative GPA combines every semester, weighted by credits, and it moves more slowly as you accumulate credits: one strong semester lifts a first-year cumulative a lot and a final-year cumulative only a little.',
          'To see where a semester leaves your overall record, use the cumulative GPA calculator with your previous GPA and credits.',
        ],
      },
      {
        heading: 'What semester GPA do you need?',
        paragraphs: [
          'Work backwards from your goal. If your cumulative GPA is below your target, the semester GPA you need is higher than the target, because the new credits are averaged with everything before them. The cumulative calculator shows the combined result for any semester GPA you try, so you can test targets before the semester starts.',
        ],
      },
      {
        heading: 'Incompletes and deferred grades',
        paragraphs: [
          'An incomplete, usually shown as an I on a transcript, is not a grade yet — it is a deadline. Most schools exclude an incomplete from the GPA until the work is finished, and the course only enters the average once a real letter replaces it. The risk is the lapse rule: if the work is not completed by the school’s deadline, the incomplete often converts to an F automatically, and from that moment it counts like any other failing grade. If you carry an incomplete, leave the course out of this calculator until it resolves, and confirm the lapse date with your instructor in writing.',
        ],
      },
      {
        heading: 'Midterm grades are not your semester GPA',
        paragraphs: [
          'Midterm grades are progress reports, and at most schools they never reach the transcript. They are useful warnings — a midterm C tells you where the semester is heading — but they carry no credits and no grade points, so they cannot be averaged into a semester GPA. The common mistake is to enter midterm letters here and treat the result as official; wait for final grades, or label any midterm-based figure clearly as a projection. If your school does record midterm grades on the transcript, it will say so in the catalog, and that is the exception, not the rule.',
        ],
      },
      {
        heading: 'Reading a semester GPA on a transcript',
        paragraphs: [
          'A transcript usually prints two numbers per term: the term GPA for that semester and the cumulative GPA to date. The term GPA is exactly what this calculator computes. The cumulative figure next to it is the running average across all terms, and the two can differ sharply — a strong term after a weak start lifts the term GPA a lot and the cumulative only a little. Transcripts also separate attempted hours from earned hours, so a withdrawn course may appear in attempted hours without contributing grade points. When a transcript number disagrees with this calculator, the usual causes are a repeated course handled differently, a pass/fail course included or excluded, or rounding to two decimals.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: a five-course semester',
      scenario: `Five courses, ${semesterResult.totalCredits} credits in total. Quality points are grade points × credits.`,
      rows: [
        ...SEMESTER_COURSES.map((c) => ({
          label: `${c.name}: ${c.letter}, ${c.credits} credits`,
          value: `${((pointsForLetter(c.letter) ?? 0) * c.credits).toFixed(1)} quality points`,
        })),
        { label: 'Total quality points', value: semesterPoints.toFixed(1) },
        { label: 'Semester GPA', value: semesterResult.unweighted.toFixed(2) },
      ],
      takeaway: `${semesterPoints.toFixed(1)} quality points ÷ ${semesterResult.totalCredits} credits = ${semesterResult.unweighted.toFixed(2)}. The 4-credit A in Biology does more work than any other course on the list.`,
    },
    faqs: [
      {
        question: 'How do I calculate my semester GPA?',
        answer:
          'Turn each grade into 4.0-scale points, multiply by the course credits, add those quality points and divide by the total credits. The calculator above does each step for up to 20 courses.',
      },
      {
        question: 'Do pass/fail courses count in semester GPA?',
        answer:
          'Usually not. Pass/fail courses normally earn credits without grade points, so they are excluded from both the quality points and the credit total in the GPA formula. Check your school’s policy, then leave those courses out of the calculator.',
      },
      {
        question: 'Is a 3.5 semester GPA good?',
        answer:
          'A 3.5 is a B+/A- average and sits comfortably above the 3.0 that many scholarships, athletic eligibility rules and good-standing policies require. Whether it helps your cumulative GPA depends on the GPA and credit total you started the semester with.',
      },
      {
        question: 'Does this calculator save my courses?',
        answer:
          'Yes, on this device only, in your browser. Nothing is uploaded. Clearing your browser’s site data removes the saved courses.',
      },
      {
        question: 'Do midterm grades affect my GPA?',
        answer:
          'At most schools, no. Midterm grades are progress reports that do not reach the transcript and carry no grade points, so they are not averaged into a semester GPA. Use final grades here for an official-style result, and treat any midterm-based figure as a projection.',
      },
      {
        question: 'Why is my transcript GPA different from this calculator?',
        answer:
          'The usual causes are a repeated course handled under a different policy, a pass/fail course included or excluded, a course the school weights differently, or rounding to two decimals. If none of those explains it, compare the transcript’s attempted and earned hours against the courses you entered — a missing or extra course is the most common cause.',
      },
      {
        question: 'Can I use this calculator for quarter-system schools?',
        answer:
          'Yes — the formula is identical, because a quarter GPA is also quality points divided by credits. The only difference is the credit unit: quarter credits are smaller than semester credits, roughly two-thirds of one, so a 5-credit quarter course converts to about 3.33 semester credits for transfer. Within one quarter, though, just enter the quarter courses and quarter credits as they are.',
      },
      {
        question: 'What is a term GPA? Is it the same as a semester GPA?',
        answer:
          'Term GPA is the general name for exactly this figure — the GPA of one academic term, whether that term is a semester, a quarter or a trimester. Semester GPA is the same calculation with the term named. If your school runs quarters, your term GPA is your quarter GPA, computed the same way.',
      },
    ],
    related: [
      { path: '/cumulative-gpa-calculator/', label: 'Cumulative GPA calculator', blurb: 'Add this semester to your previous GPA.' },
      { path: '/gpa-calculator/', label: 'GPA calculator', blurb: 'The full GPA tool with semester and cumulative modes.' },
      { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'Add honors and AP/IB bonus points.' },
      { path: '/letter-grade-calculator/', label: 'Letter grade calculator', blurb: 'Percent to letter and GPA points.' },
      { path: '/high-school-gpa-calculator/', label: 'High school GPA calculator', blurb: 'Weighted and unweighted GPA, side by side.' },
      { path: '/college-gpa-calculator/', label: 'College GPA calculator', blurb: 'Credit-weighted GPA for college courses.' },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Cumulative GPA calculator page                                      */
/* ------------------------------------------------------------------ */

const CUM_PREV_GPA = 3.4;
const CUM_PREV_CREDITS = 60;
const CUM_SEM_GPA = 3.8;
const CUM_SEM_CREDITS = 15;
const cumCombined = roundTo((CUM_PREV_GPA * CUM_PREV_CREDITS + CUM_SEM_GPA * CUM_SEM_CREDITS) / (CUM_PREV_CREDITS + CUM_SEM_CREDITS), 2);

export function buildCumulativeGpaPage(): ToolPageEntry {
  return {
    slug: 'cumulative-gpa-calculator',
    path: '/cumulative-gpa-calculator/',
    navLabel: 'Cumulative GPA calculator',
    h1: 'Cumulative GPA Calculator',
    title: 'Cumulative GPA Calculator — Add a Semester to Your GPA',
    metaDescription:
      'Free cumulative GPA calculator: combine your previous GPA and credits with this semester’s GPA to see your new cumulative GPA, and test the GPA you need.',
    badge: 'Cumulative GPA',
    intro: `Your cumulative GPA is every semester combined, weighted by credits. Enter your current cumulative GPA and credits plus this semester’s GPA and credits to see the new total. Example: a ${CUM_PREV_GPA.toFixed(1)} over ${CUM_PREV_CREDITS} credits plus a ${CUM_SEM_GPA.toFixed(1)} semester of ${CUM_SEM_CREDITS} credits gives a cumulative GPA of ${cumCombined.toFixed(2)}.`,
    keywords: [
      'cumulative gpa calculator',
      'calculate cumulative gpa',
      'overall gpa calculator',
      'gpa needed calculator',
      'raise my gpa calculator',
    ],
    featureList: [
      'Combines previous GPA and this semester by credits',
      'Test any semester GPA to plan a target',
      'Works for high school and college credit totals',
      'Runs in your browser, nothing is uploaded',
    ],
    sections: [
      {
        heading: 'How cumulative GPA is calculated',
        paragraphs: [
          'A cumulative GPA is a credit-weighted average of everything you have completed. The formula is: (previous GPA × previous credits + semester GPA × semester credits) ÷ total credits. Credits are the weights, which is why a semester moves the cumulative less and less as your credit total grows.',
          'If you know your quality points instead, the same idea applies directly: cumulative GPA = total quality points ÷ total credits, across all semesters.',
        ],
      },
      {
        heading: 'What GPA do I need this semester?',
        paragraphs: [
          'Rearrange the same formula. The semester GPA you need = (target cumulative GPA × total credits after this semester − previous GPA × previous credits) ÷ this semester’s credits.',
          `Example: with ${CUM_PREV_CREDITS} credits at ${CUM_PREV_GPA.toFixed(1)} and ${CUM_SEM_CREDITS} credits this semester, reaching a 3.50 cumulative needs a semester GPA of ${roundTo((3.5 * (CUM_PREV_CREDITS + CUM_SEM_CREDITS) - CUM_PREV_GPA * CUM_PREV_CREDITS) / CUM_SEM_CREDITS, 2).toFixed(2)}. If the number the formula asks for is above 4.0, the target cannot be reached in one semester and needs to be spread over more credits.`,
        ],
      },
      {
        heading: 'Why cumulative GPA moves slowly',
        paragraphs: [
          'After 60 credits, a 15-credit semester is only a fifth of your record, so even a perfect 4.0 semester moves the cumulative by a fraction of the gap. That is not a flaw in the maths: it is what makes a cumulative GPA a stable record. It also means early semesters carry unusual weight, and that a realistic multi-semester plan beats a single heroic term.',
        ],
      },
    ],
    example: {
      heading: 'Worked example: adding a semester',
      scenario: `Previous record: ${CUM_PREV_CREDITS} credits at a ${CUM_PREV_GPA.toFixed(1)} cumulative GPA. This semester: ${CUM_SEM_CREDITS} credits at ${CUM_SEM_GPA.toFixed(1)}.`,
      rows: [
        { label: 'Previous quality points', value: (CUM_PREV_GPA * CUM_PREV_CREDITS).toFixed(0) },
        { label: 'Semester quality points', value: (CUM_SEM_GPA * CUM_SEM_CREDITS).toFixed(0) },
        { label: 'Total credits', value: String(CUM_PREV_CREDITS + CUM_SEM_CREDITS) },
        { label: 'New cumulative GPA', value: cumCombined.toFixed(2) },
      ],
      takeaway: `A ${CUM_SEM_GPA.toFixed(1)} semester lifts the cumulative from ${CUM_PREV_GPA.toFixed(2)} to ${cumCombined.toFixed(2)}: a gain of ${roundTo(cumCombined - CUM_PREV_GPA, 2).toFixed(2)} from ${CUM_SEM_CREDITS} credits against a ${CUM_PREV_CREDITS}-credit base.`,
    },
    faqs: [
      {
        question: 'How do I calculate my cumulative GPA?',
        answer:
          'Multiply your previous cumulative GPA by your previous credits, multiply this semester’s GPA by its credits, add the two results and divide by the combined credits. The calculator above does it in one step.',
      },
      {
        question: 'What GPA do I need to raise my cumulative GPA to a target?',
        answer:
          'Needed semester GPA = (target × total credits after the semester − previous GPA × previous credits) ÷ this semester’s credits. If the result is above 4.0, the target is out of reach this semester and has to be spread over more credits. Try values in the calculator to see the combined result directly.',
      },
      {
        question: 'Does a repeated course replace the old grade in cumulative GPA?',
        answer:
          'It depends on your school. Many colleges replace the first attempt’s grade in the GPA while keeping both attempts on the transcript; others average the attempts. Your catalog’s grade replacement policy decides, so compute your official number their way.',
      },
      {
        question: 'Can cumulative GPA go down?',
        answer:
          'Yes. Any semester below your current cumulative average pulls it down, by an amount that depends on the credit share of the new semester. The same formula shows the drop before it happens, which is useful for testing worst cases.',
      },
    ],
    related: [
      { path: '/semester-gpa-calculator/', label: 'Semester GPA calculator', blurb: 'Work out one semester from its courses.' },
      { path: '/gpa-calculator/', label: 'GPA calculator', blurb: 'The full GPA tool with semester and cumulative modes.' },
      { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'Add honors and AP/IB bonus points.' },
      { path: '/final-exam-grade-calculator/', label: 'Final exam calculator', blurb: 'Find the exam score you need for your target grade.' },
      { path: '/final-grade-planner/', label: 'Final grade planner', blurb: 'What every class needs on its final exam.' },
      { path: '/college-gpa-calculator/', label: 'College GPA calculator', blurb: 'Credit-weighted GPA for college courses.' },
    ],
  };
}
