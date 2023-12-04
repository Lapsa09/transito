import React from 'react'
import { CreateFormLayout } from '@/components/forms/layout.form'

function layout({ children }: React.PropsWithChildren) {
  return (
    <CreateFormLayout
      className="flex flex-col justify-center items-center px-6"
      stepTitles={['Operativo', 'Vehiculo']}
      section="operativos"
    >
      {children}
    </CreateFormLayout>
  )
}

export default layout
