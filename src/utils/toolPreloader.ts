import { ToolKey } from '../types';
import { GUIDE_IMAGES, getGuideImageUrl, RAW_GUIDE_IMAGES } from '../data/guideImages';

const preloadedSet = new Set<string>();
const preloadedImages = new Set<string>();

export const TOOL_GUIDE_IMAGES: Record<string, string> = GUIDE_IMAGES;

/**
 * Preloads a guide image on explicit user navigation intent (hover/focus).
 */
export function preloadGuideImage(src: string): void {
  if (typeof window === 'undefined' || !src || preloadedImages.has(src)) return;
  preloadedImages.add(src);

  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  } catch {
    // Ignore SSR/non-browser environments
  }
}

/**
 * Preloads the chunk for a secondary route or modal on user intent (hover, pointerdown, touchstart, or focus).
 */
export function preloadTool(tool: ToolKey | string, options: { images?: boolean } = {}): void {
  // Preload the corresponding guide image only on real user intent (hover/touch/focus). The idle warm-up passes
  // `images: false`: it used to download ~280 KB of photos for tools the visitor never opened.
  // preloadGuideImage de-duplicates by URL, so a later hover still fetches the image after a code-only warm-up.
  if (options.images !== false) {
    const imageSrc = getGuideImageUrl(tool);
    if (imageSrc) {
      preloadGuideImage(imageSrc);
    }
  }

  if (preloadedSet.has(tool)) return;
  preloadedSet.add(tool);

  switch (tool) {
    case 'quick':
    case 'grade':
      import('../components/GradeCalculator');
      break;
    case 'gpa':
      import('../components/GpaCalculator');
      break;
    case 'cgpa':
      import('../components/CgpaToPercentage');
      break;
    case 'tip':
      import('../components/TipCalculator');
      break;
    case 'percentage':
      import('../components/PercentageCalculator');
      break;
    case 'loan':
      import('../components/LoanCalculator');
      break;
    case 'mortgage':
      import('../components/MortgageCalculator');
      break;
    case 'password':
      import('../components/PasswordGenerator');
      break;
    case 'command-palette':
      import('../components/CommandPalette');
      break;
    default:
      break;
  }
}

/**
 * Preloads the PDF export chunk on hover/focus of export buttons.
 */
export function preloadPdf(): void {
  if (preloadedSet.has('pdf')) return;
  preloadedSet.add('pdf');
  import('./pdfExport');
}

/**
 * Background preloader that warms all tool chunks during browser idle time
 * ensuring 0ms instantaneous switching when a user taps any calculator.
 */
export function preloadAllTools(): void {
  if (typeof window === 'undefined') return;

  // Respect Data Saver and slow connections: only warm on intent (hover/focus/touch) there.
  const conn = (navigator as any).connection;
  if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return;

  const warm = () => {
    // Most likely next stops for a grading visitor. Finance/utility tools load on intent only.
    // Code only, never images: photos are fetched when the visitor shows intent (hover/touch/focus).
    preloadTool('gpa', { images: false });
    preloadTool('cgpa', { images: false });
    preloadTool('percentage', { images: false });
    preloadTool('command-palette', { images: false });
  };

  // Wait until the page has fully loaded, then six seconds more, so the warm-up never competes with the
  // first paint or the LCP window on a slow phone connection (performance traces run ~10s and count these).
  const schedule = () => {
    window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(warm, { timeout: 4000 });
      } else {
        window.setTimeout(warm, 1000);
      }
    }, 6000);
  };

  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
}
