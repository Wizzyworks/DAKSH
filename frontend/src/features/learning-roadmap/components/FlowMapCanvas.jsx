import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  HelpCircle,
  Terminal,
  FileText,
  RotateCcw,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Award,
  Play,
  Plus,
  Settings,
  ArrowRight,
  ArrowLeft,
  Trash2,
} from 'lucide-react'

// Distinct icons for step types
const TYPE_ICONS = {
  video: Video,
  quiz: HelpCircle,
  challenge: Terminal,
  spec: FileText,
  project: Terminal,
}

export default function FlowMapCanvas({
  courseData,
  steps = [],
  onSelectStep,
  onAddActivity,
  onBackToOverview,
  onNavigateToHome,
  onDeletePath,
  onOpenSettings,
}) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [hoveredStep, setHoveredStep] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const safeSteps = Array.isArray(steps) ? steps : []
  const completedCount = safeSteps.filter((s) => s.status === 'completed').length
  const progressPercent = Math.round((completedCount / (safeSteps.length || 1)) * 100)

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.4, z + 0.1))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.75, z - 0.1))
  const handleFitMap = () => setZoomLevel(1)

  // Layout parameters for Serpentine Grid
  // Desktop: 3 items per row
  const COLS = 3
  const NODE_W = 72
  const COL_GAP = 140
  const ROW_GAP = 130
  const START_X = 60
  const START_Y = 60

  // Calculate coordinates for each step
  const nodePositions = safeSteps.map((step, idx) => {
    const row = Math.floor(idx / COLS)
    const colInRow = idx % COLS
    // If row is odd, run right-to-left for serpentine winding
    const effectiveCol = row % 2 === 0 ? colInRow : COLS - 1 - colInRow

    const x = START_X + effectiveCol * (NODE_W + COL_GAP)
    const y = START_Y + row * (NODE_W + ROW_GAP)

    return { ...step, x, y, row, col: effectiveCol, index: idx }
  })

  // Calculate SVG connector paths between nodes
  const connectorPaths = nodePositions.slice(0, -1).map((current, idx) => {
    const next = nodePositions[idx + 1]
    const isSameRow = current.row === next.row
    const isCurrentActive = current.status === 'current' || (current.status === 'completed' && next.status === 'current')
    const isCompleted = current.status === 'completed' && next.status === 'completed'

    let d = ''
    if (isSameRow) {
      // Horizontal straight line
      const fromLeft = current.x < next.x
      const startX = fromLeft ? current.x + NODE_W : current.x
      const endX = fromLeft ? next.x : next.x + NODE_W
      const centerY = current.y + NODE_W / 2
      d = `M ${startX} ${centerY} L ${endX} ${centerY}`
    } else {
      // Smooth U-turn / serpentine wrap to next row
      const startX = current.x + NODE_W / 2
      const startY = current.y + NODE_W
      const endX = next.x + NODE_W / 2
      const endY = next.y
      const midY = (startY + endY) / 2
      d = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`
    }

    return {
      id: `conn-${idx}`,
      d,
      isCompleted,
      isActive: isCurrentActive,
    }
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1020px',
        margin: '0 auto',
        fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
      }}
    >
      {/* 0. Top Corner Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onBackToOverview && (
            <button
              type="button"
              onClick={onBackToOverview}
              className="btn btn-outline btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '99px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                background: 'var(--surface-card)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <ArrowLeft size={13} />
              <span>Back to Pathways Overview</span>
            </button>
          )}
          {onNavigateToHome && (
            <button
              type="button"
              onClick={onNavigateToHome}
              className="btn btn-ghost btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '99px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>Dashboard Home</span>
            </button>
          )}
        </div>

        {onDeletePath && (
          <button
            type="button"
            onClick={onDeletePath}
            className="btn btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '99px',
              fontSize: '12px',
              fontWeight: 600,
              background: 'rgba(239, 68, 68, 0.08)',
              color: 'var(--error)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              cursor: 'pointer',
            }}
            title="Delete this entire learning path"
          >
            <Trash2 size={13} />
            <span>Delete Full Path</span>
          </button>
        )}
      </div>

      {/* 1. Header Toolbar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          padding: '18px 24px',
          background: 'var(--surface-card)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'var(--primary-dim)',
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              SERPENTINE FLOW MAP
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {completedCount} of {safeSteps.length} Completed
            </span>
          </div>

          <h1
            style={{
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            {courseData?.title || 'Distributed Systems & Consensus Engineering'}
          </h1>
        </div>

        {/* Right Action Tools: Progress Ring + Fit Map + Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Progress metric pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'var(--surface-soft)',
              border: '1px solid var(--border)',
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--text)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: progressPercent === 100 ? 'var(--success)' : 'var(--accent)',
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)' }}>{progressPercent}% Complete</span>
          </div>

          {/* Canvas View Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--surface-soft)',
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              padding: '2px',
            }}
          >
            <button
              onClick={handleZoomIn}
              aria-label="Zoom in"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={handleZoomOut}
              aria-label="Zoom out"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={handleFitMap}
              aria-label="Fit map"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: 'none',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Maximize2 size={12} />
              <span>Fit Map</span>
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* 2. Serpentine Flow Canvas */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '520px',
          background: 'var(--surface-card)',
          borderRadius: '30px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            width: '100%',
            minHeight: '480px',
          }}
        >
          {/* SVG Connecting Paths Layer */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            <defs>
              <marker
                id="arrow-completed"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--success)" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--accent)" />
              </marker>
              <marker
                id="arrow-upcoming"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--border-strong)" />
              </marker>
            </defs>

            {connectorPaths.map((conn) => (
              <path
                key={conn.id}
                d={conn.d}
                fill="none"
                stroke={
                  conn.isCompleted
                    ? 'var(--success)'
                    : conn.isActive
                    ? 'var(--accent)'
                    : 'var(--border-strong)'
                }
                strokeWidth={conn.isActive ? 2.5 : 2}
                strokeDasharray={conn.isActive ? '6 4' : 'none'}
                markerEnd={
                  conn.isCompleted
                    ? 'url(#arrow-completed)'
                    : conn.isActive
                    ? 'url(#arrow-active)'
                    : 'url(#arrow-upcoming)'
                }
                style={{
                  transition: 'stroke 0.3s ease',
                  animation: conn.isActive ? 'dash 1.2s linear infinite' : 'none',
                }}
              />
            ))}
          </svg>

          {/* Interactive Step Nodes */}
          {nodePositions.map((node) => {
            const Icon = TYPE_ICONS[node.type] || Video
            const isCompleted = node.status === 'completed'
            const isCurrent = node.status === 'current'
            const isUpcoming = node.status === 'upcoming'

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${NODE_W}px`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
                onClick={() => onSelectStep(node)}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setHoveredStep(node)
                  setTooltipPos({ x: node.x + NODE_W / 2, y: node.y - 12 })
                }}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Node Circle Shape with Status */}
                <motion.div
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: isCompleted
                      ? 'var(--success-dim)'
                      : isCurrent
                      ? 'var(--primary-dim)'
                      : 'var(--surface-soft)',
                    border: isCompleted
                      ? '2px solid var(--success)'
                      : isCurrent
                      ? '2.5px solid var(--accent)'
                      : '1.5px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted
                      ? 'var(--success)'
                      : isCurrent
                      ? 'var(--accent)'
                      : 'var(--text-muted)',
                    boxShadow: isCurrent
                      ? '0 0 0 6px var(--primary-dim), 0 8px 24px -4px rgba(91, 108, 240, 0.4)'
                      : 'var(--shadow-sm)',
                    transition: 'all var(--transition)',
                  }}
                >
                  {/* Step Index Badge (Top Right) */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: isCompleted
                        ? 'var(--success)'
                        : isCurrent
                        ? 'var(--accent)'
                        : 'var(--surface)',
                      color: isCompleted || isCurrent ? 'var(--on-acc)' : 'var(--text-muted)',
                      border: '1.5px solid var(--surface-card)',
                      fontSize: '10px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={12} strokeWidth={2.5} /> : `0${node.index + 1}`}
                  </span>

                  <Icon size={22} />
                </motion.div>

                {/* Floating Node Label Underneath */}
                <span
                  style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    fontWeight: isCurrent ? 600 : 500,
                    color: isCurrent ? 'var(--text)' : 'var(--text-muted)',
                    textAlign: 'center',
                    width: '130px',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {node.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
    </div>
  )
}

