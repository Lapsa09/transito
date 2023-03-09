import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const Waze = lazy(() => import('./waze'))
const WazeHistory = lazy(() => import('./History'))

function Main() {
  return (
    <Routes>
      <Route path="/" element={<Waze />} />
      <Route path="/historial" element={<WazeHistory />} />
    </Routes>
  )
}

export default Main
