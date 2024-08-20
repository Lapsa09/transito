'use client'

import * as React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar'
import { getColumns } from './columns'
import { Filter } from '@/DTO/filters'
import { RepuestosDTO } from '@/DTO/logistica/repuestos'

interface TasksTableProps {
  tasks: { data: RepuestosDTO[]; pages: number }
  filters?: Filter
}

export function RepuestosTable({
  tasks: { data, pages },
  filters,
}: TasksTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  // const filterFields: DataTableFilterField<RepuestosDTO>[] = [
  //   {
  //     label: 'Localidad',
  //     value: 'localidad',
  //     options: filters.localidad,
  //     placeholder: 'Filtrar localidad...',
  //   },
  //   {
  //     label: 'Turno',
  //     value: 'turno',
  //     options: filters.turno,
  //     placeholder: 'Filtrar turno...',
  //   },
  //   {
  //     label: 'Dominio',
  //     value: 'dominio',
  //     placeholder: 'Filtrar dominio...',
  //   },
  //   {
  //     label: 'Licencia',
  //     value: 'tipo_licencia',
  //     placeholder: 'Filtrar licencia...',
  //     options: filters.tipo_licencia,
  //   },
  //   {
  //     label: 'Zona Infractor',
  //     value: 'zona_infractor',
  //     placeholder: 'Filtrar zona infractor...',
  //     options: filters.zona_infractor,
  //   },
  //   {
  //     label: 'Resolucion',
  //     value: 'resolucion',
  //     placeholder: 'Filtrar resolucion...',
  //     options: filters.resolucion,
  //   },
  //   {
  //     label: 'Motivo',
  //     value: 'motivo',
  //     placeholder: 'Filtrar motivo...',
  //     options: filters.motivo,
  //   },
  // ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    // filterFields,
    defaultPerPage: 10,
    defaultSort: 'id.desc',
  })

  return (
    <DataTable table={table}>
      <DataTableAdvancedToolbar table={table} />
    </DataTable>
  )
}
