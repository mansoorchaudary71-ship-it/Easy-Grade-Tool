import React from 'react';
import { CheckCircle2, AlertTriangle, Target } from 'lucide-react';
import { motion } from 'motion/react';

export interface GradeVisualProgressBarProps {
  percent: number;
  letter: string;
  targetGrade?: number | null;
  targetLetter?: string | null;
  passingThreshold?: number; // default 60%
  showScaleBar?: boolean;
}

interface TierVisualConfig {
  isPassing: boolean;
  statusText: string;
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
  barGradient: string;
  barShadow: string;
  accentColor: string;
}

export function getTierVisualConfig(percent: number, passThreshold = 60): TierVisualConfig {
  if (percent >= 90) {
    return {
      isPassing: true,
      statusText: 'Passing — Honor Standing (Tier A)',
      badgeBg: '#ecfdf5', // bg-emerald-50
      badgeBorder: '#a7f3d0', // border-emerald-200
      badgeColor: '#065f46', // text-emerald-800
      barGradient: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%)',
      barShadow: '0 0 14px rgba(16, 185, 129, 0.45)',
      accentColor: '#065f46',
    };
  }
  if (percent >= 80) {
    return {
      isPassing: true,
      statusText: 'Passing — Above Average (Tier B)',
      badgeBg: '#eef2ff', // bg-indigo-50
      badgeBorder: '#c7d2fe', // border-indigo-200
      badgeColor: '#3730a3', // text-indigo-800
      barGradient: 'linear-gradient(90deg, #4338ca 0%, #6366f1 50%, #818cf8 100%)',
      barShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
      accentColor: '#3730a3',
    };
  }
  if (percent >= 70) {
    return {
      isPassing: true,
      statusText: 'Passing — Satisfactory (Tier C)',
      badgeBg: '#fffbeb', // bg-amber-50
      badgeBorder: '#fde68a', // border-amber-200
      badgeColor: '#92400e', // text-amber-800
      barGradient: 'linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
      barShadow: '0 0 12px rgba(245, 158, 11, 0.35)',
      accentColor: '#92400e',
    };
  }
  if (percent >= passThreshold) {
    return {
      isPassing: true,
      statusText: 'Passing — Marginal (Tier D)',
      badgeBg: '#fff7ed', // bg-orange-50
      badgeBorder: '#fed7aa', // border-orange-200
      badgeColor: '#9a3412', // text-orange-800
      barGradient: 'linear-gradient(90deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
      barShadow: '0 0 12px rgba(249, 115, 22, 0.4)',
      accentColor: '#9a3412',
    };
  }
  return {
    isPassing: false,
    statusText: 'Failing — At Risk (Tier F)',
    badgeBg: '#fff1f2', // bg-rose-50
    badgeBorder: '#fecdd3', // border-rose-200
    badgeColor: '#9f1239', // text-rose-800
    barGradient: 'linear-gradient(90deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)',
    barShadow: '0 0 16px rgba(239, 68, 68, 0.55)',
    accentColor: '#9f1239',
  };
}

