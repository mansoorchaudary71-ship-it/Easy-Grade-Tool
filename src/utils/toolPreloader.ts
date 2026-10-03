import { ToolKey } from '../types';
import { GUIDE_IMAGES } from '../data/guideImages';

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
export function preloadTool(tool: ToolKey | string): void {
  if (preloadedSet.has(tool)) return;
  preloadedSet.add(tool);

  // Preload corresponding semantic guide image on hover/touch
  const imageSrc = GUIDE_IMAGES[tool];
  if (imageSrc) {
    preloadGuideImage(imageSrc);
  }

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

  const warmAll = () => {
    preloadTool('gpa');
    preloadTool('cgpa');
    preloadTool('tip');
    preloadTool('percentage');
    preloadTool('loan');
    preloadTool('mortgage');
    preloadTool('password');
    preloadTool('command-palette');
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(warmAll, { timeout: 1500 });
  } else {
    setTimeout(warmAll, 200);
  }
}
