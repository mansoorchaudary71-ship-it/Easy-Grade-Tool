import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../server-data');

// Ensure server-data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('[StorageAdapter] Could not create server-data directory:', err);
  }
}

export type SubmissionType = 'contact' | 'issue' | 'suggestion' | 'subscribe';

export interface BaseSubmission {
  id: string;
  type: SubmissionType;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

export interface ContactSubmission extends BaseSubmission {
  type: 'contact';
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  rating?: number | null;
}

export interface IssueSubmission extends BaseSubmission {
  type: 'issue';
  ticketId: string;
  tool: string;
  title: string;
  description: string;
  expected?: string;
  actual?: string;
  reporterEmail: string;
  status: string;
}

export interface SuggestionSubmission extends BaseSubmission {
  type: 'suggestion';
  featureName: string;
  category: string;
  description: string;
  email?: string | null;
}

export interface SubscribeSubmission extends BaseSubmission {
  type: 'subscribe';
  email: string;
}

export type SubmissionRecord =
  | ContactSubmission
  | IssueSubmission
  | SuggestionSubmission
  | SubscribeSubmission;

// ==========================================
// INPUT SANITIZATION & VALIDATION
// ==========================================

/**
 * Escapes potentially malicious HTML characters to prevent stored XSS.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strips dangerous control characters while preserving regular newlines and spaces.
 */
export function sanitizeString(val: unknown, maxLen = 1000): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  // Strip control characters (ASCII 0-8, 11-12, 14-31, 127)
  const stripped = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return stripped.slice(0, maxLen);
}

/**
 * Validates standard email address syntax with RFC 5322 regex and length checks.
 */
export function validateEmail(val: unknown): { valid: boolean; email: string; error?: string } {
  if (!val || typeof val !== 'string') {
    return { valid: false, email: '', error: 'Email address is required.' };
  }
  const clean = val.trim().toLowerCase();
  if (clean.length < 5 || clean.length > 254) {
    return { valid: false, email: '', error: 'Email address must be between 5 and 254 characters.' };
  }
  // Standard robust email pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, email: '', error: 'Please provide a valid email address (e.g. user@domain.com).' };
  }
  return { valid: true, email: clean };
}

// ==========================================
// IN-MEMORY RATE LIMITER
// ==========================================

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

// Clean up stale IP buckets every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitMap.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Checks rate limits per client IP for public submission endpoints.
 * Default: 10 submissions per 5 minutes per IP.
 */
export function checkRateLimit(
  ip: string,
  maxRequests = 10,
  windowMs = 5 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const safeIp = ip || 'anonymous_ip';
  const bucket = rateLimitMap.get(safeIp);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitMap.set(safeIp, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - bucket.count,
    retryAfterSeconds: 0,
  };
}

// ==========================================
// STORAGE ADAPTER IMPLEMENTATION
// ==========================================

export class StorageAdapter {
  private webhookUrl?: string;
  private resendApiKey?: string;
  private destinationEmail: string;

  constructor() {
    this.webhookUrl = process.env.FEEDBACK_WEBHOOK_URL?.trim();
    this.resendApiKey = process.env.RESEND_API_KEY?.trim();
    this.destinationEmail =
      process.env.FEEDBACK_DESTINATION_EMAIL?.trim() ||
      process.env.CONTACT_EMAIL?.trim() ||
      'support@easygradecalculator.com';
  }

  /**
   * Summarizes configured persistence backends without exposing secrets.
   */
  public getStatus() {
    const hasWebhook = Boolean(this.webhookUrl && this.webhookUrl.startsWith('http'));
    const hasResend = Boolean(this.resendApiKey && this.resendApiKey.startsWith('re_'));

    return {
      primaryBackend: hasWebhook ? 'webhook' : hasResend ? 'email_api' : 'ephemeral_fallback',
      webhookConfigured: hasWebhook,
      emailApiConfigured: hasResend,
      destinationConfigured: Boolean(this.destinationEmail),
      localFallbackActive: true,
    };
  }

