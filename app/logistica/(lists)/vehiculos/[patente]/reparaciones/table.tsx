'use client'

import * as React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar'
import { getColumns } from './columns'
import { Filter } from '@/DTO/filters'
import { ReparacionesByMovilDTO } from '@/DTO/logistica/reparaciones'
import { DataTableFilterField } from '@/types/data-table'

interface TasksTableProps {
  tasks: { data: ReparacionesByMovilDTO[]; pages: number }
  filters?: Filter
}

export function ReparacionesTable({
  tasks: { data, pages },
  // filters,
}: TasksTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<ReparacionesByMovilDTO>[] = [
    {
      label: 'Fecha',
      value: 'fecha',
      type: 'date',
      placeholder: 'Filtrar fecha...',
    },
    {
      label: 'Fecha Entrega',
      value: 'fecha_entrega',
      type: 'date',
      placeholder: 'Filtrar fecha entrega...',
    },
    {
      label: 'Fecha Pedido',
      value: 'fecha_pedido',
      type: 'date',
      placeholder: 'Filtrar fecha pedido...',
    },
    {
      label: 'Orden Compra',
      value: 'orden_compra',
      placeholder: 'Filtrar orden compra...',
    },
    {
      label: 'Repuesto',
      value: 'repuesto',
      placeholder: 'Filtrar repuesto...',
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    filterFields,
    defaultPerPage: 10,
    defaultSort: 'fecha.desc',
  })

  return (
    <DataTable table={table}>
      <DataTableAdvancedToolbar table={table} />
    </DataTable>
  )
}
