import type { Parte } from '@/types/radio'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Parte>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    meta: {
      filterVariant: 'date',
    },
  },
  {
    accessorKey: 'turno',
    enableColumnFilter: false,
    header: 'Turno',
  },
  {
    accessorKey: 'qth',
    enableColumnFilter: false,
    header: 'QTH',
  },
  {
    accessorKey: 'operario',
    enableColumnFilter: false,
    header: 'Operario',
    accessorFn: (row) =>
      `${row.operario.legajo} - ${row.operario.usuario.nombre} ${row.operario.usuario.apellido}`,
  },
  {
    accessorKey: 'movil',
    enableColumnFilter: false,
    header: 'Movil',
  },
  {
    accessorKey: 'hora_inicio',
    enableColumnFilter: false,
    header: 'Hora Inicio',
  },
  {
    accessorKey: 'hora_fin',
    enableColumnFilter: false,
    header: 'Hora Fin',
  },
  {
    accessorKey: 'hora_descanso',
    enableColumnFilter: false,
    header: 'Hora Descanso',
  },
  {
    accessorKey: 'hora_descanso_fin',
    enableColumnFilter: false,
    header: 'Hora Descanso Fin',
  },
]
