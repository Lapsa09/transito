import { Reparacion } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Reparacion>[] = [
  {
    accessorFn: (row) => row.repuesto.item,
    header: 'Repuesto',
  },
  {
    accessorFn: (row) =>
      row.repuesto.pedido_repuesto.fecha_pedido?.toLocaleDateString(),
    header: 'Fecha pedido',
  },
  {
    accessorFn: (row) =>
      row.repuesto.pedido_repuesto.fecha_entrega?.toLocaleDateString(),
    header: 'Fecha entrega',
  },
  {
    accessorFn: (row) => row.repuesto.pedido_repuesto.orden_compra,
    header: 'Orden de compra',
  },
  {
    accessorFn: (row) => row.retira,
    header: 'Retira',
  },
  {
    accessorFn: (row) => row.concepto,
    header: 'Concepto',
  },
  {
    accessorFn: (row) => row.estado,
    header: 'Estado',
  },
  {
    accessorFn: (row) => row.fecha,
    header: 'Fecha reparación',
  },
  {
    accessorFn: (row) => row.observacion,
    header: 'Observación',
  },
]
