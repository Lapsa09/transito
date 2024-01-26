'use client'

import Button from '@/components/Button'
import CustomInput from '@/components/Input'
import { RegularForm } from '@/components/forms/layout.form'
import { toast } from '@/hooks'
import { setter } from '@/services'
import { examen, rinde_examen } from '@prisma/client'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FieldValues } from 'react-hook-form'

function Login() {
  const router = useRouter()
  const handleSubmit = async (body: FieldValues) => {
    const examen = await setter<string | null>({
      route: 'examen',
      body,
    })

    if (!examen)
      toast({
        title: 'Datos ingresados incorrectos o clave ya utilizada',
        variant: 'destructive',
      })
    else {
      const usuario = jwtDecode<rinde_examen & { examen: examen }>(examen)

      router.push(`/invitados/examen/${usuario.examen.clave}?u=${examen}`)
    }
  }
  return (
    <RegularForm className="md:w-1/3 md:mx-auto px-5" onSubmit={handleSubmit}>
      <CustomInput name="dni" label="DNI" />
      <CustomInput name="clave" label="Clave" type="password" />
      <Button className="w-full" type="submit">
        Ingresar
      </Button>
    </RegularForm>
  )
}

export default Login
