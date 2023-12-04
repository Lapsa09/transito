import Modal from '@/components/Modal'
import React from 'react'
import { EditFormLayout } from '@/components/forms/layout.form'

function layout({ children }: React.PropsWithChildren) {
  return (
    <Modal>
      <EditFormLayout
        className="flex flex-col justify-center items-center px-6"
        section="sueldos"
        stepTitles={['Operativo', 'Vehiculo']}
      >
        {children}
      </EditFormLayout>
    </Modal>
  )
}

export default layout
