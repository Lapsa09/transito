import React from 'react'
import {
  MovilesCard,
  PedidosCard,
  ProveedoresCard,
  ReparacionesCard,
  RepuestosCard,
} from '@/components/Card'

function page() {
  return (
    <div className="flex gap-5 mx-10">
      <MovilesCard />
      <PedidosCard />
      <ReparacionesCard />
      <ProveedoresCard />
      <RepuestosCard />
    </div>
  )
}

export default page
