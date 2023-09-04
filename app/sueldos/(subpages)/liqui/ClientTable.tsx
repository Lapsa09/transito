'use client'
import { DataTable } from '@/components/table'
import React from 'react'
import { LiquiColumns } from './columns'

function ClientTable({ data }: { data: any[] }) {
  return <DataTable columns={LiquiColumns} data={data} />
}

export default ClientTable
