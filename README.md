# Panel Spear — Spear Contact

Sistema de gestión operativa de cobranzas para Spear Contact, Panamá.

## Stack
- React 18 + Vite
- Chart.js 4
- Tabler Icons
- DM Sans / DM Mono (Google Fonts)

## Estructura del proyecto

```
panel-spear/
├── public/
│   └── logo-spear.png          # Logo oficial Spear Contact
├── src/
│   ├── components/
│   │   ├── Topbar.jsx          # Header con logo y lanza SVG
│   │   ├── Navigation.jsx      # Tabs de navegación con badge de pendientes
│   │   ├── KPIRow.jsx          # Tarjetas KPI del dashboard
│   │   ├── TrendChart.jsx      # Gráfico de tendencias + tabla comparativa
│   │   ├── PendingPanel.jsx    # Panel de carteras sin actualizar
│   │   └── LogisticsPanel.jsx  # Sábados libres + teletrabajo
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── ProductividadPage.jsx
│   │   ├── SeguimientoPage.jsx
│   │   ├── LogisticaPage.jsx
│   │   └── ParametrosPage.jsx
│   ├── data/
│   │   └── mockData.js         # Datos de prueba (reemplazar con API)
│   ├── utils/
│   │   └── helpers.js          # Fórmulas de calculadora y formateo
│   ├── styles/
│   │   └── globals.css         # Design tokens y estilos globales
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## Instalación local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Deploy en Vercel

1. Sube este repositorio a GitHub
2. En Vercel: **New Project → Import from GitHub**
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

## Próximos pasos (backend)

- Reemplazar `src/data/mockData.js` con llamadas a API real
- Agregar autenticación (supervisores vs gerente vs admin)
- Conectar Blob storage / Supabase para persistencia de registros diarios
- Implementar notificaciones en tiempo real (WebSockets o polling)

## Fórmula de calculadora de promesas

```
Promesas necesarias = Meta (B/.) ÷ Monto promedio ÷ % cumplimiento
MTD esperado = Promesas necesarias × (día actual ÷ días hábiles del mes)
```

---

*Spear Contact · Panamá · 2026*
