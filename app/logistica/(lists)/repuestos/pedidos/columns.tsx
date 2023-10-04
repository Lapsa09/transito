import { PedidoRepuesto } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<PedidoRepuesto>[] = [
  {
    accessorFn: (row) => row.fecha_pedido,
    header: 'Fecha de pedido',
  },
  {
    accessorFn: (row) => row.fecha_entrega,
    header: 'Fecha de entrega',
  },
  {
    accessorFn: (row) => row.repuesto.item,
    header: 'Repuesto',
  },
  {
    accessorFn: (row) => row.repuesto.tipo_repuesto.tipo,
    header: 'Tipo de repuesto',
  },
  {
    accessorFn: (row) => row.cantidad,
    header: 'Cantidad',
  },
  {
    accessorFn: (row) => row.orden_compra,
    header: 'Orden de compra',
  },
  {
    accessorFn: (row) => row.proveedor.nombre,
    header: 'Proveedor',
  },
]
