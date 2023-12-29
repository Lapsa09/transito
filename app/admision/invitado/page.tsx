import Button from '@/components/Button'
import CustomInput from '@/components/Input'
import { RegularForm } from '@/components/forms/layout.form'
import { setter } from '@/services'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FieldValues } from 'react-hook-form'

function page() {
  const [clave, setClave] = useState('')
  const router = useRouter()
  const onSubmit = async (body: FieldValues) => {
    const clave = await setter<string>({ route: 'admision/invitado', body })
    setClave(clave)
  }
  return (
    <div>
      <h1>Invitado</h1>
      <Button onClick={router.refresh}>Reiniciar</Button>
      <RegularForm onSubmit={onSubmit}>
        <CustomInput name="dni" label="DNI" />
        <CustomInput name="nombre" label="Nombre" />
        <CustomInput name="apellido" label="Apellido" />
        <CustomInput name="email" label="Email" />
        <Button type="submit">Enviar</Button>
      </RegularForm>
      {clave && <span>Tu clave es {clave}</span>}
    </div>
  )
}

export default page
