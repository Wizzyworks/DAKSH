import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '44px 0 32px',
        marginTop: 'auto',
      }}
    >
      <div className="page-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            paddingBottom: '22px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {/* Logo & Tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '9px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GraduationCap size={16} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '17px', fontWeight: 900, color: 'var(--text)', fontFamily: 'Outfit, sans-serif' }}>
                DAKSH
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Shaping Tier1, Tier-2 & Tier-3 candidates into hire-ready engineers.
            </p>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
              Home
            </Link>
            <Link to="/login" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
              Log In
            </Link>
            <Link to="/signup" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
              Sign Up
            </Link>
            <Link to="/onboarding" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
              Onboarding
            </Link>
          </div>
        </div>

        {/* Legal & Trademark Disclaimer */}
        <div
          style={{
            padding: '16px 0',
            borderBottom: '1px solid var(--border)',
            fontSize: '11px',
            lineHeight: '1.6',
            color: 'var(--text-subtle)',
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Disclaimer:</strong> All company logos, trademarks, and registered trademarks (such as Google, Microsoft, Amazon, TCS, Infosys) are the property of their respective owners. Use of these logos on this website is solely for identification, educational, and interview preparation calibration purposes and does not imply any official affiliation, endorsement, or sponsorship.
          </p>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '18px',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--text-subtle)',
          }}
        >
          <span>&copy; {currentYear} DAKSH | All rights reserved.</span>
          <span>Crafted for Indian Campus Recruitment Drives</span>
        </div>
      </div>
    </footer>
  )
}
