'use client'
import React from 'react'
// import { Button, Input, MainLogoOVT } from '@/components'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { MainLogoOVT } from '@/components/Logos'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { LoginUserProps } from '@/types'
import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks'
import Link from 'next/link'

function page() {
  const methods = useForm<LoginUserProps>({
    mode: 'all',
  })

  const { handleSubmit } = methods
  const { toast } = useToast()

  const router = useRouter()

  const onSubmit = async (data: LoginUserProps) => {
    signIn('credentials', {
      ...data,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.ok) {
          router.replace('/')
        } else {
          toast({ title: callback?.error, variant: 'destructive' })
        }
      })
      .catch((error) => {
        toast({ title: error.message, variant: 'destructive' })
      })
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-16 dark:bg-black flex flex-col items-center">
      <MainLogoOVT />
      <FormProvider {...methods}>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Legajo"
            name="legajo"
            rules={{ required: 'Campo requerido' }}
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            rules={{ required: 'Campo requerido' }}
          />
          <Button type="submit">Iniciar sesion</Button>
        </form>
      </FormProvider>
      <p>
        Todavia no te registraste? <Link href="/register">Registrate aca</Link>{' '}
      </p>
    </div>
  )
}

export default page
