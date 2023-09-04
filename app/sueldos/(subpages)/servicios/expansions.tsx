'use client'
import React from 'react'
import { DataTable } from '@/components/table'
import { Servicio } from '@/types/servicios.sueldos'
import { OperarioColumns } from './columns'

type MesProps = {
  data: Servicio
}

function Mes({ data }: MesProps) {
  return (
    <DataTable
      data={data.operarios_servicios}
      columns={OperarioColumns}
      rowClassName={(row) => (row.original.cancelado ? 'bg-danger' : '')}
    />
  )
}

export default Mes
