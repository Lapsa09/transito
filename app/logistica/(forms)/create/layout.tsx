'use client'
import React from 'react'
import FormLayout from '@/components/forms/layout.form'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

function layout({ children }: React.PropsWithChildren) {
  const methods = useForm()
  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    console.log(body)
  }
  return (
    <FormLayout
      steps={2}
      onSubmit={onSubmit}
      methods={methods}
      stepTitles={['1', '2']}
    >
      {children}
    </FormLayout>
  )
}

export default layout
