import PedidosForm from '@/components/forms/logistica/pedidos.form'
import { getSelects } from '@/services'
import React from 'react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function page() {
  const { proveedores, tipoRepuestos } = await getSelects()
  return <PedidosForm selects={{ proveedores, tipoRepuestos }} />
}

export default page
