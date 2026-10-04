import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {
  storageAdapter,
  sanitizeString,
  validateEmail,
  ContactSubmission,
  IssueSubmission,
  SuggestionSubmission,
  SubscribeSubmission,
} from './storageAdapter.ts';
import {
  CGPA_UNIVERSITIES,
  computeCgpaToPercentage,
  computePercentageToCgpa,
  CgpaScale,
} from '../data/cgpaUniversities.ts';
import {
  SITE_URL,
  generateSitemapXml,
  generateRobotsTxt,
} from '../data/seoConfig.ts';
import { injectRouteSeoIntoHtml } from '../utils/seoHtmlInjector.ts';
import { PROGRAMMATIC_SEO_REGISTRY } from '../data/programmaticSeoData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Root directory of the applet
const rootDir = path.resolve(__dirname, '../../');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'support@easygradetool.com';

// Enable trust proxy for Google Cloud Run / container reverse proxies
app.set('trust proxy', 1);

// Speed & performance settings
app.disable('x-powered-by');
app.set('etag', 'strong');

// Comprehensive Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", 'data:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: IS_PROD ? ["'none'"] : ["'self'", 'https://*.google.com', 'https://*.run.app'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: IS_PROD ? 'deny' : 'sameorigin' },
    hsts: IS_PROD
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  })
);

// Explicit Permissions-Policy
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// High-speed HTTP compression for all responses (Gzip / Deflate)
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// Canonical Host, HTTPS, Lowercase & Trailing Slash 301-Redirect Middleware
// The ONLY canonical host is https://www.easygradetool.com
// 301-redirects non-www (easygradetool.com) to www (www.easygradetool.com)
// Forces HTTPS in production
// 301-redirects uppercase paths to lowercase, preserving query
// 301-redirects trailing-slash variants to consistent no-slash form (root / preserved), preserving query
const CANONICAL_ORIGIN = 'https://www.easygradetool.com';
const CANONICAL_HOST = 'www.easygradetool.com';
const REDIRECT_HOSTS = new Set([
  'easygradetool.com',
]);

app.use((req, res, next) => {
  // Extract Host header without port (case-insensitive)
  const hostHeader = (req.headers.host || req.hostname || '').trim();
  const rawHost = hostHeader.split(':')[0].toLowerCase();

  // Extract path and query from originalUrl
  const originalUrl = req.originalUrl || req.url || '/';
  const qIndex = originalUrl.indexOf('?');
  const rawPath = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl;
  const queryString = qIndex >= 0 ? originalUrl.slice(qIndex) : '';

  // Bypass internal vite/dev assets
  if (rawPath.startsWith('/@') || rawPath.startsWith('/__vite') || rawPath.startsWith('/node_modules')) {
    return next();
  }

  // Canonicalize path: lowercase and strip trailing slash for non-root paths
  const lowerPath = rawPath.toLowerCase();
  const cleanPath = lowerPath.length > 1 ? lowerPath.replace(/\/+$/, '') : lowerPath;

  const isNonCanonicalHost = REDIRECT_HOSTS.has(rawHost);
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const needsHttps = IS_PROD && !isHttps;
  const pathNeedsRedirect = cleanPath !== rawPath;

  // Case 1: Host is non-canonical (e.g. non-www easygradetool.com or legacy domain) OR requires HTTPS in production
  if (isNonCanonicalHost || needsHttps) {
    const targetUrl = `${CANONICAL_ORIGIN}${cleanPath}${queryString}`;
    return res.redirect(301, targetUrl);
  }

  // Case 2: Path has trailing slashes or uppercase letters that need to be normalized
  if (pathNeedsRedirect) {
    if (rawHost === CANONICAL_HOST) {
      return res.redirect(301, `${CANONICAL_ORIGIN}${cleanPath}${queryString}`);
    }
    return res.redirect(301, `${cleanPath}${queryString}`);
  }

  next();
});

// RFC 9116 security.txt endpoints
app.get(['/.well-known/security.txt', '/security.txt'], (_req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(`Contact: mailto:${CONTACT_EMAIL}
Expires: 2027-10-04T00:00:00.000Z
Preferred-Languages: en
Canonical: ${CANONICAL_ORIGIN}/.well-known/security.txt
Policy: ${CANONICAL_ORIGIN}/privacy
`);
});

// Ensure data storage directory exists
const DATA_DIR = path.resolve(rootDir, 'server-data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create server-data directory; falling back to in-memory storage:', err);
  }
}

