'use client'

import React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { getColumns } from './columns'
import { Historial } from '@/types/quiz'
import { useDataTable } from '@/hooks/use-data-table'

function page({ data, pages }: { data: Historial[]; pages: number }) {
  const columns = React.useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    defaultPerPage: 10,
    defaultSort: 'fecha.desc',
  })

  return <DataTable table={table} />
}

export default page
