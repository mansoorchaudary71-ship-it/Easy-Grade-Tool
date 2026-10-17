"""Regenerates the 1200x630 social share cards with the Easy Grade Tool brand.
Run: python3 scripts/generate_og_cards.py   (needs Pillow + DejaVu fonts)"""
from PIL import Image, ImageDraw, ImageFont
import os
import re
import sys

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
    "og-cards/test-grade-calculator-1200x630.png": ("Test Grade\nCalculator", "Percent and letter from points earned"),
    "og-cards/grade-curve-calculator-1200x630.png": ("Grade Curve\nCalculator", "Four curving methods, class mean and median"),
    "og-cards/letter-grade-calculator-1200x630.png": ("Letter Grade\nCalculator", "Percent to letter and GPA points"),
    "og-cards/average-grade-calculator-1200x630.png": ("Average Grade\nCalculator", "Mean, median and letter for any list of scores"),
    "og-cards/grading-scale-1200x630.png": ("Grading Scale Charts", "Score charts for tests of 5 to 100 questions"),
    "og-cards/weighted-gpa-calculator-1200x630.png": ("Weighted GPA\nCalculator", "Honors, AP and IB bonus points, weighted and unweighted"),
    "og-cards/weighted-vs-unweighted-gpa-1200x630.png": ("Weighted vs\nUnweighted GPA", "What each means, with a side-by-side example"),
    "og-cards/how-many-questions-can-i-miss-1200x630.png": ("How Many Questions\nCan I Miss?", "Most wrong answers allowed for an A, B or C"),
}

# One card per /grading-scale/N-questions/ page. The list is read from src/data/gradingScaleSizes.ts so there is a single source of truth.
_sizes_src = open(os.path.join(os.path.dirname(__file__), "..", "src", "data", "gradingScaleSizes.ts"), encoding="utf8").read()
_m = re.search(r"GRADING_SCALE_SIZES[^=]*=\s*\[([^\]]*)\]", _sizes_src)
GRADING_SCALE_SIZES = [int(x) for x in re.findall(r"\d+", _m.group(1))]
for _n in GRADING_SCALE_SIZES:
    CARDS[f"og-cards/grading-scale-{_n}-questions-1200x630.png"] = (
        f"{_n}-Question\nGrading Scale",
        f"Each answer is {round(100 / _n, 2):g}%. Percent and letter for every score",
    )

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
    img = gradient(W, H, (17, 21, 38), (10, 13, 24))
    d = ImageDraw.Draw(img, "RGBA")
    d.ellipse((760, -220, 1380, 400), fill=(102, 118, 168, 40))
    d.ellipse((-200, 380, 360, 940), fill=(102, 118, 168, 28))
    # brand pill
    pill_font = ImageFont.truetype(BOLD, 26)
    d.rounded_rectangle((90, 90, 420, 142), radius=26, fill=(102, 118, 168, 40), outline=(102, 118, 168, 160), width=2)
    d.text((118, 102), "EASY GRADE TOOL", font=pill_font, fill=(160, 172, 214))
    # title
    size = 84 if "\n" not in title and len(title) < 22 else 72
    tf = ImageFont.truetype(BOLD, size)
    y = 190
    for line in title.split("\n"):
        d.text((90, y), line, font=tf, fill=(255, 255, 255))
        y += int(size * 1.2)
    d.text((90, y + 14), sub, font=ImageFont.truetype(REG, 34), fill=(148, 163, 184))
    # domain
    d.rectangle((90, 520, 150, 524), fill=(102, 118, 168))
    d.text((90, 540), "www.easygradetool.com", font=ImageFont.truetype(BOLD, 30), fill=(203, 213, 225))
    full = os.path.join(OUT, path)
    img.save(full, optimize=True)
    print("wrote", path, os.path.getsize(full) // 1024, "KB")

# Pass --missing to create only the cards that do not exist yet (leaves existing PNGs untouched).
only_missing = "--missing" in sys.argv
for p, (t, s) in CARDS.items():
    if only_missing and os.path.exists(os.path.join(OUT, p)):
        continue
    make(p, t, s)
