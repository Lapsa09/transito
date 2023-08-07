'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { OperarioColumns } from './columns'
import OperariosTable from './expansions'
import { Operario } from '@/types/operarios.sueldos'

function ClientTable({ data }: { data: Operario[] }) {
  return (
    <DataTable columns={OperarioColumns} data={data} expand={OperariosTable} />
  )
}

export default ClientTable
