'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import useSWR from 'swr'
import { getter } from '@/services'
import { columnsVehiculos } from './columns'
import { KilometrajeVehiculo } from '@/types/logistica'

function page({ params }: { params: { patente: string } }) {
  const { patente } = params

  const { data, isLoading } = useSWR<KilometrajeVehiculo[]>(
    { route: `logistica/vehiculos/${patente}/service` },
    getter,
  )

  if (isLoading) return null
  return (
    <div>
      <h1 className="text-center mb-5">{patente}</h1>
      <DataTable data={data} columns={columnsVehiculos} />
    </div>
  )
}

export default page
