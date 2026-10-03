export type CgpaScale = 4.0 | 5.0 | 10.0;

export interface CgpaUniversity {
  id: string;
  name: string;
  group: 'Popular' | 'Other Universities';
  formulaLabel: string;
  compute: (cgpa: number) => number;
  inverse: (percentage: number) => number;
  sourceNote: string;
  verified: boolean;
  stepExplanation?: (cgpa: number, result: number) => string;
}

export interface CgpaCalculationResult {
  cgpa: number;
  scale: CgpaScale;
  percentage: number;
  formulaUsed: string;
  stepByStep: string;
  university: CgpaUniversity;
  division: {
    label: string;
    shortLabel: string;
    gradeLetter: string;
    usGpaEquivalent: number;
    badgeColor: 'emerald' | 'blue' | 'amber' | 'rose';
    remark: string;
  };
}

/**
 * Curated database of Indian and International Universities & Boards for 10.0 Scale CGPA conversion.
 * Every formula is either verified from an official university notification/ordinance (verified: true)
 * or falls back transparently to the standard UGC/CBSE x 9.5 estimate (verified: false).
 */
export const CGPA_UNIVERSITIES: CgpaUniversity[] = [
  // ==========================================
  // POPULAR GROUP
  // ==========================================
  {
    id: 'normal',
    name: 'Normal Calculation (Standard × 9.5)',
    group: 'Popular',
    formulaLabel: 'CGPA × 9.5',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 9.5)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 9.5)),
    sourceNote:
      'Standard UGC and CBSE 10-point grading multiplier (Percentage = CGPA × 9.5), widely accepted when a university does not specify a custom circular.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 9.5 = ${res.toFixed(2)}%`,
  },
  {
    id: 'vtu',
    name: 'VTU (Visvesvaraya Technological University)',
    group: 'Popular',
    formulaLabel: '(CGPA − 0.75) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.75) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.75)),
    sourceNote:
      'Confirmed from VTU CBCS academic regulations (2015, 2017, 2018 & 2021 schemes): Percentage = (CGPA − 0.75) × 10.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.75) × 10 = ${(cgpa - 0.75).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'mumbai-university',
    name: 'Mumbai University (MU)',
    group: 'Popular',
    formulaLabel: '(7.1 × CGPA) + 11',
    compute: (cgpa: number) =>
      cgpa <= 0 ? 0 : Math.min(100, Math.max(0, 7.1 * cgpa + 11)),
    inverse: (pct: number) =>
      pct <= 11 ? 0 : Math.min(10, Math.max(0, (pct - 11) / 7.1)),
    sourceNote:
      'Confirmed from University of Mumbai CBSGS/CBCS circular for general UG/PG programmes: Percentage = (7.1 × CGPA) + 11.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(7.1 × ${cgpa}) + 11 = ${(7.1 * cgpa).toFixed(2)} + 11 = ${res.toFixed(2)}%`,
  },
  {
    id: 'makaut',
    name: 'MAKAUT (WBUT)',
    group: 'Popular',
    formulaLabel: '(CGPA − 0.75) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.75) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.75)),
    sourceNote:
      'Confirmed from Maulana Abul Kalam Azad University of Technology (formerly WBUT) official examination notification: Percentage = (CGPA − 0.75) × 10.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.75) × 10 = ${(cgpa - 0.75).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'gtu',
    name: 'GTU (Gujarat Technological University)',
    group: 'Popular',
    formulaLabel: '(CGPA − 0.5) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.5) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.5)),
    sourceNote:
      'Confirmed from Gujarat Technological University (GTU) official circular: Percentage = (CGPA − 0.5) × 10.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.50) × 10 = ${(cgpa - 0.5).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'sppu',
    name: 'SPPU (Savitribai Phule Pune University)',
    group: 'Popular',
    formulaLabel: '(CGPA − 0.75) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.75) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.75)),
    sourceNote:
      'Confirmed from SPPU Circular No. 322/2020 & FE 2019 CBCS Rulebook: Percentage = (CGPA − 0.75) × 10 (check marksheet back for batch-specific rules).',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.75) × 10 = ${(cgpa - 0.75).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },

  // ==========================================
  // OTHER UNIVERSITIES (STRICTLY ALPHABETICAL BY NAME)
  // ==========================================
  {
    id: 'acharya-nagarjuna',
    name: 'Acharya Nagarjuna University',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 9.5',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 9.5)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 9.5)),
    sourceNote:
      'Standard estimate (CGPA × 9.5). Verify with your specific faculty ordinance or marksheet reverse side.',
    verified: false,
    stepExplanation: (cgpa, res) => `${cgpa} × 9.5 = ${res.toFixed(2)}%`,
  },
  {
    id: 'aicte',
    name: 'AICTE',
    group: 'Other Universities',
    formulaLabel: '(CGPA − 0.75) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.75) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.75)),
    sourceNote:
      'Confirmed from AICTE model curriculum & technical equivalence norm: Percentage = (CGPA − 0.75) × 10 (or × 9.5 where specified by scholarship portals).',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.75) × 10 = ${(cgpa - 0.75).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'aktu',
    name: 'AKTU (Dr. A.P.J. Abdul Kalam Technical University)',
    group: 'Other Universities',
    formulaLabel: '(CGPA − 0.75) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.75) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.75)),
    sourceNote:
      'Confirmed from AKTU undergraduate CBCS ordinance: Percentage = (CGPA − 0.75) × 10.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.75) × 10 = ${(cgpa - 0.75).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'amie',
    name: 'AMIE (Institution of Engineers India)',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 9.5',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 9.5)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 9.5)),
    sourceNote:
      'Standard estimate (CGPA × 9.5). IEI issues individual conversion certificates based on subject grade ranges upon request.',
    verified: false,
    stepExplanation: (cgpa, res) => `${cgpa} × 9.5 = ${res.toFixed(2)}%`,
  },
  {
    id: 'amity-university',
    name: 'Amity University',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10)),
    sourceNote:
      'Confirmed from Amity University examination regulations across campuses: Percentage = CGPA × 10.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'amravati-university',
    name: 'Amravati University (SGBAU)',
    group: 'Other Universities',
    formulaLabel: '(CGPA − 0.75) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.75) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.75)),
    sourceNote:
      'Confirmed from Sant Gadge Baba Amravati University (SGBAU) CBCS direction: Percentage = (CGPA − 0.75) × 10.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.75) × 10 = ${(cgpa - 0.75).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'andhra-university',
    name: 'Andhra University',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 9.5',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 9.5)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 9.5)),
    sourceNote:
      'Standard estimate (CGPA × 9.5). Note: Some Andhra University autonomous engineering regulations use (CGPA − 0.75) × 10 or CGPA × 10.',
    verified: false,
    stepExplanation: (cgpa, res) => `${cgpa} × 9.5 = ${res.toFixed(2)}%`,
  },
  {
    id: 'anna-university',
    name: 'Anna University',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10)),
    sourceNote:
      'Confirmed from Anna University CBCS Regulations (R-2015, R-2017, R-2019 & R-2021): Percentage = CGPA × 10.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'bhu',
    name: 'Banaras Hindu University (BHU)',
    group: 'Other Universities',
    formulaLabel: '(CGPA × 10) − 4.5',
    compute: (cgpa: number) =>
      cgpa <= 0 ? 0 : Math.min(100, Math.max(0, cgpa * 10 - 4.5)),
    inverse: (pct: number) =>
      pct <= 0 ? 0 : Math.min(10, Math.max(0, (pct + 4.5) / 10)),
    sourceNote:
      'Confirmed from Banaras Hindu University official transcript ordinance printed on marksheets: Percentage = (10 × CGPA) − 4.5.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} × 10) − 4.5 = ${(cgpa * 10).toFixed(2)} − 4.5 = ${res.toFixed(2)}%`,
  },
  {
    id: 'bangalore-university',
    name: 'Bangalore University',
    group: 'Other Universities',
    formulaLabel: '(CGPA − 0.75) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.75) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.75)),
    sourceNote:
      'Confirmed from Bangalore University CBCS regulations: Percentage = (CGPA − 0.75) × 10.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.75) × 10 = ${(cgpa - 0.75).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'bharathiar-university',
    name: 'Bharathiar University',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 9.5',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 9.5)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 9.5)),
    sourceNote:
      'Standard estimate (CGPA × 9.5). Verify on the reverse side of your Bharathiar University statement of marks.',
    verified: false,
    stepExplanation: (cgpa, res) => `${cgpa} × 9.5 = ${res.toFixed(2)}%`,
  },
  {
    id: 'bput',
    name: 'Biju Patnaik University of Technology (BPUT)',
    group: 'Other Universities',
    formulaLabel: '(CGPA − 0.5) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.5) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.5)),
    sourceNote:
      'Confirmed from BPUT Rourkela academic regulations: Percentage = (CGPA − 0.5) × 10.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.50) × 10 = ${(cgpa - 0.5).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'bits-pilani',
    name: 'BITS Pilani',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10)),
    sourceNote:
      'Confirmed from BITS Pilani academic transcript equivalence guidelines: Percentage = CGPA × 10.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'burdwan-university',
    name: 'Burdwan University',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 9.5',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 9.5)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 9.5)),
    sourceNote:
      'Standard estimate (CGPA × 9.5) commonly applied for University of Burdwan CBCS transcripts.',
    verified: false,
    stepExplanation: (cgpa, res) => `${cgpa} × 9.5 = ${res.toFixed(2)}%`,
  },
  {
    id: 'cbse',
    name: 'CBSE (Central Board of Secondary Education)',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 9.5',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 9.5)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 9.5)),
    sourceNote:
      'Confirmed from official CBSE examination circular: Indicative Percentage of Marks = 9.5 × CGPA.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 9.5 = ${res.toFixed(2)}%`,
  },
  {
    id: 'delhi-university',
    name: 'Delhi University (DU - NEP 2022 Onward)',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10)),
    sourceNote:
      'Confirmed from University of Delhi official notification for examinations in AY 2022–2023 and onward: Percentage = CGPA × 10.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'delhi-university-cbcs',
    name: 'Delhi University (DU - CBCS Up to 2021–22)',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 9.5',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 9.5)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 9.5)),
    sourceNote:
      'Confirmed from University of Delhi CBCS notification for batches up to AY 2021–2022: Final Percentage = CGPA × 9.5.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 9.5 = ${res.toFixed(2)}%`,
  },
  {
    id: 'bamu',
    name: 'Dr. Babasaheb Ambedkar Marathwada University (BAMU)',
    group: 'Other Universities',
    formulaLabel: '(CGPA − 0.75) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.75) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.75)),
    sourceNote:
      'Confirmed from BAMU Faculty of Engineering and Technology ordinance (2014–15 onward): Percentage = (CGPA − 0.75) × 10.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.75) × 10 = ${(cgpa - 0.75).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'jntu',
    name: 'JNTU (JNTUH / JNTUK / JNTUA)',
    group: 'Other Universities',
    formulaLabel: '(CGPA − 0.75) × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, (cgpa - 0.75) * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10 + 0.75)),
    sourceNote:
      'Confirmed from JNTU academic regulations for B.Tech/M.Tech programmes: Percentage = (CGPA − 0.75) × 10.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      `(${cgpa} − 0.75) × 10 = ${(cgpa - 0.75).toFixed(2)} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'ktu',
    name: 'KTU (APJ Abdul Kalam Technological University, Kerala)',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10)),
    sourceNote:
      'Confirmed from KTU 2019 B.Tech regulations: Equivalent Percentage = CGPA × 10.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'mumbai-university-eng',
    name: 'Mumbai University (Engineering — 2015–16 Onward)',
    group: 'Other Universities',
    formulaLabel: 'CGPA ≥ 7: (7.4 × CGPA) + 12 | CGPA < 7: (7.1 × CGPA) + 12',
    compute: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      const raw = cgpa >= 7 ? 7.4 * cgpa + 12 : 7.1 * cgpa + 12;
      return Math.min(100, Math.max(0, raw));
    },
    inverse: (pct: number) => {
      if (pct <= 12) return 0;
      const thresholdPct = 7.4 * 7 + 12; // 63.8
      const raw = pct >= thresholdPct ? (pct - 12) / 7.4 : (pct - 12) / 7.1;
      return Math.min(10, Math.max(0, raw));
    },
    sourceNote:
      'Confirmed from University of Mumbai Faculty of Technology circular: Percentage = (7.4 × CGPA) + 12 for CGPA ≥ 7.0, and (7.1 × CGPA) + 12 for CGPA < 7.0.',
    verified: true,
    stepExplanation: (cgpa, res) =>
      cgpa >= 7
        ? `(7.4 × ${cgpa}) + 12 = ${(7.4 * cgpa).toFixed(2)} + 12 = ${res.toFixed(2)}%`
        : `(7.1 × ${cgpa}) + 12 = ${(7.1 * cgpa).toFixed(2)} + 12 = ${res.toFixed(2)}%`,
  },
  {
    id: 'osmania-university',
    name: 'Osmania University',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 9.5',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 9.5)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 9.5)),
    sourceNote:
      'Standard estimate (CGPA × 9.5) following UGC norms where a specific faculty formula is not printed on the transcript.',
    verified: false,
    stepExplanation: (cgpa, res) => `${cgpa} × 9.5 = ${res.toFixed(2)}%`,
  },
  {
    id: 'pune-university-direct',
    name: 'Pune University (SPPU Direct × 10 Engineering)',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10)),
    sourceNote:
      'Confirmed from SPPU Board of Examinations equivalence circular for specific engineering cohorts: Percentage = CGPA × 10.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'rgpv',
    name: 'RGPV (Rajiv Gandhi Proudyogiki Vishwavidyalaya)',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10)),
    sourceNote:
      'Confirmed from RGPV Bhopal Ordinance No. 12: Percentage = CGPA × 10.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'srm-university',
    name: 'SRM Institute of Science & Technology (SRMIST)',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10)),
    sourceNote:
      'Confirmed from SRMIST academic regulations: Percentage = CGPA × 10.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 10 = ${res.toFixed(2)}%`,
  },
  {
    id: 'vit',
    name: 'VIT (Vellore Institute of Technology)',
    group: 'Other Universities',
    formulaLabel: 'CGPA × 10',
    compute: (cgpa: number) => Math.min(100, Math.max(0, cgpa * 10)),
    inverse: (pct: number) => Math.min(10, Math.max(0, pct / 10)),
    sourceNote:
      'Confirmed from VIT academic regulations: Equivalent Percentage = CGPA × 10.',
    verified: true,
    stepExplanation: (cgpa, res) => `${cgpa} × 10 = ${res.toFixed(2)}%`,
  },
];

