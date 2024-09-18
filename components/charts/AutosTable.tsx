'use client'

import React from 'react'
import { DataTable } from '../ui/data-table'
import { ColumnDef } from '@tanstack/react-table'

type Props = { data: { id: string; value: number }[] }

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Props['data'][number]>[] = [
  {
    accessorKey: 'id',
    header: 'Localidad',
  },
  {
    accessorKey: 'value',
    header: 'Cantidad',
  },
]

function AutosTable({ data }: Props) {
  return (
    <div className="h-96">
      <DataTable data={data} columns={columns} />
    </div>
  )
}

export default AutosTable
