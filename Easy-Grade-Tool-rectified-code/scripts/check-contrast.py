#!/usr/bin/env python3
"""WCAG contrast check for the design tokens in src/styles/tokens.css (light and dark).

Reads the real values, so it can never drift from the CSS. Exits 1 if any pair fails.
  text pairs        need 4.5:1   (WCAG 1.4.3)
  UI/border pairs   need 3:1     (WCAG 1.4.11)
Run:  python3 scripts/check-contrast.py
"""
import re, sys, pathlib

css = (pathlib.Path(__file__).resolve().parent.parent / 'src/styles/tokens.css').read_text()

def block(selector):
    m = re.search(re.escape(selector) + r'\s*\{(.*?)\n\}', css, re.S)
    return dict(re.findall(r'--c-([\w-]+):\s*(#[0-9a-fA-F]{6})', m.group(1)))

light, dark = block(':root'), block('.dark')

def lum(h):
    h = h.lstrip('#'); r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

# (foreground token, background token, minimum ratio, what it is)
PAIRS = [
    ('ink', 'surface', 4.5, 'body text on cards'), ('ink', 'canvas', 4.5, 'body text on page'), ('ink', 'sunken', 4.5, 'text on panels'),
    ('ink-2', 'surface', 4.5, 'secondary text on cards'), ('ink-2', 'canvas', 4.5, 'secondary text on page'), ('ink-2', 'sunken', 4.5, 'secondary text on panels'),
    ('ink-3', 'surface', 4.5, 'captions on cards'), ('ink-3', 'canvas', 4.5, 'captions on page'), ('ink-3', 'sunken', 4.5, 'captions on panels'),
    ('brand', 'surface', 4.5, 'links on cards'), ('brand', 'canvas', 4.5, 'links on page'),
    ('on-brand', 'brand', 4.5, 'primary button label'), ('on-brand', 'brand-hover', 4.5, 'primary button label (hover)'),
    ('brand-ink', 'brand-soft', 4.5, 'selected nav / tinted result'),
    ('good', 'surface', 4.5, 'grade A/B text'), ('fair', 'surface', 4.5, 'grade C text'), ('poor', 'surface', 4.5, 'grade D/F and error text'),
    ('line-strong', 'surface', 3.0, 'form-field border on cards'), ('line-strong', 'field', 3.0, 'form-field border on its own fill'),
    ('focus', 'surface', 3.0, 'keyboard focus ring on cards'), ('focus', 'canvas', 3.0, 'keyboard focus ring on page'),
]

fails = 0
for name, tokens in (('LIGHT', light), ('DARK', dark)):
    merged = {**light, **tokens}
    print(f'\n{name}')
    for fg, bg, need, what in PAIRS:
        r = ratio(merged[fg], merged[bg]); ok = r >= need; fails += (not ok)
        print(f"  {'PASS' if ok else 'FAIL'}  {r:5.2f}:1 (need {need})  {fg:11} on {bg:11} {what}")
print(f'\n{fails} failing pair(s)'); sys.exit(1 if fails else 0)
