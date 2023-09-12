'use client'

import React from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { getPrecios, updatePrecios } from '@/services'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks'

function page() {
  const methods = useForm<{
    precio_normal: number
    precio_pico: number
  }>()
  const router = useRouter()
  const { handleSubmit } = methods
  const { isLoading, mutate } = useSWR('precios', getPrecios, {
    onSuccess: (data) => {
      data.forEach((precio) => {
        methods.setValue(precio.id, precio.precio)
      })
    },
  })

  const onSubmit: SubmitHandler<{
    precio_normal: number
    precio_pico: number
  }> = async (body) => {
    try {
      await mutate(async () => {
        const res = await updatePrecios(body)

        return res
      })
      toast({ title: 'Precios actualizados', variant: 'success' })
      router.push('/sueldos')
    } catch (error: any) {
      console.log(error)
      toast({ title: error.response.data, variant: 'destructive' })
    }
  }

  if (isLoading) return null
  return (
    <FormProvider {...methods}>
      <form
        className="w-7/12 mx-auto flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="precio_normal"
          label="Precio Normal"
          type="number"
          startContent="$"
        />
        <Input
          name="precio_pico"
          label="Precio Pico"
          type="number"
          startContent="$"
        />
        <Button type="submit">Actualizar</Button>
      </form>
    </FormProvider>
  )
}

export default page
