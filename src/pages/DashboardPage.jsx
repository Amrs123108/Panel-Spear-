import React, { useState } from 'react'
import KPIRow from '../components/KPIRow.jsx'
import TrendChart from '../components/TrendChart.jsx'
import PendingPanel from '../components/PendingPanel.jsx'
import LogisticsPanel from '../components/LogisticsPanel.jsx'

const FILTERS = ['Todas','Banistmo A.','SURA','TIGO','KrediYa','Solve','BLH','BAC']

export default function DashboardPage({ onPendingCountChange }) {
  const [activeFilter, setActiveFilter] = useState('Todas')

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--sp-text-ter)', fontWeight: 600, marginRight: 2 }}>Cartera:</span>
        {FILTERS.map(f => (
          <button key={f} className={`chip${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <KPIRow />

      {/* Pending */}
      <PendingPanel onCountChange={onPendingCountChange} />

      {/* Trend chart + table */}
      <div className="sl">Tendencia de productividad · Marzo – Junio 2026</div>
      <TrendChart />

      {/* Logistics */}
      <div className="sl" style={{ marginTop: 4 }}>Logística operativa</div>
      <LogisticsPanel />

      {/* Footer note */}
      <div style={{
        fontSize: 11, color: 'var(--sp-text-ter)',
        background: 'var(--sp-surface)', border: '1px solid var(--sp-border)',
        borderRadius: 'var(--r-sm)', padding: '8px 12px',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <img src="/logo-spear.png" alt="" style={{ height: 14, opacity: .4 }} />
        Panel Spear © 2026 · Spear Contact · Cobranzas y Gestión Operativa · Panamá ·
        Junio en curso — los datos se actualizan conforme los supervisores cargan. Mayo = cierre real.
      </div>
    </div>
  )
}