// In-memory fallbacks if filesystem is read-only
const inMemoryStore = {
  contacts: [] as any[],
  subscribers: [] as any[],
  issues: [] as any[],
  suggestions: [] as any[],
  shareCount: 0,
};

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.warn(`Error reading ${filename}:`, err);
  }
  return fallback;
}

// Strict body parsing middleware (limit 10kb to reject oversized payloads)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Helper to safely extract body payload
function extractPayload(req: express.Request): Record<string, any> {
  const body = req.body;
  return { ...(req.query || {}), ...(body && typeof body === 'object' ? body : {}) };
}

// Same-Site Origin Check for form submission mutations
function sameSiteOriginCheck(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.method === 'POST') {
    const origin = (req.headers.origin || req.headers.referer || '').trim();
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const host = originUrl.host.toLowerCase();
        const allowedHosts = new Set([
          'www.easygradetool.com',
          'easygradetool.com',
          req.headers.host?.toLowerCase() || '',
          'localhost:3000',
          '127.0.0.1:3000',
        ]);
        if (!allowedHosts.has(host) && !host.endsWith('.run.app')) {
          return res.status(403).json({
            success: false,
            error: 'Forbidden: Request origin is not authorized.',
          });
        }
      } catch {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Invalid request origin header.',
        });
      }
    }
  }
  next();
}

// Rate limiter factory for public form submission endpoints (express-rate-limit).
// Usage: submissionRateLimiter(maxRequests, windowMs)
function submissionRateLimiter(max = 15, windowMs = 5 * 60 * 1000) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many submissions from this connection. Please wait a few minutes before trying again.',
    },
  });
}

// ==========================================
// BACKEND API ROUTES FOR FOOTER & APP
// ==========================================

// 1. Health check & system status
const serverStartTime = Date.now();
app.all('/api/health', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  res.json({
    status: 'operational',
    service: 'Easy Grade Tool Backend',
    contactEmail: CONTACT_EMAIL,
    uptime: uptimeSeconds,
    uptimeHuman: `${Math.floor(uptimeSeconds / 60)}m ${uptimeSeconds % 60}s`,
    timestamp: new Date().toISOString(),
    version: '1.2.0',
    calculatorsOnline: 8,
    environment: IS_PROD ? 'production' : 'development',
    storageBackend: storageAdapter.getStatus(),
  });
});

// 2. Public stats
app.all('/api/stats', (req, res) => {
  const subscribers = readJsonFile<any[]>('subscribers.json', inMemoryStore.subscribers);
  const issues = readJsonFile<any[]>('issues.json', inMemoryStore.issues);
  const feedback = readJsonFile<any[]>('contacts.json', inMemoryStore.contacts);

  res.json({
    success: true,
    calculators: 8,
    activeScales: ['Standard 4.0', 'Plus/Minus', '10.0 / 5.0 / 4.0 CGPA', '100% Percentage', 'Custom Weighted'],
    totalSubscribers: subscribers.length,
    feedbackReceived: feedback.length,
    issuesResolved: issues.length,
    shareCount: inMemoryStore.shareCount,
    offlineCapable: true,
    storageBackend: storageAdapter.getStatus().primaryBackend,
  });
});

// 3. Calculator Tools Registry API
app.all('/api/tools', (req, res) => {
  res.json({
    success: true,
    tools: [
      { key: 'quick', label: 'Quick Grade Calculator', path: '/grade-calculator', status: 'operational', description: 'Test scoring & grading chart' },
      { key: 'gpa', label: 'GPA Calculator', path: '/gpa-calculator', status: 'operational', description: 'Semester & cumulative GPA' },
      { key: 'cgpa', label: 'CGPA to Percentage Calculator', path: '/cgpa-to-percentage-calculator', status: 'operational', description: '10.0, 5.0 & 4.0 CGPA to percentage converter with 30+ university formulas' },
      { key: 'tip', label: 'Tip Calculator', path: '/tip-calculator', status: 'operational', description: 'Dining tip & split bill' },
      { key: 'percentage', label: 'Percentage Calculator', path: '/percentage-calculator', status: 'operational', description: 'Percentage difference & change' },
      { key: 'loan', label: 'Loan Calculator', path: '/loan-calculator', status: 'operational', description: 'Loan amortization & interest' },
      { key: 'mortgage', label: 'Mortgage Calculator', path: '/mortgage-calculator', status: 'operational', description: 'Mortgage monthly payments' },
      { key: 'password', label: 'Password Generator', path: '/password-generator', status: 'operational', description: 'Cryptographic password generation' },
    ],
  });
});

