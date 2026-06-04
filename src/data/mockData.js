// ─── Panel Spear · Mock Data ──────────────────────────────────────────────────
// Replace with real API calls once backend is connected.

export const CARTERAS_TREND = [
  { id: 'ba',   name: 'Banistmo Activa',   prom: [4277,4813,3863,0], pct: [92,96,108,0],  rec: [1.24,1.27,1.02,0], gest: [93605,95787,105246,0] },
  { id: 'br',   name: 'Ban. Recovery',     prom: [1200,1100,980,0],  pct: [88,85,79,0],   rec: [0.38,0.36,0.31,0], gest: [31000,31000,31000,0]  },
  { id: 'sura', name: 'SURA',              prom: [3200,3500,2900,0], pct: [95,98,81,0],   rec: [1.55,1.60,1.40,0], gest: [21000,22000,19500,0]  },
  { id: 'tigo', name: 'TIGO',              prom: [2800,2600,2100,0], pct: [90,87,46,0],   rec: [0.72,0.70,0.48,0], gest: [18000,17500,16000,0]  },
  { id: 'kred', name: 'KrediYa',           prom: [1100,1200,1100,0], pct: [85,90,84,0],   rec: [0.11,0.12,0.10,0], gest: [4500,4700,4300,0]     },
  { id: 'solv', name: 'Solve',             prom: [900,950,1100,0],   pct: [88,91,150,0],  rec: [0.04,0.05,0.04,0], gest: [1500,1600,1800,0]     },
  { id: 'ca',   name: 'CA Activa',         prom: [600,650,580,0],    pct: [82,88,77,0],   rec: [0.25,0.28,0.21,0], gest: [4000,4200,3800,0]     },
  { id: 'blh',  name: 'BLH',              prom: [50,55,48,0],       pct: [75,80,68,0],   rec: [0.03,0.03,0.02,0], gest: [500,520,480,0]        },
]

export const TOTALS_TREND = {
  prom: [14127,14868,12671,0],
  pct:  [90,91,81,0],
  rec:  [3.99,4.10,3.66,0],
  gest: [174105,177307,182126,0],
}

export const TREND_MONTHS = ['Marzo', 'Abril', 'Mayo', 'Jun (curso)']

export const TREND_NOTES = {
  prom: 'Promesas: indicador principal de productividad. Caída sostenida desde mayo — requiere acción correctiva por cartera.',
  pct:  '% cumplimiento: 3 meses consecutivos a la baja. TIGO en estado crítico (46%).',
  rec:  'Recaudo en Balboas. Mayo cerró B/.440K por debajo de abril. Tendencia negativa.',
  gest: 'Gestiones: volumen de contactos sostenido. Base para mantener el flujo de promesas.',
}

