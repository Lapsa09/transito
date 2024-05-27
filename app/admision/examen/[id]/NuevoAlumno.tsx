'use client'

import React from 'react'
import CustomInput from '@/components/Input'
import { setter } from '@/services'
import Button from '@/components/Button'
import { rinde_examen } from '@prisma/client'
import { FieldValues } from 'react-hook-form'
import { toast } from '@/hooks'
import { useRouter } from 'next/navigation'
import { RegularForm } from '@/components/forms/layout.form'

function NuevoAlumno({ id }: { id: number }) {
  const router = useRouter()
  const onSubmit = async (body: FieldValues) =>
    await setter<rinde_examen>({
      route: 'admision/examen/' + id,
      body,
    })
      .catch((error: any) => {
        toast({ title: error.response.data || 'Error', variant: 'destructive' })
      })
      .finally(() => router.refresh())

  return (
    <RegularForm resetOnSubmit onSubmit={onSubmit}>
      <CustomInput name="dni" label="DNI" />
      <CustomInput name="nombre" label="Nombre" />
      <CustomInput name="apellido" label="Apellido" />
      <Button type="submit">Crear alumno</Button>
    </RegularForm>
  )
}

export default NuevoAlumno
