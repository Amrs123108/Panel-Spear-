import React, { useEffect, useRef, useState } from 'react'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'
import { CARTERAS_TREND, TOTALS_TREND, TREND_MONTHS, TREND_NOTES } from '../data/mockData.js'
import { formatMetricValue, trendCalc, statusBadge, fmtM, fmtN, fmtPct } from '../utils/helpers.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const METRICS = [
  { id: 'prom', label: 'Promesas'   },
  { id: 'pct',  label: '% vs meta'  },
  { id: 'rec',  label: 'Recaudo'    },
  { id: 'gest', label: 'Gestiones'  },
]
const METRIC_COLORS = { prom: '#1B4FD8', pct: '#378ADD', rec: '#1D9E75', gest: '#534AB7' }
const PALETTE = ['#1B4FD8','#1D9E75','#E24B4A','#D97706','#534AB7','#D85A30','#378ADD','#D4537E']

function TrendIndicator({ arr }) {
  const { dir, pct } = trendCalc(arr)
  if (dir === 'up') return <span className="t-up">↑ {Math.abs(pct).toFixed(1)}%</span>
  if (dir === 'dn') return <span className="t-dn">↓ {Math.abs(pct).toFixed(1)}%</span>
  return <span className="t-eq">→ estable</span>
}

function StatusBadge({ arr, metric }) {
  const s = statusBadge(arr, metric)
  const labels = { ok: '↑ Sobre meta', warn: '⚠ En riesgo', err: '↓ Crítico', neutral: 'Estable' }
  return <span className={`bdg bdg-${s}`}>{labels[s]}</span>
}

