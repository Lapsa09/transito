'use client'

import type { DataTableFilterField } from '@/types/data-table'
import * as React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar'
import { getColumns } from './columns'
import { Filter } from '@/DTO/filters'
import { AutosDTO } from '@/DTO/operativos/autos'

interface TasksTableProps {
  tasks: { data: AutosDTO[]; pages: number }
  filters: Filter
}

export function AutosTable({
  tasks: { data, pages },
  filters,
}: TasksTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<AutosDTO>[] = [
    {
      label: 'fecha',
      value: 'fecha',
      type: 'date',
      placeholder: 'Filtrar fecha...',
    },
    {
      label: 'Localidad',
      value: 'localidad',
      options: filters.localidad,
      placeholder: 'Filtrar localidad...',
      type: 'select',
    },
    {
      label: 'Turno',
      value: 'turno',
      options: filters.turno,
      placeholder: 'Filtrar turno...',
      type: 'select',
    },
    {
      label: 'Dominio',
      value: 'dominio',
      placeholder: 'Filtrar dominio...',
    },
    {
      label: 'Licencia',
      value: 'tipo_licencia',
      placeholder: 'Filtrar licencia...',
      options: filters.tipo_licencia,
      type: 'select',
    },
    {
      label: 'Zona Infractor',
      value: 'zona_infractor',
      placeholder: 'Filtrar zona infractor...',
      options: filters.zona_infractor,
      type: 'select',
    },
    {
      label: 'Resolucion',
      value: 'resolucion',
      placeholder: 'Filtrar resolucion...',
      options: filters.resolucion,
      type: 'select',
    },
    {
      label: 'Motivo',
      value: 'motivo',
      placeholder: 'Filtrar motivo...',
      options: filters.motivo,
      type: 'select',
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