// ─── Seguimiento — params por cartera ────────────────────────────────────────
export const SEG_PARAMS = {
  ba: {
    name: 'Banistmo Activa',
    tipo: 'tramos',
    desc: 'Registra ofrecimientos diarios por tramo de mora. Cada tramo refleja la antigüedad de la deuda del cliente.',
    campos: [
      { id: 'oferec',  label: 'Ofrecimientos totales', hint: 'Total de clientes a quienes se les ofreció gestión hoy', tag: null },
      { id: 't1_30',   label: 'Tramo 1–30 días',        hint: 'Clientes con 1 a 30 días de mora',   tag: 'Mora temprana' },
      { id: 't31_60',  label: 'Tramo 31–60 días',       hint: 'Clientes con 31 a 60 días de mora',  tag: 'Mora media'    },
      { id: 't61_90',  label: 'Tramo 61–90 días',       hint: 'Clientes con 61 a 90 días de mora',  tag: 'Mora avanzada' },
    ],
    meta: 500000, montoProm: 230, pctCumpl: 50,
    historial: [{ mes: 'Mayo 2026', meta: 500000, monto: 230, pct: 50 }, { mes: 'Abril 2026', meta: 480000, monto: 228, pct: 52 }],
  },
  br: {
    name: 'Banistmo Recovery',
    tipo: 'especial',
    desc: 'Tres herramientas distintas de recuperación con metas independientes.',
    segmentos: [
      { id: 'prospectos',   label: 'Prospectos',       hint: 'Herramienta de ofrecimiento para que el cliente acepte pagar', tag: 'Ofrecimiento',   meta: 41000,  monto: 84,   pct: 69 },
      { id: 'cancelaciones',label: 'Cancelaciones',    hint: 'Cancelaciones completas o con descuento de la deuda',          tag: 'Cancelación',    meta: 50000,  monto: 1492, pct: 68 },
      { id: 'enviados',     label: 'Enviados al banco', hint: 'Clientes en análisis activo dentro del banco',                tag: 'En análisis',    meta: 220000, monto: 5500, pct: 75 },
    ],
    historial: [{ mes: 'Mayo 2026', meta: 311000, monto: 'Multi', pct: 'Var' }],
  },
  sura: {
    name: 'SURA',
    tipo: 'asignacion',
    desc: 'Se registra la asignación de cartera diaria. Monto promedio bajo (B/.121) exige alto volumen de promesas.',
    campos: [{ id: 'asignacion', label: 'Asignación de cartera', hint: 'Monto total de cartera asignada para gestión hoy (B/.)', tag: 'Monto diario' }],
    meta: 750000, montoProm: 121, pctCumpl: 66,
    historial: [{ mes: 'Mayo 2026', meta: 750000, monto: 121, pct: 66 }],
  },
  tigo: {
    name: 'TIGO',
    tipo: 'ciclos',
    desc: 'Registra el % de cuentas recuperadas por ciclo de facturación. Cada ciclo tiene clientes con fecha de corte distinta.',
    ciclos: [
      { id: 'c1',    label: 'Ciclo 1',          hint: '% de cuentas recuperadas — corte 1',         monto: 43.81, meta: 280000, pct: 70 },
      { id: 'c15',   label: 'Ciclo 15',         hint: '% de cuentas recuperadas — corte 15',        monto: 43.81, meta: 280000, pct: 70 },
      { id: 'c21',   label: 'Ciclo 21',         hint: '% de cuentas recuperadas — corte 21',        monto: 43.81, meta: 280000, pct: 70 },
      { id: 'c6_1f', label: 'Ciclo 6 – 1ra fase', hint: '% de cuentas recuperadas, fase 1 del ciclo 6', monto: 52.83, meta: 25000, pct: 34 },
      { id: 'c6_2f', label: 'Ciclo 6 – 2da fase', hint: '% de cuentas recuperadas, fase 2 del ciclo 6', monto: 52.83, meta: 25000, pct: 34 },
    ],
    historial: [{ mes: 'Mayo 2026', meta: 305000, monto: 'Ciclos', pct: 'Var' }],
  },
  solve: {
    name: 'Solve',
    tipo: 'cancelaciones',
    desc: 'Solo cancelaciones — completas o con descuento. Monto promedio bajo (B/.81) requiere alto volumen.',
    campos: [{ id: 'cancelaciones', label: 'Cancelaciones del día', hint: 'Cancelaciones completas o con descuento procesadas hoy', tag: 'Cancelación' }],
    meta: 35000, montoProm: 81, pctCumpl: 44,
    historial: [{ mes: 'Mayo 2026', meta: 35000, monto: 81, pct: 44 }],
  },
  ca: {
    name: 'CA Activa (Caja de Ahorros)',
    tipo: 'tramos',
    desc: 'Solo tramos de mora avanzada — 31 días en adelante.',
    campos: [
      { id: 't31_60', label: 'Tramo 31–60 días', hint: 'Clientes con 31 a 60 días de mora', tag: 'Mora media'    },
      { id: 't61_90', label: 'Tramo 61–90 días', hint: 'Clientes con 61 a 90 días de mora', tag: 'Mora avanzada' },
    ],
    meta: 125000, montoProm: 215, pctCumpl: 72,
    historial: [{ mes: 'Mayo 2026', meta: 125000, monto: 215, pct: 72 }],
  },
  blh: {
    name: 'Banco La Hipotecaria',
    tipo: 'etapas',
    desc: 'Cartera hipotecaria de ticket muy alto (B/.31,477 promedio). Clasificada por etapa de recuperación.',
    campos: [
      { id: 'mejora',     label: 'Mejora',     hint: 'Clientes que mostraron mejora en su situación de pago',        tag: 'Etapa 1' },
      { id: 'contencion', label: 'Contención', hint: 'Clientes en proceso de contención para evitar profundización', tag: 'Etapa 2' },
      { id: 'castigo',    label: 'Castigo',    hint: 'Clientes en etapa de castigo — mora severa',                   tag: 'Etapa 3' },
    ],
    meta: 505000, montoProm: 31477, pctCumpl: 39,
    historial: [{ mes: 'Mayo 2026', meta: 505000, monto: 31477, pct: 39 }],
  },
  bac: {
    name: 'BAC',
    tipo: 'especial',
    desc: 'Dos tipos de gestión con metas independientes: cancelaciones y renovaciones.',
    segmentos: [
      { id: 'cancelaciones', label: 'Cancelaciones', hint: 'Deudas canceladas totalmente hoy',                  tag: 'Cancelación',    meta: 10000, monto: 58,  pct: 39 },
      { id: 'renovaciones',  label: 'Renovaciones',  hint: 'Reestructuraciones de crédito aprobadas y procesadas', tag: 'Reestructuración', meta: 50000, monto: 992, pct: 46 },
    ],
    historial: [{ mes: 'Mayo 2026', meta: 60000, monto: 'Multi', pct: 'Var' }],
  },
  rodelag: {
    name: 'Rodelag',
    tipo: 'descuentos',
    desc: 'Dos herramientas de negociación. Monto promedio bajo (B/.62) — requiere alto volumen.',
    campos: [
      { id: 'descuentos', label: 'Descuentos negociados', hint: 'Quitas parciales acordadas hoy',        tag: 'Quita parcial' },
      { id: 'arreglos',   label: 'Arreglos de pago',      hint: 'Planes de pago acordados con el cliente', tag: 'Plan de pago'  },
    ],
    meta: 4000, montoProm: 62, pctCumpl: 76,
    historial: [{ mes: 'Mayo 2026', meta: 4000, monto: 62, pct: 76 }],
  },
  global: {
    name: 'Global Bank',
    tipo: 'especial',
    desc: 'Múltiples segmentos con metas independientes.',
    segmentos: [
      { id: 'cancelaciones', label: 'Cancelaciones', hint: 'Cancelaciones totales procesadas hoy',            tag: 'Cancelación',    meta: 20000, monto: 3000, pct: 50 },
      { id: 'renovaciones',  label: 'Renovaciones',  hint: 'Renovaciones o reestructuraciones procesadas', tag: 'Reestructuración', meta: 6000,  monto: 2000, pct: 50 },
    ],
    historial: [{ mes: 'Mayo 2026', meta: 26000, monto: 'Multi', pct: 'Var' }],
  },
  delta: {
    name: 'Banco Delta',
    tipo: 'cancelaciones',
    desc: 'Solo cancelaciones. Monto promedio B/.250.',
    campos: [{ id: 'cancelaciones', label: 'Cancelaciones del día', hint: 'Total de cancelaciones procesadas hoy', tag: 'Cancelación' }],
    meta: 10000, montoProm: 250, pctCumpl: 40,
    historial: [{ mes: 'Mayo 2026', meta: 10000, monto: 250, pct: 40 }],
  },
  simpol: {
    name: 'Simpol',
    tipo: 'tramos',
    desc: 'Estructura de tramos similar a Banistmo Activa.',
    campos: [
      { id: 't1_30',  label: 'Tramo 1–30 días',  hint: 'Clientes 1–30 días de mora',  tag: 'Mora temprana' },
      { id: 't31_60', label: 'Tramo 31–60 días', hint: 'Clientes 31–60 días de mora', tag: 'Mora media'    },
      { id: 't61_90', label: 'Tramo 61–90 días', hint: 'Clientes 61–90 días de mora', tag: 'Mora avanzada' },
    ],
    meta: 12000, montoProm: 330, pctCumpl: 50,
    historial: [{ mes: 'Mayo 2026', meta: 12000, monto: 330, pct: 50 }],
  },
}

