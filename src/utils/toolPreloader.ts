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
 * Lightweight post-mount hook (no eager image decoding on initial load to preserve LCP & bandwidth).
 */
export function preloadAllTools(): void {
  // Intentionally left lightweight so below-the-fold images use native lazy-loading (`loading="lazy"`).
}
