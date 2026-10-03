import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');

// Standard Brand Icon SVG (512x512)
const standardIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#097362" />
      <stop offset="50%" stop-color="#085e50" />
      <stop offset="100%" stop-color="#053e34" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#021f1a" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Background rounded card -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Subtle ambient inner glow -->
  <circle cx="410" cy="100" r="140" fill="#34d399" opacity="0.18" />
  <circle cx="100" cy="420" r="160" fill="#f59e0b" opacity="0.12" />

  <!-- Calculator Main Body -->
  <g filter="url(#shadow)">
    <rect x="116" y="96" width="280" height="330" rx="36" fill="#0f2b26" stroke="#10b981" stroke-width="6" stroke-opacity="0.5" />
    
    <!-- Screen Display -->
    <rect x="146" y="132" width="220" height="76" rx="16" fill="#041814" stroke="#10b981" stroke-width="2" stroke-opacity="0.3" />
    <!-- Screen Text: "A+ 100%" -->
    <text x="166" y="184" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="url(#goldGrad)" letter-spacing="1">A+</text>
    <text x="344" y="184" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="800" fill="url(#accentGrad)">100%</text>

    <!-- Keypad Grid (3x3 grid) -->
    <!-- Row 1 -->
    <rect x="146" y="230" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="175" y="261" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">7</text>

    <rect x="227" y="230" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="256" y="261" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">8</text>

    <rect x="308" y="230" width="58" height="46" rx="12" fill="#059669" />
    <text x="337" y="261" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="22" font-weight="800" fill="#ffffff">÷</text>

    <!-- Row 2 -->
    <rect x="146" y="292" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="175" y="323" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">4</text>

    <rect x="227" y="292" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="256" y="323" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">5</text>

    <rect x="308" y="292" width="58" height="46" rx="12" fill="#059669" />
    <text x="337" y="323" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="22" font-weight="800" fill="#ffffff">×</text>

    <!-- Row 3 -->
    <rect x="146" y="354" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="175" y="385" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">1</text>

    <rect x="227" y="354" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="256" y="385" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">2</text>

    <rect x="308" y="354" width="58" height="46" rx="12" fill="url(#goldGrad)" />
    <text x="337" y="385" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="22" font-weight="800" fill="#041814">=</text>
  </g>

  <!-- Sparkle floating accent in top right -->
  <path d="M410 70 L416 88 L434 94 L416 100 L410 118 L404 100 L386 94 L404 88 Z" fill="url(#goldGrad)" />
</svg>
`;

// Maskable Icon SVG (512x512) - Full bleed background, all essential artwork strictly inside 80% circle (radius 204px)
const maskableIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#097362" />
      <stop offset="50%" stop-color="#085e50" />
      <stop offset="100%" stop-color="#053e34" />
    </linearGradient>
    <linearGradient id="mAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="mGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background for maskable circle/squircle clipping -->
  <rect width="512" height="512" fill="url(#mBgGrad)" />

  <!-- Scaled content centered within safe zone (80% box = 410px) -->
  <g transform="translate(256, 256) scale(0.8) translate(-256, -260)">
    <!-- Ambient Inner Glow -->
    <circle cx="390" cy="110" r="120" fill="#34d399" opacity="0.22" />
    <circle cx="120" cy="400" r="140" fill="#f59e0b" opacity="0.15" />

    <!-- Calculator Main Body -->
    <rect x="116" y="96" width="280" height="330" rx="36" fill="#0f2b26" stroke="#10b981" stroke-width="6" stroke-opacity="0.6" />
    
    <!-- Screen Display -->
    <rect x="146" y="132" width="220" height="76" rx="16" fill="#041814" stroke="#10b981" stroke-width="2" stroke-opacity="0.3" />
    <text x="166" y="184" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="url(#mGoldGrad)" letter-spacing="1">A+</text>
    <text x="344" y="184" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="800" fill="url(#mAccentGrad)">100%</text>

    <!-- Keypad Grid -->
    <rect x="146" y="230" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="175" y="261" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">7</text>

    <rect x="227" y="230" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="256" y="261" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">8</text>

    <rect x="308" y="230" width="58" height="46" rx="12" fill="#059669" />
    <text x="337" y="261" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="22" font-weight="800" fill="#ffffff">÷</text>

    <rect x="146" y="292" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="175" y="323" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">4</text>

    <rect x="227" y="292" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="256" y="323" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">5</text>

    <rect x="308" y="292" width="58" height="46" rx="12" fill="#059669" />
    <text x="337" y="323" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="22" font-weight="800" fill="#ffffff">×</text>

    <rect x="146" y="354" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="175" y="385" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">1</text>

    <rect x="227" y="354" width="58" height="46" rx="12" fill="#1b423b" />
    <text x="256" y="385" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0">2</text>

    <rect x="308" y="354" width="58" height="46" rx="12" fill="url(#mGoldGrad)" />
    <text x="337" y="385" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="22" font-weight="800" fill="#041814">=</text>

    <path d="M410 70 L416 88 L434 94 L416 100 L410 118 L404 100 L386 94 L404 88 Z" fill="url(#mGoldGrad)" />
  </g>
</svg>
`;

async function generateAllIcons() {
  console.log('Generating PWA icons...');

  // Save base SVGs
  fs.writeFileSync(path.resolve(publicDir, 'icon.svg'), standardIconSvg.trim());
  fs.writeFileSync(path.resolve(publicDir, 'icon-maskable.svg'), maskableIconSvg.trim());

  // Generate 512x512 standard PNG
  await sharp(Buffer.from(standardIconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.resolve(publicDir, 'pwa-512x512.png'));

  // Generate 192x192 standard PNG
  await sharp(Buffer.from(standardIconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.resolve(publicDir, 'pwa-192x192.png'));

  // Generate 512x512 maskable PNG
  await sharp(Buffer.from(maskableIconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.resolve(publicDir, 'pwa-maskable-512x512.png'));

  // Generate 180x180 Apple Touch Icon PNG
  await sharp(Buffer.from(standardIconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.resolve(publicDir, 'apple-touch-icon.png'));

  // Generate 64x64 favicon PNG / favicon.ico
  await sharp(Buffer.from(standardIconSvg))
    .resize(64, 64)
    .png()
    .toFile(path.resolve(publicDir, 'favicon.png'));

  console.log('Successfully generated all PWA icons:');
  console.log('- public/icon.svg');
  console.log('- public/pwa-192x192.png');
  console.log('- public/pwa-512x512.png');
  console.log('- public/pwa-maskable-512x512.png');
  console.log('- public/apple-touch-icon.png');
  console.log('- public/favicon.png');
}

generateAllIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
