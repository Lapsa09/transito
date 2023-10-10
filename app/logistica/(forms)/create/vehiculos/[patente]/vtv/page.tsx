import VTVForm from '@/components/forms/logistica/vtv.form'
import React from 'react'

function page({ params }: { params: { patente: string } }) {
  const { patente } = params
  return <VTVForm patente={patente} />
}

export default page
