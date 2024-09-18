import React from 'react'
import LayoutServiciosForm from '@/components/forms/servicios.form'
import { getPrecios, getSelects, getter } from '@/services'
import { ServiciosFormProps } from '@/types'

async function page({ params }: { params: { id: string } }) {
  const { clientes, operarios } = await getSelects()
  const precios = await getPrecios()

  const data = await getter<ServiciosFormProps>({
    route: 'sueldos/servicios/edit/' + params.id,
  })
  return (
    <LayoutServiciosForm
      editableServicio={data}
      id={params.id}
      selects={{ clientes, operarios }}
      precios={precios}
    />
  )
}

export default page
