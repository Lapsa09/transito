'use client'
import React, { useEffect } from 'react'
import FormLayout from '@/components/forms/layout.form'
import { FormInputProps, LocalOperativo, Registro, RioFormProps } from '@/types'
import { mutate } from 'swr'
import { useStepForm, useToast } from '@/hooks'
import { useSelectedLayoutSegment } from 'next/navigation'
import { setter } from '@/services'
import { useLocalStorage } from 'usehooks-ts'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import Modal from '@/components/Modal'

function layout({ children }: { children: React.ReactNode }) {
  const { data } = useSession({ required: true })
  const methods = useForm<FormInputProps | RioFormProps>({
    mode: 'all',
    resetOptions: { keepDefaultValues: true },
    defaultValues: {
      lpcarga: data?.user?.legajo,
    },
  })
  const { reset, setFocus } = methods
  const layoutSegment = useSelectedLayoutSegment() as
    | 'autos'
    | 'motos'
    | 'camiones'
    | 'rio'
  const { toast } = useToast()
  const [operativo, setOperativo] = useLocalStorage<LocalOperativo>(
    layoutSegment,
    {
      expiresAt: 0,
    },
  )
  const { setActiveStep } = useStepForm()
  const onSubmit: SubmitHandler<FormInputProps | RioFormProps> = async (
    body,
  ) => {
    try {
      await mutate<Registro[]>(
        layoutSegment,
        async (data) => {
          const post = await setter<Registro>({
            route: `/operativos/${layoutSegment}`,
            body,
          })
          if (!data) return [post]
          return [post, ...data]
        },
        {
          revalidate: false,
        },
      )
      toast({ title: 'Operativo creado con exito', variant: 'success' })
      const { expiresAt, ...rest } = operativo
      if (layoutSegment === 'camiones') {
        reset({ ...rest, hora: '' })
      } else {
        reset(rest)
      }
      setFocus('dominio')
    } catch (error: any) {
      toast({
        title: error.response?.data || error.message,
        variant: 'destructive',
      })
    }
  }

  const nuevoOperativo = () => {
    setOperativo({
      expiresAt: 0,
    })
    reset()
    setActiveStep(0)
  }

  useEffect(() => {
    if (operativo.expiresAt < Date.now()) {
      nuevoOperativo()
    } else {
      const { expiresAt, ...rest } = operativo
      reset(rest)
      setActiveStep(1)
    }
  }, [])
  return (
    <Modal>
      <FormLayout
        onSubmit={onSubmit}
        className="flex flex-col justify-center items-center px-6"
        nuevoOperativo={nuevoOperativo}
        methods={methods}
        steps={2}
        stepTitles={['Operativo', 'Vehiculo']}
      >
        {children}
      </FormLayout>
    </Modal>
  )
}

export default layout
