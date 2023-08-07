'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { ClientesColumns } from './columns'
import { Cliente } from '@/types'
import Mes from './expansions'

function ClientTable({ data }: { data: Cliente[] }) {
  return (
    <DataTable
      columns={ClientesColumns}
      data={data}
      expand={Mes}
      getRowCanExpand={() => true}
    />
  )
}

export default ClientTable
