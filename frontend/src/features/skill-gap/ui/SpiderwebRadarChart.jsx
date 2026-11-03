import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SpiderwebRadarChart({
  competencies = [],
  size = 360,
  targetLabel = 'Role Benchmark',
  candidateLabel = 'Candidate Mastery',
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const chartId = React.useId ? React.useId().replace(/[^a-zA-Z0-9]/g, '') : 'radar'
  const glowGradientId = `candGlow_${chartId}`
  const strokeGradientId = `strokeGrad_${chartId}`

  // Default fallback competencies if none provided
  const items = competencies.length >= 3 ? competencies : [
    { name: 'Core JS & Async', benchmark: 85, candidateScore: 90, status: 'strong' },
    { name: 'Problem Solving', benchmark: 85, candidateScore: 88, status: 'strong' },
    { name: 'State Management', benchmark: 85, candidateScore: 82, status: 'strong' },
    { name: 'Backend APIs', benchmark: 80, candidateScore: 75, status: 'gap' },
    { name: 'System Design', benchmark: 80, candidateScore: 65, status: 'gap' },
    { name: 'DevOps & CI/CD', benchmark: 75, candidateScore: 60, status: 'gap' },
  ]

  const totalAxes = items.length
  const center = size / 2
  // Generous padding so multi-word labels like "State Management ✓" never clip the boundary
  const radius = center - 64
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0]

  // Math helper for polygon coordinates
  const getCoordinates = (valueNormalized, index) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2
    const r = radius * Math.max(0.08, Math.min(1.0, valueNormalized))
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      angle,
    }
  }

  // Generate web polygon rings
  const makePolygonPoints = (levelFactor) => {
    return items
      .map((_, i) => {
        const { x, y } = getCoordinates(levelFactor, i)
        return `${x},${y}`
      })
      .join(' ')
  }

  // Generate Benchmark Polygon Points (normalized / 100)
  const benchmarkPoints = items
    .map((item, i) => {
      const { x, y } = getCoordinates((item.benchmark || 80) / 100, i)
      return `${x},${y}`
    })
    .join(' ')

  // Generate Candidate Score Polygon Points (normalized / 100)
  const candidatePoints = items
    .map((item, i) => {
      const { x, y } = getCoordinates((item.candidateScore || 50) / 100, i)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: `${size}px`, margin: '0 auto', userSelect: 'none' }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
      >
        <defs>
          {/* Subtle Accent Glow Fill */}
          <radialGradient id={glowGradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
          </radialGradient>

          {/* Stroke Gradient: Accent Family */}
          <linearGradient id={strokeGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-hover)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>

        {/* 1. Concentric Spiderweb Rings */}
        {levels.map((lvl, idx) => (
          <polygon
            key={`ring-${idx}`}
            points={makePolygonPoints(lvl)}
            fill="none"
            stroke="var(--glass-border)"
            strokeWidth={idx === levels.length - 1 ? '1.2' : '0.8'}
            strokeDasharray={idx < levels.length - 1 ? '3 3' : 'none'}
            opacity={0.7}
          />
        ))}

        {/* 2. Radial Spokes (Axes) */}
        {items.map((_, i) => {
          const { x, y } = getCoordinates(1.0, i)
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--glass-border)"
              strokeWidth="0.8"
              opacity={0.6}
            />
          )
        })}

        {/* 3. Target Role Benchmark Polygon: Desaturated Warning Line */}
        <polygon
          points={benchmarkPoints}
          fill="none"
          stroke="var(--warning)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity={0.8}
        />

        {/* 4. Candidate Live Score Polygon: Subtle Accent Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          points={candidatePoints}
          fill={`url(#${glowGradientId})`}
          stroke={`url(#${strokeGradientId})`}
          strokeWidth="2"
        />

        {/* 5. Interactive Vertex Points */}
        {items.map((item, i) => {
          const { x, y } = getCoordinates((item.candidateScore || 50) / 100, i)
          const isStrong = (item.candidateScore || 0) >= (item.benchmark || 80)
          const isCriticalGap = (item.candidateScore || 0) < 60
          const vertexColor = isStrong ? 'var(--accent)' : isCriticalGap ? 'var(--error)' : 'var(--warning)'
          const isHovered = hoveredIndex === i

          return (
            <g
              key={`vertex-${i}`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Outer soft ring on hover */}
              {isHovered && (
                <circle cx={x} cy={y} r="8" fill={vertexColor} opacity="0.25" />
              )}
              {/* Core Node Dot */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 5 : 3.5}
                fill={vertexColor}
                stroke="var(--bg-elevated)"
                strokeWidth="1.5"
                style={{ transition: 'all 0.18s ease' }}
              />
            </g>
          )
        })}

        {/* 6. Spoke Labels around the Web */}
        {items.map((item, i) => {
          const { x, y, angle } = getCoordinates(1.0, i)
          const labelDist = 16
          const lx = x + labelDist * Math.cos(angle)
          const ly = y + labelDist * Math.sin(angle)
          const isHovered = hoveredIndex === i

          // Alignment based on angle
          let textAnchor = 'middle'
          if (Math.cos(angle) > 0.3) textAnchor = 'start'
          else if (Math.cos(angle) < -0.3) textAnchor = 'end'

          const isStrong = (item.candidateScore || 0) >= (item.benchmark || 80)

          return (
            <text
              key={`lbl-${i}`}
              x={lx}
              y={ly}
              textAnchor={textAnchor}
              dominantBaseline="central"
              fontSize="11px"
              fontWeight={isHovered ? '600' : '500'}
              fill={isHovered ? 'var(--accent)' : 'var(--text-muted)'}
              style={{ transition: 'fill 0.15s ease', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {item.name} {isStrong ? '✓' : ''}
            </text>
          )
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      <AnimatePresence>
        {hoveredIndex !== null && items[hoveredIndex] && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="daksh-glass-card"
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '8px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 10,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div>
              <strong style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'block' }}>
                {items[hoveredIndex].name}
              </strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                Target: {items[hoveredIndex].benchmark}% • Current: {items[hoveredIndex].candidateScore}%
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: '99px',
                background: items[hoveredIndex].candidateScore >= items[hoveredIndex].benchmark ? 'var(--success-dim)' : 'var(--error-dim)',
                color: items[hoveredIndex].candidateScore >= items[hoveredIndex].benchmark ? 'var(--success)' : 'var(--error)',
                border: `1px solid ${items[hoveredIndex].candidateScore >= items[hoveredIndex].benchmark ? 'rgba(95,176,143,0.2)' : 'rgba(208,123,123,0.2)'}`,
              }}
            >
              {items[hoveredIndex].candidateScore >= items[hoveredIndex].benchmark ? 'Matched' : 'Gap Area'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '14px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '2px', borderTop: '2px dashed var(--warning)' }} />
          {targetLabel}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
          {candidateLabel}
        </span>
      </div>
    </div>
  )
}
