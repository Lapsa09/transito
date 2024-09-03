'use client'
import React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { Servicio } from '@/types/servicios.sueldos'
import { servicioColumns } from './columns'
import { useDataTable } from '@/hooks/use-data-table'

function Servicios({ data, pages }: { data: Servicio[]; pages: number }) {
  const columns = React.useMemo(() => servicioColumns(), [])

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    defaultPerPage: 10,
    defaultSort: 'idCliente.desc',
  })

  return <DataTable table={table} />
}

export default Servicios
