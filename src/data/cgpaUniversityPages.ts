import { CGPA_UNIVERSITIES } from './cgpaUniversities';
import type { ToolPageEntry } from './toolPages';

/**
 * One indexable page per verified university CGPA formula. Only entries the
 * tool marks verified (verified: true) get a page, and the generic "normal"
 * standard formula is excluded — it is not a university and is already
 * covered by the CGPA tool itself. Unverified institutions stay in the tool
 * with their transparent estimate and get no page, so no page can present an
 * estimate as an ordinance.
 *
 * Every number on these pages is computed with the university's own
 * compute()/inverse() functions from cgpaUniversities.ts.
 */

const EXAMPLE_CGPAS = [8.5, 9.0, 7.5];

export const CGPA_UNIVERSITY_PAGES = CGPA_UNIVERSITIES.filter(
  (u) => u.verified && u.id !== 'normal',
);

function shortName(name: string): string {
  // "VTU (Visvesvaraya Technological University)" -> "VTU"
  const m = /^([^(]+?)\s*\(/.exec(name);
  return (m ? m[1] : name).trim();
}

/**
 * Compact name for titles and meta descriptions, which the launch checks cap
 * at 65 / 175 characters. A short all-caps abbreviation in parentheses wins
 * ("Banaras Hindu University (BHU)" -> "BHU"); otherwise the pre-parenthesis
 * text is used ("Delhi University (DU - NEP 2022 Onward)" -> "Delhi University").
 */
function titleShort(name: string): string {
  const abbr = /\(([A-Z]{2,8})\)/.exec(name);
  if (abbr) return abbr[1];
  return shortName(name);
}

/** Parenthetical descriptor, e.g. "Engineering" from "(Engineering — 2015–16 Onward)". */
function descriptor(name: string): string {
  const m = /\(([^)]+)\)/.exec(name);
  if (!m) return '';
  return m[1].split(/[—-]/)[0].trim();
}

export function buildCgpaUniversityPages(): ToolPageEntry[] {
  return CGPA_UNIVERSITY_PAGES.map((uni) => {
    const short = shortName(uni.name);
    const compact = titleShort(uni.name);
    const idWords = uni.id.replace(/-/g, ' ');
    const ex85 = uni.compute(8.5);
    const examples = EXAMPLE_CGPAS.map((cgpa) => ({
      label: `${cgpa.toFixed(1)} CGPA`,
      value: `${uni.compute(cgpa).toFixed(2)}%`,
    }));
    // Titles are capped at 65 characters by the launch checks. The compact
    // name plus formula fits everywhere except piecewise formulas, where the
    // parenthetical descriptor keeps the title short and distinct instead.
    let title = `${compact} CGPA to Percentage — ${uni.formulaLabel}`;
    if (title.length > 65) {
      const desc = descriptor(uni.name);
      title = desc
        ? `${compact} (${desc}) CGPA to Percentage`
        : `${compact} CGPA to Percentage`;
    }
    const metaName = compact;
    // Launch checks require descriptions of 100–175 characters, measured on
    // the rendered attribute — so the meta text must contain no character
    // that HTML-escapes longer (the piecewise formula's "<" became "&lt;").
    // The Mumbai Engineering formula is therefore written out in words here.
    const metaFormula =
      uni.id === 'mumbai-university-eng'
        ? 'CGPA 7 or above: 7.4 times CGPA plus 12; below 7: 7.1 times CGPA plus 12'
        : uni.formulaLabel;
    // Threshold 170, not 175, leaves margin for any escaping.
    const longMeta = `${metaName} CGPA to percentage: ${metaFormula}. For example, 8.5 CGPA = ${ex85.toFixed(2)}%. Free converter with the university's formula.`;
    const metaDescription =
      longMeta.length <= 170
        ? longMeta
        : `${metaName} CGPA to percentage: ${metaFormula}. For example, 8.5 CGPA = ${ex85.toFixed(2)}%. Free converter.`;
    return {
      slug: `cgpa-to-percentage/${uni.id}`,
      path: `/cgpa-to-percentage/${uni.id}/`,
      navLabel: `${short} CGPA to %`,
      h1: `${uni.name} CGPA to Percentage`,
      title,
      metaDescription,
      badge: 'CGPA conversion',
      intro: `${uni.name} converts CGPA to percentage with the formula ${uni.formulaLabel}. Enter any CGPA below and the converter applies exactly that formula — for example, 8.5 CGPA gives ${ex85.toFixed(2)}%. ${uni.sourceNote}`,
      keywords: [
        `${idWords} cgpa to percentage`,
        `${short.toLowerCase()} cgpa to percentage`,
        `${uni.name.toLowerCase()} cgpa to percentage`,
        'cgpa to percentage',
      ],
      featureList: [
        `The university’s own formula: ${uni.formulaLabel}`,
        'Any CGPA from 0 to 10, converted instantly',
        'Inverse check: percentage back to CGPA',
        'Free, no sign-up, nothing uploaded',
      ],
      sections: [
        {
          heading: `What is the ${short} CGPA to percentage formula?`,
          paragraphs: [
            `The formula is ${uni.formulaLabel}. ${uni.sourceNote}`,
            'Apply it directly: subtract, multiply or scale exactly as written, and the result is the percentage. The converter below does that arithmetic for any CGPA you enter, so a single formula covers every score from 0 to 10.',
          ],
        },
        {
          heading: 'How to use this conversion',
          paragraphs: [
            'Enter your CGPA as printed on your marks card — usually to two decimal places — and read the percentage. If a form asks for CGPA instead of percentage, use the inverse check in the result: it converts the percentage back to CGPA with the same ordinance, so the two directions always agree.',
          ],
          bullets: [
            'Use the CGPA exactly as your university prints it; do not round it first.',
            'Percentages above 100 are capped at 100, and negative results at 0, by the formula itself.',
            'For an official transcript, confirm the current ordinance with the university — ordinances change, and the note above states the source this page follows.',
          ],
        },
      ],
      example: {
        heading: `Worked example: ${short} CGPA to percentage`,
        scenario: `Three CGPA values converted with ${uni.formulaLabel}.`,
        rows: examples,
        takeaway: `The same formula covers every score: change the CGPA and the percentage follows ${uni.formulaLabel}.`,
      },
      faqs: [
        {
          question: `What is the ${short} CGPA to percentage formula?`,
          answer: `The formula is ${uni.formulaLabel}. ${uni.sourceNote}`,
        },
        {
          question: `What percentage is 8.5 CGPA at ${short}?`,
          answer: `8.5 CGPA converts to ${ex85.toFixed(2)}% at ${uni.name} using ${uni.formulaLabel}.`,
        },
        {
          question: `How do I convert a percentage back to ${short} CGPA?`,
          answer: `Use the inverse of the same formula in the converter’s result check, or use the main CGPA to percentage calculator with the ${uni.name} option selected.`,
        },
        {
          question: 'My university is not listed here. What should I use?',
          answer:
            `Use the main CGPA to percentage calculator: it covers more institutions, and where an institution has no verified ordinance it says so and falls back transparently to the standard × 9.5 estimate instead of presenting a guess as a rule. For ${uni.name}, the verified formula on this page is ${uni.formulaLabel}.`,
        },
      ],
      faqHeading: {
        eyebrow: 'CGPA conversion FAQs',
        title: `${short} CGPA questions`,
        description: `The ${uni.name} formula, worked examples, and what to do when a university is not listed.`,
        ctaText: `Convert ${short} CGPA`,
      },
      related: [
        { path: '/cgpa-to-percentage-calculator/', label: 'CGPA to percentage calculator', blurb: 'Every university and scale in one converter.' },
        { path: '/gpa-converter/', label: 'GPA converter', blurb: 'SGPA, CGPA, percentage and 4.0 GPA in one place.' },
        { path: '/semester-gpa-calculator/', label: 'Semester GPA calculator', blurb: 'One semester of courses, grades and credits.' },
        { path: '/cumulative-gpa-calculator/', label: 'Cumulative GPA calculator', blurb: 'Combine semesters into one cumulative GPA.' },
        { path: '/college-gpa-calculator/', label: 'College GPA calculator', blurb: 'Credit-weighted GPA for college courses.' },
      ],
    };
  });
}
