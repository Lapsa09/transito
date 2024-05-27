'use client'

import React from 'react'
import useSWRInmutable from 'swr/immutable'
import { getter } from '@/services'
import Loader from '@/components/Loader'
import { legajos } from '@prisma/client'

function LayoutClient(props: { children: React.ReactNode }) {
  const { isLoading } = useSWRInmutable('inspectores', async (route) => {
    const operarios = await getter<
      (legajos & {
        usuario: {
          nombre: string
          apellido: string
        }
      })[]
    >({
      route,
    })
    return operarios.map(({ legajo, usuario }) => ({
      legajo,
      nombre: `${usuario.nombre} ${usuario.apellido}`,
    }))
  })
  if (isLoading) return null

  if (isLoading) return <Loader />
  return (
    <main className="flex flex-col items-center gap-3">{props.children}</main>
  )
}

export default LayoutClient
