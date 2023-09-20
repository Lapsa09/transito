import { getter } from '@/services'
import { Reparacion } from '@/types/logistica'
import React from 'react'
import useSWR from 'swr'

function page({ params }: { params: { patente: string } }) {
  const { patente } = params

  const { data, isLoading } = useSWR<Reparacion[]>(
    `/logistica/vehiculos/${patente}/reparaciones`,
    getter,
  )

  if (isLoading) return null
  return (
    <div>
      <h1>Reparaciones</h1>
    </div>
  )
}

export default page
