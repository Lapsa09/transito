'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { PedidoRepuesto } from '@/types/logistica'
import { Repuestos } from './expansions'

function page({ data, pages }: { data: PedidoRepuesto[]; pages: number }) {
  return (
    <DataTable
      enableColumnFilters={false}
      enableFilters={false}
      enableSorting={false}
      expand={Repuestos}
      columns={columns}
      data={data}
      getRowCanExpand={() => true}
      pageCount={pages}
    />
  )
}

export default page
