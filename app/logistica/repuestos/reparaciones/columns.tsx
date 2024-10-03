import { ReparacionesDTO } from '@/DTO/logistica/reparaciones'
import { ColumnDef } from '@tanstack/react-table'

export function getColumns(): ColumnDef<ReparacionesDTO>[] {
  return [
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
      accessorFn: (row) => row.movil,
      header: 'Patente',
    },
    {
      accessorFn: (row) => row.repuesto,
      header: 'Articulo',
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
}
