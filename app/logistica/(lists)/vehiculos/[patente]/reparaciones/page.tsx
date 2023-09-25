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
    `/logistica/vehiculos/${patente}/reparaciones`,
    getter,
  )

  if (isLoading) return null
  return (
    <div>
      <h1 className="mb-5 text-center">{patente}</h1>
      <DataTable data={data} columns={columns} />
    </div>
  )
}

export default page
