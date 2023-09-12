import { Registro } from '@/types/rio'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'
import Link from 'next/link'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/edit/rio/${row.getValue('id')}`}>Editar</Link>
    ),
  },
  {
    cell: ({ getValue }) =>
      DateTime.fromISO(getValue<string>(), {
        setZone: true,
      }).toLocaleString(DateTime.DATE_SHORT),
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
    cell: ({ getValue }) =>
      DateTime.fromISO(getValue<string>(), {
        setZone: true,
      }).toLocaleString(DateTime.TIME_24_SIMPLE),
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
    cell: ({ getValue }) =>
      DateTime.fromISO(getValue<string>(), {
        setZone: true,
      }).toLocaleString(DateTime.DATETIME_SHORT),
    header: 'Fecha de carga',
  },
]
