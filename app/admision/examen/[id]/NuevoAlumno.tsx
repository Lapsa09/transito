'use client'

import React from 'react'
import CustomInput from '@/components/Input'
import { setter } from '@/services'
import Button from '@/components/Button'
import { rinde_examen } from '@prisma/client'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { toast } from '@/hooks'
import { useRouter } from 'next/navigation'

function NuevoAlumno({ id }: { id: number }) {
  const router = useRouter()
  const methods = useForm()
  const onSubmit = async (body: FieldValues) =>
    await setter<rinde_examen>({
      route: 'admision/examen/' + id,
      body,
    })
      .then(() => {
        methods.reset()
      })
      .catch((error: any) => {
        toast({ title: error.response.data || 'Error', variant: 'destructive' })
      })
      .finally(() => router.refresh())

  return (
    <FormProvider {...methods}>
      <form className="w-5/6 mt-2" onSubmit={methods.handleSubmit(onSubmit)}>
        <CustomInput name="dni" label="DNI" />
        <CustomInput name="nombre" label="Nombre" />
        <CustomInput name="apellido" label="Apellido" />
        <Button type="submit">Crear alumno</Button>
      </form>
    </FormProvider>
  )
}

export default NuevoAlumno
