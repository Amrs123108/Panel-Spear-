import React from 'react'

// ─── Spear lance SVG — matches the brand: horizontal arrow/lance in blue ──────
const SpearIcon = ({ size = 32 }) => (
  <svg width={size} height={size * 0.45} viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shaft */}
    <line x1="0" y1="18" x2="58" y2="18" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
    {/* Arrowhead (lance tip) */}
    <polygon points="58,8 80,18 58,28" fill="#FFFFFF"/>
    {/* Cross guard */}
    <line x1="52" y1="8" x2="52" y2="28" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

export default function Topbar({ user, pendingCount }) {
  return (
    <header style={{
      background: 'var(--sp-navy)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 54,
      flexShrink: 0,
    }}>

      {/* LEFT — Logo + panel name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Logo image with SVG lance fallback */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src="/logo-spear.png"
            alt="Spear Contact"
            style={{ height: 26, width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          {/* Fallback: lance SVG if image fails */}
          <div style={{ display: 'none', alignItems: 'center', gap: 6 }}>
            <SpearIcon size={60} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,.18)' }} />

        {/* Panel name */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', letterSpacing: '.01em', lineHeight: 1.1 }}>
            Panel Spear
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 500 }}>
            Gestión Operativa · Cobranzas
          </div>
        </div>
      </div>

      {/* RIGHT — date + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          fontSize: 11, color: 'rgba(255,255,255,.5)',
          background: 'rgba(255,255,255,.08)',
          padding: '4px 10px', borderRadius: 20,
          border: '1px solid rgba(255,255,255,.1)',
        }}>
          Jue 4 jun 2026 · Día 4 / 30
        </span>

        {/* User avatar + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'var(--sp-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
            flexShrink: 0,
          }}>
            {user?.initials || 'AG'}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.85)', lineHeight: 1.2 }}>
              {user?.name || 'Angel G.'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--sp-blue)', fontWeight: 500 }}>
              {user?.role || 'Gerente'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
