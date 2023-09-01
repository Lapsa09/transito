'use client'
import React from 'react'
import { getServicios } from '@/services'
import { DataTable } from '@/components/table'
import { ServicioColumns } from './columns'
import Mes from './expansions'
import useSWR from 'swr'

function page() {
  const { data, isLoading } = useSWR('servicios', getServicios)
  if (isLoading) return null
  return (
    <DataTable
      columns={ServicioColumns}
      data={data}
      expand={Mes}
      getRowCanExpand={(row) => row.original.servicios?.length > 0}
    />
  )
}

export default page
