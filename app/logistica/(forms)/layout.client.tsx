'use client'
import React from 'react'
import { RegularForm } from '@/components/forms/layout.form'
import { SubmitHandler } from 'react-hook-form'
import { type LogisticaForms } from '@/types/logistica'
import { useRouter, useSelectedLayoutSegments } from 'next/navigation'
import { setter } from '@/services'
import { useToast } from '@/hooks'
import { Button } from '@/components/ui/button'

function layout({ children }: React.PropsWithChildren) {
  const layoutSegment = useSelectedLayoutSegments()
  const { toast } = useToast()
  const router = useRouter()
  const route = layoutSegment.slice(0, -1).join('/')
  const onSubmit: SubmitHandler<LogisticaForms> = async (body) => {
    try {
      await setter<LogisticaForms>({
        route: `logistica/${route}`,
        body,
      })

      toast({
        title: 'Cargado con exito',
        variant: 'success',
      })
      router.back()
    } catch (error) {
      toast({ title: 'Error al cargar', variant: 'destructive' })
    }
  }
  return (
    <RegularForm
      id={route}
      className="flex flex-col items-center"
      onSubmit={onSubmit}
    >
      {children}
      <div className="flex justify-between gap-10">
        <Button onClick={router.back} className="bg-red-700 hover:bg-red-800">
          Cancelar
        </Button>
        <Button form={route} type="submit">
          Guardar
        </Button>
      </div>
    </RegularForm>
  )
}

export default layout
