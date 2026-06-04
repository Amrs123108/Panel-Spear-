import React, { useState } from 'react'

const COLUMNS = [
  { id: 'gestiones',    label: 'Gestiones',       money: false },
  { id: 'efectivas',    label: 'Efectivas',        money: false },
  { id: 'promesas',     label: 'Promesas',         money: false },
  { id: 'cumplidas',    label: 'Cumplidas',        money: false },
  { id: 'monto_prom',   label: 'M. promesado',     money: true  },
  { id: 'rec_op',       label: 'R. operativo',     money: true  },
  { id: 'rec_masivo',   label: 'R. masivo',        money: true  },
]

const CARTERAS_PROD = [
  'Banistmo Activa','Ban. Recovery','SURA','TIGO','KrediYa','Solve','CA Activa','BLH','BAC','Rodelag','Global Bank','Delta'
]

const SEED = {
  1: { gestiones: 3218, efectivas: 812, promesas: 241, cumplidas: 89, monto_prom: 68400, rec_op: 24100, rec_masivo: 98300 },
  2: { gestiones: 2990, efectivas: 744, promesas: 218, cumplidas: 102, monto_prom: 57200, rec_op: 19800, rec_masivo: '' },
  3: { gestiones: 3104, efectivas: 788, promesas: 234, cumplidas: 95, monto_prom: 62100, rec_op: 22400, rec_masivo: 41200 },
}

