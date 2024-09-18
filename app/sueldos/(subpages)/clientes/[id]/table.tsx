'use client'

import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { Historial } from '@/types'
import React from 'react'
import { historialColumns } from './columns'

type MesProps = {
  data: Historial[]
  pages: number
}

function Mes({ data, pages }: MesProps) {
  const columns = React.useMemo(() => historialColumns(), [])

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    defaultPerPage: 10,
    defaultSort: 'mes.desc',
  })
  return <DataTable table={table} />
}

export default Mes