export default function TrendChart() {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)
  const [metric, setMetric]   = useState('prom')
  const [view, setView]       = useState('all')   // 'all' | 'focus'
  const [focusIdx, setFocusIdx] = useState(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (chartRef.current) chartRef.current.destroy()

    const col = METRIC_COLORS[metric]
    const gc  = 'rgba(13,27,46,.05)'
    const tc  = '#8A97A8'

    let datasets = []
    if (view === 'all') {
      datasets = [{
        label: 'Consolidado total',
        data: TOTALS_TREND[metric].map((v, i) => (i === 3 && v === 0 ? null : v)),
        borderColor: col, backgroundColor: 'transparent',
        borderWidth: 2.5, pointRadius: 5, pointBackgroundColor: col,
        tension: 0.35, spanGaps: false,
      }]
    } else {
      datasets = CARTERAS_TREND.map((c, i) => ({
        label: c.name,
        data: c[metric].map((v, j) => (j === 3 && v === 0 ? null : v)),
        borderColor: focusIdx === null || focusIdx === i ? PALETTE[i % PALETTE.length] : 'rgba(180,178,169,.18)',
        backgroundColor: 'transparent',
        borderWidth: focusIdx === i ? 2.5 : 1.2,
        pointRadius: focusIdx === null || focusIdx === i ? 3 : 1,
        pointBackgroundColor: PALETTE[i % PALETTE.length],
        tension: 0.35, spanGaps: false,
      }))
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: { labels: TREND_MONTHS, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff', titleColor: tc, bodyColor: '#0D1B2E',
            borderColor: '#E2E7EF', borderWidth: 1,
            callbacks: {
              label: (c) => {
                const v = c.parsed.y
                if (v === null) return null
                if (metric === 'rec')  return ` ${c.dataset.label}: ${fmtM(v)}`
                if (metric === 'pct')  return ` ${c.dataset.label}: ${fmtPct(v)}`
                return ` ${c.dataset.label}: ${fmtN(v)}`
              },
            },
          },
        },
        scales: {
          x: { grid: { color: gc }, ticks: { color: tc, font: { size: 11 } } },
          y: {
            grid: { color: gc },
            ticks: {
              color: tc, font: { size: 11 },
              callback: (v) => {
                if (metric === 'rec')  return 'B/.' + v.toFixed(1) + 'M'
                if (metric === 'pct')  return v + '%'
                return v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v
              },
            },
          },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [metric, view, focusIdx])

  const handleFocus = (i) => {
    if (view !== 'focus') return
    setFocusIdx(prev => prev === i ? null : i)
  }

  const fmt = (v, i) => formatMetricValue(v, i, metric)

  return (
    <div>
      {/* ── Chart card ── */}
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Evolución mensual consolidada</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
              {['Mar','Abr','May'].map(m => (
                <span key={m} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'var(--sp-bg)', color: 'var(--sp-text-ter)', border: '1px solid var(--sp-border)', fontWeight: 500 }}>{m}</span>
              ))}
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'var(--sp-blue-light)', color: 'var(--sp-blue)', border: '1px solid var(--sp-blue-border)', fontWeight: 600 }}>Jun ●</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Metric tabs */}
            <div style={{ display: 'flex', gap: 3 }}>
              {METRICS.map(m => (
                <button key={m.id} className={`mtab${metric === m.id ? ' active' : ''}`} onClick={() => { setMetric(m.id); setFocusIdx(null) }}>
                  {m.label}
                </button>
              ))}
            </div>
            {/* View toggle */}
            <div style={{ display: 'flex', gap: 2, background: 'var(--sp-bg)', borderRadius: 20, padding: 2 }}>
              {['all','focus'].map(v => (
                <button key={v}
                  onClick={() => { setView(v); setFocusIdx(null) }}
                  style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                    border: view === v ? '1px solid var(--sp-border)' : 'none',
                    background: view === v ? 'var(--sp-surface)' : 'transparent',
                    color: view === v ? 'var(--sp-text)' : 'var(--sp-text-sec)',
                    fontWeight: view === v ? 600 : 400,
                  }}>
                  {v === 'all' ? 'Total' : 'Por cartera'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '10px 16px 6px' }}>
          <div className="note-bar">{TREND_NOTES[metric]}</div>
          <div style={{ height: 200, position: 'relative' }}>
            <canvas ref={canvasRef} />
          </div>

          {view === 'focus' && (
            <div style={{ fontSize: 11, color: 'var(--sp-text-ter)', textAlign: 'center', marginTop: 4 }}>
              Clic en una cartera para enfocarla · clic de nuevo para quitar el foco
            </div>
          )}

          {/* Legend */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 8, paddingTop: 7, borderTop: '1px solid var(--sp-border)' }}>
            {view === 'all' ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--sp-text-sec)', fontWeight: 500 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: METRIC_COLORS[metric], display: 'inline-block' }} />
                Total consolidado — todas las carteras
              </span>
            ) : (
              CARTERAS_TREND.map((c, i) => (
                <span key={c.id} onClick={() => handleFocus(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4, fontSize: 10,
                    color: 'var(--sp-text-sec)', cursor: 'pointer', padding: '2px 7px',
                    borderRadius: 20, fontWeight: focusIdx === i ? 600 : 400,
                    background: focusIdx === i ? 'var(--sp-bg)' : 'transparent',
                    userSelect: 'none',
                  }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: PALETTE[i % PALETTE.length], display: 'inline-block',
                    opacity: focusIdx === null || focusIdx === i ? 1 : 0.2,
                  }} />
                  {c.name}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Detail table ── */}
      <div className="sl">Detalle comparativo por cartera</div>
      <div className="card">
        <table className="sp-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Cartera</th>
              <th style={{ width: '11%' }}>Marzo</th>
              <th style={{ width: '11%' }}>Abril</th>
              <th style={{ width: '12%' }}>Mayo</th>
              <th style={{ width: '12%' }}>Junio</th>
              <th style={{ width: '16%' }}>Tendencia</th>
              <th style={{ width: '18%' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {CARTERAS_TREND.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                {[0,1,2,3].map(i => (
                  <td key={i}>
                    {fmt(c[metric][i], i) ?? (
                      <span style={{ color: 'var(--sp-blue)', fontSize: 10, fontWeight: 600 }}>En curso</span>
                    )}
                  </td>
                ))}
                <td><TrendIndicator arr={c[metric]} /></td>
                <td><StatusBadge arr={c[metric]} metric={metric} /></td>
              </tr>
            ))}
            <tr className="row-total">
              <td>Total general</td>
              {[0,1,2,3].map(i => (
                <td key={i}>
                  {fmt(TOTALS_TREND[metric][i], i) ?? (
                    <span style={{ color: 'var(--sp-blue)', fontSize: 10, fontWeight: 600 }}>En curso</span>
                  )}
                </td>
              ))}
              <td><TrendIndicator arr={TOTALS_TREND[metric]} /></td>
              <td><StatusBadge arr={TOTALS_TREND[metric]} metric={metric} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
