import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { RepuestosDTO } from '@/DTO/logistica/repuestos'
import { ColumnDef } from '@tanstack/react-table'

export function getColumns(): ColumnDef<RepuestosDTO>[] {
  return [
    {
      accessorFn: (row) => row.id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Id" />
      ),
      id: 'id',
    },
    {
      accessorFn: (row) => row.item,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Repuesto" />
      ),
      id: 'repuesto',
    },
    {
      accessorFn: (row) => row.tipoRepuesto,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de repuesto" />
      ),
      id: 'tipo_repuesto',
    },
    {
      accessorFn: (row) => row.ubicacion,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ubicacion" />
      ),
      id: 'ubicacion',
    },
    {
      accessorFn: (row) => row.estado,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      id: 'estado',
    },
  ]
}
