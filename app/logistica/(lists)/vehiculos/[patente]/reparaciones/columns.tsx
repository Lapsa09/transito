import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { ReparacionesByMovilDTO } from '@/DTO/logistica/reparaciones'
import { ColumnDef } from '@tanstack/react-table'

export function getColumns(): ColumnDef<ReparacionesByMovilDTO>[] {
  return [
    {
      accessorFn: (row) => row.repuesto,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Repuesto" />
      ),
      id: 'repuesto',
    },
    {
      accessorFn: (row) => row.fecha_pedido,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha del pedido" />
      ),
      id: 'fecha_pedido',
    },
    {
      accessorFn: (row) => row.fecha_entrega,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha de entrega" />
      ),
      id: 'fecha_entrega',
    },
    {
      accessorFn: (row) => row.orden_compra,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Orden de compra" />
      ),
      id: 'orden_compra',
    },
    {
      accessorFn: (row) => row.retira,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Retira" />
      ),
      id: 'retira',
    },
    {
      accessorFn: (row) => row.concepto,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Concepto" />
      ),
      id: 'concepto',
    },
    {
      accessorFn: (row) => row.estado,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      id: 'estado',
    },
    {
      accessorFn: (row) => row.fecha,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha de reparacion" />
      ),
      id: 'fecha_reparacion',
    },
    {
      accessorFn: (row) => row.observacion,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Observacion" />
      ),
      id: 'observacion',
    },
  ]
}
