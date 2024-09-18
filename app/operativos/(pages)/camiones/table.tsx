'use client'

import type { DataTableFilterField } from '@/types/data-table'
import * as React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar'
import { getColumns } from './columns'
import { Filter } from '@/DTO/filters'
import { CamionesDTO } from '@/DTO/operativos/camiones'

interface TasksTableProps {
  tasks: { data: CamionesDTO[]; pages: number }
  filters: Filter
}

export function CamionesTable({
  tasks: { data, pages },
  filters,
}: TasksTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<CamionesDTO>[] = [
    {
      label: 'Localidad',
      value: 'localidad',
      options: filters.localidad,
      placeholder: 'Filtrar localidad...',
    },
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
      label: 'Localidad de Origen',
      value: 'localidad_origen',
      placeholder: 'Filtrar licencia...',
      options: filters.zona_infractor,
    },
    {
      label: 'Localidad de Destino',
      value: 'localidad_destino',
      placeholder: 'Filtrar zona infractor...',
      options: filters.zona_infractor,
    },
    {
      label: 'Resolucion',
      value: 'resolucion',
      placeholder: 'Filtrar resolucion...',
      options: filters.resolucion,
    },
    {
      label: 'Motivo',
      value: 'motivo',
      placeholder: 'Filtrar motivo...',
      options: filters.motivo,
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
