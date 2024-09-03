'use client'
import React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { operarioColumns } from './columns'
import { Operario } from '@/types/operarios.sueldos'
import { useDataTable } from '@/hooks/use-data-table'

function Table({ data, pages }: { data: Operario[]; pages: number }) {
  const columns = React.useMemo(() => operarioColumns(), [])

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    defaultPerPage: 10,
    defaultSort: 'legajo.desc',
  })

  return <DataTable table={table} />
}

export default Table
