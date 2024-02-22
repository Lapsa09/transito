'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Reparacion } from '@/types/logistica'

function page({ data, pages }: { data: Reparacion[]; pages: number }) {
  return (
    <DataTable
      enableColumnFilters={false}
      enableFilters={false}
      enableSorting={false}
      columns={columns}
      data={data}
      pageCount={pages}
    />
  )
}

export default page
