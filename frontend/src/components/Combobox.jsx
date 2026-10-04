import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Plus, X } from 'lucide-react'

export default function Combobox({
  label,
  value = '',
  onChange,
  options = [],
  placeholder = 'Select or type custom...',
  error,
  hint,
  id,
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = options.filter(opt => {
    const text = typeof opt === 'string' ? opt : opt.label || opt.value || ''
    return text.toLowerCase().includes((query || '').toLowerCase())
  })

  const hasExactMatch = options.some(opt => {
    const text = typeof opt === 'string' ? opt : opt.label || opt.value || ''
    return text.toLowerCase() === (query || '').trim().toLowerCase()
  })

  function handleInputChange(e) {
    const val = e.target.value
    setQuery(val)
    onChange(val)
    if (!isOpen) setIsOpen(true)
  }

  function handleSelect(item) {
    const val = typeof item === 'string' ? item : item.value || item.label
    setQuery(val)
    onChange(val)
    setIsOpen(false)
  }

  function handleClear() {
    setQuery('')
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div style={{ marginBottom: '20px', position: 'relative' }} ref={containerRef}>
      {label && (
        <label htmlFor={id} className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 500 }}>
            Choose from list or type your own
          </span>
        </label>
      )}

      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`form-input ${error ? 'error' : ''}`}
          style={{ paddingRight: '64px' }}
          autoComplete="off"
        />

        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center' }}
          >
            <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            maxHeight: '240px',
            overflowY: 'auto',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 50,
            padding: '6px',
            backdropFilter: 'blur(20px)',
          }}
        >
          {query.trim() && !hasExactMatch && (
            <button
              type="button"
              onClick={() => handleSelect(query.trim())}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--primary-bright)',
                background: 'var(--primary-dim)',
                color: 'var(--primary-bright)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                marginBottom: '4px',
                textAlign: 'left'
              }}
            >
              <Plus size={14} />
              <span>Use custom: "{query.trim()}"</span>
            </button>
          )}

          {filtered.length === 0 && !query.trim() ? (
            <div style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-subtle)' }}>
              No options available. Type to add your own.
            </div>
          ) : filtered.length === 0 && query.trim() && hasExactMatch ? null : (
            filtered.map((item, idx) => {
              const text = typeof item === 'string' ? item : item.label || item.value
              const isSelected = value.toLowerCase() === text.toLowerCase()
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(text)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isSelected ? 'var(--surface-hover)' : 'transparent',
                    color: isSelected ? 'var(--primary-bright)' : 'var(--text)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'var(--surface-soft)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span>{text}</span>
                  {isSelected && <Check size={15} color="var(--primary-bright)" />}
                </button>
              )
            })
          )}
        </div>
      )}

      {error && <p className="form-error">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  )
}
