import { Registro } from '@/types/rio'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'
import Link from 'next/link'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/rio/${row.getValue('id')}`}>Editar</Link>
    ),
  },
  {
    id: 'id',
    accessorFn: (registro) => registro.id,
    enableColumnFilter: false,
    size: 100,
  },
  {
    accessorFn: ({ operativo: { fecha } }) =>
      DateTime.fromISO(fecha, {
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
    enableColumnFilter: false,
  },
  {
    accessorFn: ({ hora }) =>
      DateTime.fromISO(hora, {
        setZone: true,
      }).toLocaleString(DateTime.TIME_24_SIMPLE),
    header: 'Hora',
    enableColumnFilter: false,
  },
  {
    accessorFn: (registro) => registro.dominio?.toUpperCase(),
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
    accessorFn: ({ fechacarga }) => {
      const sql = DateTime.fromSQL(fechacarga, {
        setZone: true,
      })

      if (sql.isValid) {
        return sql.toLocaleString(DateTime.DATETIME_SHORT)
      } else {
        return DateTime.fromFormat(fechacarga, 'F').toLocaleString(
          DateTime.DATETIME_SHORT,
        )
      }
    },
    header: 'Fecha de carga',
  },
]
