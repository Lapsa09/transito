'use client'

import * as React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar'
import { getColumns } from './columns'
import { Filter } from '@/DTO/filters'
import { VehiculoDTO } from '@/DTO/logistica/vehiculos'
import { DataTableFilterField } from '@/types/data-table'

interface TasksTableProps {
  tasks: { data: VehiculoDTO[]; pages: number }
  filters?: Filter
}

export function VehiculosTable({
  tasks: { data, pages },
  // filters,
}: TasksTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<VehiculoDTO>[] = [
    {
      label: 'Dominio',
      value: 'patente',
      placeholder: 'Filtrar dominio...',
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    filterFields,
    defaultPerPage: 10,
    defaultSort: 'patente.desc',
  })

  return (
    <DataTable table={table}>
      <DataTableAdvancedToolbar table={table} />
    </DataTable>
  )
}
