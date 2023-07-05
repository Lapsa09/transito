'use client'

import React from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { MainLogoOVT } from '@/components/Logos'
import { FormProvider, useForm } from 'react-hook-form'
import { signUp } from '@/services'
import { useToast } from '@/hooks'
import { useRouter } from 'next/navigation'
import { RegisterUserProps } from '@/types'
import Link from 'next/link'

function page() {
  const methods = useForm<RegisterUserProps>({
    mode: 'all',
  })

  const { toast } = useToast()

  const { handleSubmit } = methods

  const router = useRouter()

  const onSubmit = async (data: RegisterUserProps) => {
    if (data.password !== data.confirmPassword) {
      toast({ title: 'Las contraseñas no coinciden', variant: 'destructive' })
    } else {
      signUp(data)
        .then(() => {
          toast({ title: 'Usuario creado con exito', variant: 'success' })
          router.replace('/login')
        })
        .catch((error: any) => {
          toast({ title: error.response.data, variant: 'destructive' })
        })
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-16 dark:bg-black flex flex-col items-center">
      <MainLogoOVT />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Input
                label="Legajo"
                placeholder="12345"
                type="number"
                name="legajo"
                rules={{ required: 'Campo requerido' }}
              />
            </div>
            <div>
              <Input
                label="Nombre"
                placeholder="John"
                name="nombre"
                rules={{ required: 'Campo requerido' }}
              />
            </div>
            <div>
              <Input
                label="Apellido"
                placeholder="Doe"
                name="apellido"
                rules={{ required: 'Campo requerido' }}
              />
            </div>
            <div>
              <Input
                label="Telefono"
                placeholder="11-1234-5678"
                name="telefono"
                type="tel"
              />
            </div>
          </div>
          <Input
            label="Contraseña"
            name="password"
            type="password"
            rules={{ required: 'Campo requerido' }}
          />
          <Input
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            rules={{ required: 'Campo requerido' }}
          />
          <Button type="submit">Registrarse</Button>
        </form>
      </FormProvider>
      <p>
        Ya estas registrado? <Link href="/login">Inicia sesion</Link>
      </p>
    </div>
  )
}

export default page
