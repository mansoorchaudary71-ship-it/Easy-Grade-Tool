import { CalculationMode, CourseItem, ValidatedAssessment } from '../types';
import { GRADING_SCALES, GRADE_POINT_MAP } from '../data/constants';
import { SITE_URL } from '../data/seoConfig';

interface GradeReportOptions {
  courseName?: string;
  studentName?: string;
  mode: CalculationMode;
  scale: 'standard' | 'plus';
  percent: number;
  letter: string;
  targetGrade?: string | number;
  assessments: ValidatedAssessment[];
  whatIf?: {
    earned: string;
    possible: string;
    weight?: string;
    projectedPercent: number;
    projectedLetter: string;
    targetGrade?: string;
    impactDelta?: number;
    neededScore?: string;
  } | null;
}

export async function exportGradeReportPdf(data: GradeReportOptions): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Banner Background
  doc.setFillColor(31, 89, 80); // #1f5950 deep teal
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  // App Brand & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('EASY GRADE CALCULATOR', margin + 8, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 240, 235);
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
  doc.text(`Official Academic Calculation Report · Generated ${dateStr}`, margin + 8, y + 18);

  y += 30;

  // Student & Course Meta Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('COURSE / SUBJECT:', margin + 6, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(data.courseName?.trim() || 'General Coursework', margin + 42, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('GRADING SYSTEM:', margin + 6, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const modeLabel =
    data.mode === 'weighted'
      ? 'Weighted Percentages'
      : data.mode === 'quick-grader'
      ? 'EZ Grader (Test Score)'
      : 'Total Points Based';
  const scaleLabel = data.scale === 'plus' ? 'Plus / Minus Scale' : 'Standard 10-Point Scale';
  doc.text(`${modeLabel} (${scaleLabel})`, margin + 42, y + 13);

  if (data.studentName?.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('STUDENT:', margin + 115, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(data.studentName.trim(), margin + 138, y + 7);
  }

  y += 24;

  // Main Grade Result Card
  doc.setFillColor(240, 253, 250); // soft teal tint
  doc.setDrawColor(45, 140, 126);
  doc.setLineWidth(0.7);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(31, 89, 80);
  doc.text('CURRENT GRADE SUMMARY', margin + 8, y + 7);

  // Large percent and letter
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  const percentStr = `${data.percent.toFixed(1)}%`;
  doc.text(percentStr, margin + 8, y + 20);

  // Letter Grade badge
  const letterBoxX = margin + 8 + doc.getTextWidth(percentStr) + 6;
  doc.setFillColor(31, 89, 80);
  doc.roundedRect(letterBoxX, y + 10, 16, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(data.letter, letterBoxX + 8, y + 18.5, { align: 'center' });

  // Status message
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const statusText =
    data.percent >= 90
      ? 'Status: Excellent Academic Standing (Grade A)'
      : data.percent >= 80
      ? 'Status: Commendable Performance (Grade B)'
      : data.percent >= 70
      ? 'Status: Satisfactory Academic Standing (Grade C)'
      : data.percent >= 60
      ? 'Status: Passing Requirement Met (Grade D)'
      : 'Status: Action Required (Below Passing Threshold)';
  doc.text(statusText, margin + 110, y + 17, { align: 'right' });

  y += 33;

  // Assessments Table Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Assessment Breakdown', margin, y);

  y += 5;

  // Table Columns Setup
  const cols = [
    { label: '#', x: margin + 3, w: 10, align: 'left' as const },
    { label: 'Assessment Name', x: margin + 14, w: 60, align: 'left' as const },
    { label: 'Earned', x: margin + 85, w: 22, align: 'right' as const },
    { label: 'Possible', x: margin + 110, w: 22, align: 'right' as const },
    { label: 'Score %', x: margin + 135, w: 20, align: 'right' as const },
    ...(data.mode === 'weighted'
      ? [{ label: 'Weight', x: margin + 160, w: 14, align: 'right' as const }]
      : []),
  ];

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);

  cols.forEach((col) => {
    doc.text(col.label, col.x, y + 4.8, { align: col.align });
  });

  y += 7;

  // Table Data Rows
  const validItems = data.assessments.filter((a) => !a.invalid);
  validItems.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, y, contentWidth, 7, 'F');

    // Bottom row border
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    const scorePct = item.maxNum > 0 ? (item.scoreNum / item.maxNum) * 100 : 0;

    doc.text(String(idx + 1), cols[0].x, y + 4.8, { align: cols[0].align });
    doc.setFont('helvetica', 'bold');
    doc.text(item.name || `Assessment ${idx + 1}`, cols[1].x, y + 4.8, {
      align: cols[1].align,
    });
    doc.setFont('helvetica', 'normal');
    doc.text(String(item.scoreNum), cols[2].x, y + 4.8, { align: cols[2].align });
    doc.text(String(item.maxNum), cols[3].x, y + 4.8, { align: cols[3].align });
    doc.text(`${scorePct.toFixed(1)}%`, cols[4].x, y + 4.8, { align: cols[4].align });

    if (data.mode === 'weighted' && cols[5]) {
      doc.text(`${item.weightNum}`, cols[5].x, y + 4.8, { align: cols[5].align });
    }

    y += 7;
  });

  // Table Totals / Summary Row
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  const totalEarned = validItems.reduce((acc, c) => acc + c.scoreNum, 0);
  const totalPossible = validItems.reduce((acc, c) => acc + c.maxNum, 0);
  const totalWeight = validItems.reduce((acc, c) => acc + c.weightNum, 0);

  doc.text('TOTAL / OVERALL', cols[1].x, y + 5.5);
  doc.text(String(totalEarned), cols[2].x, y + 5.5, { align: cols[2].align });
  doc.text(String(totalPossible), cols[3].x, y + 5.5, { align: cols[3].align });
  doc.text(`${data.percent.toFixed(1)}%`, cols[4].x, y + 5.5, { align: cols[4].align });

  if (data.mode === 'weighted' && cols[5]) {
    doc.text(String(totalWeight), cols[5].x, y + 5.5, { align: cols[5].align });
  }

  y += 14;

  // What-If & Target Grade Simulation (if tested)
  if (data.whatIf) {
    const boxHeight = data.whatIf.targetGrade || data.whatIf.neededScore ? 19 : 14;
    doc.setFillColor(240, 253, 250); // soft teal/neutral
    doc.setDrawColor(45, 140, 126);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(31, 89, 80);
    const targetTag = data.whatIf.targetGrade ? ` (Target Goal: ${data.whatIf.targetGrade}%)` : '';
    doc.text(`UPCOMING ASSIGNMENT & TARGET GRADE SIMULATION${targetTag}:`, margin + 6, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const whatIfWeightPart = data.mode === 'weighted' && data.whatIf.weight
      ? ` (Weight: ${data.whatIf.weight})`
      : '';
    const deltaText = data.whatIf.impactDelta !== undefined
      ? ` [Impact: ${data.whatIf.impactDelta >= 0 ? '+' : ''}${data.whatIf.impactDelta.toFixed(1)}%]`
      : '';
    doc.text(
      `Hypothetical score of ${data.whatIf.earned}/${data.whatIf.possible} points${whatIfWeightPart} yields projected final grade of ${data.whatIf.projectedPercent.toFixed(1)}% (${data.whatIf.projectedLetter})${deltaText}.`,
      margin + 6,
      y + 10.5
    );

    if (data.whatIf.neededScore) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(31, 89, 80);
      doc.text(`Required to achieve target: ${data.whatIf.neededScore}`, margin + 6, y + 15.5);
    }

    y += boxHeight + 5;
  }

  // Grading Scale Reference Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Institutional Scale Reference', margin, y);

  y += 4;
  const currentScale = GRADING_SCALES[data.scale];
  const scaleItemW = contentWidth / currentScale.length;

  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 11, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.rect(margin, y, contentWidth, 11, 'D');

  currentScale.forEach((s, idx) => {
    const boxX = margin + idx * scaleItemW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(s.letter, boxX + scaleItemW / 2, y + 4.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${s.min}%+`, boxX + scaleItemW / 2, y + 8.5, { align: 'center' });
  });

  y += 20;

  // Footer Note & Verification Notice
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const domainDisplay = SITE_URL.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  doc.text(
    `Generated by Easy Grade Calculator · ${domainDisplay}`,
    margin,
    y
  );
  doc.text(
    'Please verify any specific syllabus weights, dropped grades, or curve policies with your institution.',
    margin,
    y + 4
  );

  // File download
  const safeCourse = (data.courseName || 'grade-report')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_');
  doc.save(`${safeCourse}_grade_report.pdf`);
}

export async function exportGpaReportPdf(data: {
  studentName?: string;
  semesterName?: string;
  gpa: number;
  totalCredits: number;
  courses: CourseItem[];
}): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Banner
  doc.setFillColor(124, 69, 211); // Purple theme
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('GPA & COURSEWORK TRANSCRIPT REPORT', margin + 8, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(243, 232, 255);
  const now = new Date();
  doc.text(
    `Easy Grade Calculator · 4.0 Scale System · Generated ${now.toLocaleDateString()}`,
    margin + 8,
    y + 18
  );

  y += 32;

  // Summary Card
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(192, 132, 252);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(124, 69, 211);
  doc.text('CUMULATIVE / SEMESTER GPA', margin + 8, y + 7);

  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.gpa.toFixed(2)} / 4.0`, margin + 8, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Total Credits Earned: ${data.totalCredits.toFixed(1)}   |   Courses: ${data.courses.length}`, margin + 80, y + 16);

  y += 32;

  // Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Courses & Quality Points', margin, y);

  y += 5;

  const cols = [
    { label: '#', x: margin + 3, align: 'left' as const },
    { label: 'Course Name', x: margin + 14, align: 'left' as const },
    { label: 'Credits', x: margin + 110, align: 'right' as const },
    { label: 'Letter Grade', x: margin + 140, align: 'center' as const },
    { label: 'Quality Points', x: margin + 170, align: 'right' as const },
  ];

  doc.setFillColor(243, 232, 255);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFontSize(8.5);
  doc.setTextColor(88, 28, 135);

  cols.forEach((c) => doc.text(c.label, c.x, y + 4.8, { align: c.align }));

  y += 7;

  data.courses.forEach((c, idx) => {
    const credits = parseFloat(c.credits) || 0;
    const qp = (GRADE_POINT_MAP[c.grade] ?? 0) * credits;

    doc.setFillColor(idx % 2 === 0 ? '#ffffff' : '#f9f5ff');
    doc.rect(margin, y, contentWidth, 7, 'F');

    doc.setDrawColor(243, 232, 255);
    doc.setLineWidth(0.2);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    doc.text(String(idx + 1), cols[0].x, y + 4.8, { align: cols[0].align });
    doc.setFont('helvetica', 'bold');
    doc.text(c.name || `Course ${idx + 1}`, cols[1].x, y + 4.8, { align: cols[1].align });
    doc.setFont('helvetica', 'normal');
    doc.text(credits.toFixed(1), cols[2].x, y + 4.8, { align: cols[2].align });
    doc.text(c.grade, cols[3].x, y + 4.8, { align: cols[3].align });
    doc.text(qp.toFixed(1), cols[4].x, y + 4.8, { align: cols[4].align });

    y += 7;
  });

  y += 15;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const domainDisplay = SITE_URL.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  doc.text(`Generated by Easy Grade Calculator · ${domainDisplay}`, margin, y);
  doc.text('Calculated using standard 4.0 collegiate scale (A=4.0, B=3.0, C=2.0, D=1.0, F=0.0).', margin, y + 4);

  doc.save('gpa_calculation_report.pdf');
}

export async function exportLoanReportPdf(data: {
  title: string;
  principal: number;
  rate: number;
  years: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  extraMonthly?: number;
  downPayment?: number;
  homePrice?: number;
}): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Banner
  doc.setFillColor(37, 131, 84); // Green loan theme
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`${data.title.toUpperCase()} REPORT`, margin + 8, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 252, 231);
  const now = new Date();
  doc.text(
    `Easy Grade Calculator · Financial Planning Series · Generated ${now.toLocaleDateString()}`,
    margin + 8,
    y + 18
  );

  y += 32;

  // Monthly Payment Card
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(74, 222, 128);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52);
  doc.text('ESTIMATED MONTHLY PAYMENT', margin + 8, y + 7);

  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  const formattedMonthly = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.monthlyPayment);
  doc.text(formattedMonthly, margin + 8, y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Fixed Rate Term: ${data.years} years (${data.years * 12} months)`, margin + 80, y + 17);

  y += 34;

  // Details Summary Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Payment & Financing Breakdown', margin, y);

  y += 6;

  const rows: [string, string][] = [
    ...(data.homePrice ? [['Property / Purchase Price', `$${data.homePrice.toLocaleString()}`] as [string, string]] : []),
    ...(data.downPayment ? [['Down Payment', `$${data.downPayment.toLocaleString()}`] as [string, string]] : []),
    ['Total Principal Borrowed', `$${data.principal.toLocaleString()}`],
    ['Annual Interest Rate', `${data.rate.toFixed(2)}%`],
    ['Loan Term Length', `${data.years} years`],
    ...(data.extraMonthly ? [['Estimated Taxes & Insurance / Month', `$${data.extraMonthly.toFixed(2)}`] as [string, string]] : []),
    ['Total Lifetime Interest', `$${data.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Total Lifetime Payments', `$${data.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
  ];

  rows.forEach(([label, value], idx) => {
    doc.setFillColor(idx % 2 === 0 ? '#ffffff' : '#f8fafc');
    doc.rect(margin, y, contentWidth, 8, 'F');

    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(margin, y + 8, margin + contentWidth, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(label, margin + 5, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(value, margin + contentWidth - 5, y + 5.5, { align: 'right' });

    y += 8;
  });

  y += 14;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const domainDisplay = SITE_URL.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  doc.text(`Generated by Easy Grade Calculator · ${domainDisplay}`, margin, y);
  doc.text('Calculated for informational and planning purposes only. Consult lender for exact APR and escrow conditions.', margin, y + 4);

  doc.save(`${data.title.toLowerCase().replace(/\s+/g, '_')}_calculation_report.pdf`);
}

export interface QuickGradePdfOptions {
  totalQuestions: number;
  scaleType: 'standard' | 'plus';
  showDecimals: boolean;
  thresholds: { A: number; B: number; C: number; D: number };
  letterGroups: Array<{
    letter: string;
    minThreshold?: number;
    items: Array<{ wrong: number; percentage: number; letter: string }>;
  }>;
}

export async function exportQuickGradePdf(options: QuickGradePdfOptions): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Banner Background
  doc.setFillColor(31, 89, 80); // #1f5950 deep teal
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('EASY GRADE — QUICK GRADING CHART', margin + 6, y + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(220, 240, 235);
  const scaleDesc =
    options.scaleType === 'plus'
      ? 'Scale: Plus / Minus (A, A-, B+...)'
      : `Scale: Standard (A≥${options.thresholds.A}%, B≥${options.thresholds.B}%, C≥${options.thresholds.C}%, D≥${options.thresholds.D}%)`;
  doc.text(
    `Total Questions: ${options.totalQuestions}  |  ${scaleDesc}  |  Decimals: ${options.showDecimals ? 'Yes' : 'No'}`,
    margin + 6,
    y + 15
  );

  y += 24;

  // Flatten and sort items by number of wrong answers ascending
  const allItems: Array<{ wrong: number; percentage: number; letter: string }> = [];
  options.letterGroups.forEach((group) => {
    group.items.forEach((item) => {
      allItems.push(item);
    });
  });
  allItems.sort((a, b) => a.wrong - b.wrong);

  // Determine number of columns based on total item count
  const numCols = options.totalQuestions <= 30 ? 2 : options.totalQuestions <= 75 ? 3 : 4;
  const colGap = 4;
  const colWidth = (contentWidth - (numCols - 1) * colGap) / numCols;
  const rowHeight = 5.2;

  let currentItemIdx = 0;
  let pageNum = 1;

  while (currentItemIdx < allItems.length) {
    if (pageNum > 1) {
      doc.addPage();
      y = margin;

      // Small secondary header for continuation pages
      doc.setFillColor(31, 89, 80);
      doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(
        `EASY GRADE — QUICK GRADING CHART (Cont. · Page ${pageNum})`,
        margin + 5,
        y + 6.5
      );
      y += 14;
    }

    const availableHeight = pageHeight - y - 14;
    const pageRows = Math.floor(availableHeight / rowHeight);
    const pageCapacity = pageRows * numCols;
    const pageItems = allItems.slice(currentItemIdx, currentItemIdx + pageCapacity);

    // Render table headers for each column
    for (let c = 0; c < numCols; c++) {
      const colX = margin + c * (colWidth + colGap);
      doc.setFillColor(241, 245, 249);
      doc.rect(colX, y, colWidth, 5.5, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.rect(colX, y, colWidth, 5.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text('# Wrong', colX + 2, y + 3.8);
      doc.text('Grade', colX + colWidth * 0.48, y + 3.8, { align: 'center' });
      doc.text('Score', colX + colWidth - 2, y + 3.8, { align: 'right' });
    }

    const startY = y + 5.5;
    const itemsPerCol = Math.ceil(pageItems.length / numCols);

    for (let i = 0; i < pageItems.length; i++) {
      const item = pageItems[i];
      const colIdx = Math.floor(i / itemsPerCol);
      const rowIdx = i % itemsPerCol;

      const cellX = margin + colIdx * (colWidth + colGap);
      const cellY = startY + rowIdx * rowHeight;

      const isEven = rowIdx % 2 === 0;
      doc.setFillColor(isEven ? '#ffffff' : '#f8fafc');
      doc.rect(cellX, cellY, colWidth, rowHeight, 'F');

      // Thin bottom line
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.15);
      doc.line(cellX, cellY + rowHeight, cellX + colWidth, cellY + rowHeight);

      // Wrong text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(225, 29, 72); // rose/crimson for wrong
      doc.text(`${item.wrong} wrong`, cellX + 2, cellY + 3.6);

      // Grade badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      if (item.letter.startsWith('A')) doc.setTextColor(16, 185, 129);
      else if (item.letter.startsWith('B')) doc.setTextColor(59, 130, 246);
      else if (item.letter.startsWith('C')) doc.setTextColor(234, 88, 12);
      else if (item.letter.startsWith('D')) doc.setTextColor(217, 119, 6);
      else doc.setTextColor(220, 38, 38);
      doc.text(item.letter, cellX + colWidth * 0.48, cellY + 3.6, { align: 'center' });

      // Percentage text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      const scoreStr = `${options.showDecimals ? Number(item.percentage).toFixed(1) : item.percentage}%`;
      doc.text(scoreStr, cellX + colWidth - 2, cellY + 3.6, { align: 'right' });
    }

    // Footer on each page
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const domainDisplay = SITE_URL.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    doc.text(`Generated by Easy Grade Calculator · ${domainDisplay} · ${dateStr}`, margin, pageHeight - 6);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 6, { align: 'right' });

    currentItemIdx += pageItems.length;
    pageNum++;
  }

  doc.save(`easy_grade_chart_${options.totalQuestions}_questions.pdf`);
}

export interface GenericPdfExportOptions {
  title: string;
  subtitle?: string;
  metrics: { label: string; value: string }[];
  tableHeaders?: string[];
  tableRows?: string[][];
  filename?: string;
}

export async function exportToPdf(options: GenericPdfExportOptions): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Banner
  doc.setFillColor(15, 118, 110); // #0f766e teal-700
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(options.title.toUpperCase(), margin + 8, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(220, 245, 240);
  const sub = options.subtitle || `Generated by Easy Grade Calculator · ${new Date().toLocaleDateString('en-US')}`;
  doc.text(sub, margin + 8, y + 17.5, { maxWidth: contentWidth - 16 });

  y += 30;

  // Metrics Grid
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  const boxHeight = Math.ceil(options.metrics.length / 2) * 14 + 6;
  doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

  options.metrics.forEach((m, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cellX = margin + 6 + col * (contentWidth / 2);
    const cellY = y + 7 + row * 14;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label.toUpperCase(), cellX, cellY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(String(m.value), cellX, cellY + 5, { maxWidth: contentWidth / 2 - 10 });
  });

  y += boxHeight + 10;

  if (options.tableHeaders && options.tableRows && options.tableRows.length > 0) {
    const colCount = options.tableHeaders.length;
    const colW = contentWidth / colCount;

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    options.tableHeaders.forEach((h, i) => {
      doc.text(h, margin + 4 + i * colW, y + 5.5);
    });
    y += 8;

    options.tableRows.forEach((row, rIdx) => {
      if (y > pageHeight - 24) {
        doc.addPage();
        y = margin;
      }
      if (rIdx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 7.5, 'F');
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      row.forEach((cell, cIdx) => {
        doc.text(String(cell), margin + 4 + cIdx * colW, y + 5.2);
      });
      y += 7.5;
    });
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const domainDisplay = SITE_URL.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  doc.text(
    `Generated by Easy Grade Calculator · ${domainDisplay}`,
    margin,
    pageHeight - 10
  );

  doc.save(options.filename || 'conversion-report.pdf');
}
