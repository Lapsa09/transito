'use client'

import React from 'react'
import { DataTable } from '../ui/data-table'
import { ColumnDef } from '@tanstack/react-table'

type Props = { data: { origen: string; destino: string; value: number }[] }

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Props['data'][number]>[] = [
  {
    accessorKey: 'origen',
    header: 'Origen',
  },
  {
    accessorKey: 'destino',
    header: 'Destino',
  },
  {
    accessorKey: 'value',
    header: 'Cantidad',
  },
]

function CamionesTable({ data }: Props) {
  return (
    <div className="h-96">
      <DataTable data={data} columns={columns} />
    </div>
  )
}

export default CamionesTable