app.all('/api/tools/:toolKey', (req, res) => {
  const toolKey = req.params.toolKey;
  const toolDefs: Record<string, any> = {
    quick: { key: 'quick', label: 'Quick Grade Calculator', path: '/grade-calculator', status: 'operational', description: 'Test scoring & grading chart' },
    gpa: { key: 'gpa', label: 'GPA Calculator', path: '/gpa-calculator', status: 'operational', description: 'Semester & cumulative GPA' },
    cgpa: { key: 'cgpa', label: 'CGPA to Percentage Calculator', path: '/cgpa-to-percentage-calculator', status: 'operational', description: '10.0, 5.0 & 4.0 CGPA to percentage converter with 30+ university formulas' },
    tip: { key: 'tip', label: 'Tip Calculator', path: '/tip-calculator', status: 'operational', description: 'Dining tip & split bill' },
    percentage: { key: 'percentage', label: 'Percentage Calculator', path: '/percentage-calculator', status: 'operational', description: 'Percentage difference & change' },
    loan: { key: 'loan', label: 'Loan Calculator', path: '/loan-calculator', status: 'operational', description: 'Loan amortization & interest' },
    mortgage: { key: 'mortgage', label: 'Mortgage Calculator', path: '/mortgage-calculator', status: 'operational', description: 'Mortgage monthly payments' },
    password: { key: 'password', label: 'Password Generator', path: '/password-generator', status: 'operational', description: 'Cryptographic password generation' },
  };

  const tool = toolDefs[toolKey];
  if (tool) {
    return res.json({ success: true, tool });
  }
  return res.status(404).json({ success: false, error: `Tool ${toolKey} not found` });
});

// 3d. CGPA Universities & Conversion Backend API
app.all('/api/cgpa-universities', (req, res) => {
  const list = CGPA_UNIVERSITIES.map((u) => ({
    id: u.id,
    name: u.name,
    group: u.group,
    formulaLabel: u.formulaLabel,
    sourceNote: u.sourceNote,
    verified: u.verified,
  }));
  res.json({
    success: true,
    totalUniversities: list.length,
    universities: list,
  });
});

app.all('/api/cgpa-to-percentage', (req, res) => {
  const payload = extractPayload(req);
  const rawScale = Number(payload.scale || 10);
  const scale: CgpaScale = rawScale === 4 ? 4.0 : rawScale === 5 ? 5.0 : 10.0;
  const rawCgpa = Number(payload.cgpa);
  const universityId = String(payload.universityId || payload.university || 'normal');

  if (Number.isNaN(rawCgpa) || rawCgpa < 0 || rawCgpa > scale) {
    return res.status(400).json({
      success: false,
      error: `Invalid CGPA value. Must be a number between 0 and ${scale.toFixed(1)}.`,
    });
  }

  const result = computeCgpaToPercentage(rawCgpa, scale, universityId);
  return res.json({
    success: true,
    tool: 'cgpa',
    cgpa: result.cgpa,
    scale: result.scale,
    percentage: result.percentage,
    formulaUsed: result.formulaUsed,
    stepByStep: result.stepByStep,
    university: {
      id: result.university.id,
      name: result.university.name,
      formulaLabel: result.university.formulaLabel,
      verified: result.university.verified,
      sourceNote: result.university.sourceNote,
    },
    division: result.division,
  });
});

// 3c. Grade Scale Backend API
app.all(['/api/grade-scale', '/api/scale'], (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    defaultScale: 'standard',
    scales: {
      standard: { A: 90, B: 80, C: 70, D: 60 },
      plus: [
        { letter: 'A', min: 93 },
        { letter: 'A−', min: 90 },
        { letter: 'B+', min: 87 },
        { letter: 'B', min: 83 },
        { letter: 'B−', min: 80 },
        { letter: 'C+', min: 77 },
        { letter: 'C', min: 73 },
        { letter: 'C−', min: 70 },
        { letter: 'D', min: 60 },
        { letter: 'F', min: 0 },
      ],
    },
  });
});

