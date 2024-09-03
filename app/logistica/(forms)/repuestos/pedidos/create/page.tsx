import PedidosForm from '@/components/forms/logistica/pedidos.form'
import { getLogisticaSelects } from '@/services'
import React from 'react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function page() {
  const { proveedores, tipoRepuestos } = await getLogisticaSelects()
  return <PedidosForm selects={{ proveedores, tipoRepuestos }} />
}

export default page
