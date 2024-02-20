'use client'
import React from 'react'
import Input from '@/components/Input'
import { useRouter } from 'next/navigation'
import { LoginUserProps } from '@/types'
import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks'
import { RegularForm } from '@/components/forms/layout.form'
import { SubmitHandler } from 'react-hook-form'
import Button from '@/components/Button'

function LoginForm() {
  const { toast } = useToast()

  const router = useRouter()

  const onSubmit: SubmitHandler<LoginUserProps> = async (data) => {
    signIn('legajo', {
      ...data,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.ok) {
          router.push('/')
        } else {
          toast({ title: `${callback?.error}`, variant: 'destructive' })
        }
      })
      .catch((error) => {
        toast({ title: error.message, variant: 'destructive' })
      })
  }
  return (
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
      <div className="flex justify-between gap-10 my-3">
        <Button className="mx-auto" type="submit">
          Iniciar sesion
        </Button>
      </div>
    </RegularForm>
  )
}

export default LoginForm
