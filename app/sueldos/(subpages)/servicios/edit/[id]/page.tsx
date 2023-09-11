'use client'
import { toast } from '@/hooks'
import { getServicioForEdit, updateServicio } from '@/services'
import { ServiciosFormProps } from '@/types'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { mutate } from 'swr'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import FormLayout from '@/components/forms/layout.form'
import LayoutServiciosForm from '@/components/forms/servicios.form'

function page({ params }: { params: { id: string } }) {
  const { id } = params
  const methods = useForm<ServiciosFormProps>()
  const { reset } = methods
  const router = useRouter()
  const {
    isLoading,
    data: servicio,
    mutate: refetch,
  } = useSWR('servicios/edit', async () => await getServicioForEdit(id))

  useEffect(() => {
    refetch().then(() => reset(servicio))
  }, [id])

  const onSubmit: SubmitHandler<ServiciosFormProps> = async (body) => {
    try {
      const res = await updateServicio({ body, id_servicio: id })
      mutate('servicios', res)
      router.back()
    } catch (error: any) {
      toast({
        title: error.response?.data ?? 'Server error',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) return null
  return (
    <FormLayout
      onSubmit={onSubmit}
      className="flex flex-col justify-center px-6"
      methods={methods}
      steps={1}
      stepTitles={['Editar servicio']}
    >
      <LayoutServiciosForm />
    </FormLayout>
  )
}

export default page
