import React from 'react'

function KPICard({ label, value, valueColor, progress, progressColor, meta, accentColor }) {
  return (
    <div style={{
      background: 'var(--sp-surface)',
      border: '1px solid var(--sp-border)',
      borderRadius: 'var(--r)',
      padding: '12px 14px',
      boxShadow: 'var(--shadow-sm)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: accentColor,
      }} />

      <div style={{ fontSize: 10, color: 'var(--sp-text-ter)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 5 }}>
        {label}
      </div>

      <div style={{ fontSize: 21, fontWeight: 700, color: valueColor || 'var(--sp-text)', lineHeight: 1.1 }}>
        {value}
      </div>

      {progress !== undefined && (
        <div className="progress-wrap">
          <div className="progress-fill" style={{ background: progressColor, width: `${Math.min(progress, 100)}%` }} />
        </div>
      )}

      {meta && (
        <div style={{ fontSize: 11, marginTop: 4 }} dangerouslySetInnerHTML={{ __html: meta }} />
      )}
    </div>
  )
}

export default function KPIRow() {
  return (
    <div className="kpi-grid">
      <KPICard
        label="Promesas · mayo cierre"
        value="13,695"
        accentColor="var(--sp-blue)"
        progress={81}
        progressColor="var(--sp-blue)"
        meta='<span class="t-dn">↓ 3.3%</span> vs abril · <b>81%</b> de meta'
      />
      <KPICard
        label="% Cumplimiento"
        value="81%"
        accentColor="#378ADD"
        progress={81}
        progressColor="#378ADD"
        meta='<span class="t-dn">↓ 3 meses consecutivos</span>'
      />
      <KPICard
        label="Recaudo · mayo cierre"
        value="B/.3.66M"
        accentColor="var(--sp-success)"
        progress={83}
        progressColor="var(--sp-success)"
        meta='<span class="t-dn">↓ 10.7%</span> vs abril · <b>83%</b> meta'
      />
      <KPICard
        label="Sin carga hoy · junio"
        value="8 / 13"
        valueColor="var(--sp-danger)"
        accentColor="var(--sp-danger)"
        progress={38}
        progressColor="var(--sp-danger)"
        meta='<span style="color:var(--sp-danger);font-weight:600">8 carteras pendientes hoy</span>'
      />
    </div>
  )
}
