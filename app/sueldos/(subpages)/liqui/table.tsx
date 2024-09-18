'use client'

import React from 'react'
import { liquiColumns } from './columns'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTable } from '@/components/data-table/data-table'

function table({
  data,
  pages,
}: {
  data: {
    mes: number
    año: number
    total: number
  }[]
  pages: number
}) {
  const columns = React.useMemo(() => liquiColumns(), [])

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    defaultPerPage: 10,
    defaultSort: 'año.desc',
  })

  return <DataTable table={table} />
}

export default table
