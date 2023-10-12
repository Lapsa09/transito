'use client'

import React from 'react'
import Input from '@/components/Input'
import { MainLogoOVT } from '@/components/Logos'
import { signUp } from '@/services'
import { useToast } from '@/hooks'
import { useRouter } from 'next/navigation'
import { RegisterUserProps } from '@/types'
import Link from 'next/link'
import { RegularForm } from '@/components/forms/layout.form'
import { SubmitHandler } from 'react-hook-form'

function page() {
  const { toast } = useToast()

  const router = useRouter()

  const onSubmit: SubmitHandler<RegisterUserProps> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({ title: 'Las contraseñas no coinciden', variant: 'destructive' })
    } else {
      signUp(data)
        .then(() => {
          toast({ title: 'Usuario creado con exito', variant: 'success' })
          router.replace('/login')
        })
        .catch((error: any) => {
          toast({
            title: error.response?.data || error.message,
            variant: 'destructive',
          })
        })
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-16 dark:bg-black flex flex-col items-center">
      <MainLogoOVT />
      <RegularForm
        className="flex w-full flex-col items-center"
        onSubmit={onSubmit}
      >
        <div className="flex w-5/6 justify-between flex-wrap">
          <Input
            label="Legajo"
            placeholder="12345"
            type="number"
            name="legajo"
            className="w-full basis-5/12"
            rules={{ required: 'Campo requerido' }}
          />

          <Input
            label="Nombre"
            placeholder="John"
            name="nombre"
            className="w-full basis-5/12"
            rules={{ required: 'Campo requerido' }}
          />

          <Input
            label="Apellido"
            placeholder="Doe"
            name="apellido"
            className="w-full basis-5/12"
            rules={{ required: 'Campo requerido' }}
          />

          <Input
            label="Telefono"
            placeholder="11-1234-5678"
            name="telefono"
            className="w-full basis-5/12"
            type="tel"
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            className="w-full basis-5/12"
            placeholder="******"
            rules={{ required: 'Campo requerido' }}
          />
          <Input
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            className="w-full basis-5/12"
            placeholder="******"
            rules={{ required: 'Campo requerido' }}
          />
        </div>
      </RegularForm>
      <p className="mt-2">
        Ya estas registrado? <Link href="/login">Inicia sesion</Link>
      </p>
    </div>
  )
}

export default page
