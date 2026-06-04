// api/data.js — Vercel Edge Function
// Handles all read/write operations to Vercel Blob storage
// Endpoint: /api/data?key=<key>  GET=read, POST=write

export const config = { runtime: 'edge' };

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_BASE  = 'https://blob.vercel-storage.com';

// Valid keys — prevents writing to arbitrary paths
const VALID_KEYS = [
  /^productividad\/[a-z_]+\/\d{4}-\d{2}-\d{2}$/,   // productividad/banistmo_activa/2026-06-04
  /^seguimiento\/[a-z_]+\/\d{4}-\d{2}-\d{2}$/,      // seguimiento/tigo/2026-06-04
  /^logistica\/sabados\/\d{4}-\d{2}$/,               // logistica/sabados/2026-06
  /^logistica\/teletrabajo\/\d{4}-W\d{2}$/,          // logistica/teletrabajo/2026-W23
  /^config\/params$/,                                 // config/params
];

function isValidKey(key) {
  return VALID_KEYS.some(re => re.test(key));
}

export default async function handler(req) {
  const url    = new URL(req.url);
  const key    = url.searchParams.get('key');
  const origin = req.headers.get('origin') || '*';

  const cors = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing key' }), { status: 400, headers: cors });
  }

  // ── GET — read a blob ──────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const blobUrl = `${BLOB_BASE}/panel-spear/${key}.json`;
      const res = await fetch(blobUrl, {
        headers: { Authorization: `Bearer ${BLOB_TOKEN}` },
      });
      if (res.status === 404 || res.status === 403) {
        return new Response(JSON.stringify(null), { status: 200, headers: cors });
      }
      if (!res.ok) throw new Error(`Blob fetch failed: ${res.status}`);
      const data = await res.json();
      return new Response(JSON.stringify(data), { status: 200, headers: cors });
    } catch (e) {
      // Return null on any read error — caller handles missing data gracefully
      return new Response(JSON.stringify(null), { status: 200, headers: cors });
    }
  }

  // ── POST — write a blob ────────────────────────────────────────────────────
  if (req.method === 'POST') {
    if (!isValidKey(key)) {
      return new Response(JSON.stringify({ error: 'Invalid key' }), { status: 400, headers: cors });
    }
    try {
      const body    = await req.json();
      const payload = JSON.stringify({ ...body, _savedAt: new Date().toISOString() });
      const pathname = `panel-spear/${key}.json`;

      // Use Vercel Blob REST API directly
      const putRes = await fetch(`${BLOB_BASE}/${pathname}`, {
        method: 'PUT',
        headers: {
          Authorization:   `Bearer ${BLOB_TOKEN}`,
          'Content-Type':  'application/json',
          'x-api-version': '7',
          'x-allow-overwrite': '1',
        },
        body: payload,
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        throw new Error(`Blob write failed: ${putRes.status} — ${errText}`);
      }

      const result = await putRes.json();
      return new Response(JSON.stringify({ ok: true, url: result.url }), { status: 200, headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: cors });
}
