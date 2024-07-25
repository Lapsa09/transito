'use client'

import { RegularForm } from '@/components/forms/layout.form'
import React from 'react'
import Input from '@/components/Input'
import { RegisterUserProps } from '@/types'
import { SubmitHandler } from 'react-hook-form'
import { signUp } from '@/services'
import { useToast } from '@/hooks'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

function RegisterForm() {
  const { toast } = useToast()
  const router = useRouter()

  const onSubmit: SubmitHandler<RegisterUserProps> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({ title: 'Las contraseñas no coinciden', variant: 'destructive' })
    } else {
      await signUp(data)
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
    <RegularForm
      className="flex w-full flex-col items-center"
      onSubmit={onSubmit}
    >
      <div className="flex w-10/12 justify-between flex-wrap">
        <Input
          label="Legajo"
          placeholder="12345"
          type="number"
          name="legajo"
          rules={{ required: 'Campo requerido' }}
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          placeholder="******"
          rules={{ required: 'Campo requerido' }}
        />
        <Input
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          placeholder="******"
          rules={{ required: 'Campo requerido' }}
        />
      </div>

      <Button className="w-10/12" type="submit">
        Registrarse
      </Button>
    </RegularForm>
  )
}

export default RegisterForm
