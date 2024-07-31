'use client'

import useSWR from 'swr'
import React from 'react'
import Input from '@/components/Input'
import { Button } from '@/components/ui/button'
import { SubmitHandler } from 'react-hook-form'
import { getPrecios, updatePrecios } from '@/services'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks'
import { RegularForm } from '@/components/forms/layout.form'

function page() {
  const router = useRouter()
  const { isLoading, mutate, data } = useSWR('precios', getPrecios)

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
    <RegularForm
      className="w-7/12 mx-auto flex flex-col"
      onSubmit={onSubmit}
      data={data}
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
    </RegularForm>
  )
}

export default page
