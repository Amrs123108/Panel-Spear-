import React, { useState } from 'react'
import { SABADOS, TELETRABAJO } from '../data/mockData.js'
import { initials } from '../utils/helpers.js'

export default function LogisticsPanel() {
  const [sabIdx, setSabIdx] = useState(0)
  const sab = SABADOS[sabIdx]

  return (
    <div className="two-col">
      {/* ── Sábados libres ── */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-head">
          <div>
            <div className="card-title">Sábados libres</div>
            <div className="card-sub" style={{ marginTop: 2 }}>{sab.date}</div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn-secondary" style={{ padding: '3px 10px', fontSize: 12 }}
              onClick={() => setSabIdx(i => Math.max(0, i - 1))} disabled={sabIdx === 0}>←</button>
            <button className="btn-secondary" style={{ padding: '3px 10px', fontSize: 12 }}
              onClick={() => setSabIdx(i => Math.min(SABADOS.length - 1, i + 1))} disabled={sabIdx === SABADOS.length - 1}>→</button>
          </div>
        </div>

        <div style={{ padding: '10px 14px' }}>
          {sab.alert && (
            <div className="alert-bar warn">
              <i className="ti ti-alert-triangle" style={{ fontSize: 13, flexShrink: 0 }} />
              {sab.alert}
            </div>
          )}

          {/* Counter */}
          <div style={{
            background: 'var(--sp-danger-bg)', border: '1px solid var(--sp-danger-bdr)',
            borderRadius: 'var(--r-sm)', padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
          }}>
            <i className="ti ti-home" style={{ fontSize: 17, color: 'var(--sp-danger)' }} />
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--sp-danger)' }}>{sab.asesores.length}</span>
            <span style={{ fontSize: 11, color: 'var(--sp-danger)', fontWeight: 600 }}>
              {sab.asesores.length === 1 ? 'asesor no estará' : 'asesores no estarán'}
            </span>
          </div>

          {/* Person list */}
          {sab.asesores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 12, color: 'var(--sp-text-ter)' }}>
              <i className="ti ti-circle-check" style={{ fontSize: 16, color: 'var(--sp-success)', display: 'block', marginBottom: 3 }} />
              Sin ausencias este sábado
            </div>
          ) : (
            sab.asesores.map((a, i) => (
              <div key={i} className="person-row">
                <div className="person-av">{initials(a.nombre)}</div>
                <div>
                  <div className="person-name">{a.nombre}</div>
                  <div className="person-tag">{a.cartera}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Teletrabajo ── */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-head">
          <div>
            <div className="card-title">Teletrabajo</div>
            <div className="card-sub">Semana {TELETRABAJO.semana}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ background: 'var(--sp-success-bg)', borderRadius: 'var(--r-sm)', padding: '3px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--sp-success)' }}>{TELETRABAJO.remoto.length}</div>
              <div style={{ fontSize: 10, color: 'var(--sp-success)', fontWeight: 600 }}>remoto</div>
            </div>
            <div style={{ background: 'var(--sp-bg)', borderRadius: 'var(--r-sm)', padding: '3px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--sp-text)' }}>{TELETRABAJO.sitio.length}</div>
              <div style={{ fontSize: 10, color: 'var(--sp-text-ter)', fontWeight: 600 }}>sitio</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {/* Remoto */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
              padding: '4px 8px', borderRadius: 'var(--r-sm)', marginBottom: 4, textAlign: 'center',
              background: 'var(--sp-success-bg)', color: 'var(--sp-success)',
            }}>
              <i className="ti ti-home" /> Remoto
            </div>
            {TELETRABAJO.remoto.map((n, i) => (
              <div key={i} style={{
                fontSize: 11, padding: '4px 7px', background: 'var(--sp-bg)',
                borderRadius: 'var(--r-sm)', marginBottom: 2, color: 'var(--sp-text)', fontWeight: 500,
              }}>{n}</div>
            ))}
          </div>

          {/* Sitio */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
              padding: '4px 8px', borderRadius: 'var(--r-sm)', marginBottom: 4, textAlign: 'center',
              background: 'var(--sp-bg)', color: 'var(--sp-text-sec)',
            }}>
              <i className="ti ti-building" /> En sitio
            </div>
            {TELETRABAJO.sitio.map((n, i) => (
              <div key={i} style={{
                fontSize: 11, padding: '4px 7px', background: 'var(--sp-bg)',
                borderRadius: 'var(--r-sm)', marginBottom: 2, color: 'var(--sp-text)', fontWeight: 500,
              }}>{n}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
