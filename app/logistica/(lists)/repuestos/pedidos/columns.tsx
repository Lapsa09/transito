import { PedidoRepuesto, Repuesto } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { DateTime } from 'luxon'

export const columns: ColumnDef<PedidoRepuesto>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return (
        row.getCanExpand() && (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
          >
            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
          </button>
        )
      )
    },
  },
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

export const RepuestosColumns: ColumnDef<PedidoRepuesto['repuestos'][0]>[] = [
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
