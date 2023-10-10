'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import useSWR from 'swr'
import { getter } from '@/services'
import { columns } from './columns'
import { KilometrajeVehiculo } from '@/types/logistica'

function page({ params }: { params: { patente: string } }) {
  const { patente } = params

  const { data, isLoading } = useSWR<KilometrajeVehiculo[]>(
    { route: `logistica/vehiculos/${patente}/kilometraje` },
    getter,
  )

  if (isLoading) return null
  return (
    <div>
      <h1 className="text-center mb-5 uppercase">{patente}</h1>
      <DataTable data={data} columns={columns} />
    </div>
  )
}

export default page
