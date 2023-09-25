'use client'
import React from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { MainLogoOVT } from '@/components/Logos'
import { useRouter } from 'next/navigation'
import { LoginUserProps } from '@/types'
import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks'
import Link from 'next/link'
import { RegularForm } from '@/components/forms/layout.form'
import { SubmitHandler } from 'react-hook-form'

function page() {
  const { toast } = useToast()

  const router = useRouter()

  const onSubmit: SubmitHandler<LoginUserProps> = async (data) => {
    signIn('credentials', {
      ...data,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.ok) {
          router.push('/')
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
      <RegularForm onSubmit={onSubmit}>
        <Input
          label="Legajo"
          name="legajo"
          rules={{ required: 'Campo requerido' }}
          placeholder="12345"
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          placeholder="********"
          rules={{ required: 'Campo requerido' }}
        />
        <Button type="submit">Iniciar sesion</Button>
      </RegularForm>
      <p>
        Todavia no te registraste? <Link href="/register">Registrate aca</Link>
      </p>
    </div>
  )
}

export default page
