import React from 'react'
import LayoutServiciosForm from '@/components/forms/servicios.form'
import { CreateFormLayout } from '@/components/forms/layout.form'

function page() {
  return (
    <CreateFormLayout
      className="flex flex-col justify-center px-6"
      stepTitles={['Nuevo servicio']}
      section="sueldos"
    >
      <LayoutServiciosForm />
    </CreateFormLayout>
  )
}

export default page
