#!/usr/bin/env python3
"""WCAG 2.1 contrast checker for the colour pairs used by the UX refactor.

Run:  python3 scripts/check-contrast.py            (prints a table, exits 1 if any pair fails)
Colours are the standard Tailwind palette hex values. Semi-transparent dark tints (e.g. emerald-950/50) are
alpha-blended over the dark card colour (#1E293B) before measuring.
"""
import sys

P = {
 'white':'#FFFFFF','slate-50':'#F8FAFC','slate-100':'#F1F5F9','slate-200':'#E2E8F0','slate-300':'#CBD5E1','slate-500':'#64748B','slate-600':'#475569',
 'slate-700':'#334155','slate-800':'#1E293B','slate-900':'#0F172A','slate-300t':'#CBD5E1','slate-100t':'#F1F5F9','slate-400':'#94A3B8',
 'blue-600':'#2563EB','blue-700':'#1D4ED8','blue-800':'#1E40AF','blue-300':'#93C5FD','blue-200':'#BFDBFE','blue-50':'#EFF6FF','blue-950':'#172554',
 'emerald-50':'#ECFDF5','emerald-100':'#D1FAE5','emerald-200':'#A7F3D0','emerald-300':'#6EE7B7','emerald-800':'#065F46','emerald-900':'#064E3B','emerald-950':'#022C22',
 'amber-50':'#FFFBEB','amber-100':'#FEF3C7','amber-200':'#FDE68A','amber-300':'#FCD34D','amber-900':'#78350F','amber-950':'#451A03',
 'rose-50':'#FFF1F2','rose-100':'#FFE4E6','rose-200':'#FECDD3','rose-300':'#FDA4AF','rose-800':'#9F1239','rose-900':'#881337','rose-950':'#4C0519',
 # dark theme remap used by this repo (premium.css): card = #1E293B, raised = #2A374D, canvas = #0F172A
 'dark-card':'#1E293B','dark-raised':'#2A374D','dark-canvas':'#0F172A',
}

def rgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def blend(fg, bg, a):
    f, b = rgb(fg), rgb(bg)
    return '#%02X%02X%02X' % tuple(round(a*f[i] + (1-a)*b[i]) for i in range(3))

def lum(h):
    def ch(c):
        c /= 255
        return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055) ** 2.4
    r, g, b = rgb(h)
    return 0.2126*ch(r) + 0.7152*ch(g) + 0.0722*ch(b)

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

C = lambda k: P[k]
rows = []  # (label, fg, bg, minimum)
def add(label, fg, bg, minimum=4.5): rows.append((label, fg, bg, minimum))

# Canvas + body text
add('Body text on light canvas (slate-900 on slate-50)', C('slate-900'), C('slate-50'))
add('Secondary text (slate-700 on white)', C('slate-700'), C('white'))
add('Help text (slate-600 on white)', C('slate-600'), C('white'))
add('Body text on dark canvas (slate-100 on slate-900)', C('slate-100'), C('dark-canvas'))
add('Help text dark (slate-300 on dark card)', C('slate-300'), C('dark-card'))
add('Help text dark on raised output card', C('slate-300'), C('dark-raised'))
add('Light output card: slate-700 on slate-100', C('slate-700'), C('slate-100'))
# Accent / CTA
add('Primary CTA: white on blue-600', C('white'), C('blue-600'))
add('Primary CTA hover: white on blue-700', C('white'), C('blue-700'))
add('Outline CTA: blue-800 on white', C('blue-800'), C('white'))
add('Outline CTA dark: blue-300 on dark card', C('blue-300'), C('dark-card'))
add('Active nav link: blue-800 on blue-50', C('blue-800'), C('blue-50'))
add('Active nav link dark: blue-200 on blue-950 (60%)', C('blue-200'), blend(C('blue-950'), C('dark-card'), .6))
# Semantic grades, light
for name, txt, bg in [('A/B Strong', 'emerald-800', 'emerald-50'), ('C Fair', 'amber-900', 'amber-50'), ('D/F Needs work', 'rose-800', 'rose-50')]:
    add(f'Light {name}: {txt} on {bg}', C(txt), C(bg))
for name, txt, bg in [('A/B badge', 'emerald-900', 'emerald-100'), ('C badge', 'amber-900', 'amber-100'), ('D/F badge', 'rose-900', 'rose-100')]:
    add(f'Light {name}: {txt} on {bg}', C(txt), C(bg))
# Semantic grades, light, table rows (tint 70% over white)
for name, txt, bg in [('A/B row', 'emerald-800', 'emerald-50'), ('C row', 'amber-900', 'amber-50'), ('D/F row', 'rose-800', 'rose-50')]:
    add(f'Light {name} text on 70% tint over white', C(txt), blend(C(bg), C('white'), .7))
# Semantic grades, dark
for name, txt, tone in [('A/B', 'emerald-300', 'emerald-950'), ('C', 'amber-300', 'amber-950'), ('D/F', 'rose-300', 'rose-950')]:
    add(f'Dark {name} surface (50% tint on card): {txt}', C(txt), blend(C(tone), C('dark-card'), .5))
    add(f'Dark {name} surface (50% tint on raised card): {txt}', C(txt), blend(C(tone), C('dark-raised'), .5))
    add(f'Dark {name} row (30% tint on card): {txt}', C(txt), blend(C(tone), C('dark-card'), .3))
for name, txt, bg in [('A/B badge', 'emerald-200', 'emerald-950'), ('C badge', 'amber-200', 'amber-950'), ('D/F badge', 'rose-200', 'rose-950')]:
    add(f'Dark {name}: {txt} on {bg}', C(txt), C(bg))
# Non-text UI (3:1): field borders, focus ring
add('Field border light (slate-500 on white) [3:1]', C('slate-500'), C('white'), 3.0)
add('Field border dark (slate-400 on dark card) [3:1]', C('slate-400'), C('dark-card'), 3.0)
add('Focus ring light (blue-600 on slate-50) [3:1]', C('blue-600'), C('slate-50'), 3.0)
add('Focus ring dark (blue-300 on dark canvas) [3:1]', C('blue-300'), C('dark-canvas'), 3.0)
# Table header
add('Sticky table header (slate-800 on slate-100)', C('slate-800'), C('slate-100'))
add('Sticky table header dark (slate-100 on raised)', C('slate-100'), C('dark-raised'))

fails = 0
print(f"{'Pair':<62} {'Ratio':>6}  Need  Result")
for label, fg, bg, need in rows:
    r = ratio(fg, bg)
    ok = r >= need
    fails += (not ok)
    print(f"{label:<62} {r:6.2f}  {need:<4}  {'PASS' if ok else 'FAIL'}")
print(f"\n{len(rows)-fails}/{len(rows)} pairs pass")
sys.exit(1 if fails else 0)
