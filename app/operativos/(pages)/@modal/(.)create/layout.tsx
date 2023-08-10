import React from 'react'
import Modal from '@/components/Modal'
import FormLayout from '@/components/forms/layout.form'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <Modal>
      <FormLayout className="flex flex-col justify-center items-center">
        {children}
      </FormLayout>
    </Modal>
  )
}

export default layout
