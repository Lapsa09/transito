'use client'

import React from 'react'
import LayoutServiciosForm from '@/components/forms/servicios.form'
import FormLayout from '@/components/forms/layout.form'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ServiciosFormProps } from '@/types'
import { nuevoServicio } from '@/services'
import { toast } from '@/hooks'

function page() {
  const methods = useForm<ServiciosFormProps>()
  const { reset } = methods

  const onSubmit: SubmitHandler<ServiciosFormProps> = async (body) => {
    try {
      const req = await nuevoServicio({ body })
      toast({ title: req, variant: 'success' })
      reset()
    } catch (error: any) {
      toast({
        title: error.response.data || error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <FormLayout
      onSubmit={onSubmit}
      className="flex flex-col justify-center items-center px-6"
      methods={methods}
      steps={1}
      stepTitles={['Nuevo servicio']}
    >
      <LayoutServiciosForm />
    </FormLayout>
  )
}

export default page
