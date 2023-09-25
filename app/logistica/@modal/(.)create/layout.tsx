'use client'
import Modal from '@/components/Modal'
import React from 'react'
import FormLayout from '@/components/forms/layout.form'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

function layout({ children }: React.PropsWithChildren) {
  const methods = useForm()
  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    console.log(body)
  }
  return (
    <Modal>
      <FormLayout
        steps={2}
        onSubmit={onSubmit}
        methods={methods}
        stepTitles={['1', '2']}
      >
        {children}
      </FormLayout>
    </Modal>
  )
}

export default layout
