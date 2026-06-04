import React, { useState } from 'react'
import { SEG_PARAMS } from '../data/mockData.js'
import { fmtB, fmtN, calcNecesarias, calcDiaria, calcMTD } from '../utils/helpers.js'

const DIA_HOY = 4

export default function ParametrosPage() {
  const [selKey, setSelKey] = useState('ba')
  const [saved, setSaved]   = useState(false)

  // Build editable state per cartera
  const buildState = (k) => {
    const c = SEG_PARAMS[k]
    if (c.segmentos) {
      return { diasHabiles: 26, segmentos: c.segmentos.map(s => ({ ...s })) }
    }
    return { diasHabiles: 26, meta: c.meta, montoProm: c.montoProm, pctCumpl: c.pctCumpl }
  }

  const [params, setParams] = useState(() =>
    Object.keys(SEG_PARAMS).reduce((acc, k) => { acc[k] = buildState(k); return acc }, {})
  )

  const p = params[selKey]
  const c = SEG_PARAMS[selKey]

  const updateGlobal = (field, val) => {
    setParams(prev => ({ ...prev, [selKey]: { ...prev[selKey], [field]: parseFloat(val) || 0 } }))
    setSaved(false)
  }

  const updateSeg = (segId, field, val) => {
    setParams(prev => {
      const segs = prev[selKey].segmentos.map(s =>
        s.id === segId ? { ...s, [field]: parseFloat(val) || 0 } : s
      )
      return { ...prev, [selKey]: { ...prev[selKey], segmentos: segs } }
    })
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const renderSegResult = (meta, monto, pct) => {
    const nec   = calcNecesarias(meta, monto, pct)
    const diaria = calcDiaria(nec, p.diasHabiles)
    const mtd   = calcMTD(nec, p.diasHabiles, DIA_HOY)
    return { nec, diaria, mtd }
  }

  const FieldRow = ({ label, desc, value, onChange, prefix = '', suffix = '' }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--sp-border)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 10, color: 'var(--sp-text-ter)', marginTop: 2 }}>{desc}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 130, justifyContent: 'flex-end' }}>
        {prefix && <span style={{ fontSize: 11, color: 'var(--sp-text-ter)', fontWeight: 500 }}>{prefix}</span>}
        <input
          type="number" min="0"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: 90, border: '1px solid var(--sp-border)', borderRadius: 'var(--r-sm)',
            padding: '5px 8px', fontSize: 13, fontWeight: 600, textAlign: 'right',
            color: 'var(--sp-text)', background: 'var(--sp-surface)', outline: 'none',
            fontFamily: 'DM Mono, monospace',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--sp-blue)'; e.target.style.background = 'var(--sp-blue-light)' }}
          onBlur={e =>  { e.target.style.borderColor = 'var(--sp-border)'; e.target.style.background = 'var(--sp-surface)' }}
        />
        {suffix && <span style={{ fontSize: 11, color: 'var(--sp-text-ter)', minWidth: 24 }}>{suffix}</span>}
      </div>
    </div>
  )

  const ResultBox = ({ nec, diaria, mtd }) => (
    <div style={{ background: 'var(--sp-blue-light)', borderRadius: 'var(--r-sm)', padding: '10px 12px', marginTop: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--sp-blue)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>
        <i className="ti ti-calculator" style={{ marginRight: 4 }} />Resultado calculado
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
        {[
          { label: 'Promesas (mes)', value: fmtN(nec), sub: 'Para cumplir la meta' },
          { label: 'Por día hábil',  value: fmtN(diaria), sub: `De ${p.diasHabiles} días` },
          { label: `MTD · día ${DIA_HOY}`, value: fmtN(mtd), sub: 'Esperado a hoy' },
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--sp-surface)', borderRadius: 'var(--r-sm)', padding: '8px 10px' }}>
            <div style={{ fontSize: 10, color: 'var(--sp-text-ter)', marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--sp-blue)' }}>{item.value}</div>
            <div style={{ fontSize: 10, color: 'var(--sp-text-ter)', marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--sp-text-sec)', background: 'var(--sp-surface)', borderRadius: 'var(--r-sm)', padding: '5px 9px' }}>
        {fmtB(p.meta || 0)} ÷ {fmtB(p.montoProm || 0)} ÷ {p.pctCumpl || 0}% = <strong>{fmtN(calcNecesarias(p.meta, p.montoProm, p.pctCumpl))}</strong>
      </div>
    </div>
  )

  return (
    <div>
      <div className="sl">Configuración de parámetros · Solo Administrador / Gerente</div>

      <div className="alert-bar info" style={{ marginBottom: 14 }}>
        <i className="ti ti-lock" style={{ fontSize: 14, flexShrink: 0 }} />
        Los parámetros que configures aquí alimentan automáticamente la calculadora del supervisor y el dashboard del gerente.
      </div>

      {/* Cartera tabs */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
        {Object.keys(SEG_PARAMS).map(k => (
          <button key={k} className={`chip${selKey === k ? ' active' : ''}`} onClick={() => { setSelKey(k); setSaved(false) }}>
            {SEG_PARAMS[k].name}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">{c.name}</div>
            <div className="card-sub">Junio 2026 · {p.diasHabiles} días hábiles · Hoy: día {DIA_HOY}</div>
          </div>
          <span className={`bdg ${p.segmentos ? 'bdg-info' : 'bdg-ok'}`}>
            {p.segmentos ? 'Multi-segmento' : 'Segmento único'}
          </span>
        </div>
        <div className="card-body">

          {/* Días hábiles — always shown */}
          <FieldRow
            label="Días hábiles del mes"
            desc="Días reales de trabajo (excluye feriados y domingos)"
            value={p.diasHabiles}
            onChange={v => updateGlobal('diasHabiles', v)}
            suffix="días"
          />

          <div style={{ height: 12 }} />

          {/* Single segment */}
          {!p.segmentos && (
            <>
              <FieldRow label="Meta operativa"         desc="Objetivo de recaudo en Balboas para el mes"            value={p.meta}       onChange={v => updateGlobal('meta', v)}       prefix="B/." />
              <FieldRow label="Monto promedio de pago"  desc="Pago promedio histórico por cliente"                  value={p.montoProm}  onChange={v => updateGlobal('montoProm', v)}  prefix="B/." />
              <FieldRow label="% de cumplimiento"       desc="De cada 100 promesas, ¿cuántas se cobran realmente?"  value={p.pctCumpl}   onChange={v => updateGlobal('pctCumpl', v)}   suffix="%" />
              {p.meta && p.montoProm && p.pctCumpl && (
                <ResultBox {...renderSegResult(p.meta, p.montoProm, p.pctCumpl)} />
              )}
            </>
          )}

          {/* Multi-segment */}
          {p.segmentos?.map(seg => {
            const r = renderSegResult(seg.meta, seg.monto, seg.pct)
            return (
              <div key={seg.id} style={{ border: '1px solid var(--sp-border)', borderRadius: 'var(--r-sm)', padding: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--sp-text)', marginBottom: 2 }}>
                  {seg.label} <span className="bdg bdg-info">{seg.tag}</span>
                </div>
                <FieldRow label="Meta operativa"         desc="" value={seg.meta}  onChange={v => updateSeg(seg.id,'meta',v)}  prefix="B/." />
                <FieldRow label="Monto promedio"          desc="" value={seg.monto} onChange={v => updateSeg(seg.id,'monto',v)} prefix="B/." />
                <FieldRow label="% cumplimiento"          desc="" value={seg.pct}   onChange={v => updateSeg(seg.id,'pct',v)}   suffix="%" />
                <FieldRow label="Peso del segmento"       desc="% de importancia relativa dentro de la cartera" value={seg.peso} onChange={v => updateSeg(seg.id,'peso',v)} suffix="%" />
                <ResultBox {...r} />
              </div>
            )
          })}

        </div>
      </div>

      {/* Save bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: saved ? 'var(--sp-success)' : 'var(--sp-text-ter)' }}>
          {saved ? '✓ Parámetros guardados' : 'Sin cambios guardados'}
        </span>
        <button className="btn-secondary" onClick={() => setParams(p => ({ ...p, [selKey]: buildState(selKey) }))}>
          <i className="ti ti-refresh" style={{ marginRight: 4 }} />Restablecer
        </button>
        <button className="btn-primary" onClick={handleSave}>
          <i className="ti ti-device-floppy" style={{ marginRight: 5 }} />Guardar parámetros
        </button>
      </div>
    </div>
  )
}
