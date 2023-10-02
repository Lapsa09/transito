'use client'
import React from 'react'
import { RegularForm } from '@/components/forms/layout.form'
import { SubmitHandler } from 'react-hook-form'
import { type LogisticaForms } from '@/types/logistica'
import { useSelectedLayoutSegments } from 'next/navigation'
import { mutate } from 'swr'
import { setter } from '@/services'

function layout({ children }: React.PropsWithChildren) {
  const layoutSegment = useSelectedLayoutSegments()

  const onSubmit: SubmitHandler<LogisticaForms> = async (body) => {
    const route = String(layoutSegment)

    await mutate<LogisticaForms[]>(
      { route: `logistica/${layoutSegment.join('/')}` },
      async (data) => {
        const res = await setter<LogisticaForms>({ route, body })

        if (data) {
          return [...data, res]
        }
        return [res]
      },
    )
  }
  return (
    <RegularForm className="flex flex-col items-center" onSubmit={onSubmit}>
      {children}
    </RegularForm>
  )
}

export default layout
