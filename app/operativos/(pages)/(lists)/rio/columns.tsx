import { Registro } from '@/types/rio'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/edit/rio/${row.getValue('id')}`}>Editar</Link>
    ),
  },
  {
    accessorFn: (registro) =>
      new Date(registro.operativo.fecha).toLocaleDateString(),
    header: 'Fecha',
  },
  {
    accessorFn: (registro) =>
      registro.operativo.turno === 'MA_ANA'
        ? 'MAÑANA'
        : registro.operativo.turno,
    header: 'Turno',
  },
  {
    accessorFn: (registro) => registro.operativo.lp,
    header: 'Legajo',
  },
  {
    accessorFn: (registro) => new Date(registro.hora).toLocaleTimeString(),
    header: 'Hora',
  },
  {
    accessorFn: (registro) => registro.dominio.toUpperCase(),
    header: 'Dominio',
  },
  {
    accessorFn: (registro) => registro.barrio?.barrio,
    header: 'Barrio',
  },
  {
    accessorFn: (registro) => registro.zona.zona,
    header: 'Zona',
  },
  {
    accessorFn: (registro) => new Date(registro.fechacarga).toLocaleString(),
    header: 'Fecha de carga',
  },
]
