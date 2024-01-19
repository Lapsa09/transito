import React from 'react'
import { EditFormLayout } from '@/components/forms/layout.form'
import LayoutServiciosForm from '@/components/forms/servicios.form'
import { getPrecios, getSelects } from '@/services'

async function page() {
  const { clientes, operarios } = await getSelects()
  const precios = await getPrecios()
  return (
    <EditFormLayout
      className="flex flex-col justify-center px-6"
      section="sueldos"
      stepTitles={['Editar servicio']}
    >
      <LayoutServiciosForm
        selects={{ clientes, operarios }}
        precios={precios}
      />
    </EditFormLayout>
  )
}

export default page