export default function ProductividadPage() {
  const [cartera,   setCartera]   = useState('Banistmo Activa')
  const [selDay,    setSelDay]    = useState(4)
  const [rows,      setRows]      = useState(SEED)
  const [saved,     setSaved]     = useState([1,2,3])
  const [importing, setImporting] = useState(false)

  const diaHoy  = 4
  const totalDias = 30

  const handleCellChange = (day, col, val) => {
    setRows(prev => ({
      ...prev,
      [day]: { ...(prev[day] || {}), [col]: val },
    }))
  }

  const handleSave = () => {
    setSaved(prev => prev.includes(selDay) ? prev : [...prev, selDay])
    // Visual feedback
    const btn = document.getElementById('btn-save')
    if (btn) { btn.textContent = '✓ Guardado'; setTimeout(() => { btn.textContent = 'Guardar semana' }, 2000) }
  }

  const handleImport = () => {
    setImporting(true)
    setTimeout(() => {
      setRows(prev => ({
        ...prev,
        4: { gestiones: 2418, efectivas: 631, promesas: 198, cumplidas: 74, monto_prom: 54320, rec_op: 21080, rec_masivo: '' },
      }))
      setImporting(false)
    }, 1200)
  }

  const weekDays = [
    { n: 2, label: 'Lun 2' },
    { n: 3, label: 'Mar 3' },
    { n: 4, label: 'Mié 4' },
    { n: 5, label: 'Jue 5' },
    { n: 6, label: 'Vie 6' },
  ]

  const dayStatus = (d) => {
    if (d > diaHoy)  return 'future'
    if (d === diaHoy) return 'today'
    if (saved.includes(d)) return 'filled'
    return 'empty'
  }

  // Acumulados
  const acum = COLUMNS.reduce((acc, col) => {
    acc[col.id] = Object.entries(rows)
      .filter(([d]) => Number(d) <= diaHoy)
      .reduce((s, [, r]) => s + (parseFloat(r[col.id]) || 0), 0)
    return acc
  }, {})

  return (
    <div>
      <div className="sl">Carga de productividad diaria</div>

      {/* Context selectors */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--sp-text-ter)', marginBottom: 4 }}>Cartera</div>
          <select className="sp-input" style={{ width: 'auto' }} value={cartera} onChange={e => setCartera(e.target.value)}>
            {CARTERAS_PROD.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--sp-text-ter)', marginBottom: 4 }}>Semana</div>
          <select className="sp-input" style={{ width: 'auto' }}>
            <option>2–6 jun 2026</option>
            <option>26–30 may 2026</option>
          </select>
        </div>
      </div>

      {/* Import buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <div className="card" style={{ margin: 0, padding: 12, cursor: 'pointer', textAlign: 'center' }} onClick={handleImport}>
          <div style={{ fontSize: 20, color: 'var(--sp-text-ter)' }}><i className="ti ti-camera" /></div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--sp-text)', marginTop: 4 }}>
            {importing ? 'Procesando con IA…' : 'Captura o imagen del reporte'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--sp-text-ter)', marginTop: 2 }}>Foto, screenshot o PDF — extrae datos automáticamente</div>
          {importing && (
            <div style={{ height: 3, background: 'var(--sp-border)', borderRadius: 2, marginTop: 8 }}>
              <div style={{ height: 3, background: 'var(--sp-blue)', borderRadius: 2, width: '60%', transition: 'width 1.2s' }} />
            </div>
          )}
        </div>
        <div className="card" style={{ margin: 0, padding: 12, cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ fontSize: 20, color: 'var(--sp-text-ter)' }}><i className="ti ti-table-import" /></div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--sp-text)', marginTop: 4 }}>Importar desde Excel</div>
          <div style={{ fontSize: 11, color: 'var(--sp-text-ter)', marginTop: 2 }}>
            Copia el rango en Excel · <kbd style={{ background: 'var(--sp-bg)', border: '1px solid var(--sp-border)', borderRadius: 3, padding: '1px 5px', fontSize: 10 }}>Ctrl+V</kbd> para pegar
          </div>
        </div>
      </div>

      {/* Day picker */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--sp-text-ter)', fontWeight: 600, marginBottom: 6 }}>Día seleccionado</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {weekDays.map(d => {
            const st = dayStatus(d.n)
            const isSelected = selDay === d.n
            return (
              <button key={d.n}
                onClick={() => st !== 'future' && setSelDay(d.n)}
                className={`day-btn ${isSelected ? 'selected' : st}`}
                style={{ width: 64, padding: '7px 4px' }}>
                {d.label}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
          {[['filled','var(--sp-success-bg)','var(--sp-success-bdr)','Guardado'],
            ['today','var(--sp-blue-light)','var(--sp-blue-border)','Hoy'],
            ['selected','var(--sp-navy)','var(--sp-navy)','Seleccionado']].map(([cls,bg,bdr,lbl]) => (
            <span key={cls} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--sp-text-ter)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: bg, border: `1px solid ${bdr}`, display: 'inline-block' }} />
              {lbl}
            </span>
          ))}
        </div>
      </div>

      {selDay < diaHoy && (
        <div className="alert-bar warn" style={{ marginBottom: 10 }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 14, flexShrink: 0 }} />
          Estás editando el día {selDay}. Este registro ya fue guardado — cualquier cambio sobreescribirá el dato existente.
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="sp-table" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th style={{ width: 80 }}>Día</th>
              {COLUMNS.map(c => <th key={c.id}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {weekDays.map(d => {
              const st = dayStatus(d.n)
              const isFuture = st === 'future'
              const isSelected = selDay === d.n
              const rowData = rows[d.n] || {}
              return (
                <tr key={d.n}
                  style={{ background: isSelected ? 'var(--sp-blue-light)' : isFuture ? 'transparent' : 'inherit', opacity: isFuture ? .35 : 1 }}
                  onClick={() => !isFuture && setSelDay(d.n)}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{d.label}</div>
                    <div style={{ fontSize: 10 }}>
                      {st === 'filled' && <span style={{ color: 'var(--sp-success)' }}>● guardado</span>}
                      {st === 'today'  && <span style={{ color: 'var(--sp-blue)'    }}>● hoy</span>}
                      {st === 'future' && <span style={{ color: 'var(--sp-text-ter)' }}>● futuro</span>}
                    </div>
                  </td>
                  {COLUMNS.map(col => (
                    <td key={col.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        {col.money && <span style={{ fontSize: 10, color: isFuture ? 'var(--sp-text-ter)' : '#0F6E56' }}>B/.</span>}
                        <input
                          type="number" min="0"
                          disabled={isFuture}
                          value={rowData[col.id] ?? ''}
                          placeholder={isFuture ? '—' : '0'}
                          onChange={e => handleCellChange(d.n, col.id, e.target.value)}
                          style={{
                            width: '100%', border: 'none', background: 'transparent', outline: 'none',
                            fontSize: 12, fontWeight: 500, fontFamily: 'DM Mono, monospace',
                            color: col.money ? '#0F6E56' : 'var(--sp-text)',
                          }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              )
            })}
            {/* Acum row */}
            <tr className="row-total">
              <td><div style={{ fontSize: 11, fontWeight: 700 }}>Acumulado</div></td>
              {COLUMNS.map(col => (
                <td key={col.id} style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: col.money ? '#0F6E56' : 'var(--sp-text)' }}>
                  {col.money && 'B/.'}{Math.round(acum[col.id]).toLocaleString('es-PA')}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
        <button className="btn-secondary">← Semana anterior</button>
        <button id="btn-save" className="btn-primary" onClick={handleSave}>
          <i className="ti ti-device-floppy" style={{ marginRight: 5 }} />Guardar semana
        </button>
      </div>
    </div>
  )
}