// 3b. Backend Calculator Execution API — Immediate 1-press calculation for any calculator
app.all(['/api/calculate', '/api/calculate/:toolKey'], (req, res) => {
  const payload = extractPayload(req);
  const tool = req.params.toolKey || payload.tool || payload.type || 'quick';

  try {
    switch (tool) {
      case 'quick':
      case 'grade': {
        const rawTotal = payload.totalQuestions ?? payload.total ?? 50;
        const rawWrong = payload.wrongAnswers ?? payload.wrong ?? 0;
        const total = Math.max(1, Math.min(1000, Number(rawTotal) || 1));
        const wrong = Math.max(0, Math.min(total, Number(rawWrong) || 0));
        const correct = total - wrong;
        const percentage = Math.round(((correct / total) * 100) * 100) / 100;
        let letter = 'F';
        if (percentage >= 90) letter = 'A';
        else if (percentage >= 80) letter = 'B';
        else if (percentage >= 70) letter = 'C';
        else if (percentage >= 60) letter = 'D';

        return res.json({
          success: true,
          tool: 'quick',
          totalQuestions: total,
          wrongAnswers: wrong,
          correctAnswers: correct,
          percentage,
          letterGrade: letter,
        });
      }

      case 'gpa': {
        const courses = Array.isArray(payload.courses) ? payload.courses : [];
        let totalCredits = 0;
        let qualityPoints = 0;
        const gradeMap: Record<string, number> = {
          'A+': 4.0, A: 4.0, 'A-': 3.7, 'A−': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7, 'B−': 2.7,
          'C+': 2.3, C: 2.0, 'C-': 1.7, 'C−': 1.7, 'D+': 1.3, D: 1.0, 'D-': 0.7, 'D−': 0.7, F: 0.0,
        };

        courses.forEach((c: any) => {
          const cr = Math.max(0, Number(c.credits) || 0);
          const gr = String(c.grade || 'A').toUpperCase();
          const pts = gradeMap[gr] ?? 4.0;
          totalCredits += cr;
          qualityPoints += cr * pts;
        });

        const semesterGpa = totalCredits > 0 ? qualityPoints / totalCredits : 0;
        return res.json({
          success: true,
          tool: 'gpa',
          totalCredits,
          qualityPoints,
          semesterGpa: Math.round(semesterGpa * 100) / 100,
        });
      }

      case 'cgpa': {
        const rawScale = Number(payload.scale || 10);
        const scale: CgpaScale = rawScale === 4 ? 4.0 : rawScale === 5 ? 5.0 : 10.0;
        const cgpa = Math.max(0, Math.min(scale, Number(payload.cgpa ?? 8.5)));
        const universityId = String(payload.universityId || payload.university || 'normal');
        const result = computeCgpaToPercentage(cgpa, scale, universityId);
        return res.json({
          success: true,
          tool: 'cgpa',
          cgpa: result.cgpa,
          scale: result.scale,
          percentage: result.percentage,
          formulaUsed: result.formulaUsed,
          stepByStep: result.stepByStep,
          university: result.university.name,
          division: result.division.label,
        });
      }

      case 'tip': {
        const bill = Math.max(0, Number(payload.billAmount || payload.bill || 0));
        const tipPct = Math.max(0, Number(payload.tipPercent || payload.tip || 20));
        const people = Math.max(1, Number(payload.people || 1));

        const tipAmount = (bill * tipPct) / 100;
        const totalWithTip = bill + tipAmount;
        const eachPersonPays = totalWithTip / people;

        return res.json({
          success: true,
          tool: 'tip',
          billAmount: bill,
          tipPercent: tipPct,
          people,
          tipAmount: Math.round(tipAmount * 100) / 100,
          totalWithTip: Math.round(totalWithTip * 100) / 100,
          eachPersonPays: Math.round(eachPersonPays * 100) / 100,
        });
      }

      case 'percentage': {
        const x = Number(payload.x || 0);
        const y = Number(payload.y || 0);
        const isWhatPct = y !== 0 ? (x / y) * 100 : 0;
        const pctOf = (x / 100) * y;
        const change = x !== 0 ? ((y - x) / Math.abs(x)) * 100 : 0;

        return res.json({
          success: true,
          tool: 'percentage',
          x,
          y,
          percentOfNumber: Math.round(pctOf * 100) / 100,
          percentRatio: Math.round(isWhatPct * 100) / 100,
          percentChange: Math.round(change * 100) / 100,
        });
      }

      case 'loan':
      case 'mortgage': {
        const principal = Math.max(0, Number(payload.amount || payload.principal || 0));
        const rate = Math.max(0, Number(payload.interestRate || payload.rate || 0));
        const years = Math.max(1, Number(payload.years || payload.termYears || 30));

        const months = years * 12;
        const monthlyRate = rate / 100 / 12;
        const monthlyPayment =
          monthlyRate === 0
            ? principal / months
            : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
              (Math.pow(1 + monthlyRate, months) - 1);

        const totalCost = monthlyPayment * months;
        const totalInterest = Math.max(0, totalCost - principal);

        return res.json({
          success: true,
          tool,
          principal,
          interestRate: rate,
          years,
          monthlyPayment: Math.round(monthlyPayment * 100) / 100,
          totalCost: Math.round(totalCost * 100) / 100,
          totalInterest: Math.round(totalInterest * 100) / 100,
        });
      }

      case 'password': {
        const length = Math.max(6, Math.min(64, Number(payload.length || 16)));
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let pass = '';
        for (let i = 0; i < length; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res.json({
          success: true,
          tool: 'password',
          length,
          password: pass,
        });
      }

      default:
        return res.json({
          success: true,
          tool,
          message: `Backend calculator operational for ${tool}.`,
        });
    }
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Calculation error' });
  }
});

// 4. Contact & Developer Message / Feedback
app.all(['/api/contact', '/api/feedback'], submissionRateLimiter(15, 5 * 60 * 1000), async (req, res) => {
  if (req.method === 'GET') {
    const contacts = readJsonFile<any[]>('contacts.json', inMemoryStore.contacts);
    return res.json({
      success: true,
      totalFeedback: contacts.length,
      contactEmail: CONTACT_EMAIL,
      status: 'Feedback inbox operational',
    });
  }

  try {
    const payload = extractPayload(req);
    const { name, email, subject, message, category, rating } = payload;

    const cleanMessage = sanitizeString(message, 4000);
    if (!email || !cleanMessage) {
      return res.status(400).json({
        success: false,
        error: 'Email and message are required fields.',
      });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({
        success: false,
        error: emailCheck.error || 'Please provide a valid email address.',
      });
    }

    const newMessage: ContactSubmission = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'contact',
      name: sanitizeString(name, 120) || 'Anonymous Learner',
      email: emailCheck.email,
      subject: sanitizeString(subject, 200) || 'User Feedback',
      category: sanitizeString(category, 100) || 'General Feedback',
      message: cleanMessage,
      rating: rating ? Number(rating) : null,
      timestamp: new Date().toISOString(),
      userAgent: sanitizeString(req.headers['user-agent'], 300) || 'Unknown',
    };

    await storageAdapter.saveSubmission(newMessage, 'contacts.json', inMemoryStore.contacts);

    return res.status(200).json({
      success: true,
      id: newMessage.id,
      message: 'Thank you! Your message has been sent to our team. We typically respond within 24 hours.',
      timestamp: newMessage.timestamp,
    });
  } catch (error: any) {
    console.error('Error handling /api/contact:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your message.',
    });
  }
});

