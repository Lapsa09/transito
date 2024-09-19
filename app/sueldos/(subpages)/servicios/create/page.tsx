import React from 'react'
import LayoutServiciosForm from '@/components/forms/servicios.form'
import { getPrecios, getSelects } from '@/services'

export const dynamic = 'force-dynamic'

async function page() {
  const { clientes, operarios } = await getSelects()
  const precios = await getPrecios()
  return (
    <LayoutServiciosForm selects={{ clientes, operarios }} precios={precios} />
  )
}

export default page
