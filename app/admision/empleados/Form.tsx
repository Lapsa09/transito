'use client'

import Autocomplete from '@/components/Autocomplete'
import { Button } from '@/components/ui/button'
import { RegularForm } from '@/components/forms/layout.form'
import CustomInput from '@/components/Input'
import CustomSelect from '@/components/Select'
import { toast } from '@/hooks'
import { setter } from '@/services'
import React from 'react'
import { SubmitHandler } from 'react-hook-form'
import { Permiso, Turno } from '@/drizzle/schema/schema'

function Form({
  roles,
  turnos,
}: {
  roles: Permiso[]
  turnos: { id: Turno; label: string }[]
}) {
  const onSubmit: SubmitHandler<{ legajo: string; rol: Permiso }> = async (
    data,
  ) =>
    await setter({ route: '/admision/empleados', body: data })
      .then(() => {
        toast({ title: 'Empleado creado', variant: 'success' })
      })
      .catch(() => {
        toast({ title: 'Error al crear empleado', variant: 'destructive' })
      })

  return (
    <RegularForm className="w-1/2 mx-auto" onSubmit={onSubmit} resetOnSubmit>
      <CustomInput
        rules={{ required: true }}
        label="Legajo"
        name="legajo"
        type="number"
        placeholder="12345"
      />
      <CustomInput
        label="Nombre"
        placeholder="John"
        name="nombre"
        className="basis-5/12"
        rules={{ required: 'Campo requerido' }}
      />
      <CustomInput
        label="Apellido"
        placeholder="Doe"
        name="apellido"
        className="basis-5/12"
        rules={{ required: 'Campo requerido' }}
      />
      <CustomSelect label="Turno" name="turno" options={turnos} />
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
