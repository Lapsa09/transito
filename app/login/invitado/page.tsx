import Button from '@/components/Button'
import CustomInput from '@/components/Input'
import { RegularForm } from '@/components/forms/layout.form'
import React from 'react'
import { FieldValues } from 'react-hook-form'

function page() {
  const handleSubmit = (data: FieldValues) => {
    console.log(data)
  }
  return (
    <div>
      <h1>Invitado</h1>
      <RegularForm onSubmit={handleSubmit}>
        <CustomInput name="dni" label="DNI" />
        <CustomInput name="clave" label="Clave" type="password" />
        <Button type="submit">Ingresar</Button>
      </RegularForm>
    </div>
  )
}

export default page
