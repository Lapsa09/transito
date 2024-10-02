'use client'
import React from 'react'
import Input from '@/components/Input'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks'
import { RegularForm } from '@/components/forms/layout.form'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import { Button } from '@nextui-org/react'

function LoginForm() {
  const { toast } = useToast()

  const router = useRouter()

  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    const callback = await signIn('dni', { ...body, redirect: false })

    if (callback) {
      if (callback.ok) {
        router.push(`/invitados/examen`)
      } else {
        toast({ title: callback.error!, variant: 'destructive' })
      }
    } else {
      toast({ title: 'Server error', variant: 'destructive' })
    }
  }
  return (
    <RegularForm onSubmit={onSubmit}>
      {({ formState: { isSubmitting, isSubmitted } }) => (
        <>
          <Input
            label="DNI"
            name="dni"
            rules={{ required: 'Campo requerido' }}
            placeholder="12345"
          />
          <div className="flex justify-between gap-10 my-3">
            <Button
              color="primary"
              isLoading={isSubmitting || isSubmitted}
              className="mx-auto"
              type="submit"
            >
              Iniciar sesion
            </Button>
          </div>
        </>
      )}
    </RegularForm>
  )
}

export default LoginForm
