'use client'

import React from 'react'
import CustomInput from '@/components/Input'
import { setter } from '@/services'
import { Button } from '@/components/ui/button'
import { rinde_examen } from '@prisma/client'
import { FieldValues } from 'react-hook-form'
import { toast } from '@/hooks'
import { useRouter } from 'next/navigation'
import { RegularForm } from '@/components/forms/layout.form'
import CustomSelect from '@/components/Select'

const tipos_examen = [
  { id: 1, label: 'AUTOS' },
  { id: 2, label: 'MOTOVEHICULO Y PARTICULAR' },
  { id: 3, label: 'PROFESIONAL C1, C2, C3, D2, D3, E1, E2' },
  { id: 4, label: 'PROFESIONAL D1, TAXI - REMIS, D4 EMERGENCIAS' },
]

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
      <CustomSelect
        label="Tipo de examen"
        options={tipos_examen}
        name="tipo_examen"
      />
      <Button type="submit">Crear alumno</Button>
    </RegularForm>
  )
}

export default NuevoAlumno
