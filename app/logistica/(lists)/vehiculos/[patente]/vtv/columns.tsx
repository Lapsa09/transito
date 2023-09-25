import { VTV } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'

export const columns: ColumnDef<VTV>[] = [
  {
    accessorFn: (row) => DateTime.fromJSDate(row.fecha_emision!).monthLong,
    header: 'Mes',
  },
  {
    accessorFn: (row) => DateTime.fromJSDate(row.fecha_emision!).year,
    header: 'Año',
  },
  {
    accessorFn: (row) => row.fecha_emision,
    header: 'Fecha de emisión',
  },
  {
    accessorFn: (row) => row.vencimiento,
    header: 'Fecha de vencimiento',
  },
  {
    accessorFn: (row) => row.estado,
    header: 'Estado',
  },
  {
    accessorFn: (row) => row.observacion,
    header: 'Observaciones',
  },
  {
    accessorFn: (row) => row.condicion,
    header: 'Condición',
  },
]
