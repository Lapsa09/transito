import React from 'react'
import { EditFormLayout } from '@/components/forms/layout.form'

function layout({ children }: React.PropsWithChildren) {
  return (
    <EditFormLayout
      className="flex flex-col justify-center items-center px-6"
      section="operativos"
      stepTitles={['Operativo', 'Vehiculo']}
    >
      {children}
    </EditFormLayout>
  )
}

export default layout
