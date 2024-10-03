'use client'

import React from 'react'
import { operarioColumns } from './columns'
import { useDataTable } from '@/hooks/use-data-table'
import { OperariosDTO } from '@/types/servicios.sueldos'
import { DataTable } from '@/components/data-table/data-table'
import { Fetched } from '@/types'

function Mes({ data, pages }: Fetched<OperariosDTO>) {
  const columns = React.useMemo(() => operarioColumns(), [])

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    defaultPerPage: 10,
    defaultSort: 'id.desc',
  })
  return <DataTable table={table} />
}

export default Mes