export const GradeVisualProgressBar: React.FC<GradeVisualProgressBarProps> = ({
  percent,
  letter,
  targetGrade = null,
  targetLetter = null,
  passingThreshold = 60,
  showScaleBar = true,
}) => {
  const config = getTierVisualConfig(percent, passingThreshold);
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const hasTarget = targetGrade !== null && !isNaN(targetGrade) && targetGrade >= 0 && targetGrade <= 100;

  return (
    <div
      className="grade-visual-progress-card"
      role="region"
      aria-label="Grade Visual Progress Output"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        marginTop: '2px',
      }}
    >
      {/* Dynamic Passing vs Failing Indicator Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div
          className={`grade-status-pill ${config.isPassing ? 'is-passing' : 'is-failing'}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '1rem', /* rounded-2xl */
            fontSize: '11.5px',
            fontWeight: 700,
            fontFamily: 'var(--app-font-sans)',
            backgroundColor: config.badgeBg,
            border: `1px solid ${config.badgeBorder}`,
            color: config.badgeColor,
            transition: 'all 0.3s ease',
          }}
        >
          {config.isPassing ? (
            <CheckCircle2 style={{ width: 14, height: 14, flexShrink: 0 }} aria-hidden="true" />
          ) : (
            <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0 }} aria-hidden="true" />
          )}
          <span>{config.statusText}</span>
        </div>

        {hasTarget && (
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--app-font-mono)',
              fontWeight: 600,
              color: '#f59e0b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Target style={{ width: 13, height: 13 }} aria-hidden="true" />
            Goal: {targetGrade}% {targetLetter ? `(${targetLetter})` : ''}
          </span>
        )}
      </div>

      {/* Main Dynamic Progress Bar Track */}
      <div
        className="grade-progress-track-container"
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '6px',
          paddingBottom: '2px',
        }}
      >
        <div
          className="grade-progress-outer-track"
          style={{
            position: 'relative',
            width: '100%',
            height: '14px',
            backgroundColor: 'hsl(var(--secondary))',
            border: '1px solid hsl(var(--border) / 0.8)',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${percent.toFixed(1)}%, Letter grade ${letter}, ${config.statusText}`}
        >
          {/* Subtle passing zone background tint */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${passingThreshold}%`,
              right: 0,
              background: 'rgba(16, 185, 129, 0.05)',
              pointerEvents: 'none',
            }}
          />

          {/* Dynamic Fill: Vibrant Green for Passing, Vivid Red for Failing */}
          <div
            className="grade-progress-dynamic-fill"
            style={{
              width: `${clampedPercent}%`,
              height: '100%',
              background: config.barGradient,
              borderRadius: '9999px',
              boxShadow: config.barShadow,
              transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, box-shadow 0.3s ease',
            }}
          />
        </div>

        {/* Passing Threshold Marker (60%) */}
        <div
          style={{
            position: 'absolute',
            top: '2px',
            bottom: '-2px',
            left: `${passingThreshold}%`,
            width: '2px',
            backgroundColor: 'hsl(var(--muted-foreground) / 0.7)',
            zIndex: 3,
            pointerEvents: 'none',
          }}
          title={`Passing threshold: ${passingThreshold}%`}
        >
          <div
            style={{
              position: 'absolute',
              top: '-18px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '9px',
              fontWeight: 700,
              fontFamily: 'var(--app-font-mono)',
              color: 'hsl(var(--muted-foreground))',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            Pass {passingThreshold}%
          </div>
        </div>

        {/* Target Goal Marker Needle (if set) */}
        {hasTarget && (
          <div
            style={{
              position: 'absolute',
              top: '0px',
              bottom: '-4px',
              left: `${targetGrade}%`,
              width: '2.5px',
              backgroundColor: '#f59e0b',
              boxShadow: '0 0 6px rgba(245, 158, 11, 0.85)',
              zIndex: 4,
              pointerEvents: 'none',
              transform: 'translateX(-50%)',
            }}
            title={`Goal target: ${targetGrade}%`}
          >
            <div
              style={{
                position: 'absolute',
                bottom: '-16px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '9px',
                fontWeight: 800,
                fontFamily: 'var(--app-font-mono)',
                color: '#f59e0b',
                whiteSpace: 'nowrap',
              }}
            >
              ▲ Goal
            </div>
          </div>
        )}
      </div>

      {/* Axis Scale Markers (0%, 60% Pass, 100%) */}
      <div
        className="grade-progress-axis-labels"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '10.5px',
          fontFamily: 'var(--app-font-mono)',
          color: 'hsl(var(--muted-foreground))',
          padding: '0 2px',
          marginTop: hasTarget ? '6px' : '0px',
        }}
      >
        <span>0% (F)</span>
        <span style={{ color: config.isPassing ? '#10b981' : '#ef4444', fontWeight: 700 }}>
          {clampedPercent.toFixed(1)}% ({letter})
        </span>
        <span>100% (A+)</span>
      </div>

      {/* Interactive Academic Letter Tier Scale Bar */}
      {showScaleBar && (
        <div
          className="grade-tier-spectrum-bar"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            marginTop: '4px',
            padding: '8px 10px',
            backgroundColor: 'hsl(var(--secondary) / 0.45)',
            border: '1px solid hsl(var(--border) / 0.6)',
            borderRadius: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '10px',
              fontFamily: 'var(--app-font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'hsl(var(--muted-foreground))',
            }}
          >
            <span>Grading Spectrum</span>
            <span style={{ color: config.accentColor, fontWeight: 700 }}>
              Current: Tier {letter}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60fr 10fr 10fr 10fr 10fr',
              height: '8px',
              borderRadius: '1rem',
              overflow: 'hidden',
              gap: '1px',
              background: 'hsl(var(--border) / 0.4)',
            }}
          >
            {/* F Zone (0-59%): Rose Indicator */}
            <div
              style={{
                backgroundColor: percent < 60 ? '#f43f5e' : 'rgba(244, 63, 94, 0.35)',
                transition: 'background-color 0.25s ease',
              }}
              title="Tier F zone (< 60%)"
            />
            {/* D Zone (60-69%): Orange Indicator */}
            <div
              style={{
                backgroundColor: percent >= 60 && percent < 70 ? '#f97316' : 'rgba(249, 115, 22, 0.35)',
                transition: 'background-color 0.25s ease',
              }}
              title="Tier D zone (60-69%)"
            />
            {/* C Zone (70-79%): Amber Indicator */}
            <div
              style={{
                backgroundColor: percent >= 70 && percent < 80 ? '#f59e0b' : 'rgba(245, 158, 11, 0.35)',
                transition: 'background-color 0.25s ease',
              }}
              title="Tier C zone (70-79%)"
            />
            {/* B Zone (80-89%): Indigo Indicator */}
            <div
              style={{
                backgroundColor: percent >= 80 && percent < 90 ? '#6366f1' : 'rgba(99, 102, 241, 0.35)',
                transition: 'background-color 0.25s ease',
              }}
              title="Tier B zone (80-89%)"
            />
            {/* A Zone (90-100%): Emerald Indicator */}
            <div
              style={{
                backgroundColor: percent >= 90 ? '#10b981' : 'rgba(16, 185, 129, 0.35)',
                transition: 'background-color 0.25s ease',
              }}
              title="Tier A zone (90-100%)"
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60fr 10fr 10fr 10fr 10fr',
              textAlign: 'center',
              fontSize: '9px',
              fontFamily: 'var(--app-font-mono)',
              fontWeight: 700,
              color: 'hsl(var(--muted-foreground))',
            }}
          >
            <span style={{ color: percent < 60 ? '#ef4444' : undefined }}>F</span>
            <span style={{ color: percent >= 60 && percent < 70 ? '#f59e0b' : undefined }}>D</span>
            <span style={{ color: percent >= 70 && percent < 80 ? '#3b82f6' : undefined }}>C</span>
            <span style={{ color: percent >= 80 && percent < 90 ? '#14b8a6' : undefined }}>B</span>
            <span style={{ color: percent >= 90 ? '#10b981' : undefined }}>A</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeVisualProgressBar;
