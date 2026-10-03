// Static WebP guide images served from /images/* with immutable caching headers.
// Keeps the JavaScript bundle lean while allowing search engine image crawlers (Googlebot-Image)
// to index every tool's educational illustration and enabling native lazy-loading below the fold.

export const GUIDE_IMAGES: Record<string, string> = {
  quick: '/images/easy-grade-calculator-guide.webp',
  gpa: '/images/gpa-calculator-guide.webp',
  cgpa: '/images/cgpa-calculator-guide.webp',
  tip: '/images/tip-calculator-guide.webp',
  percentage: '/images/percentage-calculator-guide.webp',
  loan: '/images/loan-calculator-guide.webp',
  mortgage: '/images/mortgage-calculator-guide.webp',
  password: '/images/password-generator-guide.webp',
};

// Ultra-compact blur placeholders (~400-600 bytes) for instantaneous 0ms perceived paint
export const GUIDE_PLACEHOLDERS: Record<string, string> = {
  quick:
    'data:image/webp;base64,UklGRroAAABXRUJQVlA4IK4AAAAwBQCdASoeABQAPzmSv1mvKaajqAgB4CcJZgDHJoAlwz8noimdohC2JfE7Ogs9d452wAD+6zZxmy9rSz5xwvrh2IdLK3oW8Dr7gYEl2rla7zuZcTknCWqyQpf9mV32lSU90fvRmz/KNozYPNcM2x45uRukGt7MeL+Mzn4OTMISrAf+YqpyTB0NoB1dvGQWKMO1Hi970USzBVsUBOqG+bFkprYDyFP0I4e6TEM9QAA=',
  gpa:
    'data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAACwBQCdASoeABQAPzmMu1YvKSYjsBgIAeAnCUAW2QYKFyos0VHeqzBHFabl+G8kqlPla5WcnwAA4n6HEZ5YDiiBJ+UjUI9kDuMaZEqiLRrLapeDO5fID5G4IL6d4EioZ2B44wdaSHrNjN//aUy/oE1y80X9LIYBEoKBdny0GuzEQ4ABAg7EvHrRcAUFRlp8l5tD8t5FQIUlnszexp2WOeCA9slUtmewn8Up7iRi14Zu/HRHLEgAAA==',
  cgpa:
    'data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAACwBQCdASoeABQAPzmMu1YvKSYjsBgIAeAnCUAW2QYKFyos0VHeqzBHFabl+G8kqlPla5WcnwAA4n6HEZ5YDiiBJ+UjUI9kDuMaZEqiLRrLapeDO5fID5G4IL6d4EioZ2B44wdaSHrNjN//aUy/oE1y80X9LIYBEoKBdny0GuzEQ4ABAg7EvHrRcAUFRlp8l5tD8t5FQIUlnszexp2WOeCA9slUtmewn8Up7iRi14Zu/HRHLEgAAA==',
  loan:
    'data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAAAQBQCdASoeABQAPzmIuVOvKSWisAgB4CcJYwC+SBo7tixlaR3/K0DxXfe7iaevRN5wAPy0NENXy4pcrfPNf3IC8OXytPGZQR6B8udFz+fdj9WtoBBrJd6ryDPE5F6eEtwVs7z1cV8iPcYc/sFPGDxlpRUymLIT6yl3Aa4gBPLbsELmAQhz/6Z4STGHRvhCRgc4AAAA',
  mortgage:
    'data:image/webp;base64,UklGRsYAAABXRUJQVlA4ILoAAADwBACdASoeABQAPzmQvFWvKqYjMBgIAeAnCWQAnTKAAW5wBY5h2k9XHtZZPymPxZAA8qQw8CC8CUnqRxZjyLldfBGbQTC4QgtwpxmpCc5LDo6O0IFtxyYYNogFUi1VnRbzv+M0VGPx9pQdbNQ1lpMd7Hm/zfT1CWtLaPJJDaidOx5teP4k9HafkCATKuc2Ree5Jr08S6+pKyrLN/9ZOwA3jc7ILySD9qwdERFV5HJFdqMxQZhMz9BAAAA=',
  password:
    'data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAACQBACdASoeABQAPzmGuVOvKSWisAgB4CcJZzuDr+EVyEOxg329bwPTT5+4VSAA/uv2LmLtYOpZaAAgyBV1ONJFRC3a/shAkJVGp0IqbkMiU9S2qiQQPzdcOeIdRAqNVQf/iz3yMj0wTNVRQYyLnLDUgIXaw+fVo+LvTpT8tyGFRaK4itB/OPPsn+8sN7Kfdol+D16nR/AsmkItpJmAAA==',
  percentage:
    'data:image/webp;base64,UklGRsoAAABXRUJQVlA4IL4AAABQBQCdASoeABQAPzmMwFcvKScjqAqp4CcJbACdM1kBcBS5f3GiWjLHRBdhNd+12WgEQhgA/qwRWq3q7bIDiff5u11sYKhN5aEOcWKfiZZBn/Oo1Na3LFQymFiZJNwK3JLCuBdkKf8GFRgLOeXOL1h26o0mzo4IzKMl5USZBSa3nLF/1tAnlo11Xlms9AfqiSjqerZZzno6/eIwIyuTFHlcv+xpGlGA43Gd9F6sR4JEJ+RGWNxMVsgzxBu3TwAA',
  tip:
    'data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAABQBQCdASoeABQAPzmGuFOvKSUisAgB4CcJbACdMzQ4N1HAL1tFo0DVhEtbbmalixASnsAAyvGMD0IgwMt2ioroedgOxxsk0rBiDGEUow1cGQslZmMbALbfTHMNrRgCOaQBffhdRtMXu14/jPLpWPeKPvxoIQYIVOyuiFl4gJVPdW61nftAvNuiJDHO3QBeqzLJacD7NkU64BXp16SKJi4lcMYO9avbPh1UOVKDN3Y3+FFYFStiGnNX0yf9kqSi8WpE55jEO3WUIVYAAAA=',
};
