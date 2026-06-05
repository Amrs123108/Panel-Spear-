// api/data.js — Vercel Edge Function — Panel Spear
// GET  /api/data?key=<key>          → read blob
// POST /api/data?key=<key>          → write blob  (body = JSON)
// GET  /api/data?key=seed           → seed master data into Blob (run once)
// GET  /api/data?action=history&key=<key>  → list edit history

export const config = { runtime: 'edge' };

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BASE  = 'https://blob.vercel-storage.com';
const NS    = 'panel-spear';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: CORS });

// ── Blob helpers ──────────────────────────────────────────────────────────────
async function blobGet(key) {
  try {
    const r = await fetch(`${BASE}/${NS}/${key}.json`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}

async function blobPut(key, data) {
  const payload = JSON.stringify({ ...data, _updatedAt: new Date().toISOString() });
  const r = await fetch(`${BASE}/${NS}/${key}.json`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'x-api-version': '7',
      'x-allow-overwrite': '1',
    },
    body: payload,
  });
  if (!r.ok) throw new Error(`Blob PUT failed: ${r.status} ${await r.text()}`);
  return r.json();
}

// Save edit history (last 20 edits per key)
async function saveHistory(key, oldData, newData, editedBy) {
  try {
    const histKey = `history/${key.replace(/\//g, '_')}`;
    const existing = await blobGet(histKey) || { edits: [] };
    existing.edits.unshift({
      timestamp: new Date().toISOString(),
      editedBy: editedBy || 'desconocido',
      before: oldData,
      after: newData,
    });
    existing.edits = existing.edits.slice(0, 20); // keep last 20
    await blobPut(histKey, existing);
  } catch { /* history is best-effort */ }
}

// ── Valid key patterns ────────────────────────────────────────────────────────
const VALID = [
  /^datos_maestros$/,
  /^productividad\/[a-z_]+\/\d{4}-\d{2}-\d{2}$/,
  /^seguimiento\/[a-z_]+\/\d{4}-\d{2}-\d{2}$/,
  /^logistica\/sabados\/\d{4}-W\d{2}$/,
  /^logistica\/teletrabajo\/\d{4}-W\d{2}$/,
  /^config\/params$/,
  /^history\/.+$/,
];
const ok = key => VALID.some(r => r.test(key));