// ─── Sábados libres ───────────────────────────────────────────────────────────
export const SABADOS = [
  {
    date: '7 de junio 2026',
    alert: null,
    asesores: [
      { nombre: 'Susana Lore',       cartera: 'Banistmo Activa' },
      { nombre: 'Allison González',  cartera: 'Banistmo Activa' },
      { nombre: 'Najhaira Alvarado', cartera: 'SURA'            },
      { nombre: 'Yinorís Ramos',     cartera: 'TIGO'            },
    ],
  },
  {
    date: '14 de junio 2026',
    alert: '6 ausencias — cobertura reducida en SURA y TIGO.',
    asesores: [
      { nombre: 'Madelín Oses',    cartera: 'Ban. Recovery' },
      { nombre: 'Zury Andrade',    cartera: 'SURA'          },
      { nombre: 'Rodolfo Miller',  cartera: 'SURA'          },
      { nombre: 'Yanitza Torres',  cartera: 'TIGO'          },
      { nombre: 'Darlenys Correa', cartera: 'Solve'         },
      { nombre: 'Marisely Soto',   cartera: 'KrediYa'       },
    ],
  },
  {
    date: '21 de junio 2026',
    alert: '8 ausencias — sábado más crítico del mes.',
    asesores: [
      { nombre: 'Katherine Quintero',  cartera: 'Banistmo Activa' },
      { nombre: 'Angie Herrera',        cartera: 'Ban. Recovery'   },
      { nombre: 'Yulyssa López',        cartera: 'Ban. Recovery'   },
      { nombre: 'Kristel Pérez',        cartera: 'SURA'            },
      { nombre: 'Aileen Espinosa',      cartera: 'SURA'            },
      { nombre: 'Jhon Puga',            cartera: 'TIGO'            },
      { nombre: 'Yunаyckа Reyes',       cartera: 'Solve'           },
      { nombre: 'Erishka Samaniego',    cartera: 'Rodelag'         },
    ],
  },
  {
    date: '28 de junio 2026',
    alert: null,
    asesores: [
      { nombre: 'Natalie Herrera',    cartera: 'Banistmo Activa' },
      { nombre: 'Yanaris Caballero',  cartera: 'Banistmo Activa' },
      { nombre: 'Pebbles Valderrama', cartera: 'SURA'            },
      { nombre: 'Melany Pérez',       cartera: 'SURA'            },
      { nombre: 'Danna Rivas',        cartera: 'Solve'           },
      { nombre: 'Elvira Duncan',      cartera: 'BLH'             },
    ],
  },
]

