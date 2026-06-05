// api/data.js — Vercel Edge Function — Panel Spear v4
export const config = { runtime: 'edge' };

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BASE  = 'https://blob.vercel-storage.com';
const NS    = 'panel-spear';
const CORS  = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};
const json = (d, s=200) => new Response(JSON.stringify(d), {status:s, headers:CORS});

async function blobGet(key) {
  try {
    const r = await fetch(`${BASE}/${NS}/${key}.json`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}

async function blobPut(key, data) {
  const r = await fetch(`${BASE}/${NS}/${key}.json`, {
    method: 'PUT',
    headers: {
      Authorization:       `Bearer ${TOKEN}`,
      'Content-Type':      'application/json',
      'x-api-version':     '7',
      'x-allow-overwrite': '1',
    },
    body: JSON.stringify({ ...data, _updatedAt: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`Blob PUT ${r.status}: ${await r.text()}`);
  return r.json();
}

async function saveHistory(key, oldData, newData, editor) {
  try {
    const hKey = `history/${key.replace(/\//g,'_')}`;
    const h = await blobGet(hKey) || { edits: [] };
    h.edits.unshift({ ts: new Date().toISOString(), editor: editor||'?', before: oldData, after: newData });
    h.edits = h.edits.slice(0, 30);
    await blobPut(hKey, h);
  } catch { /* best-effort */ }
}

const VALID = [
  /^datos_maestros$/,
  /^productividad\/[a-z_]+\/\d{4}-\d{2}-\d{2}$/,
  /^seguimiento\/[a-z_]+\/\d{4}-\d{2}-\d{2}$/,
  /^logistica\/sabados\/\d{4}-W\d{2}$/,
  /^logistica\/teletrabajo\/\d{4}-W\d{2}$/,
  /^config\/params$/,
  /^history\/.+$/,
];

// ── MASTER DATA (from Excel Resultados_VS_Meta.xlsx) ──────────────────────────
const MASTER = {
  tendencia: {
    meses: ['Marzo','Abril','Mayo','Jun (curso)'],
    carteras: [
      {id:'ba',n:'Banistmo Activa',prom:[4277,4813,3863,null],pct:[92,96,81,null],rec:[1.24,1.27,1.02,null],gest:[93605,95787,105246,null]},
      {id:'br',n:'Ban. Recovery',  prom:[1200,1200,1200,null],pct:[88,85,79,null], rec:[0.31,0.31,0.31,null],gest:[31000,31000,31000,null]},
      {id:'su',n:'SURA',           prom:[3877,3410,2722,null],pct:[95,98,81,null], rec:[1.64,1.03,1.08,null],gest:[97474,77574,64573,null]},
      {id:'ti',n:'TIGO',           prom:[2800,2600,2100,null],pct:[90,87,46,null], rec:[0.72,0.70,0.48,null],gest:[18000,17500,16000,null]},
      {id:'kr',n:'KrediYa',        prom:[2641,1200,1200,null],pct:[85,90,84,null], rec:[0.14,0.12,0.10,null],gest:[71667,45000,31000,null]},
      {id:'so',n:'Solve',          prom:[2398,800,900,null],  pct:[88,91,150,null],rec:[0.05,0.04,0.03,null],gest:[38725,37236,31000,null]},
      {id:'ca',n:'CA Activa',      prom:[600,650,580,null],   pct:[82,88,77,null], rec:[0.25,0.28,0.21,null],gest:[4000,4200,3800,null]},
      {id:'bl',n:'BLH',            prom:[50,55,48,null],      pct:[75,80,68,null], rec:[0.03,0.03,0.02,null],gest:[500,520,480,null]},
    ],
    totales: {prom:[17843,15028,12613,null],pct:[90,91,81,null],rec:[4.38,3.78,3.25,null],gest:[362971,308817,282099,null]},
  },
  kpi_mayo: { ia_real:13695, ia_meta:16897, ia_pct:81, rec_real:3663920, rec_meta:4425000, rec_pct:83 },
  metas_junio: {
    'Banistmo Activa':      {rec_op:500000,  rec_mas:750000,  ia:4500, monto_prom:230,   pct_cumpl:50},
    'Banistmo Recovery':    {rec_op:330000,  rec_mas:0,       ia:4500, monto_prom:null,  pct_cumpl:null},
    'SURA':                 {rec_op:750000,  rec_mas:800000,  ia:2105, monto_prom:121,   pct_cumpl:66},
    'TIGO':                 {rec_op:280000,  rec_mas:420000,  ia:2281, monto_prom:44,    pct_cumpl:70},
    'KrediYa':              {rec_op:25000,   rec_mas:75000,   ia:3500, monto_prom:85,    pct_cumpl:44},
    'Solve':                {rec_op:35000,   rec_mas:5000,    ia:2000, monto_prom:81,    pct_cumpl:44},
    'CA Activa':            {rec_op:125000,  rec_mas:175000,  ia:57,   monto_prom:215,   pct_cumpl:72},
    'La Hipotecaria':       {rec_op:35000,   rec_mas:0,       ia:281,  monto_prom:31477, pct_cumpl:39},
    'Rodelag':              {rec_op:10000,   rec_mas:190000,  ia:456,  monto_prom:62,    pct_cumpl:76},
    'Banco Delta':          {rec_op:10000,   rec_mas:0,       ia:250,  monto_prom:250,   pct_cumpl:40},
    'BAC':                  {rec_op:60000,   rec_mas:0,       ia:0,    monto_prom:525,   pct_cumpl:43},
    'Global Bank':          {rec_op:30000,   rec_mas:0,       ia:0,    monto_prom:2500,  pct_cumpl:50},
  },
  params: {
    ba:      {n:'Banistmo Activa',   sup:'Luis Dolande',    dh:26,meta:500000,  monto:230,   pct:50},
    br:      {n:'Banistmo Recovery', sup:'Andrew González', dh:26,segs:[{id:'p',l:'Prospectos',tag:'Ofrecimiento',meta:41000,monto:84,pct:69},{id:'c',l:'Cancelaciones',tag:'Cancelación',meta:50000,monto:1492,pct:68},{id:'e',l:'Enviados',tag:'En análisis',meta:220000,monto:5500,pct:75}]},
    sura:    {n:'SURA',              sup:'Kevin Herrera',   dh:26,meta:750000,  monto:121,   pct:66},
    tigo:    {n:'TIGO',              sup:'Nicole Núñez',    dh:26,segs:[{id:'cp',l:'Ciclo principal',tag:'Ciclos',meta:280000,monto:44,pct:70},{id:'c6',l:'Ciclo 6',tag:'2 fases',meta:25000,monto:53,pct:34}]},
    solve:   {n:'Solve',             sup:'Víctor Delgado',  dh:26,meta:35000,   monto:81,    pct:44},
    ca:      {n:'CA Activa',         sup:'Miriam Núñez',    dh:26,meta:125000,  monto:215,   pct:72},
    blh:     {n:'La Hipotecaria',    sup:'Miriam Núñez',    dh:26,meta:505000,  monto:31477, pct:39},
    bac:     {n:'BAC',               sup:'Yeznhya de León', dh:26,segs:[{id:'c',l:'Cancelaciones',tag:'Cancelación',meta:10000,monto:58,pct:39},{id:'r',l:'Renovaciones',tag:'Reestructuración',meta:50000,monto:992,pct:46}]},
    delta:   {n:'Banco Delta',       sup:'Yeznhya de León', dh:26,meta:10000,   monto:250,   pct:40},
    rodelag: {n:'Rodelag',           sup:'Oris Jaramillo',  dh:26,meta:4000,    monto:62,    pct:76},
    krediya: {n:'KrediYa',           sup:'Nicole Núñez',    dh:26,meta:100000,  monto:85,    pct:44},
    global:  {n:'Global Bank',       sup:'Víctor Delgado',  dh:26,segs:[{id:'c',l:'Cancelaciones',tag:'Cancelación',meta:20000,monto:3000,pct:50},{id:'r',l:'Renovaciones',tag:'Reestructuración',meta:6000,monto:2000,pct:50}]},
  },
  // ── SÁBADOS LIBRES — datos completos del Excel ───────────────────────────
  sabados: {
    '2026-W23': {date:'7 jun 2026',   alert:'7 ausencias este sábado.', asesores:[
      {nombre:'Susana Lore',         cartera:'Banistmo Activa'},
      {nombre:'Allison González',    cartera:'Banistmo Activa'},
      {nombre:'Yunaycka Reyes',      cartera:'Solve'},
      {nombre:'Yinoris Ramos',       cartera:'TIGO'},
      {nombre:'Najhaira Alvarado',   cartera:'SURA'},
      {nombre:'Samuel De La Oliva',  cartera:'SURA'},
      {nombre:'Checyllia Alexander', cartera:'Banistmo Recovery'},
    ]},
    '2026-W24': {date:'14 jun 2026',  alert:'8 ausencias — cobertura reducida en SURA, Banistmo y TIGO.', asesores:[
      {nombre:'Ericka Salinas',      cartera:'Banistmo Activa'},
      {nombre:'Brizeida Bordones',   cartera:'Banistmo Activa'},
      {nombre:'Yanitza Torres',      cartera:'TIGO'},
      {nombre:'Zury Andrade',        cartera:'SURA'},
      {nombre:'Rodolfo Miller',      cartera:'SURA'},
      {nombre:'Melany Pérez',        cartera:'SURA'},
      {nombre:'Madelín Oses',        cartera:'Banistmo Recovery'},
      {nombre:'Danna Rivas',         cartera:'Solve'},
    ]},
    '2026-W25': {date:'21 jun 2026',  alert:'9 ausencias — sábado más crítico del mes.', asesores:[
      {nombre:'Katherine Quintero',  cartera:'Banistmo Activa'},
      {nombre:'Darlenys Correa',     cartera:'Solve'},
      {nombre:'Elvira Duncan',       cartera:'BLH'},
      {nombre:'Jhonn Puga',          cartera:'TIGO'},
      {nombre:'Kristel Pérez',       cartera:'SURA'},
      {nombre:'Aileen Espinosa',     cartera:'SURA'},
      {nombre:'Yulissa López',       cartera:'Banistmo Recovery'},
      {nombre:'Angie Herrera',       cartera:'Banistmo Recovery'},
      {nombre:'Mariselys Soto',      cartera:'KrediYa'},
    ]},
    '2026-W26': {date:'28 jun 2026',  alert:null, asesores:[
      {nombre:'Yanaris Caballero',   cartera:'Banistmo Activa'},
      {nombre:'Natalie Herrera',     cartera:'Banistmo Activa'},
      {nombre:'Pebbles Valderrama',  cartera:'SURA'},
      {nombre:'Erishka Samaniego',   cartera:'Rodelag'},
      {nombre:'Tayreth Oyaga',       cartera:'BAC Recovery'},
    ]},
  },
  // ── TELETRABAJO — 12 personas por semana (datos completos del Excel) ─────
  teletrabajo: {
    '2026-W23': {label:'2–6 jun 2026',
      remoto:[
        {nombre:'Liliana M.',  rol:'Coordinadora'},
        {nombre:'Miriam N.',   rol:'Supervisora'},
        {nombre:'Angel G.',    rol:'Especialista'},
        {nombre:'Nicole N.',   rol:'Supervisora'},
        {nombre:'César Z.',    rol:'Gerente'},
        {nombre:'Ever V.',     rol:'Apoyo'},
      ],
      sitio:[
        {nombre:'Andrew G.',   rol:'Supervisor'},
        {nombre:'Oris J.',     rol:'Supervisora'},
        {nombre:'Kevin H.',    rol:'Supervisor'},
        {nombre:'Luis D.',     rol:'Supervisor'},
        {nombre:'Víctor D.',   rol:'Supervisor'},
        {nombre:'Yeznhya L.',  rol:'Supervisora'},
      ]},
    '2026-W24': {label:'9–13 jun 2026',
      remoto:[
        {nombre:'Luis D.',     rol:'Supervisor'},
        {nombre:'Andrew G.',   rol:'Supervisor'},
        {nombre:'Oris J.',     rol:'Supervisora'},
        {nombre:'Kevin H.',    rol:'Supervisor'},
        {nombre:'Yeznhya L.',  rol:'Supervisora'},
      ],
      sitio:[
        {nombre:'Miriam N.',   rol:'Supervisora'},
        {nombre:'Liliana M.',  rol:'Coordinadora'},
        {nombre:'Angel G.',    rol:'Especialista'},
        {nombre:'Víctor D.',   rol:'Supervisor'},
        {nombre:'Nicole N.',   rol:'Supervisora'},
        {nombre:'César Z.',    rol:'Gerente'},
        {nombre:'Ever V.',     rol:'Apoyo'},
      ]},
    '2026-W25': {label:'16–20 jun 2026',
      remoto:[
        {nombre:'Liliana M.',  rol:'Coordinadora'},
        {nombre:'Miriam N.',   rol:'Supervisora'},
        {nombre:'Yeznhya L.',  rol:'Supervisora'},
        {nombre:'César Z.',    rol:'Gerente'},
        {nombre:'Ever V.',     rol:'Apoyo'},
      ],
      sitio:[
        {nombre:'Andrew G.',   rol:'Supervisor'},
        {nombre:'Oris J.',     rol:'Supervisora'},
        {nombre:'Kevin H.',    rol:'Supervisor'},
        {nombre:'Luis D.',     rol:'Supervisor'},
        {nombre:'Angel G.',    rol:'Especialista'},
        {nombre:'Víctor D.',   rol:'Supervisor'},
        {nombre:'Nicole N.',   rol:'Supervisora'},
      ]},
    '2026-W26': {label:'23–27 jun 2026',
      remoto:[
        {nombre:'Luis D.',     rol:'Supervisor'},
        {nombre:'Andrew G.',   rol:'Supervisor'},
        {nombre:'Oris J.',     rol:'Supervisora'},
        {nombre:'Nicole N.',   rol:'Supervisora'},
        {nombre:'Angel G.',    rol:'Especialista'},
        {nombre:'Kevin H.',    rol:'Supervisor'},
      ],
      sitio:[
        {nombre:'Miriam N.',   rol:'Supervisora'},
        {nombre:'Liliana M.',  rol:'Coordinadora'},
        {nombre:'Víctor D.',   rol:'Supervisor'},
        {nombre:'Yeznhya L.',  rol:'Supervisora'},
        {nombre:'César Z.',    rol:'Gerente'},
        {nombre:'Ever V.',     rol:'Apoyo'},
      ]},
  },
};

// ── Handler ────────────────────────────────────────────────────────────────────
export default async function handler(req) {
  const url    = new URL(req.url);
  const key    = url.searchParams.get('key');
  const action = url.searchParams.get('action');
  const editor = url.searchParams.get('editor') || 'usuario';

  if (req.method === 'OPTIONS') return new Response(null, {status:204, headers:CORS});

  // SEED — writes all master data to Blob
  if (req.method === 'GET' && key === 'seed') {
    try {
      await blobPut('datos_maestros', MASTER);
      await blobPut('config/params', {params: MASTER.params});
      return json({ok:true, message:'Datos maestros sembrados en Blob.', keys:['datos_maestros','config/params']});
    } catch(e) {
      return json({error:e.message}, 500);
    }
  }

  // HISTORY
  if (action === 'history' && key) {
    const h = await blobGet(`history/${key.replace(/\//g,'_')}`);
    return json(h || {edits:[]});
  }

  if (!key) return json({error:'Missing key'}, 400);

  // GET
  if (req.method === 'GET') {
    if (key === 'datos_maestros') {
      const blob = await blobGet('datos_maestros');
      return json(blob || MASTER);
    }
    return json(await blobGet(key));
  }

  // POST
  if (req.method === 'POST') {
    if (!VALID.some(r => r.test(key))) return json({error:`Invalid key: ${key}`}, 400);
    try {
      const body = await req.json();
      const existing = await blobGet(key);
      if (existing !== null) await saveHistory(key, existing, body, editor);
      await blobPut(key, body);
      return json({ok:true, key, savedAt: new Date().toISOString()});
    } catch(e) {
      return json({error:e.message}, 500);
    }
  }

  return json({error:'Method not allowed'}, 405);
}