// ── Master data — datos reales del Excel ──────────────────────────────────────
const MASTER_DATA = {
  // Tendencia mensual Mar/Abr/May (reales) | Jun = null (en curso)
  tendencia: {
    meses: ['Marzo', 'Abril', 'Mayo', 'Jun (curso)'],
    carteras: [
      { id:'ba', n:'Banistmo Activa',
        prom:[4277,4813,3863,null], pct:[92,96,81,null],
        rec:[1.24,1.27,1.02,null], gest:[93605,95787,105246,null] },
      { id:'br', n:'Ban. Recovery',
        prom:[1200,1200,1200,null], pct:[88,85,79,null],
        rec:[0.31,0.31,0.31,null], gest:[31000,31000,31000,null] },
      { id:'su', n:'SURA',
        prom:[3877,3410,2722,null], pct:[95,98,81,null],
        rec:[1.64,1.03,1.08,null], gest:[97474,77574,64573,null] },
      { id:'ti', n:'TIGO',
        prom:[2800,2600,2100,null], pct:[90,87,46,null],
        rec:[0.72,0.70,0.48,null], gest:[18000,17500,16000,null] },
      { id:'kr', n:'KrediYa',
        prom:[2641,1200,1200,null], pct:[85,90,84,null],
        rec:[0.14,0.12,0.10,null], gest:[71667,45000,31000,null] },
      { id:'so', n:'Solve',
        prom:[2398,800,900,null],   pct:[88,91,150,null],
        rec:[0.05,0.04,0.03,null], gest:[38725,37236,31000,null] },
      { id:'ca', n:'CA Activa',
        prom:[600,650,580,null],    pct:[82,88,77,null],
        rec:[0.25,0.28,0.21,null], gest:[4000,4200,3800,null] },
      { id:'bl', n:'BLH',
        prom:[50,55,48,null],       pct:[75,80,68,null],
        rec:[0.03,0.03,0.02,null], gest:[500,520,480,null] },
    ],
    totales: {
      prom:[17843,15028,12613,null], pct:[90,91,81,null],
      rec:[4.38,3.78,3.25,null],    gest:[362971,308817,282099,null],
    },
  },
  // KPIs de mayo 2026 (cierre real)
  kpi_mayo: {
    ia_real: 13695, ia_meta: 16897, ia_pct: 81,
    rec_real: 3663920, rec_meta: 4425000, rec_pct: 83,
  },
  // Metas junio 2026
  metas_junio: {
    'Banistmo Activa':   { rec_op: 500000, rec_mas: 750000,  ia: 4500 },
    'Banistmo Recovery': { rec_op: 330000, rec_mas: 0,       ia: 4500 },
    'SURA':              { rec_op: 750000, rec_mas: 800000,  ia: 2105 },
    'TIGO':              { rec_op: 280000, rec_mas: 420000,  ia: 2281 },
    'KrediYa':           { rec_op: 25000,  rec_mas: 75000,   ia: 3500 },
    'Solve':             { rec_op: 35000,  rec_mas: 5000,    ia: 2000 },
    'CA Activa':         { rec_op: 125000, rec_mas: 175000,  ia: 57   },
    'Banco La Hipotecaria': { rec_op: 35000, rec_mas: 0,     ia: 281  },
    'Rodelag':           { rec_op: 10000,  rec_mas: 190000,  ia: 456  },
    'Banco Delta':       { rec_op: 10000,  rec_mas: 0,       ia: 250  },
    'BAC':               { rec_op: 60000,  rec_mas: 0,       ia: 0    },
    'Global Bank':       { rec_op: 30000,  rec_mas: 0,       ia: 0    },
  },
  // Parámetros de calculadora
  params: {
    ba:      { n:'Banistmo Activa',    sup:'Luis Dolande',    dh:26, meta:500000,  monto:230,   pct:50 },
    br:      { n:'Banistmo Recovery',  sup:'Andrew González', dh:26,
               segs:[{id:'p',l:'Prospectos',tag:'Ofrecimiento',meta:41000,monto:84,pct:69},{id:'c',l:'Cancelaciones',tag:'Cancelación',meta:50000,monto:1492,pct:68},{id:'e',l:'Enviados',tag:'En análisis',meta:220000,monto:5500,pct:75}] },
    sura:    { n:'SURA',               sup:'Kevin Herrera',   dh:26, meta:750000,  monto:121,   pct:66 },
    tigo:    { n:'TIGO',               sup:'Nicole Núñez',    dh:26,
               segs:[{id:'cp',l:'Ciclo principal',tag:'Ciclos',meta:280000,monto:44,pct:70},{id:'c6',l:'Ciclo 6',tag:'2 fases',meta:25000,monto:53,pct:34}] },
    solve:   { n:'Solve',              sup:'Víctor Delgado',  dh:26, meta:35000,   monto:81,    pct:44 },
    ca:      { n:'CA Activa',          sup:'Miriam Núñez',    dh:26, meta:125000,  monto:215,   pct:72 },
    blh:     { n:'La Hipotecaria',     sup:'Miriam Núñez',    dh:26, meta:505000,  monto:31477, pct:39 },
    bac:     { n:'BAC',                sup:'Yeznhya de León', dh:26,
               segs:[{id:'c',l:'Cancelaciones',tag:'Cancelación',meta:10000,monto:58,pct:39},{id:'r',l:'Renovaciones',tag:'Reestructuración',meta:50000,monto:992,pct:46}] },
    delta:   { n:'Banco Delta',        sup:'Yeznhya de León', dh:26, meta:10000,   monto:250,   pct:40 },
    rodelag: { n:'Rodelag',            sup:'Oris Jaramillo',  dh:26, meta:4000,    monto:62,    pct:76 },
    krediya: { n:'KrediYa',            sup:'Nicole Núñez',    dh:26, meta:100000,  monto:85,    pct:44 },
    global:  { n:'Global Bank',        sup:'Víctor Delgado',  dh:26,
               segs:[{id:'c',l:'Cancelaciones',tag:'Cancelación',meta:20000,monto:3000,pct:50},{id:'r',l:'Renovaciones',tag:'Reestructuración',meta:6000,monto:2000,pct:50}] },
  },
  // Sábados libres — datos reales del Excel
  sabados: {
    '2026-W23': { date:'7 jun 2026',  alert:'7 ausencias este sábado.',
      asesores:[
        {nombre:'Susana Lore',        cartera:'Banistmo Activa'},
        {nombre:'Allison González',   cartera:'Banistmo Activa'},
        {nombre:'Yunaycka Reyes',     cartera:'Solve'},
        {nombre:'Yinoris Ramos',      cartera:'TIGO'},
        {nombre:'Najhaira Alvarado',  cartera:'SURA'},
        {nombre:'Samuel De La Oliva', cartera:'SURA'},
        {nombre:'Checyllia Alexander',cartera:'Banistmo Recovery'},
      ]},
    '2026-W24': { date:'14 jun 2026', alert:'8 ausencias — cobertura reducida.',
      asesores:[
        {nombre:'Ericka Salinas',    cartera:'Banistmo Activa'},
        {nombre:'Brizeida Bordones', cartera:'Banistmo Activa'},
        {nombre:'Yanitza Torres',    cartera:'TIGO'},
        {nombre:'Zury Andrade',      cartera:'SURA'},
        {nombre:'Rodolfo Miller',    cartera:'SURA'},
        {nombre:'Melany Pérez',      cartera:'SURA'},
        {nombre:'Madelín Oses',      cartera:'Banistmo Recovery'},
        {nombre:'Danna Rivas',       cartera:'Solve'},
      ]},
    '2026-W25': { date:'21 jun 2026', alert:'9 ausencias — sábado más crítico del mes.',
      asesores:[
        {nombre:'Katherine Quintero', cartera:'Banistmo Activa'},
        {nombre:'Darlenys Correa',    cartera:'Solve'},
        {nombre:'Elvira Duncan',      cartera:'BLH'},
        {nombre:'Jhonn Puga',         cartera:'TIGO'},
        {nombre:'Kristel Pérez',      cartera:'SURA'},
        {nombre:'Aileen Espinosa',    cartera:'SURA'},
        {nombre:'Yulissa López',      cartera:'Banistmo Recovery'},
        {nombre:'Angie Herrera',      cartera:'Banistmo Recovery'},
        {nombre:'Mariselys Soto',     cartera:'KrediYa'},
      ]},
    '2026-W26': { date:'28 jun 2026', alert:null,
      asesores:[
        {nombre:'Yanaris Caballero',  cartera:'Banistmo Activa'},
        {nombre:'Natalie Herrera',    cartera:'Banistmo Activa'},
        {nombre:'Pebbles Valderrama', cartera:'SURA'},
        {nombre:'Erishka Samaniego',  cartera:'Rodelag'},
        {nombre:'Tayreth Oyaga',      cartera:'BAC Recovery'},
      ]},
  },
  // Teletrabajo — datos reales del Excel
  teletrabajo: {
    '2026-W23': { label:'2–6 jun 2026',
      remoto:['Liliana M.','Miriam N.','Angel G.','Nicolle N.','César Z.','Ever V.'],
      sitio: ['Andrew G.','Oris J.','Kevin H.','Luis D.','Víctor D.','Yeznhya L.'] },
    '2026-W24': { label:'9–13 jun 2026',
      remoto:['Luis D.','Andrew G.','Oris J.','Kevin H.','Yeznhya L.'],
      sitio: ['Miriam N.','Liliana M.','Angel G.','Víctor D.','Nicolle N.','César Z.','Ever V.'] },
    '2026-W25': { label:'16–20 jun 2026',
      remoto:['Liliana M.','Miriam N.','Yeznhya L.','César Z.','Ever V.'],
      sitio: ['Andrew G.','Oris J.','Kevin H.','Luis D.','Angel G.','Víctor D.','Nicolle N.'] },
    '2026-W26': { label:'23–27 jun 2026',
      remoto:['Luis D.','Andrew G.','Oris J.','Nicolle N.','Angel G.','Kevin H.'],
      sitio: ['Miriam N.','Liliana M.','Víctor D.','Yeznhya L.','César Z.','Ever V.'] },
  },
};

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req) {
  const url    = new URL(req.url);
  const key    = url.searchParams.get('key');
  const action = url.searchParams.get('action');
  const editor = url.searchParams.get('editor') || 'usuario';

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  // ── Seed: write master data to Blob (GET /api/data?key=seed) ──────────────
  if (req.method === 'GET' && key === 'seed') {
    try {
      await blobPut('datos_maestros', MASTER_DATA);
      // Also seed config/params
      await blobPut('config/params', { params: MASTER_DATA.params });
      return json({ ok: true, message: 'Datos maestros guardados en Blob correctamente.' });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  // ── History: list edit history for a key ──────────────────────────────────
  if (action === 'history' && key) {
    const histKey = `history/${key.replace(/\//g, '_')}`;
    const hist = await blobGet(histKey);
    return json(hist || { edits: [] });
  }

  if (!key) return json({ error: 'Missing key' }, 400);

  // ── GET ───────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    // Special: datos_maestros — try Blob first, fall back to hardcoded
    if (key === 'datos_maestros') {
      const blob = await blobGet('datos_maestros');
      return json(blob || MASTER_DATA);
    }
    const data = await blobGet(key);
    return json(data); // null if not found
  }

  // ── POST ──────────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    if (!ok(key)) return json({ error: `Invalid key: ${key}` }, 400);
    try {
      const body = await req.json();
      // Save history before overwriting
      const existing = await blobGet(key);
      if (existing !== null) {
        await saveHistory(key, existing, body, editor);
      }
      await blobPut(key, body);
      return json({ ok: true, key, savedAt: new Date().toISOString() });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  return json({ error: 'Method not allowed' }, 405);
}