// ─── Teletrabajo ──────────────────────────────────────────────────────────────
export const TELETRABAJO = {
  semana: '2–6 jun 2026',
  remoto: ['Liliana M.', 'Miriam I.', 'Yeznyha E.', 'César S.', 'Ever V.', 'Angel N.'],
  sitio:  ['Andrew R.', 'Oris R.', 'Kevin L.', 'Victor I.', 'Nicolle C.', 'Luis G.', 'Nicolle U.'],
}

// ─── Pendientes de actualización ─────────────────────────────────────────────
export const PENDIENTES = [
  { id: 'sura',  cartera: 'SURA',              supervisor: 'Samuel De La Oliva', ultimaCarga: 'ayer 03 jun',  diasSin: 1, urgencia: 'alta'   },
  { id: 'tigo',  cartera: 'TIGO',              supervisor: 'Yinorís Ramos',      ultimaCarga: '02 jun',       diasSin: 2, urgencia: 'alta'   },
  { id: 'ba',    cartera: 'Banistmo Activa',   supervisor: 'Kevin Martínez',     ultimaCarga: 'ayer 03 jun',  diasSin: 1, urgencia: 'media'  },
  { id: 'kred',  cartera: 'KrediYa',           supervisor: 'Marisely Soto',      ultimaCarga: 'ayer 03 jun',  diasSin: 1, urgencia: 'media'  },
  { id: 'br',    cartera: 'Banistmo Recovery', supervisor: 'Angie Herrera',      ultimaCarga: 'ayer 03 jun',  diasSin: 1, urgencia: 'media'  },
  { id: 'bac',   cartera: 'BAC',               supervisor: 'Tayreth Oyaga',      ultimaCarga: 'ayer 03 jun',  diasSin: 1, urgencia: 'normal' },
  { id: 'ca',    cartera: 'CA Activa',         supervisor: 'Rodolfo Miller',     ultimaCarga: 'ayer 03 jun',  diasSin: 1, urgencia: 'normal' },
  { id: 'blh',   cartera: 'BLH',              supervisor: 'Elvira Duncan',      ultimaCarga: 'ayer 03 jun',  diasSin: 1, urgencia: 'normal' },
]

export const AL_DIA = [
  { cartera: 'Banistmo Activa (Prod.)', supervisor: 'Katherine Quintero', hora: 'hoy 08:21' },
  { cartera: 'Solve',                   supervisor: 'Darlenys Correa',    hora: 'hoy 07:55' },
  { cartera: 'Rodelag',                 supervisor: 'Erishka Samaniego',  hora: 'hoy 08:03' },
  { cartera: 'Delta',                   supervisor: 'Yaremi Núñez',       hora: 'hoy 07:48' },
  { cartera: 'Global Bank',             supervisor: 'Luis García',        hora: 'hoy 08:30' },
]
