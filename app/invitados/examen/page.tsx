'use client'

import Button from '@/components/Button'
import CustomInput from '@/components/Input'
import { RegularForm } from '@/components/forms/layout.form'
import { toast } from '@/hooks'
import { useInvitado } from '@/hooks/useInvitado'
import { setter } from '@/services'
import { rinde_examen } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FieldValues } from 'react-hook-form'

function page() {
  const router = useRouter()
  const { setUsuario } = useInvitado()
  const handleSubmit = async (body: FieldValues) => {
    const examen = await setter<rinde_examen | null>({ route: 'examen', body })

    if (!examen)
      toast({
        title: 'Datos ingresados incorrectos o clave ya utilizada',
        variant: 'destructive',
      })
    else {
      setUsuario(examen)
      router.push(`/invitados/examen/${examen.id_examen}`)
    }
  }
  return (
    <div>
      <h1>Examen de manejo</h1>
      <RegularForm onSubmit={handleSubmit}>
        <CustomInput name="dni" label="DNI" />
        <CustomInput name="clave" label="Clave" type="password" />
        <Button type="submit">Ingresar</Button>
      </RegularForm>
    </div>
  )
}

export default page
