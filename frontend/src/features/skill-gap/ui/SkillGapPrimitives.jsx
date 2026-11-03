import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, AlertCircle, Sparkles, ChevronRight, X } from 'lucide-react'

// ─── Design Tokens & Theme Helper ──────────────────────────────────────────
export const TOKENS = {
  radius: 'var(--radius-md, 12px)',
  radiusSm: 'var(--radius-sm, 8px)',
  borderHairline: '1px solid var(--border)',
  fontDisplay: "var(--font-sans, 'Outfit', -apple-system, sans-serif)",
  fontBody: "var(--font-sans, 'Outfit', -apple-system, sans-serif)",
  fontMono: "var(--font-mono, 'JetBrains Mono', monospace)",
  colorMuted: 'var(--text-muted)',
  glowPrimary: 'none',
  glowCyan: 'none',
  glowEmerald: 'none',
}

// ─── Motion Presets (with prefers-reduced-motion support) ───────────────────
export const useMotionPresets = () => {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return {
      fadeUp: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      },
      stagger: {
        animate: { transition: { staggerChildren: 0 } },
      },
      pulse: {},
    }
  }

  return {
    fadeUp: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -6 },
      transition: { duration: 0.18, ease: 'easeOut' },
    },
    stagger: {
      animate: {
        transition: { staggerChildren: 0.04 },
      },
    },
    slideIn: {
      initial: { opacity: 0, x: 10 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -10 },
      transition: { duration: 0.18, ease: 'easeOut' },
    },
  }
}

// ─── Telemetry Badge / HUD Tag ────────────────────────────────────────
export function HUDTag({
  label,
  value,
  variant = 'cyan', // 'cyan' | 'purple' | 'emerald' | 'amber' | 'crimson'
  pulse = true,
  style = {},
}) {
  const colorMap = {
    cyan: { text: 'var(--accent)', bg: 'var(--primary-dim)', border: 'rgba(107, 124, 245, 0.2)', dot: 'var(--accent)' },
    purple: { text: 'var(--accent)', bg: 'var(--primary-dim)', border: 'rgba(107, 124, 245, 0.2)', dot: 'var(--accent)' },
    emerald: { text: 'var(--success)', bg: 'var(--success-dim)', border: 'rgba(95, 176, 143, 0.22)', dot: 'var(--success)' },
    amber: { text: 'var(--warning)', bg: 'var(--warning-dim)', border: 'rgba(212, 169, 94, 0.22)', dot: 'var(--warning)' },
    crimson: { text: 'var(--error)', bg: 'var(--error-dim)', border: 'rgba(208, 123, 123, 0.22)', dot: 'var(--error)' },
  }

  const current = colorMap[variant] || colorMap.cyan

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 9px',
        borderRadius: '9999px',
        background: current.bg,
        border: `1px solid ${current.border}`,
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: TOKENS.fontMono,
        color: current.text,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        boxShadow: 'var(--shadow-sm)',
        ...style,
      }}
    >
      {pulse && (
        <span
          style={{
            position: 'relative',
            display: 'flex',
            height: '5px',
            width: '5px',
          }}
        >
          <span
            style={{
              position: 'relative',
              borderRadius: '50%',
              height: '5px',
              width: '5px',
              background: current.dot,
            }}
          />
        </span>
      )}
      <span>{label}</span>
      {value && <span style={{ opacity: 0.85, fontWeight: 500 }}>: {value}</span>}
    </div>
  )
}

// ─── Corner HUD Crosshair Overlay (Clean SaaS) ──────────────────────────
export function CornerHUD() {
  return null
}

