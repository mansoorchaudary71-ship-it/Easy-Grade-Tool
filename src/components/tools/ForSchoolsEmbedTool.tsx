import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { BTN_PRIMARY, CARD, INPUT, LABEL } from './ui';

const ORIGIN = 'https://www.easygradetool.com';

interface EmbedChoice {
  key: string;
  label: string;
  path: string;
  linkText: string;
  height: number;
}

const CHOICES: EmbedChoice[] = [
  { key: 'ez-grader', label: 'EZ Grader chart (25 questions)', path: '/grading-scale/25-questions/', linkText: 'EZ Grader Chart', height: 720 },
  { key: 'weighted-gpa', label: 'Weighted GPA calculator', path: '/weighted-gpa-calculator/', linkText: 'Weighted GPA Calculator', height: 760 },
  { key: 'semester-gpa', label: 'Semester GPA calculator', path: '/semester-gpa-calculator/', linkText: 'Semester GPA Calculator', height: 720 },
  { key: 'grade-curve', label: 'Grade curve calculator', path: '/grade-curve-calculator/', linkText: 'Grade Curve Calculator', height: 760 },
  { key: 'test-grade', label: 'Test grade calculator', path: '/test-grade-calculator/', linkText: 'Test Grade Calculator', height: 720 },
];

const WIDTHS = [
  { key: 'responsive', label: 'Responsive (100%)', css: '100%' },
  { key: '720', label: 'Fixed 720px', css: '720px' },
  { key: '560', label: 'Fixed 560px', css: '560px' },
];

export const ForSchoolsEmbedTool: React.FC = () => {
  const [choiceKey, setChoiceKey] = useState('ez-grader');
  const [widthKey, setWidthKey] = useState('responsive');
  const [school, setSchool] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  // The preview iframe src is set only after mount, so the prerendered page contains no
  // crawlable ?embed=1 URL (avoids a parameterized duplicate of the chart page in indexes).
  const [previewOn, setPreviewOn] = useState(false);
  useEffect(() => {
    setPreviewOn(true);
  }, []);

  const choice = CHOICES.find((c) => c.key === choiceKey) ?? CHOICES[0];
  const width = WIDTHS.find((w) => w.key === widthKey) ?? WIDTHS[0];
  const schoolName = school.trim();

  const embedCode = useMemo(() => {
    const title = schoolName ? `${choice.linkText} — ${schoolName}` : choice.linkText;
    return [
      `<iframe src="${ORIGIN}${choice.path}?embed=1" width="${width.css}" height="${choice.height}" style="border:1px solid #e5e7eb;border-radius:12px;max-width:720px" loading="lazy" title="${title}"></iframe>`,
      `<p><a href="${ORIGIN}${choice.path}">${choice.linkText}</a> by <a href="${ORIGIN}/">Easy Grade Tool</a></p>`,
    ].join('\n');
  }, [choice, width, schoolName]);

  const posterText = useMemo(
    () =>
      `${choice.linkText} — free on our website${schoolName ? ` (${schoolName})` : ''}\n\nWork out grades in seconds with the free ${choice.linkText} from Easy Grade Tool.\nNo sign-up, no ads in the tool, and nothing you type is uploaded.\nTry it here: ${ORIGIN}${choice.path}`,
    [choice, schoolName],
  );

  const blurbText = useMemo(
    () =>
      `Free grading tool for our school community: the ${choice.linkText} from Easy Grade Tool (${ORIGIN}${choice.path}) works in any browser, needs no account, and calculates everything on your own device, so no grades are ever uploaded.`,
    [choice],
  );

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
    } catch {
      setCopied(null);
    }
  };

  const copyBtn = (key: string, text: string, label: string) => (
    <button type="button" onClick={() => copy(key, text)} className={BTN_PRIMARY}>
      {copied === key ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
      <span>{copied === key ? 'Copied' : label}</span>
    </button>
  );

  const SELECT = `${INPUT} appearance-auto cursor-pointer`;
  const CODEBOX =
    'w-full bg-[#F7F4EF] dark:bg-slate-800 border-2 border-transparent text-stone-900 dark:text-white rounded-2xl px-4 py-3 font-mono text-sm break-all';

  return (
    <div className="space-y-6">
      <section aria-label="Embed configurator" className={`${CARD} space-y-6 print:hidden`}>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="fs-tool" className={LABEL}>Calculator</label>
            <select id="fs-tool" className={SELECT} value={choiceKey} onChange={(e) => setChoiceKey(e.target.value)}>
              {CHOICES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fs-width" className={LABEL}>Width</label>
            <select id="fs-width" className={SELECT} value={widthKey} onChange={(e) => setWidthKey(e.target.value)}>
              {WIDTHS.map((w) => <option key={w.key} value={w.key}>{w.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fs-school" className={LABEL}>School name (optional)</label>
            <input id="fs-school" className={INPUT} type="text" value={school} placeholder="e.g. Lincoln High School"
              onChange={(e) => setSchool(e.target.value)} autoComplete="organization" />
          </div>
        </div>

        <div>
          <label htmlFor="fs-code" className={LABEL}>Your embed code</label>
          <textarea id="fs-code" className={`${CODEBOX} text-left`} rows={4} readOnly value={embedCode} onFocus={(e) => e.target.select()} />
          <div className="mt-3">{copyBtn('embed', embedCode, 'Copy embed code')}</div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 m-0">
            Paste the code into any page on your school, district or classroom website. The embedded view shows only the calculator, with no site navigation. The small credit line under it is part of the free licence.
          </p>
        </div>
      </section>

      <section aria-label="Live preview" className={`${CARD} space-y-4 print:hidden`}>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white m-0">Live preview</h2>
        <iframe
          src={previewOn ? `${choice.path}?embed=1` : undefined}
          width="100%"
          height={choice.height}
          style={{ border: '1px solid #e5e7eb', borderRadius: 12, maxWidth: 720 }}
          loading="lazy"
          title={`${choice.linkText} preview`}
        />
      </section>

      <section aria-label="Announcement kit" className={`${CARD} space-y-6 print:hidden`}>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white m-0">Announce it: poster and newsletter text</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 m-0 mt-1">Ready-made wording for a classroom poster, school newsletter or parent email.</p>
        </div>
        <div>
          <label htmlFor="fs-poster" className={LABEL}>Poster / noticeboard text</label>
          <textarea id="fs-poster" className={`${CODEBOX} text-left whitespace-pre-wrap`} rows={5} readOnly value={posterText} onFocus={(e) => e.target.select()} />
          <div className="mt-3">{copyBtn('poster', posterText, 'Copy poster text')}</div>
        </div>
        <div>
          <label htmlFor="fs-blurb" className={LABEL}>Newsletter blurb</label>
          <textarea id="fs-blurb" className={`${CODEBOX} text-left whitespace-pre-wrap`} rows={4} readOnly value={blurbText} onFocus={(e) => e.target.select()} />
          <div className="mt-3">{copyBtn('blurb', blurbText, 'Copy newsletter blurb')}</div>
        </div>
      </section>
    </div>
  );
};

export default ForSchoolsEmbedTool;
