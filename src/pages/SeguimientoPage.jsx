import React, { useState } from 'react'
import { SEG_PARAMS } from '../data/mockData.js'
import { fmtB, fmtN, calcNecesarias, calcDiaria, calcMTD } from '../utils/helpers.js'

const DIA_HOY    = 4
const DIAS_MES   = 30
const DIAS_HABILES = 26

function CalcBox({ meta, monto, pct, dia = DIA_HOY, diasHabiles = DIAS_HABILES }) {
  const nec  = calcNecesarias(meta, monto, pct)
  const diaria = calcDiaria(nec, diasHabiles)
  const mtd  = calcMTD(nec, diasHabiles, dia)
  return (
    <div className="calc-box">
      <div>
        <div style={{ fontSize: 11, color: 'var(--sp-blue)', marginBottom: 2 }}>
          <i className="ti ti-calculator" style={{ marginRight: 4 }} />
          Para cumplir la meta de <strong>{fmtB(meta)}</strong>
        </div>
        <div style={{ fontSize: 11, color: 'var(--sp-blue)' }}>
          necesitas <strong style={{ fontSize: 18 }}>{fmtN(nec)}</strong> promesas en el mes
        </div>
        <div style={{ fontSize: 10, color: 'var(--sp-blue)', opacity: .8, marginTop: 2 }}>
          A hoy (día {dia}) deberías llevar ~{fmtN(mtd)} acumuladas · {fmtN(diaria)}/día hábil
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: 'var(--sp-blue)' }}>Monto prom.</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--sp-blue)' }}>{fmtB(monto)}</div>
        <div style={{ fontSize: 10, color: 'var(--sp-blue)', opacity: .8 }}>{pct}% cumpl.</div>
      </div>
    </div>
  )
}

function Tag({ label }) {
  if (!label) return null
  return (
    <span style={{
      display: 'inline-block', fontSize: 10, padding: '2px 7px',
      borderRadius: 20, background: 'var(--sp-blue-light)', color: 'var(--sp-blue)',
      marginLeft: 5, fontWeight: 500,
    }}>{label}</span>
  )
}

function SimpleForm({ campos, meta, montoProm, pctCumpl }) {
  return (
    <>
      <CalcBox meta={meta} monto={montoProm} pct={pctCumpl} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {campos.map(c => (
          <div key={c.id} className="cell-wrap">
            <div className="cell-label">{c.label}<Tag label={c.tag} /></div>
            <input className={`cell-input${c.id === 'asignacion' ? ' money' : ''}`}
              type="number" min="0" placeholder="0" />
            <div className="cell-hint">{c.hint}</div>
          </div>
        ))}
      </div>
    </>
  )
}

function EspecialForm({ segmentos }) {
  return (
    <>
      {segmentos.map(seg => {
        const nec = calcNecesarias(seg.meta, seg.monto, seg.pct)
        const mtd = calcMTD(nec, DIAS_HABILES, DIA_HOY)
        return (
          <div key={seg.id} className="card" style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{seg.label}<Tag label={seg.tag} /></div>
              <div style={{ fontSize: 11, color: 'var(--sp-text-ter)' }}>Meta: {fmtB(seg.meta)}</div>
            </div>
            <div className="calc-box" style={{ marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--sp-blue)' }}>
                  Promesas necesarias: <strong style={{ fontSize: 14 }}>{fmtN(nec)}</strong>
                </div>
                <div style={{ fontSize: 10, color: 'var(--sp-blue)', opacity: .8 }}>A hoy deberías llevar ~{fmtN(mtd)}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--sp-blue)', textAlign: 'right' }}>
                {fmtB(seg.monto)} prom.<br />
                <span style={{ opacity: .8 }}>{seg.pct}% cumpl.</span>
              </div>
            </div>
            <input className="sp-input" type="number" min="0" placeholder="0" />
            <div style={{ fontSize: 10, color: 'var(--sp-text-ter)', marginTop: 4 }}>{seg.hint}</div>
          </div>
        )
      })}
    </>
  )
}

