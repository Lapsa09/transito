'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Registro } from '@/types/autos'

function ClientTable({ data }: { data: Registro[] }) {
  return <DataTable columns={columns} data={data} />
}

export default ClientTable
