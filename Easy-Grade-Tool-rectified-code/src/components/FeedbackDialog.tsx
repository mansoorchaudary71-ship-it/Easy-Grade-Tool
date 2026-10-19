import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, Loader2, Send, X } from 'lucide-react';
import { CONTACT_EMAIL } from '../data/constants';
import { submitForm } from '../utils/formSubmit';
import { useDialogA11y } from '../utils/useDialogA11y';

export type FeedbackKind = 'contact' | 'report-issue' | 'suggest-feature';

interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea';
  placeholder?: string;
  autoComplete?: string;
  options?: Array<{ value: string; label: string }>;
  /** Two short fields share one row from the sm breakpoint up. */
  half?: boolean;
  /** Kept after a successful send (name, email, dropdowns). Everything else is cleared. */
  sticky?: boolean;
}

interface FormConfig {
  title: string;
  submitLabel: string;
  successToast: string;
  defaultSuccess: string;
  initial: Record<string, string>;
  fields: FieldDef[];
  validate: (v: Record<string, string>) => string | null;
  toPayload: (v: Record<string, string>) => Record<string, unknown>;
}

const opts = (...values: string[]) => values.map((v) => ({ value: v, label: v }));

const CONFIGS: Record<FeedbackKind, FormConfig> = {
  contact: {
    title: 'Contact & feedback',
    submitLabel: 'Send message',
    successToast: 'Message sent successfully!',
    defaultSuccess: 'Thank you! Your message was sent to our team.',
    initial: { name: '', email: '', subject: 'General Feedback', message: '' },
    fields: [
      { name: 'name', label: 'Name (optional)', type: 'text', placeholder: 'e.g. Alex Chen', autoComplete: 'name', half: true, sticky: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'your.email@school.edu', autoComplete: 'email', half: true, sticky: true },
      {
        name: 'subject',
        label: 'Topic',
        type: 'select',
        sticky: true,
        options: opts('General Feedback', 'Grading Formula Question', 'GPA Scale Accuracy', 'Academic Institution Inquiry', 'Other'),
      },
      { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell us what you love or how we can make Easy Grade better for you...' },
    ],
    validate: (v) => (!v.email.trim() || !v.message.trim() ? 'Please enter both your email address and a message.' : null),
    toPayload: (v) => ({ name: v.name, email: v.email, subject: v.subject, message: v.message, category: v.subject }),
  },
  'report-issue': {
    title: 'Report an issue',
    submitLabel: 'Send report',
    successToast: 'Bug report submitted!',
    defaultSuccess: 'Thank you! Your report was sent.',
    initial: { tool: 'Quick Grade', title: '', description: '', email: '' },
    fields: [
      {
        name: 'tool',
        label: 'Calculator',
        type: 'select',
        half: true,
        sticky: true,
        options: [
          { value: 'Quick Grade', label: 'Quick Grade Calculator' },
          { value: 'GPA Calculator', label: 'GPA Calculator' },
          { value: 'CGPA to Percentage Calculator', label: 'CGPA to Percentage Calculator' },
          { value: 'Percentage Calculator', label: 'Percentage Calculator' },
          { value: 'Tip Calculator', label: 'Tip Calculator' },
          { value: 'Loan Calculator', label: 'Loan Calculator' },
          { value: 'Mortgage Calculator', label: 'Mortgage Calculator' },
          { value: 'Password Generator', label: 'Password Generator' },
        ],
      },
      { name: 'title', label: 'Summary (optional)', type: 'text', placeholder: 'e.g. Weighted curve rounding discrepancy', half: true },
      {
        name: 'description',
        label: 'What happened?',
        type: 'textarea',
        placeholder: 'Describe what values you entered, what result you saw, and what you expected...',
      },
      { name: 'email', label: 'Email (optional)', type: 'email', placeholder: 'student@university.edu', autoComplete: 'email', sticky: true },
    ],
    validate: (v) => (!v.description.trim() ? 'Please provide details about the issue or calculation discrepancy.' : null),
    toPayload: (v) => ({ tool: v.tool, title: v.title || `${v.tool} Issue`, description: v.description, email: v.email }),
  },
  'suggest-feature': {
    title: 'Request a calculator or feature',
    submitLabel: 'Send request',
    successToast: 'Feature request sent!',
    defaultSuccess: 'Thank you! Your feature idea was sent.',
    initial: { featureName: '', category: 'New Grading Scale', description: '', email: '' },
    fields: [
      { name: 'featureName', label: 'Idea', type: 'text', placeholder: 'e.g. Canadian 9.0 GPA Scale', half: true },
      {
        name: 'category',
        label: 'Type',
        type: 'select',
        half: true,
        sticky: true,
        options: opts('New Grading Scale', 'New Calculator Type', 'Formula Enhancement', 'Export & Reporting Option'),
      },
      {
        name: 'description',
        label: 'Details',
        type: 'textarea',
        placeholder: 'Describe how the calculator should work or provide links to standard formulas...',
      },
      { name: 'email', label: 'Email (optional)', type: 'email', placeholder: 'you@school.edu', autoComplete: 'email', sticky: true },
    ],
    validate: (v) =>
      !v.featureName.trim() || !v.description.trim() ? 'Please provide both a name and a description for your feature request.' : null,
    toPayload: (v) => ({ featureName: v.featureName.trim(), category: v.category, description: v.description.trim(), email: v.email.trim() }),
  },
};

interface FeedbackDialogProps {
  kind: FeedbackKind;
  apiBase: string;
  onClose: () => void;
  setToast?: (msg: string) => void;
}

/**
 * One dialog for all three footer forms (contact, report an issue, request a feature).
 * It uses the shared .dialog look and the shared focus-trap hook, so there is nothing form-specific left to style.
 * Mount it only while open.
 */
export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ kind, apiBase, onClose, setToast }) => {
  const config = CONFIGS[kind];
  const panelRef = useRef<HTMLDivElement | null>(null);
  const uid = useId();
  const [values, setValues] = useState<Record<string, string>>(config.initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  useDialogA11y(panelRef, onClose);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = config.validate(values);
    if (problem) {
      setError(problem);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await submitForm(kind, config.toPayload(values), apiBase);
      if (result.ok) {
        setSuccess(result.message || config.defaultSuccess);
        setValues((v) => {
          const next = { ...config.initial };
          for (const f of config.fields) if (f.sticky) next[f.name] = v[f.name];
          return next;
        });
        setToast?.(config.successToast);
        closeTimer.current = window.setTimeout(onClose, 2200);
      } else {
        setError(`We could not send that right now. Please email ${CONTACT_EMAIL} directly.`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (typeof document === 'undefined') return null;

  const titleId = `${uid}-title`;
  const errorId = `${uid}-error`;

  const renderField = (f: FieldDef) => {
    const id = `${uid}-${f.name}`;
    return (
      <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
        <label htmlFor={id} className="field-label">
          {f.label}
        </label>
        {f.type === 'select' ? (
          <select id={id} className="field" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : f.type === 'textarea' ? (
          <textarea
            id={id}
            className="field"
            rows={4}
            value={values[f.name]}
            placeholder={f.placeholder}
            onChange={(e) => set(f.name, e.target.value)}
            aria-describedby={error ? errorId : undefined}
          />
        ) : (
          <input
            id={id}
            type={f.type}
            className="field"
            value={values[f.name]}
            placeholder={f.placeholder}
            autoComplete={f.autoComplete}
            onChange={(e) => set(f.name, e.target.value)}
          />
        )}
      </div>
    );
  };

  return createPortal(
    <div
      className="dialog-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className="dialog">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl">
            {config.title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="btn btn-ghost btn-icon -mr-2 -mt-2">
            <X aria-hidden="true" />
          </button>
        </div>

        {success ? (
          <p role="status" className="tone-good flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold">
            <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
            {success}
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {error && (
              <p id={errorId} role="alert" className="tone-poor flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-semibold">
                <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">{config.fields.map(renderField)}</div>
            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
                {loading ? 'Sending...' : config.submitLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

export default FeedbackDialog;
