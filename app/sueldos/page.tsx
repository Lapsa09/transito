import {
  ActualizarPreciosCard,
  ClientesLinkCard,
  LiquidacionesLinkCard,
  NewServicioLinkCard,
  OperariosLinkCard,
  ServiciosLinkCard,
} from '@/components/Card'
import React from 'react'

function page() {
  return (
    <div className="flex gap-5 justify-center flex-wrap w-8/12 mx-auto">
      <NewServicioLinkCard />
      <ClientesLinkCard />
      <ServiciosLinkCard />
      <OperariosLinkCard />
      <LiquidacionesLinkCard />
      <ActualizarPreciosCard />
    </div>
  )
}

export default page
