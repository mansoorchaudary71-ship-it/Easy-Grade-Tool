/**
 * Honest form submission for static hosting (GitHub Pages).
 *
 * GitHub Pages cannot run the Express /api routes, so the footer forms used to
 * show "Subscribed successfully!" while only saving the text in the visitor's own
 * browser. Nothing ever reached the site owner. This helper only reports success
 * when a real server (or relay) accepted the submission.
 *
 * Delivery order:
 *   1. VITE_FORM_ENDPOINT  - a form relay such as Formspree or Web3Forms (works on static hosting)
 *   2. {VITE_API_URL}/api/<kind> - the Express backend (works when self-hosted)
 */
export type FormKind = 'subscribe' | 'contact' | 'report-issue' | 'suggest-feature';

export interface SubmitResult {
  ok: boolean;
  message?: string;
}

const RELAY: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FORM_ENDPOINT) || '';

const RELAY_KEY: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FORM_ACCESS_KEY) || '';

export async function submitForm(
  kind: FormKind,
  payload: Record<string, unknown>,
  apiBase = ''
): Promise<SubmitResult> {
  try {
    if (RELAY) {
      const res = await fetch(RELAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...(RELAY_KEY ? { access_key: RELAY_KEY } : {}),
          subject: `Easy Grade Tool - ${kind}`,
          form: kind,
          ...payload,
        }),
      });
      return res.ok ? { ok: true } : { ok: false };
    }

    const res = await fetch(`${apiBase}/api/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const isJson = res.headers.get('content-type')?.includes('application/json');
    if (res.ok && isJson) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, message: data?.message };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}