function CiclosForm({ ciclos }) {
  const [vals, setVals] = useState({})
  return (
    <>
      <div className="alert-bar info" style={{ marginBottom: 10 }}>
        <i className="ti ti-info-circle" style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }} />
        Ingresa el <strong>% de cuentas recuperadas</strong> para cada ciclo. Este porcentaje varía diariamente.
      </div>
      {ciclos.map(cic => {
        const v = parseFloat(vals[cic.id]) || 0
        const recaudo = Math.round((v / 100) * cic.meta)
        return (
          <div key={cic.id} className="card" style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{cic.label}</div>
              <span style={{ fontSize: 11, color: 'var(--sp-text-ter)' }}>Meta: {fmtB(cic.meta)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20, color: 'var(--sp-text-sec)' }}>%</span>
              <input
                className="cell-input pct"
                type="number" min="0" max="100" step="0.01" placeholder="0.00"
                style={{ width: 80, fontSize: 20 }}
                value={vals[cic.id] || ''}
                onChange={e => setVals(p => ({ ...p, [cic.id]: e.target.value }))}
              />
              <div style={{ flex: 1 }}>
                <div className="progress-wrap">
                  <div className="progress-fill" style={{ background: 'var(--sp-blue)', width: `${Math.min(v, 100)}%` }} />
                </div>
                <div style={{ fontSize: 10, color: v > 50 ? 'var(--sp-success)' : v > 25 ? 'var(--sp-warning)' : 'var(--sp-text-ter)', marginTop: 3 }}>
                  {v > 0 ? `Equivale a ${fmtB(recaudo)} recuperado` : 'Ingresa el % del día'}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--sp-text-ter)' }}>{cic.hint}</div>
          </div>
        )
      })}
    </>
  )
}

const SEG_KEYS = Object.keys(SEG_PARAMS)

export default function SeguimientoPage() {
  const [selKey, setSelKey] = useState('ba')
  const c = SEG_PARAMS[selKey]

  return (
    <div>
      <div className="sl">Calculadora de promesas por cartera</div>

      {/* Cartera tabs */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
        {SEG_KEYS.map(k => (
          <button key={k}
            className={`chip${selKey === k ? ' active' : ''}`}
            onClick={() => setSelKey(k)}
          >
            {SEG_PARAMS[k].name}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">{c.name}</div>
            <div className="card-sub">{c.tipo === 'ciclos' ? 'Ciclos de facturación' :
              c.tipo === 'especial' ? 'Multi-segmento' : 'Seguimiento diario'}</div>
          </div>
          <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 20,
            background: 'var(--sp-blue-light)', color: 'var(--sp-blue)',
            border: '1px solid var(--sp-blue-border)', fontWeight: 600,
          }}>
            {c.campos ? c.campos.map(f => f.label).join(' / ') :
              c.segmentos ? c.segmentos.map(s => s.label).join(' / ') :
              c.ciclos?.map(ci => ci.label).join(' / ')}
          </span>
        </div>
        <div className="card-body">
          <div style={{
            fontSize: 11, color: 'var(--sp-text-sec)', padding: '6px 9px',
            background: 'var(--sp-bg)', borderRadius: 'var(--r-sm)', marginBottom: 12,
          }}>{c.desc}</div>

          {/* Render by tipo */}
          {(c.tipo === 'tramos' || c.tipo === 'cancelaciones' || c.tipo === 'etapas' || c.tipo === 'descuentos' || c.tipo === 'asignacion') && (
            <SimpleForm campos={c.campos} meta={c.meta} montoProm={c.montoProm} pctCumpl={c.pctCumpl} />
          )}
          {c.tipo === 'especial' && <EspecialForm segmentos={c.segmentos} />}
          {c.tipo === 'ciclos'   && <CiclosForm ciclos={c.ciclos} />}

          {/* Historial */}
          {c.historial?.length > 0 && (
            <>
              <div style={{ height: 1, background: 'var(--sp-border)', margin: '14px 0' }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sp-text-ter)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Historial de parámetros
              </div>
              {c.historial.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--sp-border)', fontSize: 12 }}>
                  <span style={{ color: 'var(--sp-text-sec)' }}>{h.mes}</span>
                  <span style={{ fontWeight: 600 }}>{typeof h.meta === 'number' ? fmtB(h.meta) : h.meta}</span>
                  <span style={{ color: 'var(--sp-blue)' }}>
                    {typeof h.monto === 'number' ? fmtB(h.monto) : h.monto} · {h.pct}{typeof h.pct === 'number' ? '% cumpl.' : ''}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
