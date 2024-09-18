import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Button } from '@/components/ui'
import { PedidosDTO } from '@/DTO/logistica/pedidos'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'

export function getColumns(): ColumnDef<PedidosDTO>[] {
  return [
    {
      id: 'expander',
      cell: ({ row }) => {
        return (
          row.getCanExpand() && (
            <Button
              asChild
              onClick={row.getToggleExpandedHandler()}
              className="cursor-pointer"
            >
              {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
            </Button>
          )
        )
      },
    },
    {
      accessorFn: (row) => row.fechaPedido,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha del pedido" />
      ),
      id: 'fechaPedido',
    },
    {
      accessorFn: (row) => row.fechaEntrega,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha de entrega" />
      ),
      id: 'fechaEntrega',
    },
    {
      accessorFn: (row) => row.ordenCompra,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Orden de compra" />
      ),
      id: 'ordenCompra',
    },
    {
      accessorFn: (row) => row.proveedor,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Proveedor" />
      ),
      id: 'proveedor',
    },
  ]
}
export const repuestosColumns = (): ColumnDef<PedidosDTO['repuestos'][0]>[] => [
  {
    accessorFn: (row) => row.item,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item" />
    ),
    id: 'item',
  },
  {
    accessorFn: (row) => row.tipoRepuesto,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de repuesto" />
    ),
    id: 'tipoRepuesto',
  },
  // {
  //   accessorFn: (row) => row.cantidad,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Cantidad" />
  //   ),
  //   id: 'cantidad',
  // },
]
