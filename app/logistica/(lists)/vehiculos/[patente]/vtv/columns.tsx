import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { VTVDTO } from '@/DTO/logistica/vtv'
import { ColumnDef } from '@tanstack/react-table'

export function getColumns(): ColumnDef<VTVDTO>[] {
  return [
    {
      accessorFn: (row) => row.mes,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mes" />
      ),
      id: 'mes',
    },
    {
      accessorFn: (row) => row.año,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Año" />
      ),
      id: 'año',
    },
    {
      accessorFn: (row) => row.fecha_emision,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha de emision" />
      ),
      id: 'fecha_emision',
    },
    {
      accessorFn: (row) => row.vencimiento,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha de vencimiento" />
      ),
      id: 'vencimiento',
    },
    {
      accessorFn: (row) => row.estado,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      id: 'estado',
    },
    {
      accessorFn: (row) => row.observacion,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Observaciones" />
      ),
      id: 'observacion',
    },
    {
      accessorFn: (row) => row.condicion,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Condicion" />
      ),
      id: 'condicion',
    },
  ]
}
