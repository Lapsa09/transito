'use client'
import React from 'react'
import { getClientes } from '@/services'
import useSWR from 'swr'
import { DataTable } from '@/components/table'
import Mes from './expansions'
import { ClientesColumns } from './columns'

function page() {
  const { data, isLoading } = useSWR('clientes', getClientes)

  if (isLoading) return null
  return (
    <DataTable
      columns={ClientesColumns}
      data={data}
      expand={Mes}
      getRowCanExpand={() => true}
    />
  )
}

export default page
