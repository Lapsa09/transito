'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { KilometrajeVehiculo } from '@/types/logistica'

function page({ data, pages }: { data: KilometrajeVehiculo[]; pages: number }) {
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