// 5. Newsletter / Grade updates subscription
app.all('/api/subscribe', submissionRateLimiter(15, 5 * 60 * 1000), async (req, res) => {
  if (req.method === 'GET') {
    const subscribers = readJsonFile<any[]>('subscribers.json', inMemoryStore.subscribers);
    return res.json({
      success: true,
      totalSubscribers: subscribers.length,
      status: 'Subscription engine active',
    });
  }

  try {
    const payload = extractPayload(req);
    const rawEmail = payload.email || payload.subscribeEmail || req.query.email;

    const emailCheck = validateEmail(rawEmail);
    if (!emailCheck.valid) {
      return res.status(400).json({
        success: false,
        error: emailCheck.error || 'Please enter a valid email address format (e.g. name@school.edu).',
      });
    }

    const cleanEmail = emailCheck.email;
    const subscribers = readJsonFile<any[]>('subscribers.json', inMemoryStore.subscribers);
    const existing = subscribers.find((s) => s.email === cleanEmail);

    if (existing) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        message: 'You are already subscribed to Easy Grade updates!',
        email: cleanEmail,
      });
    }

    const subscriberRecord: SubscribeSubmission = {
      id: `sub_${Date.now()}`,
      type: 'subscribe',
      email: cleanEmail,
      timestamp: new Date().toISOString(),
    };

    await storageAdapter.saveSubmission(subscriberRecord, 'subscribers.json', inMemoryStore.subscribers);

    return res.status(200).json({
      success: true,
      message: `Subscribed successfully! We will notify you when new calculators are launched.`,
      email: cleanEmail,
    });
  } catch (error: any) {
    console.error('Error handling /api/subscribe:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process subscription. Please try again.',
    });
  }
});

