// ─── Panel Spear · Utilities ──────────────────────────────────────────────────

export const fmtB = (v) =>
  'B/.' + Math.round(v).toLocaleString('es-PA')

export const fmtM = (v) =>
  'B/.' + v.toFixed(2) + 'M'

export const fmtN = (v) =>
  Math.round(v).toLocaleString('es-PA')

export const fmtPct = (v) =>
  Math.round(v) + '%'

export const initials = (name) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export const calcNecesarias = (meta, monto, pct) => {
  if (!meta || !monto || !pct) return 0
  return Math.ceil(meta / Math.max(monto, 1) / (pct / 100))
}

export const calcDiaria = (nec, diasHabiles) =>
  diasHabiles > 0 ? Math.ceil(nec / diasHabiles) : 0

export const calcMTD = (nec, diasHabiles, diaActual) =>
  diasHabiles > 0 ? Math.round(nec * (diaActual / diasHabiles)) : 0

export const trendCalc = (arr) => {
  const real = arr.filter((v, i) => !(i === 3 && v === 0))
  if (real.length < 2) return { dir: 'eq', pct: 0 }
  const last = real[real.length - 1]
  const prev = real[real.length - 2]
  const pct = ((last - prev) / Math.max(prev, 0.001)) * 100
  if (pct > 2)  return { dir: 'up', pct }
  if (pct < -2) return { dir: 'dn', pct }
  return { dir: 'eq', pct }
}

export const statusBadge = (arr, metric) => {
  const real = arr.filter((v, i) => !(i === 3 && v === 0))
  if (real.length < 2) return 'neutral'
  const last = real[real.length - 1]
  const prev = real[real.length - 2]
  const d = ((last - prev) / Math.max(prev, 0.001)) * 100
  if (metric === 'pct') {
    if (last >= 95) return 'ok'
    if (last >= 80) return 'warn'
    return 'err'
  }
  if (d > 5)  return 'ok'
  if (d > -5) return 'neutral'
  return 'warn'
}

export const formatMetricValue = (v, i, metric) => {
  if (i === 3 && v === 0) return null // en curso
  if (metric === 'rec') return fmtM(v)
  if (metric === 'pct') return fmtPct(v)
  return fmtN(v)
}

export const URGENCIA_COLOR = {
  alta:   'var(--sp-danger)',
  media:  'var(--sp-warning)',
  normal: 'var(--sp-text-ter)',
}
