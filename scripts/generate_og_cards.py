"""Regenerates the 1200x630 social share cards with the Easy Grade Tool brand.
Run: python3 scripts/generate_og_cards.py   (needs Pillow + DejaVu fonts)"""
from PIL import Image, ImageDraw, ImageFont
import os

BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
OUT = os.path.join(os.path.dirname(__file__), "..", "public")

CARDS = {
    "og-cards/grade-calculator-1200x630.png": ("Easy Grade Calculator\n& EZ Grader Chart", "Test scores, letter grades and printable charts"),
    "og-cards/gpa-calculator-1200x630.png": ("GPA Calculator", "Semester and cumulative GPA on the 4.0 scale"),
    "og-cards/cgpa-calculator-1200x630.png": ("CGPA to Percentage\nCalculator", "10.0, 5.0 and 4.0 scale conversions"),
    "og-cards/tip-calculator-1200x630.png": ("Tip Calculator", "Work out the tip and split the bill"),
    "og-cards/percentage-calculator-1200x630.png": ("Percentage Calculator", "Percent of a number and percent change"),
    "og-cards/loan-calculator-1200x630.png": ("Loan Calculator", "Monthly payment and amortization table"),
    "og-cards/mortgage-calculator-1200x630.png": ("Mortgage Calculator", "Monthly home loan payment and interest cost"),
    "og-cards/password-generator-1200x630.png": ("Password Generator", "Strong random passwords made in your browser"),
    "og-image.png": ("Easy Grade Tool", "Free grade, GPA and everyday calculators"),
}

def gradient(w, h, c1, c2):
    img = Image.new("RGB", (w, h), c1)
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = (x / w * 0.5 + y / h * 0.5)
            px[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
    return img

def make(path, title, sub):
    W, H = 1200, 630
    img = gradient(W, H, (10, 29, 26), (6, 21, 19))
    d = ImageDraw.Draw(img, "RGBA")
    d.ellipse((760, -220, 1380, 400), fill=(16, 185, 129, 40))
    d.ellipse((-200, 380, 360, 940), fill=(16, 185, 129, 28))
    # brand pill
    pill_font = ImageFont.truetype(BOLD, 26)
    d.rounded_rectangle((90, 90, 420, 142), radius=26, fill=(16, 185, 129, 40), outline=(16, 185, 129, 160), width=2)
    d.text((118, 102), "EASY GRADE TOOL", font=pill_font, fill=(52, 211, 153))
    # title
    size = 84 if "\n" not in title and len(title) < 22 else 72
    tf = ImageFont.truetype(BOLD, size)
    y = 190
    for line in title.split("\n"):
        d.text((90, y), line, font=tf, fill=(255, 255, 255))
        y += int(size * 1.2)
    d.text((90, y + 14), sub, font=ImageFont.truetype(REG, 34), fill=(148, 163, 184))
    # domain
    d.rectangle((90, 520, 150, 524), fill=(16, 185, 129))
    d.text((90, 540), "www.easygradetool.com", font=ImageFont.truetype(BOLD, 30), fill=(203, 213, 225))
    full = os.path.join(OUT, path)
    img.save(full, optimize=True)
    print("wrote", path, os.path.getsize(full) // 1024, "KB")

for p, (t, s) in CARDS.items():
    make(p, t, s)