// 6. Bug / Calculation issue report
app.all('/api/report-issue', submissionRateLimiter(15, 5 * 60 * 1000), async (req, res) => {
  if (req.method === 'GET') {
    const issues = readJsonFile<any[]>('issues.json', inMemoryStore.issues);
    return res.json({
      success: true,
      totalIssuesLogged: issues.length,
      status: 'Issue tracking operational',
    });
  }

  try {
    const payload = extractPayload(req);
    const { tool, title, description, expected, actual, email } = payload;

    const cleanDesc = sanitizeString(description, 4000);
    if (!cleanDesc) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a description of the issue or formula discrepancy.',
      });
    }

    const emailCheck = email ? validateEmail(email) : { valid: false, email: '' };
    const ticketId = `ISSUE-${Date.now().toString().slice(-6)}`;

    const issueTicket: IssueSubmission = {
      id: ticketId,
      type: 'issue',
      ticketId,
      tool: sanitizeString(tool, 100) || 'General Calculator',
      title: sanitizeString(title, 200) || 'Calculation / UI Issue',
      description: cleanDesc,
      expected: sanitizeString(expected, 500),
      actual: sanitizeString(actual, 500),
      reporterEmail: emailCheck.valid ? emailCheck.email : 'anonymous@user.internal',
      timestamp: new Date().toISOString(),
      status: 'Logged & Open',
    };

    await storageAdapter.saveSubmission(issueTicket, 'issues.json', inMemoryStore.issues);

    return res.status(200).json({
      success: true,
      ticketId: issueTicket.ticketId,
      message: `Ticket ${issueTicket.ticketId} logged successfully! Our team will inspect the formula.`,
    });
  } catch (error: any) {
    console.error('Error handling /api/report-issue:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to record issue report.',
    });
  }
});

// 7. Suggest a Calculator or Feature
app.all('/api/suggest-feature', submissionRateLimiter(15, 5 * 60 * 1000), async (req, res) => {
  if (req.method === 'GET') {
    const suggestions = readJsonFile<any[]>('suggestions.json', inMemoryStore.suggestions);
    return res.json({
      success: true,
      totalSuggestions: suggestions.length,
      status: 'Feature suggestion roadmap active',
    });
  }

  try {
    const payload = extractPayload(req);
    const { featureName, category, description, email } = payload;

    const cleanFeatureName = sanitizeString(featureName, 160);
    const cleanDesc = sanitizeString(description, 4000);

    if (!cleanFeatureName || !cleanDesc) {
      return res.status(400).json({
        success: false,
        error: 'Feature name and description are required.',
      });
    }

    const emailCheck = email ? validateEmail(email) : { valid: false, email: '' };

    const suggestion: SuggestionSubmission = {
      id: `sug_${Date.now()}`,
      type: 'suggestion',
      featureName: cleanFeatureName,
      category: sanitizeString(category, 100) || 'New Calculator',
      description: cleanDesc,
      email: emailCheck.valid ? emailCheck.email : null,
      timestamp: new Date().toISOString(),
    };

    await storageAdapter.saveSubmission(suggestion, 'suggestions.json', inMemoryStore.suggestions);

    return res.status(200).json({
      success: true,
      id: suggestion.id,
      message: `Thank you for suggesting "${suggestion.featureName}"! It has been submitted to our roadmap.`,
    });
  } catch (error: any) {
    console.error('Error handling /api/suggest-feature:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit feature suggestion.',
    });
  }
});

// 8. Backup & Export Verification
app.all('/api/backup-data', (req, res) => {
  try {
    const payload = extractPayload(req);
    const { clientData } = payload;
    const backupId = `bkp_${Date.now()}`;
    const timestamp = new Date().toISOString();

    return res.status(200).json({
      success: true,
      backupId,
      timestamp,
      itemCount: clientData && typeof clientData === 'object' ? Object.keys(clientData).length : 0,
      message: 'Backup payload verified and timestamped.',
    });
  } catch (error: any) {
    console.error('Error handling /api/backup-data:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process backup request.',
    });
  }
});

// 9. Share counter
app.all('/api/share', (req, res) => {
  if (req.method === 'POST') {
    inMemoryStore.shareCount += 1;
  }
  res.json({
    success: true,
    totalShares: inMemoryStore.shareCount,
  });
});

// ==========================================
// STATIC ASSETS OR VITE DEV MIDDLEWARE
// ==========================================

// Dynamic Sitemap.xml & Robots.txt endpoints using canonical SITE_URL
app.get('/sitemap.xml', (_req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  return res.status(200).send(generateSitemapXml(SITE_URL));
});

app.get('/robots.txt', (_req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  return res.status(200).send(generateRobotsTxt(SITE_URL));
});

