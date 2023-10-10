import KilometrajeForm from '@/components/forms/logistica/kilometraje.form'
import React from 'react'

function page({ params }: { params: { patente: string } }) {
  const { patente } = params
  return <KilometrajeForm patente={patente} />
}

export default page
