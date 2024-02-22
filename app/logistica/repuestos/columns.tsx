import { Repuesto } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Repuesto>[] = [
  {
    accessorFn: (row) => row.id,
    header: 'ID',
  },
  {
    accessorFn: (row) => row.item,
    header: 'Repuesto',
  },
  {
    accessorFn: (row) => row.tipo_repuesto.tipo,
    header: 'Tipo de repuesto',
  },
  {
    accessorFn: (row) => row.reparacion?.patente || 'En almacen',
    header: 'Ubicacion',
  },
  {
    accessorFn: (row) => (row.reparacion ? 'Usado' : 'Sin usar'),
    header: 'Estado',
  },
]
