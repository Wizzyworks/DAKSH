import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  FileText,
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  Clock,
  Play,
  SkipForward,
  SkipBack,
  Award,
} from 'lucide-react'

export default function VideoClassroomView({
  step,
  courseTitle,
  onBackToMap,
  onCompleteLecture,
}) {
  const [activeTab, setActiveTab] = useState('notes')
  const [notes, setNotes] = useState('Key concept: Byzantine Fault Tolerance requires 3f + 1 nodes to tolerate f faulty or malicious nodes. Raft simplifies this by separating Leader Election from Log Replication.')
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: `Welcome to "${step?.title || 'Lecture'}"! I am SETU AI, your in-video tutor. Ask me any doubt about this topic or timestamped explanations as you watch.`,
    },
  ])
  const [chatInput, setChatInput] = useState('')

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMsg = { id: Date.now().toString(), sender: 'user', text: chatInput.trim() }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput('')

    setTimeout(() => {
      const botReply = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Regarding "${userMsg.text}": In distributed state machines, consensus ensures that all non-faulty nodes agree on the exact sequence of log entries. Raft guarantees safety by enforcing the Leader Completeness property.`,
      }
      setChatMessages((prev) => [...prev, botReply])
    }, 600)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
        gap: '16px',
      }}
    >
      {/* Top Header & Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <button
          onClick={onBackToMap}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '9999px',
            border: '1px solid var(--border)',
            background: 'var(--surface-card)',
            color: 'var(--text)',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Roadmap</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '9999px',
              background: 'var(--primary-dim)',
              color: 'var(--accent)',
            }}
          >
            STAGE {step?.stepNumber || '01'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
            {step?.title}
          </span>
        </div>

        {/* Mark as complete CTA */}
        <motion.button
          onClick={() => onCompleteLecture(step.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 18px',
            borderRadius: '9999px',
            background: 'var(--gradient-primary)',
            color: 'var(--on-acc)',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px -2px rgba(91, 108, 240, 0.4)',
          }}
        >
          <CheckCircle2 size={15} />
          <span>Mark as Completed (+100 XP)</span>
        </motion.button>
      </div>

      {/* Main Split Grid: Left Video Player (65%) | Right Sidebar Tabs (35%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
          gap: '16px',
        }}
      >
        {/* Left: Video Player Shell */}
        <div
          style={{
            background: 'var(--surface-card)',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Simulated 16:9 Video Canvas */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%',
              background: '#0B0D12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--on-acc)',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  boxShadow: '0 4px 20px rgba(91, 108, 240, 0.5)',
                }}
              >
                <Play size={24} fill="var(--on-acc)" style={{ marginLeft: '3px' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0' }}>{step?.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--sec-ink-muted)', margin: 0 }}>Duration: {step?.duration || '24:18 mins'}</p>
            </div>
            {/* Fallback external lecture link in case of embed restrictions */}
            <div style={{ padding: '8px 12px', background: 'var(--surface-soft)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)' }}>
              <span>Having playback issues?</span>
              <a
                href={step?.url || 'https://www.youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}
              >
                Watch on YouTube ↗
              </a>
            </div>
          </div>

          {/* Under-video Controls & Retention Badge */}
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--success)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: 'var(--success-dim)',
                }}
              >
                <RotateCcw size={12} />
                <span>SuperMemo SM-2 Active Recall Ready</span>
              </span>
            </div>

            <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
              Course: {courseTitle}
            </span>
          </div>
        </div>

        {/* Right: Tabbed Sidebar (Notes & SETU AI Tutor) */}
        <div
          style={{
            background: 'var(--surface-card)',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: '520px',
          }}
        >
          {/* Tab Header */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface-soft)',
            }}
          >
            <button
              onClick={() => setActiveTab('notes')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: activeTab === 'notes' ? 'var(--surface-card)' : 'transparent',
                color: activeTab === 'notes' ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <FileText size={14} />
              <span>Study Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: activeTab === 'tutor' ? 'var(--surface-card)' : 'transparent',
                color: activeTab === 'tutor' ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Bot size={14} />
              <span>SETU AI Tutor</span>
            </button>
          </div>

          {/* Tab 1: Notes */}
          {activeTab === 'notes' && (
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take timestamped notes here..."
                style={{
                  width: '100%',
                  flex: 1,
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '12px',
                  fontSize: '13px',
                  color: 'var(--text)',
                  lineHeight: 1.5,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '8px', textAlign: 'right' }}>
                Auto-saved to your profile telemetry
              </span>
            </div>
          )}

          {/* Tab 2: In-Context SETU AI Tutor */}
          {activeTab === 'tutor' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div
                style={{
                  flex: 1,
                  padding: '14px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      maxWidth: '85%',
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' ? 'var(--accent)' : 'var(--surface-soft)',
                      color: msg.sender === 'user' ? 'var(--on-acc)' : 'var(--text)',
                      borderRadius: '14px',
                      padding: '8px 12px',
                      fontSize: '12.5px',
                      lineHeight: 1.45,
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} style={{ padding: '10px', borderTop: '1px solid var(--border)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--surface-soft)',
                    border: '1px solid var(--border)',
                    borderRadius: '9999px',
                    padding: '2px 4px 2px 12px',
                  }}
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask SETU about this lecture..."
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '12px',
                      color: 'var(--text)',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      border: 'none',
                      color: 'var(--on-acc)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Send size={11} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

