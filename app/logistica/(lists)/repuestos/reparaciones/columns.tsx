import { Reparacion } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Reparacion>[] = [
  {
    accessorFn: (row) => row.fecha,
    header: 'Fecha',
  },
  {
    accessorFn: (row) => row.concepto,
    header: 'Concepto',
  },
  {
    accessorFn: (row) => row.movil,
    header: 'Movil',
  },
  {
    accessorFn: (row) => row.patente,
    header: 'Patente',
  },
  {
    accessorFn: (row) => row.articulo,
    header: 'Articulo',
  },
  {
    accessorFn: (row) => row.suministro.repuesto.item,
    header: 'Repuesto',
  },
  {
    accessorFn: (row) => row.retira,
    header: 'Retira',
  },
  {
    accessorFn: (row) => row.estado,
    header: 'Estado',
  },
]