export function getUniversityById(id?: string): CgpaUniversity {
  if (!id) return CGPA_UNIVERSITIES[0];
  return (
    CGPA_UNIVERSITIES.find((u) => u.id.toLowerCase() === id.toLowerCase()) ||
    CGPA_UNIVERSITIES[0]
  );
}

export function classifyAcademicDivision(percentage: number): CgpaCalculationResult['division'] {
  const pct = Math.max(0, Math.min(100, percentage));

  if (pct >= 75) {
    return {
      label: 'First Class with Distinction',
      shortLabel: 'Distinction',
      gradeLetter: pct >= 90 ? 'O (Outstanding)' : 'A+ (Excellent)',
      usGpaEquivalent: Math.min(4.0, Math.round((pct / 25) * 100) / 100),
      badgeColor: 'emerald',
      remark:
        'Top-tier academic standing. Qualifies for honours distinction, competitive postgraduate admissions, and PSU/corporate cutoffs.',
    };
  }
  if (pct >= 60) {
    return {
      label: 'First Class / First Division',
      shortLabel: 'First Division',
      gradeLetter: pct >= 65 ? 'A (Very Good)' : 'B+ (Good)',
      usGpaEquivalent: Math.min(4.0, Math.round((pct / 25) * 100) / 100),
      badgeColor: 'blue',
      remark:
        'Strong First Division standing. Meets standard 60% eligibility criteria for most campus placements, GATE, and civil service exams.',
    };
  }
  if (pct >= 50) {
    return {
      label: 'Second Class / Second Division',
      shortLabel: 'Second Division',
      gradeLetter: 'B (Above Average)',
      usGpaEquivalent: Math.min(4.0, Math.round((pct / 25) * 100) / 100),
      badgeColor: 'amber',
      remark:
        'Satisfactory Second Division standing. Meets general degree completion requirements and standard university graduation thresholds.',
    };
  }
  if (pct >= 40) {
    return {
      label: 'Pass Class / Third Division',
      shortLabel: 'Pass Class',
      gradeLetter: 'P (Pass)',
      usGpaEquivalent: Math.min(4.0, Math.round((pct / 25) * 100) / 100),
      badgeColor: 'amber',
      remark:
        'Passing academic threshold achieved. Check program-specific minimum percentage requirements for postgraduate applications.',
    };
  }
  return {
    label: 'Below Passing Threshold',
    shortLabel: 'Below Pass',
    gradeLetter: 'F (Needs Improvement)',
    usGpaEquivalent: Math.max(0, Math.round((pct / 25) * 100) / 100),
    badgeColor: 'rose',
    remark:
      'Below the standard 40% passing benchmark. Verify supplementary examination or grade improvement policies with your registrar.',
  };
}

