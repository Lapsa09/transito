import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const Autos = lazy(() => import('./autos'))
const Motos = lazy(() => import('./motos'))
const Camiones = lazy(() => import('./camiones'))

function Operativos() {
  return (
    <Routes>
      <Route path="/autos" element={<Autos />} />
      <Route path="/motos" element={<Motos />} />
      <Route path="/camiones" element={<Camiones />} />
    </Routes>
  )
}

export default Operativos
