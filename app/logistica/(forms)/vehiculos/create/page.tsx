import VehiculosForm from '@/components/forms/logistica/vehiculos.form'
import { getLogisticaSelects } from '@/services'
import React from 'react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function page() {
  const { usos, tipoMoviles, dependencias } = await getLogisticaSelects()
  return <VehiculosForm selects={{ usos, tipoMoviles, dependencias }} />
}

export default page
