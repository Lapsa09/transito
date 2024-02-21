import PedidosForm from '@/components/forms/logistica/pedidos.form'
import { getSelects } from '@/services'
import React from 'react'

async function page() {
  const { proveedores, tipoRepuestos } = await getSelects()
  return <PedidosForm selects={{ proveedores, tipoRepuestos }} />
}

export default page
