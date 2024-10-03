'use client'

import type { DataTableFilterField } from '@/types/data-table'
import * as React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar'
import { getColumns } from './columns'
import { Filter } from '@/DTO/filters'
import { RioDTO } from '@/DTO/operativos/rio'

interface TasksTableProps {
  tasks: { data: RioDTO[]; pages: number }
  filters: Filter
}

export function RioTable({ tasks: { data, pages }, filters }: TasksTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<RioDTO>[] = [
    {
      label: 'Turno',
      value: 'turno',
      options: filters.turno,
      placeholder: 'Filtrar turno...',
    },
    {
      label: 'Dominio',
      value: 'dominio',
      placeholder: 'Filtrar dominio...',
    },
    {
      label: 'Zona Infractor',
      value: 'zona_infractor',
      placeholder: 'Filtrar zona infractor...',
      options: filters.zona_infractor,
    },
    {
      label: 'Zona',
      value: 'zona',
      placeholder: 'Filtrar zona...',
      options: filters.zona,
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
    <DataTable table={table}>
      <DataTableAdvancedToolbar table={table} filterFields={filterFields} />
    </DataTable>
  )
}
