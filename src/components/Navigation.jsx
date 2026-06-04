import React from 'react'

const TABS = [
  { id: 'dashboard',    label: 'Dashboard'     },
  { id: 'productividad',label: 'Productividad' },
  { id: 'seguimiento',  label: 'Seguimiento'   },
  { id: 'logistica',    label: 'Logística'     },
  { id: 'parametros',   label: 'Parámetros'    },
  { id: 'pendientes',   label: 'Pendientes', badge: true },
]

export default function Navigation({ activeTab, onTabChange, pendingCount = 0 }) {
  return (
    <nav style={{
      background: 'var(--sp-navy-mid)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '2px solid var(--sp-navy-light)',
      flexShrink: 0,
      overflowX: 'auto',
    }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: isActive ? '#FFFFFF' : 'rgba(255,255,255,.4)',
              padding: '10px 14px',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              borderBottom: isActive ? '2px solid var(--sp-blue)' : '2px solid transparent',
              marginBottom: -2,
              transition: 'all .15s',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,.75)' }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,.4)' }}
          >
            {tab.label}
            {tab.badge && pendingCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 17, height: 17, borderRadius: '50%',
                background: 'var(--sp-danger)', color: '#fff',
                fontSize: 9, fontWeight: 700,
              }}>
                {pendingCount}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
