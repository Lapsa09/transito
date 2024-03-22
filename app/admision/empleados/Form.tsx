'use client'

import CustomInput from '@/components/Input'
import Autocomplete from '@/components/Autocomplete'
import { RegularForm } from '@/components/forms/layout.form'
import { permisos } from '@prisma/client'
import React from 'react'
import { SubmitHandler } from 'react-hook-form'
import Button from '@/components/Button'
import { setter } from '@/services'
import { toast } from '@/hooks'

function Form({ roles }: { roles: permisos[] }) {
  const onSubmit: SubmitHandler<{ legajo: string; rol: permisos }> = async (
    data,
  ) =>
    setter({ route: '/admision/empleados', body: data })
      .then(() => {
        toast({ title: 'Empleado creado', variant: 'success' })
      })
      .catch(() => {
        toast({ title: 'Error al crear empleado', variant: 'destructive' })
      })

  return (
    <RegularForm className="w-1/2 mx-auto" onSubmit={onSubmit}>
      <CustomInput
        rules={{ required: true }}
        label="Legajo"
        name="legajo"
        type="number"
      />
      <Autocomplete
        label="Rol"
        name="rol"
        rules={{ required: true }}
        options={roles}
        inputId="id"
        inputLabel="permiso"
      />
      <Button type="submit">Enviar</Button>
    </RegularForm>
  )
}

export default Form
