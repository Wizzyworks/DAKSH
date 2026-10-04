import { motion, AnimatePresence } from 'framer-motion'
import { Target, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react'
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
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
          Step 2: Target Hiring Benchmark & Job Description
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Select your target campus placement role or paste an exact company job description.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Left: Role Taxonomy Cards */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
            Select Target Placement Track
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PRESET_ROLES.map((role) => {
              const isSelected = selectedRole === role.id
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--surface-glass)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)' }}>
                      {role.title}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', background: 'var(--surface-soft)', padding: '2px 8px', borderRadius: '4px' }}>
                      {role.tier}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.4 }}>
                    {role.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {role.coreSkills.slice(0, 5).map((sk, sIdx) => (
                      <span key={sIdx} style={{ fontSize: '10px', background: 'var(--surface-soft)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-subtle)' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Custom Company JD Textarea */}
        <div
          style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Target size={18} color="var(--primary)" />
              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Custom Company JD (Optional)</h4>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
              Have a specific campus drive JD (e.g. Amazon, Swiggy, TCS Digital)? Paste the requirements below for precision extraction.
            </p>

            <textarea
              placeholder="Paste Job Description text here (e.g. Required skills: React, Node.js, SQL indexing, Docker, REST API architecture)..."
              rows={8}
              value={customJDText}
              onChange={(e) => setCustomJDText(e.target.value)}
              style={{
                width: '100%',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-soft)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '12px',
                fontSize: '12.5px',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
              }}
            />
          </div>

          <div style={{ marginTop: '16px', background: 'var(--surface-soft)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Selected Benchmark:</span>
            <p style={{ fontSize: '12.5px', fontWeight: 700, margin: '2px 0 0', color: 'var(--text)' }}>
              {activeRoleConfig.title}
            </p>
          </div>
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
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--primary)' }}>
                Analysis in Progress ({analysisProgress}%)
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{analysisStatusText}</span>
            </div>
            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--gradient-primary)',
                  width: `${analysisProgress}%`,
                  transition: 'all 0.3s ease',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onBack}
          className="btn btn-outline"
          style={{ padding: '10px 20px', borderRadius: '99px', fontSize: '13px', cursor: 'pointer', gap: '6px' }}
        >
          <ArrowLeft size={15} />
          <span>Back to Step 1</span>
        </button>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="btn btn-primary"
          style={{
            padding: '12px 28px',
            borderRadius: '99px',
            fontSize: '14px',
            fontWeight: 800,
            gap: '8px',
            boxShadow: '0 4px 16px var(--primary-glow)',
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
              <span>Run AI Skill Gap Analysis</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
