'use client'

import React from 'react'
import CustomInput from '@/components/Input'
import { RegularForm } from '@/components/forms/layout.form'
import { setter } from '@/services'
import Button from '@/components/Button'
import { rinde_examen } from '@prisma/client'
import { FieldValues } from 'react-hook-form'
import { toast } from '@/hooks'
import { useRouter } from 'next/navigation'

function NuevoAlumno({ id }: { id: number }) {
  const router = useRouter()
  const onSubmit = async (body: FieldValues) => {
    try {
      await setter<rinde_examen>({
        route: 'admision/examen/' + id,
        body,
      })

      router.refresh()
    } catch (error: any) {
      toast({ title: error.response.data || 'Error', variant: 'destructive' })
    }
  }

  return (
    <RegularForm className="w-5/6 mt-2" onSubmit={onSubmit}>
      <CustomInput name="dni" label="DNI" />
      <CustomInput name="nombre" label="Nombre" />
      <CustomInput name="apellido" label="Apellido" />
      <Button type="submit">Crear alumno</Button>
    </RegularForm>
  )
}

export default NuevoAlumno
