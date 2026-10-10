import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, ArrowLeft, RefreshCw, Sparkles, Check, Briefcase, FileCode, CheckCircle2 } from 'lucide-react'
import { PRESET_ROLES } from './skillGapData'

export default function Step2TargetBenchmark({
  selectedRole,
  setSelectedRole,
  customJDText,
  setCustomJDText,
  isAnalyzing,
  analysisProgress,
  analysisStatusText,
  activeRoleConfig,
  onBack,
  onRunAnalysis,
}) {
  const [benchmarkMode, setBenchmarkMode] = useState('preset') // 'preset' or 'custom'

  const wordCount = customJDText.trim() ? customJDText.trim().split(/\s+/).length : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 900,
            margin: '0 0 6px',
            fontFamily: 'Outfit, sans-serif',
            color: 'var(--text)',
            letterSpacing: '-0.01em',
          }}
        >
          Step 2: Choose Your Target Job / Dream Role
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          Pick a curated campus placement track or paste an exact company job description.
        </p>
      </div>

      {/* Segmented Mode Switcher (Theme-Aware & Responsive) */}
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          background: 'var(--surface-soft)',
          padding: '4px',
          borderRadius: '99px',
          border: '1px solid var(--border)',
          marginBottom: '24px',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => setBenchmarkMode('preset')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '99px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: benchmarkMode === 'preset' ? 'var(--gradient-primary)' : 'transparent',
            color: benchmarkMode === 'preset' ? '#FFFFFF' : 'var(--text-muted)',
            boxShadow: benchmarkMode === 'preset' ? '0 2px 12px var(--primary-glow)' : 'none',
          }}
        >
          <Briefcase size={15} />
          <span>Campus Placement Tracks ({PRESET_ROLES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setBenchmarkMode('custom')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '99px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: benchmarkMode === 'custom' ? 'var(--gradient-primary)' : 'transparent',
            color: benchmarkMode === 'custom' ? '#FFFFFF' : 'var(--text-muted)',
            boxShadow: benchmarkMode === 'custom' ? '0 2px 12px var(--primary-glow)' : 'none',
          }}
        >
          <FileCode size={15} />
          <span>Paste Company Drive JD</span>
        </button>
      </div>

      {/* Main Mode Surface (Theme-Aware & Responsive) */}
      <div
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(24px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'clamp(16px, 3vw, 24px)',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <AnimatePresence mode="wait">
          {benchmarkMode === 'preset' ? (
            <motion.div
              key="mode-preset"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                {PRESET_ROLES.map((role) => {
                  const isSelected = selectedRole === role.id
                  return (
                    <motion.div
                      key={role.id}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedRole(role.id)}
                      style={{
                        background: isSelected ? 'var(--primary-dim)' : 'var(--surface-soft)',
                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '16px 18px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        boxShadow: isSelected ? '0 0 16px var(--primary-glow)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text)' }}>
                          {role.title}
                        </span>
                        {isSelected ? (
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '10.5px',
                              fontWeight: 800,
                              color: '#10B981',
                              background: 'rgba(16, 185, 129, 0.12)',
                              padding: '2px 8px',
                              borderRadius: '99px',
                            }}
                          >
                            <Check size={11} strokeWidth={3} />
                            ACTIVE
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              color: 'var(--primary)',
                              background: 'var(--primary-dim)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            {role.tier}
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.45 }}>
                        {role.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {role.coreSkills.map((sk, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              fontSize: '10.5px',
                              background: 'var(--surface)',
                              border: '1px solid var(--border)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              color: 'var(--text-muted)',
                              fontWeight: 600,
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mode-custom"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} color="var(--primary)" />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)' }}>
                    Paste Company Drive Job Description
                  </span>
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
                  {wordCount > 0 ? `${wordCount} words detected` : 'Waiting for input'}
                </span>
              </div>

              <textarea
                placeholder="Paste Job Description text here (e.g. Amazon SDE Drive requirements: Proficiency in Data Structures, React.js, Node.js, SQL indexing, Docker containerization, REST API architecture)..."
                rows={7}
                value={customJDText}
                onChange={(e) => setCustomJDText(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  padding: '16px',
                  fontSize: '13px',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: 1.6,
                  fontFamily: 'Consolas, Monaco, monospace',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Benchmark Status Pill */}
        <div
          style={{
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Active Target Benchmark:</span>
            <strong style={{ fontSize: '13px', color: 'var(--text)' }}>{activeRoleConfig.title}</strong>
          </div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} />
            Ready for AI Skill Gap Audit
          </span>
        </div>
      </div>

      {/* Scanning Animation Bar */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--border-focus)',
              borderRadius: 'var(--radius-xl)',
              padding: '18px 24px',
              marginBottom: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
                Analysis in Progress ({analysisProgress}%)
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{analysisStatusText}</span>
            </div>
            <div style={{ height: '6px', background: 'var(--surface-soft)', borderRadius: '99px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--gradient-primary)',
                  width: `${analysisProgress}%`,
                  transition: 'all 0.3s ease',
                  borderRadius: '99px',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          className="btn btn-outline"
          style={{ padding: '10px 22px', borderRadius: '99px', fontSize: '13px', cursor: 'pointer', gap: '6px' }}
        >
          <ArrowLeft size={15} />
          <span>Back to Resume</span>
        </button>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="btn btn-primary"
          style={{
            padding: '13px 30px',
            borderRadius: '99px',
            fontSize: '14px',
            fontWeight: 800,
            gap: '8px',
            boxShadow: '0 4px 20px var(--primary-glow)',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
          }}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Analyzing Competencies...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Run AI Skill Gap Audit</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
