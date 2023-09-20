'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { getter } from '@/services'
import useSWR from 'swr'
import { columns } from './columns'
import { Vehiculo } from '@/types/logistica'

function page() {
  const { data, isLoading } = useSWR<Vehiculo[]>(
    { route: 'logistica/vehiculos' },
    getter,
  )
  if (isLoading) return null
  return (
    <div>
      <h1 className="text-center mb-5">Vehiculos</h1>
      <DataTable data={data} columns={columns} />
    </div>
  )
}

export default page
