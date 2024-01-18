import React from 'react'
import { CreateFormLayout } from '@/components/forms/layout.form'
import Modal from '@/components/Modal'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <Modal>
      <CreateFormLayout
        className="flex flex-col justify-center items-center px-6"
        stepTitles={['Operativo', 'Vehiculo']}
        section="operativos"
      >
        {children}
      </CreateFormLayout>
    </Modal>
  )
}

export default layout
