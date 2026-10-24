import type { ToolPageEntry } from './toolPages';

/**
 * /for-schools/ — the free embed programme. Schools place a calculator on their own site with the
 * configurator above (ForSchoolsEmbedTool); the credit line under every embed links back here.
 * Embeds load the tool pages with ?embed=1, which renders a chrome-free view (App.tsx + index.css).
 */
export function buildForSchoolsPage(): ToolPageEntry {
  return {
    slug: 'for-schools',
    path: '/for-schools/',
    navLabel: 'For schools',
    h1: 'Free Grade Calculators for Your School Website',
    title: 'Embed Free Grade Calculators — For Schools',
    metaDescription:
      'Add a free EZ Grader or GPA calculator to your school website. No ads in the tool, no sign-up, nothing uploaded. Copy the embed code and paste it in.',
    badge: 'For schools & districts',
    intro:
      'Add a free EZ Grader chart or GPA calculator to your school, district or classroom website in about two minutes. No ads inside the calculator, no sign-up for students, and nothing anyone types is uploaded: every calculation runs in the visitor’s own browser. Pick a calculator above, copy the code, and paste it into any page.',
    keywords: [
      'embed grade calculator',
      'ez grader for school website',
      'free calculators for schools',
      'gpa calculator widget',
      'grade calculator for school website',
    ],
    featureList: [
      'Free for schools, districts, teachers and PTAs — no licence fee, ever',
      'No ads inside the embedded calculator',
      'No sign-up and no student data collected: calculations run on the visitor’s device',
      'Accessible, keyboard-friendly and works on school Chromebooks',
      'Poster text and a newsletter blurb included, ready to announce it',
    ],
    sections: [
      {
        heading: 'How to add the calculator to your site',
        paragraphs: [
          'Choose the calculator and width in the configurator above and copy the code it gives you. Paste it into your website editor where an “embed” or “HTML” block is available: most school website platforms (Google Sites, WordPress, Wix, Squarespace, Schoology and Canvas pages) accept it directly.',
        ],
        bullets: [
          'In Google Sites: Insert → Embed → Embed code, paste, and set the height the configurator suggests.',
          'In WordPress: add a Custom HTML block and paste the code.',
          'In Canvas or Schoology: switch the page editor to HTML view and paste where the tool should appear.',
          'The embedded view shows only the calculator — no menus or site navigation — and adapts to phones and Chromebooks.',
        ],
      },
      {
        heading: 'The free licence, in plain language',
        paragraphs: [
          'You may embed these calculators on any school, district, classroom or PTA website, free of charge, for as long as you like. The small credit line that appears under the embed (“by Easy Grade Tool”) must stay in place: it is the whole price of the licence.',
          'You may not resell the embed, place it on a page that exists mainly to sell products, or remove or hide the credit line. If you need the credit line styled differently to match your site, keep the same words and links and adjust only colours and size.',
        ],
      },
      {
        heading: 'Privacy: what happens to grades typed into the embed',
        paragraphs: [
          'Nothing leaves the visitor’s device. The calculators run entirely in the browser, send no grades, names or scores to any server, and set no tracking cookies of their own. Settings a visitor chooses (such as a grading scale) are remembered only in their own browser. That makes the embed safe to offer on pages students use without accounts.',
        ],
      },
      {
        heading: 'Which calculator should you embed?',
        paragraphs: [
          'For a teacher resources or homework-help page, the EZ Grader chart is the most-used: it answers “what grade is X out of Y?” for a whole class at a glance. For a counselling or college-planning page, choose the weighted GPA calculator or the semester GPA calculator. The grade curve calculator suits department and teacher pages.',
        ],
      },
    ],
    example: {
      heading: 'What your page will show',
      scenario: 'Every embed loads the live calculator, already working, inside a rounded frame on your page.',
      rows: [
        { label: 'Cost', value: 'Free' },
        { label: 'Setup time', value: 'About 2 minutes' },
        { label: 'Accounts for students', value: 'None' },
        { label: 'Ads inside the tool', value: 'None' },
        { label: 'Data collected', value: 'None' },
      ],
      takeaway: 'If you can paste text into your site editor, you can have a working grade calculator on your school website today.',
    },
    faqs: [
      {
        question: 'Is the embed really free for schools?',
        answer:
          'Yes. Schools, districts, teachers and PTAs may embed the calculators free of charge, with no time limit. The only condition is that the credit line under the embed stays in place and visible.',
      },
      {
        question: 'Does the embedded calculator collect student data?',
        answer:
          'No. All calculations run in the visitor’s browser. No grades, names or scores are sent to Easy Grade Tool or anyone else, and the embed sets no tracking cookies of its own.',
      },
      {
        question: 'Can I remove the “by Easy Grade Tool” credit line?',
        answer:
          'No — the credit line is the licence condition for free use. You may restyle its colour and size to fit your site, but the words and the links must remain.',
      },
      {
        question: 'The embed does not appear on our site. What should we check?',
        answer:
          'Most school platforms require the code to be pasted into an Embed, HTML or iframe block rather than the normal text editor, and some district-managed sites block outside embeds entirely. Ask your webmaster to allow iframes from www.easygradetool.com. If it still fails, email support@easygradetool.com with your page address and we will help.',
      },
      {
        question: 'Can we embed more than one calculator?',
        answer:
          'Yes. Run the configurator once per calculator and place each embed on the page where it fits best. There is no limit for school sites.',
      },
    ],
    related: [
      { path: '/grading-scale/', label: 'Grading scale charts', blurb: 'Printable EZ Grader charts for common test lengths.' },
      { path: '/weighted-gpa-calculator/', label: 'Weighted GPA calculator', blurb: 'The most-embedded calculator for counselling pages.' },
      { path: '/blog/', label: 'Grading guides & blog', blurb: 'How-to articles your teachers and students can read next.' },
      { path: '/about/', label: 'About & methodology', blurb: 'Who builds these tools and how the maths is checked.' },
    ],
  };
}
