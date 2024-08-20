'use client'

import React from 'react'
import useSWRInmutable from 'swr/immutable'
import { getter } from '@/services'
import Loader from '@/components/Loader'
import { InspectoresDTO } from '@/DTO/user'

function LayoutClient(props: { children: React.ReactNode }) {
  const { isLoading } = useSWRInmutable('inspectores', async (route) => {
    const operarios = await getter<InspectoresDTO[]>({
      route,
    })
    return operarios.map(({ legajo, nombre, apellido }) => ({
      legajo,
      nombre: `${nombre} ${apellido}`,
    }))
  })
  if (isLoading) return null

  if (isLoading) return <Loader />
  return (
    <main className="flex flex-col items-center gap-3">{props.children}</main>
  )
}

export default LayoutClient