  /**
   * Dispatches a submission record to the external webhook if configured.
   */
  private async dispatchWebhook(submission: SubmissionRecord): Promise<boolean> {
    if (!this.webhookUrl || !this.webhookUrl.startsWith('http')) {
      return false;
    }

    try {
      const isSlack = this.webhookUrl.includes('slack.com');
      const isDiscord = this.webhookUrl.includes('discord.com') || this.webhookUrl.includes('discordapp.com');

      let payload: any;

      if (isSlack) {
        payload = {
          text: `🔔 *New Easy Grade Calculator Submission: ${submission.type.toUpperCase()}*`,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: `New ${submission.type.toUpperCase()}: Easy Grade Calculator`,
                emoji: true,
              },
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Type:*\n${submission.type}` },
                { type: 'mrkdwn', text: `*Timestamp:*\n${submission.timestamp}` },
                { type: 'mrkdwn', text: `*ID:*\n${submission.id}` },
              ],
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `\`\`\`${JSON.stringify(submission, null, 2).slice(0, 2900)}\`\`\``,
              },
            },
          ],
        };
      } else if (isDiscord) {
        payload = {
          content: `🔔 **New Easy Grade Calculator Submission: ${submission.type.toUpperCase()}**`,
          embeds: [
            {
              title: `Submission: ${submission.type.toUpperCase()}`,
              color: submission.type === 'issue' ? 0xe11d48 : 0x097362,
              fields: [
                { name: 'ID', value: submission.id, inline: true },
                { name: 'Type', value: submission.type, inline: true },
                { name: 'Timestamp', value: submission.timestamp, inline: false },
              ],
              description: `\`\`\`json\n${JSON.stringify(submission, null, 2).slice(0, 1900)}\n\`\`\``,
              footer: { text: 'Easy Grade Calculator Feedback Relay' },
            },
          ],
        };
      } else {
        // Standard generic webhook payload (Zapier, Make, n8n, Custom Receiver)
        payload = {
          event: 'easygrade_submission',
          submissionType: submission.type,
          data: submission,
          deliveredAt: new Date().toISOString(),
        };
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000), // 5s timeout
      });

      if (!response.ok) {
        console.warn(`[StorageAdapter] Webhook returned status ${response.status}`);
        return false;
      }

      return true;
    } catch (err: any) {
      console.warn('[StorageAdapter] Webhook delivery failed:', err?.message || err);
      return false;
    }
  }

  /**
   * Dispatches an email via Resend API if configured.
   */
  private async dispatchEmail(submission: SubmissionRecord): Promise<boolean> {
    if (!this.resendApiKey) {
      return false;
    }

    try {
      const subject = `[Easy Grade] New ${submission.type.toUpperCase()}: ${
        'subject' in submission
          ? submission.subject
          : 'title' in submission
          ? submission.title
          : 'featureName' in submission
          ? submission.featureName
          : submission.id
      }`;

      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #097362; margin-top: 0;">Easy Grade Calculator — New ${submission.type.toUpperCase()}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Submission ID:</strong></td><td>${submission.id}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Type:</strong></td><td>${submission.type}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Timestamp:</strong></td><td>${submission.timestamp}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <h3 style="color: #334155;">Submission Details</h3>
          <pre style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 13px; overflow-x: auto;">${escapeHtml(JSON.stringify(submission, null, 2))}</pre>
        </div>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Easy Grade Notifications <notifications@easygradecalculator.com>',
          to: [this.destinationEmail],
          subject,
          html: htmlBody,
        }),
        signal: AbortSignal.timeout(6000),
      });

      return response.ok;
    } catch (err: any) {
      console.warn('[StorageAdapter] Email API delivery failed:', err?.message || err);
      return false;
    }
  }

  /**
   * Appends record to fallback local JSON file and in-memory list.
   */
  private saveFallback<T>(filename: string, record: T, memoryList: T[]): void {
    try {
      const filePath = path.join(DATA_DIR, filename);
      let list: T[] = memoryList;
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          list = JSON.parse(raw);
        } catch {}
      }
      list.unshift(record);
      // Keep maximum 500 records on ephemeral disk to prevent runaway storage
      if (list.length > 500) {
        list.length = 500;
      }
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn(`[StorageAdapter] Fallback write to ${filename} failed:`, err);
    }
  }

  /**
   * Saves and dispatches a submission.
   * Primary: Webhook or Email delivery.
   * Fallback: Local JSON file and in-memory store.
   */
  public async saveSubmission(
    submission: SubmissionRecord,
    fallbackFileName: string,
    memoryList: any[]
  ): Promise<{ deliveredExternally: boolean; fallbackSaved: boolean }> {
    // 1. Always write to local fallback so we never lose data if offline or in local dev
    this.saveFallback(fallbackFileName, submission, memoryList);
    const fallbackSaved = true;

    // 2. Dispatch to external webhook or email
    let deliveredExternally = false;
    if (this.webhookUrl) {
      deliveredExternally = await this.dispatchWebhook(submission);
    }

    if (!deliveredExternally && this.resendApiKey) {
      deliveredExternally = await this.dispatchEmail(submission);
    }

    if (!deliveredExternally && (this.webhookUrl || this.resendApiKey)) {
      console.warn(
        `[StorageAdapter] External delivery was attempted but did not succeed for ${submission.id}. Saved to local fallback ${fallbackFileName}.`
      );
    } else if (deliveredExternally) {
      console.log(`[StorageAdapter] Successfully dispatched ${submission.type} (${submission.id}) externally.`);
    }

    return { deliveredExternally, fallbackSaved };
  }
}

export const storageAdapter = new StorageAdapter();
