'use client'

import * as React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar'
import { getColumns, repuestosColumns } from './columns'
import { Filter } from '@/DTO/filters'
import { PedidosDTO } from '@/DTO/logistica/pedidos'
import { DataTableFilterField } from '@/types/data-table'

interface TasksTableProps {
  tasks: { data: PedidosDTO[]; pages: number }
  filters?: Filter
}

export function PedidosTable({ tasks: { data, pages } }: TasksTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<PedidosDTO>[] = [
    {
      label: 'Proveedor',
      value: 'proveedor',
      placeholder: 'Filtrar proveedor...',
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    filterFields,
    defaultPerPage: 10,
    defaultSort: 'id.desc',
  })

  return (
    <DataTable table={table} expand={Repuestos}>
      <DataTableAdvancedToolbar table={table} />
    </DataTable>
  )
}

export function Repuestos({ data }: { data: PedidosDTO }) {
  const columns = React.useMemo(() => repuestosColumns(), [])

  const { table } = useDataTable({
    data: data.repuestos,
    columns,
    pageCount: 1,
    // optional props
    defaultPerPage: data.repuestos.length,
    defaultSort: 'item.desc',
  })

  return <DataTable table={table} />
}
