import VehiculosForm from '@/components/forms/logistica/vehiculos.form'
import { getSelects } from '@/services'
import React from 'react'

async function page() {
  const { usos, tipoMoviles, dependencias } = await getSelects()
  return <VehiculosForm selects={{ usos, tipoMoviles, dependencias }} />
}

export default page
