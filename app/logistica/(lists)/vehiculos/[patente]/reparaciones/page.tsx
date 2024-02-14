'use client'

import { DataTable } from '@/components/table'
import { getter } from '@/services'
import { Reparacion } from '@/types/logistica'
import React from 'react'
import useSWR from 'swr'
import { columns } from './columns'

function page({ params }: { params: { patente: string } }) {
  const { patente } = params

  const { data, isLoading } = useSWR<Reparacion[]>(
    { route: `logistica/vehiculos/${patente}/reparaciones` },
    (params: Record<'route', string>) => getter(params),
  )

  if (isLoading) return null
  return (
    <div>
      <h1 className="mb-5 text-center uppercase">{patente}</h1>
      <DataTable data={data} columns={columns} />
    </div>
  )
}

export default page
