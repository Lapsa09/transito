import React from 'react'

import ReparacionesForm from '@/components/forms/logistica/reparaciones.form'
import { getSelects } from '@/services'

async function page({ params }: { params: { patente: string } }) {
  const { patente } = params
  const { repuestos } = await getSelects()
  return <ReparacionesForm patente={patente} selects={{ repuestos }} />
}

export default page
