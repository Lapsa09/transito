'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { ServicioColumns } from './columns'
import Mes from './expansions'
import { Servicio } from '@/types/servicios.sueldos'

function ClientTable({ data }: { data: Servicio[] }) {
  return (
    <DataTable
      columns={ServicioColumns}
      data={data}
      expand={Mes}
      getRowCanExpand={() => true}
    />
  )
}

export default ClientTable
