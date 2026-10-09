// Static WebP guide images served from /images/* with immutable caching headers.
// Keeps the JavaScript bundle lean while allowing search engine image crawlers (Googlebot-Image)
// to index every tool's educational illustration and enabling native lazy-loading below the fold.

/**
 * Safely resolves public asset paths with dynamic base URL support
 * for both root domain deployments and GitHub Pages subpaths.
 */
export function resolveAssetUrl(relativePath: string): string {
  if (!relativePath) return '';
  if (
    relativePath.startsWith('http://') ||
    relativePath.startsWith('https://') ||
    relativePath.startsWith('data:')
  ) {
    return relativePath;
  }

  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;

  // 1. Check Vite base URL
  const viteBase = typeof import.meta !== 'undefined' && import.meta?.env?.BASE_URL;
  if (viteBase && viteBase !== '/' && viteBase !== './') {
    const prefix = viteBase.endsWith('/') ? viteBase : `${viteBase}/`;
    return `${prefix}${cleanPath}`;
  }

  // 2. Check browser location for GitHub Pages repository subpath (e.g. /Easy-Grade-Tool/)
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 0 && !parts[0].includes('.')) {
      return `/${parts[0]}/${cleanPath}`;
    }
  }

  return `/${cleanPath}`;
}

export const RAW_GUIDE_IMAGES: Record<string, string> = {
  quick: 'images/easy-grade-calculator-guide.webp',
  gpa: 'images/gpa-calculator-guide.webp',
  cgpa: 'images/cgpa-calculator-guide.webp',
  tip: 'images/tip-calculator-guide.webp',
  percentage: 'images/percentage-calculator-guide.webp',
  loan: 'images/loan-calculator-guide.webp',
  mortgage: 'images/mortgage-calculator-guide.webp',
  password: 'images/password-generator-guide.webp',
  // Grade-tool guides (components/ToolContentGuide.tsx). They reuse the existing photos for now;
  // to give a tool its own photo, drop a 1200x800 .webp in public/images and change that one line.
  weighted: 'images/easy-grade-calculator-guide.webp',
  'final-exam': 'images/easy-grade-calculator-guide.webp',
  'test-grade': 'images/percentage-calculator-guide.webp',
  'grade-curve': 'images/percentage-calculator-guide.webp',
  'letter-grade': 'images/gpa-calculator-guide.webp',
};

export function getGuideImageUrl(toolKey: string): string {
  const raw = RAW_GUIDE_IMAGES[toolKey] || RAW_GUIDE_IMAGES.quick;
  return resolveAssetUrl(raw);
}

export const GUIDE_IMAGES: Record<string, string> = new Proxy(RAW_GUIDE_IMAGES, {
  get(target, prop: string) {
    const raw = (target as any)[prop] || target.quick;
    return resolveAssetUrl(raw);
  },
});

