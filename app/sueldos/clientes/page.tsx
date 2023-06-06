'use client'

import { DataTable } from '@/components'
import { getClientes } from '@/services'
import React from 'react'
import useSWR from 'swr'
import { ClientesColumns } from './columns'
import Mes from './mes'

function page() {
  const { data, isLoading } = useSWR('clientes', getClientes)

  if (isLoading) return <div>Loading...</div>
  return (
    <DataTable
      data={data!}
      columns={ClientesColumns}
      expand={Mes}
      getRowCanExpand={() => true}
    />
  )
}

export default page
