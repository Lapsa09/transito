import {
  ClientesLinkCard,
  LiquidacionesLinkCard,
  NewServicioLinkCard,
  OperariosLinkCard,
  ServiciosLinkCard,
} from '@/components/Card'
import React from 'react'

function page() {
  return (
    <div className="flex gap-5 justify-center flex-wrap">
      <NewServicioLinkCard />
      <ClientesLinkCard />
      <ServiciosLinkCard />
      <OperariosLinkCard />
      <LiquidacionesLinkCard />
    </div>
  )
}

export default page
