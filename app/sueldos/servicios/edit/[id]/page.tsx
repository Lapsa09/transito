import { EditServicioForm } from '@/components/forms/servicios.form'
import { getServicioForEdit } from '@/services'
import React from 'react'

async function page({ params }: { params: { id: string } }) {
  const { id } = params
  const servicio = await getServicioForEdit(id)
  return (
    <div>
      <EditServicioForm servicio={servicio} id={id} />
    </div>
  )
}

export default page
