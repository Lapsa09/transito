import type { Parte } from '@/types/radio'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Parte>[] = [
  {
    accessorFn: (row) =>
      new Date(row.fecha).toLocaleDateString('UTC', { timeZone: 'GMT' }),
    header: 'Fecha',
    meta: {
      filterVariant: 'date',
    },
    id: 'fecha',
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
      row.operario.apellido
        ? `${row.operario.legajo} - ${row.operario.nombre} ${row.operario.apellido}`
        : row.operario.legajo,
  },
  {
    accessorKey: 'movil',
    enableColumnFilter: false,
    header: 'Movil',
  },
  {
    id: 'horario',
    enableColumnFilter: false,
    header: 'Horario',
    accessorFn: (row) => {
      const horaInicio = new Date(row.hora_inicio).toLocaleTimeString('UTC', {
        timeZone: 'GMT',
        timeStyle: 'short',
      })
      const horaFin = new Date(row.hora_fin).toLocaleTimeString('UTC', {
        timeZone: 'GMT',
        timeStyle: 'short',
      })
      return `${horaInicio} - ${horaFin}`
    },
  },
  {
    id: 'hora_descanso',
    enableColumnFilter: false,
    header: 'Hora Descanso',
    accessorFn: (row) => {
      const horaDescanso = new Date(row.hora_descanso).toLocaleTimeString(
        'UTC',
        {
          timeZone: 'GMT',
          timeStyle: 'short',
        },
      )
      const horaDescansoFin = new Date(
        row.hora_descanso_fin,
      ).toLocaleTimeString('UTC', {
        timeZone: 'GMT',
        timeStyle: 'short',
      })
      return `${horaDescanso} - ${horaDescansoFin}`
    },
  },
]
