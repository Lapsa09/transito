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
  return <DataTable data={data} columns={columns} />
}

export default page
