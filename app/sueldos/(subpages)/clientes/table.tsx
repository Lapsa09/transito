import React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { Cliente } from '@/types'
import { clientesColumns } from './columns'

type ClienteProps = {
  data: Cliente[]
  pages: number
}

export function ClientesTable({ data, pages }: ClienteProps) {
  const columns = React.useMemo(() => clientesColumns(), [])

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
