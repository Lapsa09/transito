'use client'

// import type { DataTableFilterField } from '@/types/data-table'
import * as React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar'
import { getColumns } from './columns'
import { Filter } from '@/DTO/filters'
import { KilometrajeDTO } from '@/DTO/logistica/kilometraje'
import { DataTableFilterField } from '@/types/data-table'

interface TasksTableProps {
  tasks: { data: KilometrajeDTO[]; pages: number }
  filters?: Filter
}

export function KilometrajeTable({
  tasks: { data, pages },
  // filters,
}: TasksTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<KilometrajeDTO>[] = [
    {
      label: 'Fecha',
      value: 'fecha',
      type: 'date',
      placeholder: 'Filtrar fecha...',
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
