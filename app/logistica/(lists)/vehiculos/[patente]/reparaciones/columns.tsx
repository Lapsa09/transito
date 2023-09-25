import { Reparacion } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Reparacion>[] = [
  {
    accessorFn: (row) => row.suministro.repuesto.item,
    header: 'Repuesto',
  },
  {
    accessorFn: (row) => row.suministro.fecha_pedido,
    header: 'Fecha pedido',
  },
  {
    accessorFn: (row) => row.suministro.fecha_entrega,
    header: 'Fecha entrega',
  },
  {
    accessorFn: (row) => row.suministro.orden_compra,
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
