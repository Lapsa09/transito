'use client'
import React from 'react'
import { getOperarios } from '@/services'
import { DataTable } from '@/components/table'
import { OperarioColumns } from './columns'
import OperariosTable from './expansions'
import useSWR from 'swr'

function page() {
  const { data, isLoading } = useSWR('operarios', getOperarios)
  if (isLoading) return null

  return (
    <DataTable
      columns={OperarioColumns}
      data={data}
      expand={OperariosTable}
      getRowCanExpand={(row) => row.original.servicios.length > 0}
    />
  )
}

export default page