/**
 * Core formula engine for converting CGPA to Percentage across 10.0, 5.0, and 4.0 scales.
 * University-specific formulas apply strictly to the 10.0 scale.
 */
export function computeCgpaToPercentage(
  cgpa: number,
  scale: CgpaScale = 10.0,
  universityId: string = 'normal'
): CgpaCalculationResult {
  const uni = getUniversityById(universityId);
  const clampedCgpa = Math.max(0, Math.min(scale, cgpa));

  let rawPercentage = 0;
  let formulaUsed = '';
  let stepByStep = '';

  if (scale === 4.0) {
    rawPercentage = clampedCgpa * 25;
    formulaUsed = 'Percentage = CGPA × 25';
    stepByStep = `${clampedCgpa} × 25 = ${rawPercentage.toFixed(2)}%`;
  } else if (scale === 5.0) {
    rawPercentage = clampedCgpa * 20;
    formulaUsed = 'Percentage = CGPA × 20';
    stepByStep = `${clampedCgpa} × 20 = ${rawPercentage.toFixed(2)}%`;
  } else {
    rawPercentage = uni.compute(clampedCgpa);
    formulaUsed = `Percentage = ${uni.formulaLabel}`;
    stepByStep = uni.stepExplanation
      ? uni.stepExplanation(clampedCgpa, rawPercentage)
      : `${clampedCgpa} → ${rawPercentage.toFixed(2)}%`;
  }

  const roundedPct = Math.round(Math.min(100, Math.max(0, rawPercentage)) * 100) / 100;

  return {
    cgpa: Math.round(clampedCgpa * 100) / 100,
    scale,
    percentage: roundedPct,
    formulaUsed,
    stepByStep,
    university: uni,
    division: classifyAcademicDivision(roundedPct),
  };
}

