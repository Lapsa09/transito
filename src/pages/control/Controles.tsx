import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const ControlDiario = lazy(() => import('./diario'))
const ControlPaseo = lazy(() => import('./paseo'))

function Controles() {
  return (
    <Routes>
      <Route path="/diario" element={<ControlDiario />} />
      <Route path="/paseo" element={<ControlPaseo />} />
    </Routes>
  )
}

export default Controles
