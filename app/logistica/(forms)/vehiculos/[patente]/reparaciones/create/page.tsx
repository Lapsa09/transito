import React from 'react'

import ReparacionesForm from '@/components/forms/logistica/reparaciones.form'
import { getLogisticaSelects } from '@/services'

async function page({ params }: { params: { patente: string } }) {
  const { patente } = params
  const { repuestos } = await getLogisticaSelects()
  return <ReparacionesForm patente={patente} selects={{ repuestos }} />
}

export default page
