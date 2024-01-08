'use client'

import React from 'react'
import CustomInput from '@/components/Input'
import { RegularForm } from '@/components/forms/layout.form'
import { setter } from '@/services'
import Button from '@/components/Button'
import { rinde_examen } from '@prisma/client'
import { FieldValues } from 'react-hook-form'
import CustomSelect from '@/components/Select'

const tipo_examen = [
  { id: 1, label: 'AUTOS' },
  { id: 2, label: 'MOTOVEHICULO Y PARTICULAR' },
  { id: 3, label: 'PROFESIONAL C1, C2, C3, D2, D3, E1, E2' },
  { id: 4, label: 'PROFESIONAL D1, TAXI - REMIS, D4 EMERGENCIAS' },
]

function NuevoAlumno({ id }: { id: number }) {
  const onSubmit = async (body: FieldValues) => {
    await setter<rinde_examen>({
      route: 'admision/examen/' + id,
      body,
    })
  }

  return (
    <RegularForm onSubmit={onSubmit}>
      <CustomInput name="nombre" label="Nombre" />
      <CustomInput name="apellido" label="Apellido" />
      <CustomInput name="email" label="Email" />
      <CustomInput name="dni" label="DNI" />
      <CustomSelect
        options={tipo_examen}
        name="tipo_examen"
        label="Tipo de examen"
      />
      <Button type="submit">Crear alumno</Button>
    </RegularForm>
  )
}

export default NuevoAlumno
