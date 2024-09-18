'use client'

import React from 'react'
import Input from '@/components/Input'
import { Button } from '@/components/ui/button'
import { SubmitHandler } from 'react-hook-form'
import { updatePrecios } from '@/services'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks'
import { RegularForm } from '@/components/forms/layout.form'

function Form({
  data,
}: {
  data: [
    { id: 'precio_normal'; precio: number },
    { id: 'precio_pico'; precio: number },
  ]
}) {
  const router = useRouter()

  const onSubmit: SubmitHandler<{
    precio_normal: number
    precio_pico: number
  }> = async (body) => {
    try {
      await updatePrecios(body)

      toast({ title: 'Precios actualizados', variant: 'success' })
      router.push('/sueldos')
    } catch (error: any) {
      console.log(error)
      toast({ title: error.response.data, variant: 'destructive' })
    }
  }

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

export default Form
