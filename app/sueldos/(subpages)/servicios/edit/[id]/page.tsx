import React from 'react'
import { EditFormLayout } from '@/components/forms/layout.form'
import LayoutServiciosForm from '@/components/forms/servicios.form'

function page() {
  return (
    <EditFormLayout
      className="flex flex-col justify-center px-6"
      section="sueldos"
      stepTitles={['Editar servicio']}
    >
      <LayoutServiciosForm />
    </EditFormLayout>
  )
}

export default page
