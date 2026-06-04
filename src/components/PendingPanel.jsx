import React, { useState } from 'react'
import { PENDIENTES, AL_DIA } from '../data/mockData.js'
import { URGENCIA_COLOR } from '../utils/helpers.js'

export default function PendingPanel({ onCountChange }) {
  const [notified, setNotified] = useState({})

  const handleNotify = (id) => {
    const next = { ...notified, [id]: true }
    setNotified(next)
    const remaining = PENDIENTES.filter(p => !next[p.id]).length
    onCountChange?.(remaining)
  }

  return (
    <div>
      <div className="sl">Pendientes de actualización · hoy 4 jun</div>
      <div className="card" style={{ marginBottom: 12 }}>
        {/* Header */}
        <div className="pend-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-alert-circle" style={{ fontSize: 16, color: 'var(--sp-danger)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--sp-danger)' }}>
              {PENDIENTES.filter(p => !notified[p.id]).length} carteras sin registrar hoy
            </span>
            <span className="bdg bdg-err">Requiere acción</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--sp-text-ter)' }}>Última actualización: 08:42</span>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '8px 1fr 1fr auto',
          gap: 10, padding: '6px 14px',
          background: 'var(--sp-bg)', borderBottom: '1px solid var(--sp-border)',
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--sp-text-ter)',
        }}>
          <span />
          <span>Cartera</span>
          <span>Supervisor responsable</span>
          <span style={{ textAlign: 'right' }}>Acción</span>
        </div>

        {/* Pending rows */}
        {PENDIENTES.map(p => (
          <div key={p.id} className={`pend-row${notified[p.id] ? ' notified' : ''}`}
            style={{ gridTemplateColumns: '8px 1fr 1fr auto', display: 'grid', gap: 10 }}>
            <div className="pend-dot" style={{ background: URGENCIA_COLOR[p.urgencia], alignSelf: 'center' }} />
            <div style={{ fontWeight: 600, fontSize: 12 }}>{p.cartera}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--sp-text)' }}>{p.supervisor}</div>
              <div style={{ fontSize: 10, color: 'var(--sp-text-ter)' }}>
                Últ. carga: {p.ultimaCarga} ·{' '}
                <span style={{ color: URGENCIA_COLOR[p.urgencia], fontWeight: 600 }}>
                  {p.diasSin === 1 ? '1 día sin datos' : `${p.diasSin} días sin datos`}
                </span>
              </div>
            </div>
            <button
              className="btn-notify"
              disabled={notified[p.id]}
              onClick={() => handleNotify(p.id)}
            >
              {notified[p.id] ? '✓ Notificado' : (
                <><i className="ti ti-send" style={{ fontSize: 11, marginRight: 3 }} />Notificar</>
              )}
            </button>
          </div>
        ))}

        {/* Al día section */}
        <div className="pend-ok-section">✓ Al día</div>
        {AL_DIA.map((item, i) => (
          <div key={i} className="pend-ok-row"
            style={{ display: 'grid', gridTemplateColumns: '8px 1fr 1fr auto', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sp-success)', alignSelf: 'center' }} />
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--sp-success)' }}>{item.cartera}</div>
            <div style={{ fontSize: 11, color: 'var(--sp-text-ter)' }}>{item.supervisor} · {item.hora}</div>
            <span className="bdg bdg-ok">✓ Actualizado</span>
          </div>
        ))}
      </div>
    </div>
  )
}
