'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { proveedor } from '@prisma/client'

function page({ data, pages }: { data: proveedor[]; pages: number }) {
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