/**
 * Reverse formula engine for converting Percentage to CGPA across 10.0, 5.0, and 4.0 scales.
 */
export function computePercentageToCgpa(
  percentage: number,
  scale: CgpaScale = 10.0,
  universityId: string = 'normal'
): {
  percentage: number;
  scale: CgpaScale;
  cgpa: number;
  formulaUsed: string;
  stepByStep: string;
  university: CgpaUniversity;
  division: CgpaCalculationResult['division'];
} {
  const uni = getUniversityById(universityId);
  const clampedPct = Math.max(0, Math.min(100, percentage));

  let rawCgpa = 0;
  let formulaUsed = '';
  let stepByStep = '';

  if (scale === 4.0) {
    rawCgpa = clampedPct / 25;
    formulaUsed = 'CGPA = Percentage ÷ 25';
    stepByStep = `${clampedPct}% ÷ 25 = ${rawCgpa.toFixed(2)} CGPA`;
  } else if (scale === 5.0) {
    rawCgpa = clampedPct / 20;
    formulaUsed = 'CGPA = Percentage ÷ 20';
    stepByStep = `${clampedPct}% ÷ 20 = ${rawCgpa.toFixed(2)} CGPA`;
  } else {
    rawCgpa = uni.inverse(clampedPct);
    formulaUsed = `Reverse of (${uni.formulaLabel})`;
    stepByStep = `${clampedPct}% → ${rawCgpa.toFixed(2)} CGPA (${uni.name})`;
  }

  const roundedCgpa = Math.round(Math.min(scale, Math.max(0, rawCgpa)) * 100) / 100;

  return {
    percentage: Math.round(clampedPct * 100) / 100,
    scale,
    cgpa: roundedCgpa,
    formulaUsed,
    stepByStep,
    university: uni,
    division: classifyAcademicDivision(clampedPct),
  };
}
