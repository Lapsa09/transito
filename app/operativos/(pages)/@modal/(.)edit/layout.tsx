'use client'
import Modal from '@/components/Modal'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useStepForm } from '@/hooks'
import { getter, updater } from '@/services'
import useSWR, { mutate } from 'swr'
import { useRouter, useSelectedLayoutSegments } from 'next/navigation'
import { useToast } from '@/hooks'
import {
  EditInputProps,
  LocalOperativo,
  Registro,
  RioFormProps,
  Roles,
} from '@/types'
import FormLayout from '@/components/forms/layout.form'
import { useLocalStorage } from 'usehooks-ts'
import { useSession } from 'next-auth/react'
import Loader from '@/components/Loader'

function layout({ children }: React.PropsWithChildren) {
  const { data } = useSession({ required: true })
  const router = useRouter()
  const [layoutSegment, id] = useSelectedLayoutSegments()

  const { isLoading } = useSWR(
    data?.user?.role === Roles.ADMIN
      ? { route: `/operativos/${layoutSegment}/${id}` }
      : null,
    getter,
    {
      onSuccess: async (data) => {
        reset(data)
        setActiveStep(1)
      },
      onError: () => {
        router.replace('/operativos/' + layoutSegment)
      },
    },
  )

  const [, setOperativo] = useLocalStorage<LocalOperativo>(layoutSegment, {
    expiresAt: 0,
  })
  const methods = useForm<EditInputProps | RioFormProps>({
    mode: 'all',
    defaultValues: {
      lpcarga: data?.user?.legajo,
    },
  })
  const { setActiveStep } = useStepForm()
  const { reset } = methods
  const { toast } = useToast()

  const onSubmit: SubmitHandler<EditInputProps | RioFormProps> = async (
    body,
  ) => {
    try {
      await mutate<Registro[]>(
        layoutSegment,
        async (data) => {
          const registro = await updater<Registro>({
            route: `/operativos/${layoutSegment}/${id}`,
            body,
          })
          return data?.map((item) =>
            item.id === registro.id ? registro : item,
          )
        },
        {
          revalidate: false,
        },
      )
      toast({ title: 'Operativo creado con exito', variant: 'success' })
      router.back()
    } catch (error: any) {
      toast({
        title: error.response.data || error.message,
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

  if (isLoading) return <Loader />
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
