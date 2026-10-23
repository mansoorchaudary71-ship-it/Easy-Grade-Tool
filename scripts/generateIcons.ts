/**
 * Generates every logo / icon file in /public from the single brand source:
 *   src/brand/brand.ts  +  src/components/Logo.tsx
 *
 * Run:  npx tsx scripts/generateIcons.ts
 *
 * Output (all in /public):
 *   icon.svg, icon-maskable.svg      vector app icons
 *   logo.svg, logo-dark.svg          horizontal lockups for light / dark backgrounds
 *   favicon.png                      96 x 96  (Google needs a multiple of 48 px)
 *   favicon-48x48.png                48 x 48  (the size Google Search shows next to results)
 *   favicon-96x96.png                96 x 96
 *   favicon.ico                      16 / 32 / 48 px, served at /favicon.ico (the default crawlers request)
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

/** Multi-size .ico (PNG-compressed entries, supported by every current browser and crawler). */
async function ico(svg: string, sizes: number[], name: string) {
  const images = await Promise.all(
    sizes.map((size) =>
      sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer(),
    ),
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map((img, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0); // width
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1); // height
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(img.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += img.length;
    return e;
  });
  fs.writeFileSync(path.resolve(publicDir, name), Buffer.concat([header, ...entries, ...images]));
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
  await png(standard, 96, 'favicon.png');
  await png(standard, 48, 'favicon-48x48.png');
  await png(standard, 96, 'favicon-96x96.png');
  await ico(standard, [16, 32, 48], 'favicon.ico');
  await png(maskable, 512, 'pwa-maskable-512x512.png');
  // iOS rounds the corners itself and paints transparent pixels black, so use the full-bleed art.
  await png(maskable, 180, 'apple-touch-icon.png');

  console.log('Done: icon.svg, icon-maskable.svg, logo.svg, logo-dark.svg, favicon.png, favicon-48x48.png,');
  console.log('      favicon-96x96.png, favicon.ico,');
  console.log('      apple-touch-icon.png, pwa-192x192.png, pwa-512x512.png, pwa-maskable-512x512.png');
}

generateAllIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
