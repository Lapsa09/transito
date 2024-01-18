import React from 'react'
import LayoutServiciosForm from '@/components/forms/servicios.form'
import { CreateFormLayout } from '@/components/forms/layout.form'
import { getPrecios, getSelects } from '@/services'

async function page() {
  const { clientes, operarios } = await getSelects()
  const precios = await getPrecios()
  return (
    <CreateFormLayout
      className="flex flex-col justify-center px-6"
      stepTitles={['Nuevo servicio']}
      section="sueldos"
    >
      <LayoutServiciosForm
        selects={{ clientes, operarios }}
        precios={precios}
      />
    </CreateFormLayout>
  )
}

export default page