// ─── Section Header (Clean SaaS) ───────────────────────────────────────
export function Section({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
  className = '',
  style = {},
}) {
  return (
    <section className={`sg-section ${className}`} style={{ marginBottom: '28px', ...style }}>
      {(eyebrow || title || subtitle || actions) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            {eyebrow && (
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: '4px',
                  fontFamily: TOKENS.fontMono,
                }}
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                style={{
                  fontFamily: TOKENS.fontDisplay,
                  fontSize: '17px',
                  fontWeight: 650,
                  letterSpacing: '-0.015em',
                  color: 'var(--text)',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  margin: '3px 0 0',
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

// ─── 1px Hairline Divider ──────────────────────────────────────────────────
export function Divider({ style = {}, vertical = false }) {
  if (vertical) {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        style={{
          width: '1px',
          alignSelf: 'stretch',
          background: 'linear-gradient(180deg, transparent, var(--border) 20%, var(--border) 80%, transparent)',
          margin: '0 16px',
          ...style,
        }}
      />
    )
  }
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      style={{
        width: '100%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--border) 15%, var(--border) 85%, transparent)',
        margin: '20px 0',
        ...style,
      }}
    />
  )
}

// ─── Inline Typographic Stat ───────────────────────────────────────────────
export function Stat({
  value,
  unit = '',
  label,
  sublabel,
  trend,
  color = 'var(--text)',
  size = 'md',
  style = {},
}) {
  const valueSizes = {
    sm: '17px',
    md: '22px',
    lg: '28px',
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
        <span
          style={{
            fontFamily: TOKENS.fontMono,
            fontSize: valueSizes[size] || valueSizes.md,
            fontWeight: 800,
            color,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: TOKENS.fontMono }}>
            {unit}
          </span>
        )}
        {trend && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: TOKENS.fontMono,
              color: trend > 0 ? 'var(--success)' : 'var(--error)',
              marginLeft: '3px',
            }}
          >
            {trend > 0 ? `+${trend}` : trend}
          </span>
        )}
      </div>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      {sublabel && (
        <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
          {sublabel}
        </span>
      )}
    </div>
  )
}

// ─── Clean Semantic Skill Chip ─────────────────────────────────────────────
export function Chip({
  label,
  variant = 'neutral', // 'neutral' | 'matched' | 'partial' | 'missing' | 'primary' | 'cyber'
  priority, // 'High' | 'Medium' | 'Low'
  icon,
  onClick,
  style = {},
}) {
  const variantStyles = {
    neutral: {
      bg: 'var(--glass)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
    matched: {
      bg: 'var(--success-dim)',
      color: 'var(--success)',
      border: '1px solid rgba(95, 176, 143, 0.25)',
    },
    partial: {
      bg: 'var(--warning-dim)',
      color: 'var(--warning)',
      border: '1px solid rgba(212, 169, 94, 0.25)',
    },
    missing: {
      bg: 'var(--error-dim)',
      color: 'var(--error)',
      border: '1px solid rgba(208, 123, 123, 0.25)',
    },
    primary: {
      bg: 'var(--primary-dim)',
      color: 'var(--accent)',
      border: '1px solid rgba(107, 124, 245, 0.22)',
    },
    cyber: {
      bg: 'var(--primary-dim)',
      color: 'var(--accent)',
      border: '1px solid rgba(107, 124, 245, 0.22)',
    },
  }

  const current = variantStyles[variant] || variantStyles.neutral

  const priorityColors = {
    High: 'var(--error)',
    Medium: 'var(--warning)',
    Low: 'var(--text-muted)',
  }

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 550,
        background: current.bg,
        color: current.color,
        border: current.border,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 180ms ease-out',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        letterSpacing: '-0.01em',
        ...style,
      }}
    >
      {priority && (
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: priorityColors[priority] || 'var(--text-muted)',
            display: 'inline-block',
          }}
          title={`Priority: ${priority}`}
        />
      )}
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{label}</span>
    </span>
  )
}

