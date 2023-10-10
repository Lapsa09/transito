'use client'
import React from 'react'
import { RegularForm } from '@/components/forms/layout.form'
import { SubmitHandler } from 'react-hook-form'
import { type LogisticaForms } from '@/types/logistica'
import { useRouter, useSelectedLayoutSegments } from 'next/navigation'
import { mutate } from 'swr'
import { setter } from '@/services'
import { useToast } from '@/hooks'

function layout({ children }: React.PropsWithChildren) {
  const layoutSegment = useSelectedLayoutSegments()
  const { toast } = useToast()
  const router = useRouter()
  const route = layoutSegment.join('/')
  const onSubmit: SubmitHandler<LogisticaForms> = async (body) => {
    try {
      await mutate<LogisticaForms[]>(
        { route: `logistica/${route}` },
        async (data) => {
          const res = await setter<LogisticaForms>({
            route: `logistica/${route}`,
            body,
          })

          if (data) {
            return [...data, res]
          }
          return [res]
        },
      )
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
    </RegularForm>
  )
}

export default layout
