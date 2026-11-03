import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Sparkles,
  Send,
  ChevronDown,
  Compass,
  RotateCcw,
  Lightbulb,
} from 'lucide-react'

const QUICK_PROMPTS = [
  {
    icon: Compass,
    label: 'How to build?',
    query: 'How do I create a custom learning path in DAKSH?',
  },
  {
    icon: RotateCcw,
    label: 'Spaced Recall?',
    query: 'How does the 7-14-21-30 day spaced repetition work?',
  },
  {
    icon: Lightbulb,
    label: 'Topics',
    query: 'What high-yield courses do you recommend for public service competency?',
  },
]

export default function SetuAiWidget({ onCreatePath }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'setu',
      text: "Namaste! I'm SETU, your AI Learning Co-Pilot. I can recommend curated modules and guide you through your roadmap.\n\nClick '+ Create Your Learning Path' to begin, or ask me anything below!",
      timestamp: 'Just now',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, isTyping])

  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim()
    if (!query) return

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      let replyText = ''
      const lower = query.toLowerCase()

      if (lower.includes('create') || lower.includes('path') || lower.includes('build')) {
        replyText =
          "To create your path, click '+ Create Your Learning Path'. You will give it a title, add video lectures, and I will recommend quizzes and checkpoints to bundle in!"
      } else if (lower.includes('spaced') || lower.includes('repetition') || lower.includes('memory') || lower.includes('7')) {
        replyText =
          "DAKSH schedules active recall reviews at Day +7, Day +14, Day +21, and Day +30 using the SM-2 algorithm to solidify long-term memory retention."
      } else if (lower.includes('recommend') || lower.includes('course') || lower.includes('topic')) {
        replyText =
          'Top recommendations:\n1. Public Procurement & GeM Rules (GFR 2017)\n2. Cyber Hygiene & IT Governance\n3. Treasury Management & Audit Rules'
      } else {
        replyText =
          `I've noted "${query}". As you build your learning map, I'll generate contextual flashcards and scenario quizzes to reinforce this topic.`
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'setu',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 600)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '24px',
        zIndex: 50,
        fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: '56px',
              right: '0',
              width: '330px',
              maxWidth: 'calc(100vw - 32px)',
              height: '450px',
              maxHeight: 'calc(100vh - 120px)',
              background: 'var(--surface-card)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--border-strong)',
              borderRadius: '22px',
              boxShadow: 'var(--shadow-xl), 0 16px 40px -10px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '9999px',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--on-acc)',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                  }}
                >
                  <Bot size={15} />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: 'var(--success)',
                      border: '1.5px solid var(--surface-card)',
                    }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                      SETU AI Co-Pilot
                    </span>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 600,
                        padding: '1px 5px',
                        borderRadius: '9999px',
                        background: 'var(--primary-dim)',
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      HUB
                    </span>
                  </div>
                  <p style={{ fontSize: '10.5px', color: 'var(--text-muted)', margin: 0 }}>
                    In-Hub Learning Assistant
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close SETU AI"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '9999px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background var(--transition), color var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text)'
                  e.currentTarget.style.background = 'var(--surface-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.background = 'var(--surface)'
                }}
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Chat Body */}
            <div
              style={{
                flex: 1,
                padding: '12px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {messages.map((msg) => {
                const isBot = msg.sender === 'setu'
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isBot ? 'flex-start' : 'flex-end',
                      gap: '3px',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '88%',
                        padding: '9px 12px',
                        borderRadius: isBot ? '16px 16px 16px 5px' : '16px 16px 5px 16px',
                        background: isBot ? 'var(--surface-soft)' : 'var(--accent)',
                        color: isBot ? 'var(--text)' : 'var(--on-acc)',
                        border: isBot ? '1px solid var(--border)' : 'none',
                        fontSize: '12.5px',
                        lineHeight: 1.45,
                        whiteSpace: 'pre-line',
                        boxShadow: isBot ? 'var(--shadow-sm)' : '0 3px 10px rgba(91, 108, 240, 0.22)',
                      }}
                    >
                      {msg.text}
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--text-subtle)',
                        padding: '0 3px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                )
              })}

              {isTyping && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '14px',
                    background: 'var(--surface-soft)',
                    border: '1px solid var(--border)',
                    width: 'fit-content',
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      animation: 'pulse 1s infinite alternate',
                    }}
                  />
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      animation: 'pulse 1s 0.2s infinite alternate',
                    }}
                  />
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      animation: 'pulse 1s 0.4s infinite alternate',
                    }}
                  />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div
              style={{
                padding: '6px 10px 4px',
                display: 'flex',
                gap: '5px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                borderTop: '1px solid var(--border)',
                background: 'var(--surface)',
              }}
            >
              {QUICK_PROMPTS.map((item, idx) => {
                const Icon = item.icon
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.query)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface-soft)',
                      color: 'var(--text-muted)',
                      fontSize: '10.5px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all var(--transition)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary-dim)'
                      e.currentTarget.style.color = 'var(--accent)'
                      e.currentTarget.style.borderColor = 'var(--border-accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--surface-soft)'
                      e.currentTarget.style.color = 'var(--text-muted)'
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                  >
                    <Icon size={11} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: '8px 10px 10px',
                background: 'var(--surface)',
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '3px 4px 3px 12px',
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask SETU about your path..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '12px',
                    color: 'var(--text)',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: inputValue.trim() ? 'var(--accent)' : 'var(--surface-hover)',
                    color: inputValue.trim() ? 'var(--on-acc)' : 'var(--text-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() ? 'pointer' : 'default',
                    transition: 'all var(--transition)',
                  }}
                >
                  <Send size={12} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px 8px 10px',
          borderRadius: '9999px',
          background: 'var(--surface-card)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-md), 0 6px 18px -4px rgba(91, 108, 240, 0.22)',
          cursor: 'pointer',
          color: 'var(--text)',
          transition: 'box-shadow var(--transition), border-color var(--transition)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-accent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-strong)'
        }}
      >
        {/* Compact Bot Avatar */}
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '9999px',
            background: 'var(--gradient-primary)',
            color: 'var(--on-acc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 2px 6px rgba(91, 108, 240, 0.3)',
          }}
        >
          <Bot size={14} />
          {/* Live Indicator */}
          <span
            style={{
              position: 'absolute',
              top: '-1px',
              right: '-1px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--success)',
              border: '1.5px solid var(--surface-card)',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
              SETU AI
            </span>
            <Sparkles size={11} style={{ color: 'var(--accent)' }} />
          </div>
          <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
            {isOpen ? 'Close' : 'Ask Co-Pilot'}
          </span>
        </div>
      </motion.button>
    </div>
  )
}
