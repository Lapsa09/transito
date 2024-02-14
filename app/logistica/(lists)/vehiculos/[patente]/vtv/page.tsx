'use client'

import { DataTable } from '@/components/table'
import { getter } from '@/services'
import React from 'react'
import useSWR from 'swr'
import { columns } from './columns'
import { VTV } from '@/types/logistica'

function page({ params }: { params: { patente: string } }) {
  const { patente } = params

  const { data, isLoading } = useSWR<VTV[]>(
    { route: `logistica/vehiculos/${patente}/vtv` },
    getter,
    {},
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
