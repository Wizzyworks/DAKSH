import { useState, useRef } from 'react'
import FormField from './FormField'
import Combobox from './Combobox'
import { Upload, X, File, Check } from 'lucide-react'

// Renders a single onboarding field based on its schema config
export default function OnboardingField({ config, value, onChange, error }) {
  const { id, type, label, placeholder, options, required, hint } = config

  if (type === 'combobox') {
    return (
      <Combobox
        id={id}
        label={label}
        placeholder={placeholder}
        options={options || []}
        value={value || ''}
        onChange={onChange}
        error={error}
        hint={hint}
        required={required}
      />
    )
  }

  if (type === 'text' || type === 'tel' || type === 'url' || type === 'number') {
    return (
      <FormField id={id} label={label} error={error} hint={hint} required={required}>
        <input
          id={id}
          type={type}
          className={['form-input', error ? 'error' : ''].join(' ')}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          min={type === 'number' ? 0 : undefined}
        />
      </FormField>
    )
  }

  if (type === 'select') {
    return (
      <FormField id={id} label={label} error={error} hint={hint} required={required}>
        <select
          id={id}
          className={['form-input', error ? 'error' : ''].join(' ')}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ cursor: 'pointer' }}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormField>
    )
  }

  if (type === 'multiselect') {
    const selected = Array.isArray(value) ? value : []
    const toggle = (v) => {
      if (selected.includes(v)) {
        onChange(selected.filter((s) => s !== v))
      } else {
        onChange([...selected, v])
      }
    }
    return (
      <FormField id={id} label={label} error={error} hint={hint} required={required}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                className={`interactive-chip ${isSelected ? 'active' : ''}`}
                onClick={() => toggle(opt.value)}
              >
                {isSelected && <Check size={14} color="var(--primary-bright)" />}
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </FormField>
    )
  }

  if (type === 'file') {
    return (
      <FileUploadField
        id={id}
        label={label}
        error={error}
        hint={hint}
        required={required}
        value={value}
        onChange={onChange}
      />
    )
  }

  return null
}

function FileUploadField({ id, label, error, hint, required, value, onChange }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    onChange({ name: file.name, size: file.size, type: file.type, file })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <FormField id={id} label={label} error={error} hint={hint} required={required}>
      {value?.name ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px 20px',
            border: '1px solid var(--border-focus)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-dim)',
            boxShadow: '0 0 20px -5px var(--primary-glow)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--primary-bright)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <File size={20} color="#FFFFFF" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value.name}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {value.size ? `${(value.size / 1024).toFixed(0)} KB • Ready for AI Semantic Parsing` : 'Ready'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Remove file"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <div
          className="gradient-border-card"
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          style={{
            padding: '36px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            borderStyle: 'dashed',
            borderWidth: '2px',
            borderColor: dragging ? 'var(--primary-bright)' : 'var(--border)',
            background: dragging ? 'var(--primary-dim)' : 'var(--surface-soft)',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Upload size={24} color="var(--primary-bright)" />
          </div>
          <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
            Click to upload or drag & drop your Resume
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            PDF format recommended (Max size: 5 MB)
          </p>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      )}
    </FormField>
  )
}
