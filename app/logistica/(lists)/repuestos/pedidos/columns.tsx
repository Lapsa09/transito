import { PedidoRepuesto, Repuesto } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'

export const columns: ColumnDef<PedidoRepuesto>[] = [
  {
    accessorFn: (row) =>
      DateTime.fromISO(String(row.fecha_pedido))
        .plus({ day: 1 })
        .toLocaleString(DateTime.DATE_SHORT),
    header: 'Fecha de pedido',
  },
  {
    accessorFn: (row) =>
      DateTime.fromISO(String(row.fecha_entrega))
        .plus({ day: 1 })
        .toLocaleString(DateTime.DATE_SHORT),
    header: 'Fecha de entrega',
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

export const RepuestosColumns: ColumnDef<Repuesto>[] = [
  {
    accessorFn: (row) => row.item,
    header: 'Repuesto',
  },
  {
    accessorFn: (row) => row.tipo_repuesto.tipo,
    header: 'Tipo de repuesto',
  },
  {
    accessorFn: (row) => row.cantidad,
    header: 'Cantidad',
  },
]
