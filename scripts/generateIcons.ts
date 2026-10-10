/**
 * Generates every logo / icon file in /public from the single brand source:
 *   src/brand/brand.ts  +  src/components/Logo.tsx
 *
 * Run:  npx tsx scripts/generateIcons.ts
 *
 * Output (all in /public):
 *   icon.svg, icon-maskable.svg      vector app icons
 *   logo.svg, logo-dark.svg          horizontal lockups for light / dark backgrounds
 *   favicon.png                      64 x 64
 *   apple-touch-icon.png             180 x 180, full-bleed (iOS applies its own rounded mask)
 *   pwa-192x192.png, pwa-512x512.png standard PWA icons
 *   pwa-maskable-512x512.png         maskable PWA icon (artwork inside the 80% safe zone)
 */
import fs from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';
import { BRAND } from '../src/brand/brand';
import { BrandMark, LogoLockup } from '../src/components/Logo';

const publicDir = path.resolve(process.cwd(), 'public');

function markSvg(variant: 'standard' | 'maskable'): string {
  return renderToStaticMarkup(
    createElement(BrandMark, { size: 512, variant, idPrefix: variant === 'standard' ? 'egt' : 'egtm' }),
  );
}

function lockupSvg(dark: boolean): string {
  return renderToStaticMarkup(
    createElement(LogoLockup, {
      idPrefix: dark ? 'egtd' : 'egtl',
      textFill: dark ? BRAND.textDark : BRAND.textLight,
      accentFill: dark ? BRAND.accentDark : BRAND.accentLight,
      interactive: false,
    }),
  );
}

const write = (name: string, contents: string) =>
  fs.writeFileSync(path.resolve(publicDir, name), `${contents.trim()}\n`);

async function png(svg: string, size: number, name: string) {
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size)
    // Palette quantisation keeps the gradient clean while cutting the file size by ~60-70%.
    .png({ palette: true, quality: 92, effort: 10, dither: 1 })
    .toFile(path.resolve(publicDir, name));
}

async function generateAllIcons() {
  console.log('Generating logo + icon files...');

  const standard = markSvg('standard');
  const maskable = markSvg('maskable');

  write('icon.svg', standard);
  write('icon-maskable.svg', maskable);
  write('logo.svg', lockupSvg(false));
  write('logo-dark.svg', lockupSvg(true));

  await png(standard, 512, 'pwa-512x512.png');
  await png(standard, 192, 'pwa-192x192.png');
  await png(standard, 64, 'favicon.png');
  await png(maskable, 512, 'pwa-maskable-512x512.png');
  // iOS rounds the corners itself and paints transparent pixels black, so use the full-bleed art.
  await png(maskable, 180, 'apple-touch-icon.png');

  console.log('Done: icon.svg, icon-maskable.svg, logo.svg, logo-dark.svg, favicon.png,');
  console.log('      apple-touch-icon.png, pwa-192x192.png, pwa-512x512.png, pwa-maskable-512x512.png');
}

generateAllIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