// Ultra-compact blur placeholders (~400-600 bytes) for instantaneous 0ms perceived paint
export const GUIDE_PLACEHOLDERS: Record<string, string> = {
  quick:
    'data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAABwBACdASoYABAAPzmEuVOvKKWisAgB4CcJQBbZMY2bcH/1v9oQ62VZOUKwAAD+rslmcV9OkeBF6Ft6BVDF5jq6M5MRVnVFDd8uGUJbw/ai20pKCvdqQy+ESj3O38dgzGnxIRHi/ZrnXjqCOwUzuBFM94FSQu/JmgJUx6SV6mijnWjPVgUNyb0sgX0eUERMVwAAAA==',
  gpa:
    'data:image/webp;base64,UklGRqYAAABXRUJQVlA4IJoAAABwBACdASoYABAAPzmGulOvKKWisAgB4CcJYgCdACB/xrpXK3/kMK5GFybcAAD+xQb8Ft3TQx0mhBHsrhbXE0KGESytpjp7CrQkQ5bfqgYXniLFxb6ads+4iXlwILnBBoQjR/wzg8vg+Gj4yK391TVDsShBQvlWWbNykiBJQh2dh128yCj+Eyf5sd5G2BaXxweVDwyATI9MsAAA',
  cgpa:
    'data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAAAwBACdASoYABAAPzmGuVOvKSWisAgB4CcJYwC/OYyApgbyE7K1+5oufVAA/mdhZMcMOjF1RVpuTmg9yFP113bEVi4wrCamZhgeyqa6v/YK+x2fLKm4R5/DY5lCeC4oWtLWjx19qhNS9LmkfSl2neF3pzqxPr4006FcgtRrHJN9i6SORYc3X0rQAAA=',
  tip:
    'data:image/webp;base64,UklGRqIAAABXRUJQVlA4IJYAAAAQBACdASoYABAAPzmEuVOvKKWisAgB4CcJQBdgAno1jwkDQd8ZY5FIAAD+zbuQnrGPA8N/rS4FWaMEtdKvpp/I12LL9JzvpGOO/8A5+cPecv7baiOQUR05CNu45RWCGrgy5j9ZJ2OU37orNPTAu0jEP9HhPrLqRIuw/MgubCiGTO/a0R3DMHZ/yeJvhZU4iYThfhAAAAA=',
  percentage:
    'data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAAAQBACdASoYABAAPzmGuVOvKSWisAgB4CcJYwDE2CPVb8281KZ17uolAAD+3s+a4zzCgtUeIKLEvxwlb9Vfq4y+uzk6ojs64puLq9RRCvBhAUoYoARMnmBLP+oHC3mMBQpCju4oV337lJL2VfGzCAF7SXtRG2A8M1RufDmmklYbjxyiRhXTU0AA',
  loan:
    'data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAABQBACdASoYABAAPzmEuVOvKKWisAgB4CcJQBdkGQBBuhISqHg/exj7hPgAAPymTjLrkBZDEnWuRq30QeTfrEMg/J+2kqtrfZjFYnM/pYllsW4g8ZhjMZNFBJaAPvF4gULU6Srl/bRR5dBH/59qPEu2TGyUSXX1mPmqgMlOYuU6BaMQ6m7CdzlOD6SCyoqqcLn4AAAA',
  mortgage:
    'data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAAAwBACdASoYABAAPzmGuVOvKSWisAgB4CcJYgCsB3gAhFX4MHdcADKMOEwA/mSLQynsFxcNgv+tJaKej+YXgPQXydUoQZU9SNqFlvbn4btvY/Hogr93lC5QbclRLou+vRlxYGgQf7lGsPVK53KpSsdQygOF0Mfr7PAdNMSPn8QeAsYS0Cjewe07Oos3BmS3uxiKSc/+TYDDD9qPAAA=',
  password:
    'data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADwAwCdASoYABAAPzmGuVQvKSWjMAgB4CcJQBOgBFkV5Z2vfYFWO6QAAP7L4iMvNXlBgxuKdvNCGZ5jLCcvk1t9pyg6mBoQ/YmTWv0PThEp7FsMfjhvtHqGirh7wxjBC0+dOvwJwmIq2vgLEUxrxtiROTBniwDwgGZllg+y4AA=',
};

// Blur placeholders for the grade-tool guide images follow the photo each one currently uses.
GUIDE_PLACEHOLDERS.weighted = GUIDE_PLACEHOLDERS.quick;
GUIDE_PLACEHOLDERS['final-exam'] = GUIDE_PLACEHOLDERS.quick;
GUIDE_PLACEHOLDERS['test-grade'] = GUIDE_PLACEHOLDERS.percentage;
GUIDE_PLACEHOLDERS['grade-curve'] = GUIDE_PLACEHOLDERS.percentage;
GUIDE_PLACEHOLDERS['letter-grade'] = GUIDE_PLACEHOLDERS.gpa;
