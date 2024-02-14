'use client'

import { DataTable } from '@/components/table'
import { getter } from '@/services'
import { Reparacion } from '@/types/logistica'
import React from 'react'
import useSWR from 'swr'
import { columns } from './columns'

function page() {
  const { data, isLoading } = useSWR<Reparacion[]>(
    { route: '/logistica/repuestos/reparaciones' },
    getter,
    {},
  )

  if (isLoading) return null
  return (
    <div>
      <h1 className="mb-1 text-center">Historial de reparaciones realizadas</h1>
      <DataTable data={data} columns={columns} />
    </div>
  )
}

export default page