// ─── Animated SVG Score Ring with Tech Radial HUD Glow ─────────────────────
export function ScoreRing({
  score = 0,
  max = 100,
  size = 130,
  strokeWidth = 9,
  label = 'ATS Score',
  sublabel = 'Baseline',
}) {
  const shouldReduceMotion = useReducedMotion()
  const [displayVal, setDisplayVal] = useState(shouldReduceMotion ? score : 0)

  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(score / max, 0), 1)
  const strokeDashoffset = circumference - progress * circumference

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayVal(score)
      return
    }

    let start = 0
    const duration = 1200
    const startTime = performance.now()

    const animateNumber = (now) => {
      const elapsed = now - startTime
      const factor = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - factor, 3)
      const curr = Math.round(start + (score - start) * ease)
      setDisplayVal(curr)

      if (factor < 1) {
        requestAnimationFrame(animateNumber)
      }
    }

    const frameId = requestAnimationFrame(animateNumber)
    return () => cancelAnimationFrame(frameId)
  }, [score, shouldReduceMotion])

  // Semantic color and glow based on score grade
  const color =
    score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--error)'

  const glowShadow = 'drop-shadow(0 2px 8px rgba(107, 124, 245, 0.15))'

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label={`${label}: ${score} of ${max}`}
    >
      <svg
        width={size}
        height={size}
        style={{
          transform: 'rotate(-90deg)',
          filter: glowShadow,
        }}
      >
        <defs>
          <linearGradient id={`sgRingGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>

        {/* Outer Guide Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth}
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="2 4"
          fill="none"
          opacity={0.4}
        />

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.6}
        />

        {/* Animated Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#sgRingGrad-${size})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.0, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Center Label */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: TOKENS.fontMono,
            fontSize: `${Math.round(size * 0.27)}px`,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1,
          }}
        >
          {displayVal}
          <span style={{ fontSize: `${Math.round(size * 0.13)}px`, fontWeight: 600, color: 'var(--text-muted)' }}>
            %
          </span>
        </span>
        {label && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              fontFamily: TOKENS.fontMono,
              color: 'var(--text-muted)',
              marginTop: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Button with Subtle Lift & SaaS Styling ───────────────────────────────
export function Button({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'outline' | 'cyber'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  icon,
  iconRight,
  style = {},
  className = '',
  type = 'button',
}) {
  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12px', borderRadius: '7px' },
    md: { padding: '8px 16px', fontSize: '13px', borderRadius: '8px' },
    lg: { padding: '11px 22px', fontSize: '14px', borderRadius: '9px' },
  }

  const variantStyles = {
    primary: {
      background: 'var(--gradient-primary)',
      color: '#F8F9FC',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 2px 10px rgba(91, 108, 240, 0.22)',
    },
    cyber: {
      background: 'var(--gradient-primary)',
      color: '#F8F9FC',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 2px 10px rgba(91, 108, 240, 0.22)',
    },
    secondary: {
      background: 'var(--glass)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      border: 'none',
    },
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        fontWeight: 600,
        borderRadius: TOKENS.radius,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontFamily: TOKENS.fontBody,
        textDecoration: 'none',
        letterSpacing: '-0.01em',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      className={className}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
      {iconRight && <span style={{ display: 'inline-flex' }}>{iconRight}</span>}
    </motion.button>
  )
}

// ─── Stage List (Honest Progress for Scan Modal) ───────────────────────────
export function StageList({ stages = [], activeIndex = 0 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {stages.map((stage, idx) => {
        const isDone = idx < activeIndex
        const isActive = idx === activeIndex
        const isUpcoming = idx > activeIndex

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              opacity: isUpcoming ? 0.35 : 1,
              transition: 'opacity 0.25s ease',
            }}
          >
            {/* Indicator */}
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
                background: isDone
                  ? 'var(--success-dim)'
                  : isActive
                  ? 'var(--accent-dim)'
                  : 'var(--glass)',
                border: isDone
                  ? '1px solid rgba(95, 176, 143, 0.35)'
                  : isActive
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border)',
                color: isDone ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {isDone ? (
                <Check size={14} strokeWidth={2.5} />
              ) : isActive ? (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    boxShadow: '0 0 8px var(--primary)',
                  }}
                />
              ) : (
                <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: TOKENS.fontMono }}>{idx + 1}</span>
              )}
            </div>

            {/* Stage Text */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: isActive ? 800 : 600,
                    color: isUpcoming ? 'var(--text-muted)' : 'var(--text)',
                  }}
                >
                  {stage.title}
                </span>
                {isDone && stage.elapsed && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, fontFamily: TOKENS.fontMono }}>
                    {stage.elapsed}
                  </span>
                )}
              </div>
              {stage.sub && (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0', lineHeight: 1.4 }}>
                  {stage.sub}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Minimal Toast Notification ───────────────────────────────────────────
export function Toast({ message, type = 'info', onClose }) {
  if (!message) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: 'var(--surface-glass, var(--surface))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: TOKENS.radius,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '380px',
      }}
    >
      <span style={{ color: type === 'error' ? 'var(--error)' : 'var(--success)', display: 'flex' }}>
        {type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
      </span>
      <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', flex: 1 }}>
        {message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={15} />
        </button>
      )}
    </motion.div>
  )
}

// ─── Subtle Skeleton Loader ───────────────────────────────────────────────
export function Skeleton({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--surface-soft) 25%, var(--surface-hover) 50%, var(--surface-soft) 75%)',
        backgroundSize: '200% 100%',
        animation: 'sg-skeleton-pulse 1.6s ease-in-out infinite',
        ...style,
      }}
    />
  )
}
