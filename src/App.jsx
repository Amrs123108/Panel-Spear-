import React, { useState } from 'react'
import Topbar       from './components/Topbar.jsx'
import Navigation   from './components/Navigation.jsx'
import DashboardPage    from './pages/DashboardPage.jsx'
import ProductividadPage from './pages/ProductividadPage.jsx'
import SeguimientoPage  from './pages/SeguimientoPage.jsx'
import LogisticaPage    from './pages/LogisticaPage.jsx'
import ParametrosPage   from './pages/ParametrosPage.jsx'
import PendingPanel     from './components/PendingPanel.jsx'

const PAGES = {
  dashboard:     DashboardPage,
  productividad: ProductividadPage,
  seguimiento:   SeguimientoPage,
  logistica:     LogisticaPage,
  parametros:    ParametrosPage,
  pendientes:    () => <div><PendingPanel /></div>,
}

export default function App() {
  const [activeTab,     setActiveTab]     = useState('dashboard')
  const [pendingCount,  setPendingCount]  = useState(8)

  const PageComponent = PAGES[activeTab] || DashboardPage

  return (
    <div className="page-layout">
      <Topbar
        user={{ name: 'Angel G.', role: 'Gerente', initials: 'AG' }}
        pendingCount={pendingCount}
      />
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingCount}
      />
      <main className="page-body">
        <PageComponent onPendingCountChange={setPendingCount} />
      </main>
    </div>
  )
}
