import React from 'react'

import ReparacionesForm from '@/components/forms/logistica/reparaciones.form'

function page({ params }: { params: { patente: string } }) {
  const { patente } = params
  return <ReparacionesForm patente={patente} />
}

export default page
