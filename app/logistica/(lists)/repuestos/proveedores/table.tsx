'use client'

// import type { DataTableFilterField } from '@/types/data-table'
import * as React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar'
import { getColumns } from './columns'
import { Filter } from '@/DTO/filters'
import { proveedor } from '@/drizzle/schema/logistica'
import { DataTableFilterField } from '@/types/data-table'

interface TasksTableProps {
  tasks: { data: (typeof proveedor.$inferSelect)[]; pages: number }
  filters?: Filter
}

export function ProveedoresTable({
  tasks: { data, pages },
  filters,
}: TasksTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<typeof proveedor.$inferSelect>[] = [
    {
      label: 'Nombre',
      value: 'nombre',
      placeholder: 'Filtrar nombre...',
    },
    {
      label: 'Tipo',
      value: 'tipo',
      options: filters?.tipo_repuesto,
      placeholder: 'Filtrar tipo...',
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
      <DataTableAdvancedToolbar table={table} />
    </DataTable>
  )
}
