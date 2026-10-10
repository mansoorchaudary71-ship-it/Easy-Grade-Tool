import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { Link } from './SlashLink';
import {
  Calculator,
  CheckCircle2,
  Info,
  Copy,
  Share2,
  Printer,
  FileDown,
  RotateCcw,
  Search,
  ChevronDown,
  Plus,
  Trash2,
  ArrowLeftRight,
  Layers,
  Sparkles,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import {
  CGPA_UNIVERSITIES,
  CgpaScale,
  CgpaUniversity,
  computeCgpaToPercentage,
  computePercentageToCgpa,
  getUniversityById,
} from '../data/cgpaUniversities';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { SEO_ROUTES } from '../data/seoConfig';
import { AmbientAura } from './AmbientAura';
import { CgpaEducationalGuide } from './CgpaEducationalGuide';
import { triggerHapticFeedback as triggerHaptic } from '../utils/haptics';

interface CgpaToPercentageProps {
  setToast: (msg: string) => void;
  hideHeading?: boolean;
  hideSeo?: boolean;
}

interface SemesterRow {
  id: string;
  name: string;
  sgpa: string;
  credits: string;
}

const SCALES: { value: CgpaScale; label: string; badge: string; multiplierNote: string }[] = [
  {
    value: 10.0,
    label: '10.0 Scale',
    badge: 'India / UGC / CBSE',
    multiplierNote: 'Supports 30+ university-specific ordinances & × 9.5 standard',
  },
  {
    value: 5.0,
    label: '5.0 Scale',
    badge: '5-Point International',
    multiplierNote: 'Standard 5.0 scale conversion: Percentage = CGPA × 20',
  },
  {
    value: 4.0,
    label: '4.0 Scale',
    badge: 'US / Canada / Global',
    multiplierNote: 'Standard 4.0 scale conversion: Percentage = CGPA × 25',
  },
];

const SCALE_PRESETS: Record<CgpaScale, number[]> = {
  10.0: [9.5, 9.0, 8.5, 8.0, 7.5, 7.0, 6.5],
  5.0: [4.8, 4.5, 4.25, 4.0, 3.75, 3.5],
  4.0: [3.9, 3.7, 3.5, 3.3, 3.0, 2.7],
};

export const CgpaToPercentage: React.FC<CgpaToPercentageProps> = ({
  setToast,
  hideHeading = false,
  hideSeo = false,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const seoMeta = SEO_ROUTES.cgpa;

  // Initialize state from URL query parameters if present
  const initialScale = useMemo<CgpaScale>(() => {
    const raw = Number(searchParams.get('scale'));
    if (raw === 4 || raw === 4.0) return 4.0;
    if (raw === 5 || raw === 5.0) return 5.0;
    return 10.0;
  }, [searchParams]);

  const initialUni = useMemo<string>(() => {
    const u = searchParams.get('uni');
    if (u && CGPA_UNIVERSITIES.some((item) => item.id === u)) {
      return u;
    }
    return 'normal';
  }, [searchParams]);

  const initialCgpa = useMemo<string>(() => {
    const c = searchParams.get('cgpa');
    if (c && !Number.isNaN(Number(c))) {
      const n = Number(c);
      if (n >= 0 && n <= initialScale) return String(n);
    }
    return initialScale === 10.0 ? '8.50' : initialScale === 5.0 ? '4.25' : '3.50';
  }, [searchParams, initialScale]);

  const [scale, setScale] = useState<CgpaScale>(initialScale);
  const [cgpaInput, setCgpaInput] = useState<string>(initialCgpa);
  const [cgpaError, setCgpaError] = useState<string>('');
  const [selectedUniId, setSelectedUniId] = useState<string>(initialUni);

  // Accessible searchable combobox state
  const [isComboOpen, setIsComboOpen] = useState<boolean>(false);
  const [uniQuery, setUniQuery] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const comboContainerRef = useRef<HTMLDivElement>(null);
  const comboSearchInputRef = useRef<HTMLInputElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Secondary tab state: 'sgpa' (SGPA -> CGPA -> %) or 'reverse' (Percentage -> CGPA)
  const [secondaryMode, setSecondaryMode] = useState<'sgpa' | 'reverse'>('sgpa');

  // SGPA to CGPA state
  const [semesters, setSemesters] = useState<SemesterRow[]>([
    { id: 'sem-1', name: 'Semester 1', sgpa: '8.20', credits: '22' },
    { id: 'sem-2', name: 'Semester 2', sgpa: '8.45', credits: '24' },
    { id: 'sem-3', name: 'Semester 3', sgpa: '8.60', credits: '24' },
    { id: 'sem-4', name: 'Semester 4', sgpa: '8.75', credits: '22' },
  ]);

  // Reverse Percentage to CGPA state
  const [reversePctInput, setReversePctInput] = useState<string>('80.75');
  const [reversePctError, setReversePctError] = useState<string>('');

  // Close combobox on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        comboContainerRef.current &&
        !comboContainerRef.current.contains(e.target as Node)
      ) {
        setIsComboOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validate CGPA string
  const validateCgpaValue = (raw: string, activeScale: CgpaScale): string => {
    const trimmed = raw.trim();
    if (!trimmed) {
      return `Please enter a CGPA value between 0 and ${activeScale.toFixed(1)}.`;
    }
    if (trimmed.startsWith('-')) {
      return 'CGPA cannot be negative. Enter a value of 0 or higher.';
    }
    if (!/^\d+(\.\d{0,2})?$/.test(trimmed)) {
      if (/^\d+\.\d{3,}$/.test(trimmed)) {
        return 'Please enter up to 2 decimal places (for example, 8.45).';
      }
      return 'Enter a valid numeric CGPA (digits and at most one decimal point).';
    }
    const num = Number(trimmed);
    if (Number.isNaN(num)) {
      return 'Enter a valid numeric CGPA.';
    }
    if (num < 0) {
      return 'CGPA cannot be negative.';
    }
    if (num > activeScale) {
      return `CGPA cannot exceed ${activeScale.toFixed(1)} on the ${activeScale.toFixed(1)}-point scale.`;
    }
    return '';
  };

  const handleScaleChange = (newScale: CgpaScale) => {
    triggerHaptic(8);
    setScale(newScale);
    setIsComboOpen(false);

    const currentNum = Number(cgpaInput);
    if (Number.isNaN(currentNum) || currentNum > newScale || cgpaInput.trim() === '') {
      const defaultForScale = newScale === 10.0 ? '8.50' : newScale === 5.0 ? '4.25' : '3.50';
      setCgpaInput(defaultForScale);
      setCgpaError('');
    } else {
      setCgpaError(validateCgpaValue(cgpaInput, newScale));
    }
  };

  // Keyboard navigation for Grading Scale tabs (role="tablist")
  const handleScaleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIdx = index;
    if (e.key === 'ArrowRight') {
      nextIdx = (index + 1) % SCALES.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (index - 1 + SCALES.length) % SCALES.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = SCALES.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const targetScale = SCALES[nextIdx].value;
    handleScaleChange(targetScale);
    tabRefs.current[nextIdx]?.focus();
  };

  const handleCgpaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow user to type numbers, one dot, or clear to edit, while immediately showing validation feedback
    setCgpaInput(raw);
    setCgpaError(validateCgpaValue(raw, scale));
  };

  const handleCalculateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateCgpaValue(cgpaInput, scale);
    setCgpaError(err);
    if (err) {
      setToast(err);
      return;
    }
    triggerHaptic(10);
    setToast(`Calculated: ${calculationResult.percentage.toFixed(2)}%`);
  };

  // Filtered universities for searchable combobox
  const filteredUniversities = useMemo(() => {
    const q = uniQuery.trim().toLowerCase();
    if (!q) return CGPA_UNIVERSITIES;
    return CGPA_UNIVERSITIES.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.formulaLabel.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }, [uniQuery]);

  const popularFiltered = useMemo(
    () => filteredUniversities.filter((u) => u.group === 'Popular'),
    [filteredUniversities]
  );
  const otherFiltered = useMemo(
    () => filteredUniversities.filter((u) => u.group === 'Other Universities'),
    [filteredUniversities]
  );

  // Flat ordered list for keyboard arrow navigation inside combobox
  const flatOrderedUniversities = useMemo(
    () => [...popularFiltered, ...otherFiltered],
    [popularFiltered, otherFiltered]
  );

  const selectedUniversity: CgpaUniversity = useMemo(
    () => getUniversityById(selectedUniId),
    [selectedUniId]
  );

  const handleSelectUniversity = (uni: CgpaUniversity) => {
    triggerHaptic(8);
    setSelectedUniId(uni.id);
    setIsComboOpen(false);
    setUniQuery('');
  };

  const handleComboKeyDown = (e: React.KeyboardEvent) => {
    if (scale !== 10.0) return;

    if (!isComboOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsComboOpen(true);
        setHighlightedIndex(0);
        setTimeout(() => comboSearchInputRef.current?.focus(), 20);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsComboOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        flatOrderedUniversities.length > 0 ? (prev + 1) % flatOrderedUniversities.length : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        flatOrderedUniversities.length > 0
          ? (prev - 1 + flatOrderedUniversities.length) % flatOrderedUniversities.length
          : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = flatOrderedUniversities[highlightedIndex];
      if (chosen) {
        handleSelectUniversity(chosen);
      }
    }
  };

  // Main Calculation Result
  const calculationResult = useMemo(() => {
    const err = validateCgpaValue(cgpaInput, scale);
    const numericCgpa = err ? 0 : Number(cgpaInput);
    return computeCgpaToPercentage(numericCgpa, scale, selectedUniId);
  }, [cgpaInput, scale, selectedUniId]);

  const isValidMainInput = cgpaError === '' && cgpaInput.trim() !== '';

  // SGPA to CGPA Calculation
  const sgpaSummary = useMemo(() => {
    let totalWeightedPoints = 0;
    let totalCredits = 0;
    let validSemestersCount = 0;
    let simpleSum = 0;

    semesters.forEach((sem) => {
      const s = Number(sem.sgpa);
      const c = Number(sem.credits);
      if (
        sem.sgpa.trim() !== '' &&
        !Number.isNaN(s) &&
        s >= 0 &&
        s <= scale
      ) {
        validSemestersCount += 1;
        simpleSum += s;
        const weight = !Number.isNaN(c) && c > 0 ? c : 1;
        totalWeightedPoints += s * weight;
        totalCredits += weight;
      }
    });

    const calculatedCgpa =
      totalCredits > 0
        ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100
        : validSemestersCount > 0
        ? Math.round((simpleSum / validSemestersCount) * 100) / 100
        : 0;

    const pctResult = computeCgpaToPercentage(calculatedCgpa, scale, selectedUniId);

    return {
      calculatedCgpa,
      totalCredits,
      validSemestersCount,
      percentage: pctResult.percentage,
      formulaUsed: pctResult.formulaUsed,
      division: pctResult.division,
    };
  }, [semesters, scale, selectedUniId]);

  // Reverse Percentage to CGPA Calculation
  const reverseResult = useMemo(() => {
    const trimmed = reversePctInput.trim();
    if (!trimmed || Number.isNaN(Number(trimmed))) {
      return computePercentageToCgpa(0, scale, selectedUniId);
    }
    const num = Number(trimmed);
    return computePercentageToCgpa(num, scale, selectedUniId);
  }, [reversePctInput, scale, selectedUniId]);

  const handleReverseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setReversePctInput(val);
    const trimmed = val.trim();
    if (!trimmed) {
      setReversePctError('Please enter a percentage between 0 and 100.');
      return;
    }
    if (trimmed.startsWith('-')) {
      setReversePctError('Percentage cannot be negative.');
      return;
    }
    const num = Number(trimmed);
    if (Number.isNaN(num) || num < 0 || num > 100) {
      setReversePctError('Enter a valid percentage between 0 and 100.');
      return;
    }
    setReversePctError('');
  };

  // Actions: Copy, Share, Print, PDF, Reset
  const handleCopyResult = async () => {
    if (!isValidMainInput) {
      setToast('Enter a valid CGPA before copying.');
      return;
    }
    const summaryText = `CGPA to Percentage Conversion:\n• CGPA: ${calculationResult.cgpa.toFixed(2)} (${scale.toFixed(1)} Scale)\n• University / Rule: ${scale === 10.0 ? selectedUniversity.name : `${scale.toFixed(1)}-Point Standard`}\n• Formula: ${calculationResult.formulaUsed}\n• Equivalent Percentage: ${calculationResult.percentage.toFixed(2)}%\n• Academic Standing: ${calculationResult.division.label}`;
    try {
      await navigator.clipboard.writeText(summaryText);
      triggerHaptic(10);
      setToast('Conversion summary copied to clipboard!');
    } catch {
      setToast('Could not copy to clipboard.');
    }
  };

  const handleShareLink = async () => {
    if (!isValidMainInput) {
      setToast('Enter a valid CGPA before sharing.');
      return;
    }
    const params = new URLSearchParams();
    params.set('scale', String(scale));
    params.set('cgpa', String(calculationResult.cgpa));
    if (scale === 10.0) {
      params.set('uni', selectedUniId);
    }
    setSearchParams(params, { replace: true });
    const shareUrl = `${window.location.origin}/cgpa-to-percentage-calculator?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      triggerHaptic(10);
      setToast('Shareable conversion link copied to clipboard!');
    } catch {
      setToast('URL updated with your CGPA parameters.');
    }
  };

  const handleExportPdf = async () => {
    if (!isValidMainInput) {
      setToast('Please enter a valid CGPA before exporting a PDF.');
      return;
    }
    triggerHaptic(12);
    const { exportToPdf } = await import('../utils/pdfExport');
    exportToPdf({
      title: 'CGPA to Percentage Official Conversion Report',
      subtitle:
        scale === 10.0
          ? `University Rule: ${selectedUniversity.name} (${selectedUniversity.verified ? 'Verified Ordinance' : 'Standard Estimate'})`
          : `Grading Scale: ${scale.toFixed(1)}-Point International Scale`,
      metrics: [
        { label: 'Entered CGPA', value: `${calculationResult.cgpa.toFixed(2)} / ${scale.toFixed(1)}` },
        { label: 'Equivalent Percentage', value: `${calculationResult.percentage.toFixed(2)}%` },
        { label: 'Academic Division', value: calculationResult.division.label },
        { label: 'Formula Applied', value: calculationResult.formulaUsed },
        { label: 'Step-by-Step Math', value: calculationResult.stepByStep },
        { label: 'Grade Equivalent', value: calculationResult.division.gradeLetter },
      ],
      tableHeaders: ['Semester', 'SGPA', 'Credits', 'Scale Max'],
      tableRows: semesters.map((s) => [
        s.name,
        s.sgpa || '—',
        s.credits || '—',
        `${scale.toFixed(1)}`,
      ]),
      filename: `cgpa-to-percentage-${calculationResult.cgpa.toFixed(2)}.pdf`,
    });
    setToast('PDF conversion report downloaded!');
  };

  const handlePrint = () => {
    triggerHaptic(8);
    window.print();
  };

  const handleReset = () => {
    triggerHaptic(8);
    setScale(10.0);
    setSelectedUniId('normal');
    setCgpaInput('8.50');
    setCgpaError('');
    setSearchParams({}, { replace: true });
    setToast('Reset to default 10.0 scale (8.50 CGPA).');
  };

  // Semester list handlers
  const handleAddSemester = () => {
    if (semesters.length >= 12) {
      setToast('Maximum of 12 semesters reached.');
      return;
    }
    triggerHaptic(6);
    const nextNum = semesters.length + 1;
    setSemesters((prev) => [
      ...prev,
      { id: `sem-${Date.now()}`, name: `Semester ${nextNum}`, sgpa: '8.00', credits: '22' },
    ]);
  };

  const handleRemoveSemester = (id: string) => {
    if (semesters.length <= 2) {
      setToast('At least 2 semesters are required to calculate cumulative CGPA.');
      return;
    }
    triggerHaptic(6);
    setSemesters((prev) =>
      prev
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, name: `Semester ${idx + 1}` }))
    );
  };

  const handleUpdateSemester = (id: string, field: 'sgpa' | 'credits', value: string) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <>
      {!hideSeo && (
        <SEO
          title={seoMeta.title}
          description={seoMeta.description}
          canonicalUrl={seoMeta.canonicalUrl}
          ogImage={seoMeta.ogImagePlaceholder}
          applicationCategory={seoMeta.applicationCategory}
          featureList={seoMeta.featureList}
          keywords={seoMeta.keywords}
        />
      )}
      {!hideHeading && (
        <ToolHeading
          badge="30+ University Formulas • 10.0 / 5.0 / 4.0 Scales"
          title="CGPA to Percentage Calculator"
          description="Convert your 10.0, 5.0, or 4.0 scale CGPA into an exact percentage using verified university ordinances (VTU, Mumbai University, MAKAUT, GTU, SPPU, Anna University, BHU) or standard UGC/CBSE multipliers."
        />
      )}

      {/* PART 1: MAIN CGPA TO PERCENTAGE CALCULATOR (Uniformed UI/UX Container) */}
      <div className="relative tool-layout font-sans">
        <AmbientAura />

        {/* Left Column: Uniformed Inputs & Configuration Container */}
        <section
          aria-label="CGPA to Percentage Input Controls"
          className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col gap-6"
        >
          {/* Uniformed Card Header */}
          <div className="pb-5 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase block mb-1">
              Academic Converter
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">
              CGPA &amp; Scale Details
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base mt-1 m-0">
              Select your grading scale, university ordinance, and enter your CGPA.
            </p>
          </div>

          <form onSubmit={handleCalculateSubmit} noValidate className="flex flex-col gap-5">
            {/* Step 1: Grading Scale Tabs in Uniformed Sub-Container */}
            <div className="bg-[#F8F9FA] dark:bg-slate-800/60 rounded-[24px] border border-stone-100 dark:border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label
                  id="cgpa-scale-tablist-label"
                  className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase"
                >
                  1. Select Grading Scale
                </label>
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                  Max CGPA: {scale.toFixed(1)}
                </span>
              </div>

              <LayoutGroup id="cgpa-scale-tabs">
              <div
                role="tablist"
                aria-labelledby="cgpa-scale-tablist-label"
                className="grid grid-cols-3 gap-1 p-1 rounded-full bg-slate-100/80 dark:bg-slate-800 border border-gray-200/70 dark:border-white/10"
              >
                {SCALES.map((s, idx) => {
                  const isSelected = scale === s.value;
                  return (
                    <button
                      key={s.value}
                      ref={(el) => {
                        tabRefs.current[idx] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`cgpa-scale-tab-${s.value}`}
                      aria-label={`Select ${s.label} (${s.badge})`}
                      aria-selected={isSelected}
                      aria-controls="cgpa-converter-panel"
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => handleScaleChange(s.value)}
                      onKeyDown={(e) => handleScaleTabKeyDown(e, idx)}
                      className={`relative isolate min-h-[44px] px-4 py-1.5 text-center flex flex-col items-center justify-center cursor-pointer rounded-full ${
                        isSelected
                          ? 'font-bold text-teal-900 dark:text-white'
                          : 'font-semibold text-slate-600 dark:text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:text-teal-700 dark:hover:text-teal-400'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="cgpa-active-pill"
                          className="absolute inset-0 -z-10 rounded-full border border-gray-200/70 bg-white shadow-sm shadow-gray-400/20 dark:border-white/10 dark:bg-teal-600"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-xs sm:text-sm font-mono font-bold">{s.label}</span>
                      <span className="text-[10px] opacity-80 leading-tight hidden sm:inline">
                        {s.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
              </LayoutGroup>
              <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                {SCALES.find((s) => s.value === scale)?.multiplierNote}
              </p>
            </div>

            {/* Step 2: University / Formula Combobox in Uniformed Sub-Container */}
            <div
              className="bg-[#F8F9FA] dark:bg-slate-800/60 rounded-[24px] border border-stone-100 dark:border-slate-800 p-4 space-y-3"
              ref={comboContainerRef}
            >
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="university-combobox-trigger"
                  className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase"
                >
                  2. University or Conversion Ordinance
                </label>
                {scale === 10.0 && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      selectedUniversity.verified
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                    }`}
                  >
                    {selectedUniversity.verified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                        <span>Verified Formula</span>
                      </>
                    ) : (
                      <>
                        <Info className="w-3 h-3" aria-hidden="true" />
                        <span>Standard estimate</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              {scale !== 10.0 ? (
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                  <Info
                    className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <button
                      id="university-combobox-trigger"
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5 opacity-75 cursor-not-allowed text-left"
                    >
                      University selector disabled on {scale.toFixed(1)} scale
                    </button>
                    University-specific formulas (VTU, Mumbai University, MAKAUT, GTU, SPPU, etc.) apply strictly to the <strong>10.0-point</strong> grading system. Switch to the 10.0 Scale tab above to select a specific university.
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    id="university-combobox-trigger"
                    type="button"
                    role="combobox"
                    aria-label={`Select university or conversion ordinance, currently ${selectedUniversity.name}`}
                    aria-expanded={isComboOpen}
                    aria-haspopup="listbox"
                    aria-controls="university-combobox-listbox"
                    aria-activedescendant={
                      isComboOpen && flatOrderedUniversities[highlightedIndex]
                        ? `uni-opt-${flatOrderedUniversities[highlightedIndex].id}`
                        : undefined
                    }
                    onClick={() => {
                      setIsComboOpen((prev) => !prev);
                      if (!isComboOpen) {
                        setTimeout(() => comboSearchInputRef.current?.focus(), 20);
                      }
                    }}
                    onKeyDown={handleComboKeyDown}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] text-left flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200 cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-white truncate">
                        {selectedUniversity.name}
                      </div>
                      <div className="text-xs font-mono text-teal-700 dark:text-teal-400 truncate">
                        Formula: Percentage = {selectedUniversity.formulaLabel}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                        isComboOpen ? 'rotate-180 text-teal-600' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isComboOpen && (
                    <div
                      id="university-combobox-listbox"
                      role="listbox"
                      aria-label="Universities and Conversion Formulas"
                      className="absolute z-30 left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden"
                    >
                      <div className="p-2.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900">
                        <div className="relative">
                          <Search
                            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            aria-hidden="true"
                          />
                          <input
                            ref={comboSearchInputRef}
                            type="search"
                            aria-label="Search universities"
                            placeholder="Type university name (e.g., VTU, Mumbai, Anna, BHU)..."
                            value={uniQuery}
                            onChange={(e) => {
                              setUniQuery(e.target.value);
                              setHighlightedIndex(0);
                            }}
                            onKeyDown={handleComboKeyDown}
                            className="w-full bg-[#F0F2F5] border-2 border-transparent text-stone-900 rounded-full pl-10 pr-4 py-3 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-base sm:text-sm placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70">
                        {flatOrderedUniversities.length === 0 ? (
                          <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                            No matching university found. Use &ldquo;Normal Calculation (CGPA × 9.5)&rdquo; for standard conversion.
                          </div>
                        ) : (
                          <>
                            {popularFiltered.length > 0 && (
                              <div role="group" aria-label="Popular Universities">
                                <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/90 dark:bg-slate-800/50">
                                  Popular Universities &amp; Standard
                                </div>
                                {popularFiltered.map((uni) => {
                                  const flatIdx = flatOrderedUniversities.findIndex(
                                    (u) => u.id === uni.id
                                  );
                                  const isHighlighted = flatIdx === highlightedIndex;
                                  const isSelected = uni.id === selectedUniId;
                                  return (
                                    <div
                                      key={uni.id}
                                      id={`uni-opt-${uni.id}`}
                                      role="option"
                                      aria-selected={isSelected}
                                      onClick={() => handleSelectUniversity(uni)}
                                      onMouseEnter={() => setHighlightedIndex(flatIdx)}
                                      className={`px-4 py-2.5 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                                        isHighlighted
                                          ? 'bg-teal-50/90 dark:bg-teal-950/50'
                                          : isSelected
                                          ? 'bg-slate-50 dark:bg-slate-800/60'
                                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                      }`}
                                    >
                                      <div className="min-w-0">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                          {uni.name}
                                        </div>
                                        <div className="text-xs font-mono text-teal-700 dark:text-teal-400">
                                          {uni.formulaLabel}
                                        </div>
                                      </div>
                                      <span
                                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                          uni.verified
                                            ? 'bg-emerald-100/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                            : 'bg-amber-100/80 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                                        }`}
                                      >
                                        {uni.verified ? 'Verified' : 'Standard estimate'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {otherFiltered.length > 0 && (
                              <div role="group" aria-label="Other Universities">
                                <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/90 dark:bg-slate-800/50">
                                  Other Universities (A–Z)
                                </div>
                                {otherFiltered.map((uni) => {
                                  const flatIdx = flatOrderedUniversities.findIndex(
                                    (u) => u.id === uni.id
                                  );
                                  const isHighlighted = flatIdx === highlightedIndex;
                                  const isSelected = uni.id === selectedUniId;
                                  return (
                                    <div
                                      key={uni.id}
                                      id={`uni-opt-${uni.id}`}
                                      role="option"
                                      aria-selected={isSelected}
                                      onClick={() => handleSelectUniversity(uni)}
                                      onMouseEnter={() => setHighlightedIndex(flatIdx)}
                                      className={`px-4 py-2.5 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                                        isHighlighted
                                          ? 'bg-teal-50/90 dark:bg-teal-950/50'
                                          : isSelected
                                          ? 'bg-slate-50 dark:bg-slate-800/60'
                                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                      }`}
                                    >
                                      <div className="min-w-0">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                          {uni.name}
                                        </div>
                                        <div className="text-xs font-mono text-teal-700 dark:text-teal-400">
                                          {uni.formulaLabel}
                                        </div>
                                      </div>
                                      <span
                                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                          uni.verified
                                            ? 'bg-emerald-100/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                            : 'bg-amber-100/80 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                                        }`}
                                      >
                                        {uni.verified ? 'Verified' : 'Standard estimate'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed m-0">
                    {selectedUniversity.sourceNote}
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: CGPA Numeric Input with Uniformed Input Container */}
            <div
              id="cgpa-converter-panel"
              role="tabpanel"
              className="bg-[#F8F9FA] dark:bg-slate-800/60 rounded-[24px] border border-stone-100 dark:border-slate-800 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="cgpa-main-input"
                  className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase"
                >
                  3. Enter Your CGPA (0 – {scale.toFixed(1)})
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                  Up to 2 decimals
                </span>
              </div>

              <div className="relative">
                <input
                  id="cgpa-main-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={`e.g. ${scale === 10.0 ? '8.50' : scale === 5.0 ? '4.25' : '3.50'}`}
                  value={cgpaInput}
                  onChange={handleCgpaInputChange}
                  aria-invalid={cgpaError !== ''}
                  aria-describedby={cgpaError ? 'cgpa-input-error' : 'cgpa-input-hint'}
                  className={`w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 transition-all font-bold text-xl sm:text-2xl text-center placeholder:text-slate-400 ${
                    cgpaError
                      ? 'border-rose-500 text-rose-700 dark:text-rose-400 focus:ring-rose-500/30'
                      : 'border-transparent focus:border-[#2563EB] focus:ring-blue-500/15'
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 select-none bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-2 py-0.5 rounded-md pointer-events-none">
                  / {scale.toFixed(1)}
                </span>
              </div>

              {cgpaError ? (
                <div
                  id="cgpa-input-error"
                  role="alert"
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{cgpaError}</span>
                </div>
              ) : (
                <p id="cgpa-input-hint" className="text-xs text-slate-500 dark:text-slate-400 m-0">
                  Instant calculation active. Or select a quick preset below:
                </p>
              )}

              {/* Quick CGPA Preset Chips (Uniformed UI Chips) */}
              <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                  Presets:
                </span>
                {SCALE_PRESETS[scale].map((presetVal) => {
                  const formatted = presetVal.toFixed(2).replace(/\.00$/, '.0');
                  const isCurrent =
                    !cgpaError &&
                    cgpaInput.trim() !== '' &&
                    Math.abs(Number(cgpaInput) - presetVal) < 0.001;
                  return (
                    <button
                      key={presetVal}
                      type="button"
                      aria-label={`Set CGPA to ${formatted}`}
                      onClick={() => {
                        triggerHaptic(6);
                        setCgpaInput(presetVal.toFixed(2));
                        setCgpaError('');
                      }}
                      className={`preset-btn text-xs py-1.5 px-4 font-mono transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#4C5985] dark:bg-teal-600 text-white rounded-full font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 rounded-full font-semibold shadow-sm'
                      }`}
                    >
                      {formatted}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit & Reset Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <button
                type="submit"
                className="flex-1 min-h-[48px] px-6 py-2.5 rounded-full bg-[#4C5985] hover:bg-[#3D476B] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold shadow-md text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Calculate Percentage</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[48px] px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
          </form>
        </section>

        {/* Right Column: Uniformed Live Conversion Output Card */}
        <section
          aria-label="Calculated Percentage Result"
          aria-live="polite"
          className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Equivalent Percentage
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl text-xs font-semibold ${
                  calculationResult.division.badgeColor === 'emerald'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : calculationResult.division.badgeColor === 'blue'
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    : calculationResult.division.badgeColor === 'amber'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {isValidMainInput ? calculationResult.division.shortLabel : 'Enter Valid CGPA'}
                </span>
              </span>
            </div>

            {/* Primary Percentage Readout with Lightweight Inline SVG Donut Visual */}
            <div className="p-5 rounded-[28px] bg-[#DCE1EF] dark:bg-teal-950/60 border border-[#B0BAD9] dark:border-teal-800/60 shadow-sm mb-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight text-teal-950 dark:text-teal-100 tabular-nums">
                    {isValidMainInput ? `${calculationResult.percentage.toFixed(2)}%` : '— %'}
                  </div>
                  <div className="mt-1.5 font-mono text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-300">
                    {isValidMainInput ? calculationResult.stepByStep : 'Enter a valid CGPA to compute'}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {scale === 10.0
                      ? selectedUniversity.name
                      : `Standard ${scale.toFixed(1)} Scale (${scale === 5.0 ? 'CGPA × 20' : 'CGPA × 25'})`}
                  </div>
                </div>

                {/* Lightweight Inline SVG Donut Chart */}
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center" aria-hidden="true">
                  {(() => {
                    const radius = 38;
                    const circumference = 2 * Math.PI * radius;
                    const clampedPct = isValidMainInput
                      ? Math.min(100, Math.max(0, calculationResult.percentage))
                      : 0;
                    const strokeDashoffset =
                      circumference - (clampedPct / 100) * circumference;
                    return (
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="9"
                          className="text-slate-200/80 dark:text-slate-800"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="9"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          className="text-teal-500 dark:text-teal-400 transition-all duration-500 ease-out"
                        />
                      </svg>
                    );
                  })()}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-xs font-extrabold text-teal-950 dark:text-teal-100">
                      {isValidMainInput ? `${Math.round(calculationResult.percentage)}%` : '0%'}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                      Score
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="mt-4 w-full h-2 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-500 transition-all duration-300"
                  style={{
                    width: `${isValidMainInput ? Math.min(100, Math.max(0, calculationResult.percentage)) : 0}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 italic m-0 text-center sm:text-left">
                Estimates only, check your university&apos;s official marksheet.
              </p>
            </div>

            {/* Step-by-Step Formula Box */}
            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-[20px] bg-[#F8F9FA] dark:bg-slate-800/60 border border-black/5 dark:border-slate-800 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Formula &amp; Step-by-Step Calculation
                </div>
                <div className="font-mono text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-300">
                  {calculationResult.formulaUsed}
                </div>
                <div className="font-mono text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {isValidMainInput ? calculationResult.stepByStep : '—'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-[20px] bg-[#FFE8C2] dark:bg-amber-950/55 border border-black/5 dark:border-amber-800/50 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Class / Division
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                    {isValidMainInput ? calculationResult.division.label : '—'}
                  </div>
                </div>
                <div className="p-4 rounded-[20px] bg-[#D6E1FF] dark:bg-indigo-950/55 border border-black/5 dark:border-indigo-800/50 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Letter Equivalent
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 font-mono">
                    {isValidMainInput ? calculationResult.division.gradeLetter : '—'}
                  </div>
                </div>
              </div>

              {isValidMainInput && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-1">
                  {calculationResult.division.remark}
                </p>
              )}
            </div>
          </div>

          {/* Export / Copy / Share / Print Toolbar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-200/70 dark:border-slate-800/80 no-print">
            <button
              type="button"
              onClick={handleCopyResult}
              className="min-h-[44px] px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 font-semibold shadow-sm text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Copy</span>
            </button>
            <button
              type="button"
              onClick={handleShareLink}
              className="min-h-[44px] px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 font-semibold shadow-sm text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#4C5985] hover:bg-[#3D476B] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold shadow-md text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>PDF</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#4C5985] hover:bg-[#3D476B] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold shadow-md text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Print</span>
            </button>
          </div>
        </section>
      </div>

      {/* PART 2: SECONDARY WORKSTATION (SGPA TO CGPA & REVERSE PERCENTAGE TO CGPA) */}
      <section
        aria-label="SGPA to CGPA and Reverse Percentage Calculators"
        className="w-full max-w-5xl mx-auto mt-8 bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 font-sans"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200/60 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase block mb-1">
              Multi-Semester &amp; Reverse Tools
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">
              Semester SGPA Aggregator &amp; Reverse Percentage Converter
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base mt-1 m-0">
              Calculate cumulative CGPA from semester SGPAs or reverse-convert a target percentage back into CGPA.
            </p>
          </div>

          <div className="inline-flex p-1 rounded-full bg-stone-100/80 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 self-start">
            <button
              type="button"
              onClick={() => setSecondaryMode('sgpa')}
              className={`text-xs flex items-center gap-1.5 cursor-pointer ${
                secondaryMode === 'sgpa'
                  ? 'bg-[#1A1C1E] dark:bg-slate-700 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 rounded-full font-semibold shadow-sm px-4 py-1.5 transition-all'
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>SGPA to CGPA &amp; %</span>
            </button>
            <button
              type="button"
              onClick={() => setSecondaryMode('reverse')}
              className={`text-xs flex items-center gap-1.5 cursor-pointer ${
                secondaryMode === 'reverse'
                  ? 'bg-[#1A1C1E] dark:bg-slate-700 text-white rounded-full font-bold px-4 py-1.5 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 rounded-full font-semibold shadow-sm px-4 py-1.5 transition-all'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Percentage to CGPA</span>
            </button>
          </div>
        </div>

        {secondaryMode === 'sgpa' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-[#F8F9FA] dark:bg-slate-800/60 rounded-[24px] border border-stone-100 dark:border-slate-800 p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-12 gap-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <div className="col-span-4">Term</div>
                <div className="col-span-4">SGPA (Max {scale.toFixed(1)})</div>
                <div className="col-span-3">Credits</div>
                <div className="col-span-1 text-right">Del</div>
              </div>

              {semesters.map((sem) => (
                <div
                  key={sem.id}
                  className="grid grid-cols-12 gap-2 items-center p-2 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/60 dark:border-slate-800 shadow-xs"
                >
                  <div className="col-span-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 pl-2 truncate">
                    {sem.name}
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label={`${sem.name} SGPA`}
                      placeholder="8.50"
                      value={sem.sgpa}
                      onChange={(e) => handleUpdateSemester(sem.id, 'sgpa', e.target.value)}
                      className="w-full min-h-[42px] px-4 py-2.5 rounded-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 font-mono text-base sm:text-sm font-bold text-center placeholder:text-slate-400"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      aria-label={`${sem.name} Credits`}
                      placeholder="22"
                      value={sem.credits}
                      onChange={(e) => handleUpdateSemester(sem.id, 'credits', e.target.value)}
                      className="w-full min-h-[42px] px-4 py-2.5 rounded-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 font-mono text-base sm:text-sm font-bold text-center placeholder:text-slate-400"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      aria-label={`Remove ${sem.name}`}
                      onClick={() => handleRemoveSemester(sem.id)}
                      disabled={semesters.length <= 2}
                      className="min-h-[38px] min-w-[38px] rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleAddSemester}
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 font-semibold shadow-sm text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add Semester ({semesters.length}/12)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setCgpaInput(sgpaSummary.calculatedCgpa.toFixed(2));
                    setCgpaError('');
                    setToast(`Loaded ${sgpaSummary.calculatedCgpa.toFixed(2)} CGPA into main converter!`);
                  }}
                  className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#4C5985] hover:bg-[#3D476B] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold shadow-md text-xs transition-all cursor-pointer active:scale-95"
                >
                  Use {sgpaSummary.calculatedCgpa.toFixed(2)} CGPA in Main Converter &uarr;
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-[28px] bg-[#DCE1EF] dark:bg-teal-950/60 border border-[#B0BAD9] dark:border-teal-800/60 shadow-sm space-y-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-teal-800 dark:text-teal-300">
                Cumulative Multi-Semester Result
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-stone-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Cumulative CGPA
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-teal-950 dark:text-teal-100 mt-1">
                    {sgpaSummary.calculatedCgpa.toFixed(2)}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-stone-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Equivalent %
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-teal-950 dark:text-teal-100 mt-1">
                    {sgpaSummary.percentage.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
                <div>
                  <strong>Semesters Counted:</strong> {sgpaSummary.validSemestersCount} terms ({sgpaSummary.totalCredits} total credits)
                </div>
                <div>
                  <strong>Applied Formula:</strong> <span className="font-mono">{sgpaSummary.formulaUsed}</span>
                </div>
                <div>
                  <strong>Academic Class:</strong> {sgpaSummary.division.label}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 bg-[#F8F9FA] dark:bg-slate-800/60 rounded-[24px] border border-stone-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-3">
              <label
                htmlFor="reverse-percentage-input"
                className="block text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300"
              >
                Enter Percentage (0% – 100%)
              </label>
              <div className="relative group">
                <input
                  id="reverse-percentage-input"
                  type="text"
                  inputMode="decimal"
                  value={reversePctInput}
                  onChange={handleReverseInputChange}
                  placeholder="e.g. 80.75"
                  className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-xl text-center placeholder:text-slate-400"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 transition-colors select-none bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-2 py-0.5 rounded-full pointer-events-none">
                  %
                </span>
              </div>
              {reversePctError && (
                <p role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400 m-0">
                  {reversePctError}
                </p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                Uses the exact inverse of your currently selected scale ({scale.toFixed(1)}) and university rule ({scale === 10.0 ? selectedUniversity.name : 'Standard'}).
              </p>
            </div>

            <div className="lg:col-span-6 p-5 rounded-[28px] bg-[#D6E1FF] dark:bg-indigo-950/60 border border-[#A5BCF0] dark:border-indigo-800/60 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-widest text-indigo-900 dark:text-indigo-300">
                Required / Equivalent CGPA
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-indigo-950 dark:text-indigo-100 mt-1 tabular-nums">
                {reversePctError ? '—' : `${reverseResult.cgpa.toFixed(2)} / ${scale.toFixed(1)}`}
              </div>
              <div className="mt-2 font-mono text-xs text-indigo-900/80 dark:text-indigo-300/80">
                {reversePctError ? 'Enter a valid percentage' : reverseResult.stepByStep}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* PART 3: EDUCATIONAL GUIDE, REFERENCE TABLES, UNIVERSITY DIRECTORY & FAQ */}
      <CgpaEducationalGuide />
    </>
  );
};

export default CgpaToPercentage;