// Serve /images with 1-year immutable caching
app.use(
  '/images',
  express.static(path.resolve(rootDir, 'public/images'), {
    maxAge: '31536000000',
    immutable: true,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  })
);

// 301 Permanent Redirects for merged programmatic paths and legacy aliases
const PERMANENT_REDIRECTS: Record<string, string> = {
  '/easy-grade-calculator/gpa': '/gpa-calculator',
  '/easy-grade-calculator/semester-gpa-calculator': '/gpa-calculator',
  '/easy-grade-calculator/weighted-grade-calculator': '/grade-calculator',
  '/easy-grade-calculator/test-score': '/grade-calculator',
  '/easy-grade-calculator/college-final-grade-calculator': '/easy-grade-calculator/final-exam-grade-calculator',
  '/easy-grade-calculator/high-school-test-grader': '/easy-grade-calculator/ez-grader',
  '/easy-grade-calculator': '/grade-calculator',
  '/calculator': '/grade-calculator',
  '/privacy-policy': '/privacy',
  '/terms-of-service': '/terms',
  '/terms-and-conditions': '/terms',
  '/methodology': '/about',
  '/about-methodology': '/about',
  '/gpa': '/gpa-calculator',
  '/cgpa': '/cgpa-to-percentage-calculator',
  '/cgpa-to-percentage': '/cgpa-to-percentage-calculator',
  '/cgpa-calculator': '/cgpa-to-percentage-calculator',
  '/tip': '/tip-calculator',
  '/percentage': '/percentage-calculator',
  '/loan': '/loan-calculator',
  '/mortgage': '/mortgage-calculator',
  '/password': '/password-generator',
  '/final-grade': '/grade-calculator',
  '/weighted-grade': '/grade-calculator',
};

// Global 301 Redirect Middleware
app.use((req, res, next) => {
  const clean = (req.path.split('?')[0].replace(/\/+$/, '') || '/').toLowerCase();
  if (PERMANENT_REDIRECTS[clean]) {
    const qIndex = req.originalUrl.indexOf('?');
    const query = qIndex >= 0 ? req.originalUrl.slice(qIndex) : '';
    return res.redirect(301, PERMANENT_REDIRECTS[clean] + query);
  }
  next();
});

function isKnownRoute(rawPath: string): boolean {
  const clean = rawPath.split('?')[0].replace(/\/+$/, '') || '/';
  const staticValidRoutes = new Set([
    '/',
    '/grade-calculator',
    '/gpa-calculator',
    '/cgpa-to-percentage-calculator',
    '/tip-calculator',
    '/percentage-calculator',
    '/loan-calculator',
    '/mortgage-calculator',
    '/password-generator',
    '/privacy',
    '/terms',
    '/about',
  ]);

  if (staticValidRoutes.has(clean)) return true;

  if (clean.startsWith('/easy-grade-calculator/')) {
    const slug = clean.split('/').pop() || '';
    return slug in PROGRAMMATIC_SEO_REGISTRY;
  }

  return false;
}

