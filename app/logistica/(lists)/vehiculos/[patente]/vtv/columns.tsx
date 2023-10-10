import { VTV } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'

export const columns: ColumnDef<VTV>[] = [
  {
    accessorFn: (row) => DateTime.fromISO(String(row.fecha_emision)).monthLong,
    header: 'Mes',
  },
  {
    accessorFn: (row) => DateTime.fromISO(String(row.fecha_emision)).year,
    header: 'Año',
  },
  {
    accessorFn: (row) =>
      DateTime.fromISO(String(row.fecha_emision))
        .plus({ day: 1 })
        .toLocaleString(DateTime.DATE_SHORT),
    header: 'Fecha de emisión',
  },
  {
    accessorFn: (row) =>
      DateTime.fromISO(String(row.vencimiento))
        .plus({ day: 1 })
        .toLocaleString(DateTime.DATE_SHORT),
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