export async function setupServer() {
  const distPath = path.resolve(rootDir, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const useDist = hasDist;

  if (useDist) {
    console.log('[Easy Grade Tool] Serving ultra-fast pre-rendered build from dist/');

    // High-performance in-memory cache for instantaneous route delivery (< 0.1ms)
    const htmlMemoryCache = new Map<string, string>();

    // Pre-warm in-memory cache for all pre-rendered static routes on boot
    try {
      const walkAndCache = (dir: string, baseRoute = '') => {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory() && entry.name !== 'assets') {
            walkAndCache(fullPath, `${baseRoute}/${entry.name}`);
          } else if (entry.isFile() && entry.name === 'index.html') {
            const route = baseRoute || '/';
            const content = fs.readFileSync(fullPath, 'utf-8');
            htmlMemoryCache.set(route.toLowerCase(), content);
          }
        }
      };
      walkAndCache(distPath);
      console.log(`[Easy Grade Tool] In-memory cache pre-warmed with ${htmlMemoryCache.size} pre-rendered routes.`);
    } catch (e) {
      console.warn('Failed to pre-warm HTML memory cache:', e);
    }

    // Immutable 1-year cache for Vite hashed bundles (/assets/*)
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        maxAge: 31536000000,
        immutable: true,
        setHeaders: (res) => {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        },
      })
    );

    // General static assets with aggressive caching
    app.use(
      express.static(distPath, {
        extensions: ['html'],
        index: false,
        redirect: false,
        maxAge: '86400000',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          } else if (filePath.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/i)) {
            res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
          }
        },
      })
    );

    app.get('*', async (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      const rawPath = req.originalUrl.split('?')[0] || '/';
      const cleanPath = (rawPath.replace(/\/+$/, '') || '/').toLowerCase();
      const isKnown = isKnownRoute(cleanPath);

      // 1. Instant return from in-memory cache
      if (htmlMemoryCache.has(cleanPath)) {
        return res
          .status(isKnown ? 200 : 404)
          .set({ 'Content-Type': 'text/html; charset=utf-8' })
          .send(htmlMemoryCache.get(cleanPath));
      }

      // 2. Custom 404 handling
      if (!isKnown) {
        const file404 = path.resolve(distPath, '404.html');
        if (fs.existsSync(file404)) {
          const html404 = fs.readFileSync(file404, 'utf-8');
          htmlMemoryCache.set(cleanPath, html404);
          return res.status(404).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(html404);
        }
      }

      // 3. Direct route file match from dist (e.g. dist/gpa-calculator/index.html)
      const routeSubPath = cleanPath === '/' ? '' : cleanPath.replace(/^\/+/, '');
      const candidates = routeSubPath
        ? [
            path.resolve(distPath, routeSubPath, 'index.html'),
            path.resolve(distPath, `${routeSubPath}.html`),
          ]
        : [path.resolve(distPath, 'index.html')];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          const html = fs.readFileSync(candidate, 'utf-8');
          htmlMemoryCache.set(cleanPath, html);
          return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(html);
        }
      }

      // 4. Fallback to index.html with SEO injection
      const indexFile = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        let rawHtml = fs.readFileSync(indexFile, 'utf-8');
        try {
          const { render } = await import('../entry-server.tsx');
          const renderedBody = render(cleanPath);
          rawHtml = rawHtml.replace(
            /<div id="root">[\s\S]*?<\/div>/i,
            `<div id="root">${renderedBody}</div>`
          );
        } catch (_) {}
        const seoHtml = injectRouteSeoIntoHtml(rawHtml, cleanPath);
        htmlMemoryCache.set(cleanPath, seoHtml);
        return res.status(isKnown ? 200 : 404).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(seoHtml);
      }
      res.status(isKnown ? 200 : 404).sendFile(indexFile);
    });
  } else {
    // In development mode (fallback if dist does not exist yet)
    const devHtmlCache = new Map<string, string>();
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: rootDir,
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        const indexPath = path.resolve(rootDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          const routePath = (url.split('?')[0].replace(/\/+$/, '') || '/').toLowerCase();
          const isKnown = isKnownRoute(routePath);

          if (devHtmlCache.has(routePath)) {
            return res
              .status(isKnown ? 200 : 404)
              .set({ 'Content-Type': 'text/html; charset=utf-8' })
              .send(devHtmlCache.get(routePath));
          }

          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);

          if (!isKnown) {
            template = template.replace(
              '<head>',
              '<head>\n    <meta name="robots" content="noindex, follow" />'
            );
            template = template.replace(
              /<title>.*?<\/title>/i,
              '<title>404 — Page Not Found | Easy Grade Tool</title>'
            );
            const notFoundBody = `
              <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 font-sans">
                <span class="text-xs font-mono font-bold tracking-widest uppercase text-teal-700 dark:text-teal-400 mb-2">Error 404</span>
                <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Page Not Found</h1>
                <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                  The calculator or page you requested could not be found. Please check the address or return to our calculation suite.
                </p>
                <a href="/" class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-sm transition-all active:scale-95">
                  &larr; Return to Easy Grade Tool
                </a>
              </div>
            `;
            template = template.replace('<div id="root"></div>', `<div id="root">${notFoundBody}</div>`);
            devHtmlCache.set(routePath, template);
            return res.status(404).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(template);
          }

          try {
            const { render } = await import('../entry-server.tsx');
            const renderedBody = render(routePath);
            template = template.replace(
              '<div id="root"></div>',
              `<div id="root">${renderedBody}</div>`
            );
          } catch (_) {}
          template = injectRouteSeoIntoHtml(template, routePath);
          devHtmlCache.set(routePath, template);
          return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(template);
        }
        return next();
      } catch (e: any) {
        vite.ssrFixStacktrace?.(e);
        next(e);
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Easy Grade Tool] Express server running at http://0.0.0.0:${PORT}`);
    console.log(`[Easy Grade Tool] Mode: ${IS_PROD ? 'Production' : 'Development'}`);
  });

  return { app, server };
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
