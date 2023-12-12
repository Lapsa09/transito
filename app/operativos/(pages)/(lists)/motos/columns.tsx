import { ColumnDef } from '@tanstack/react-table'
import { Registro } from '@/types/motos'
import { DateTime } from 'luxon'
import { turnos } from '@prisma/client'
import { Link } from '@nextui-org/react'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/edit/motos/${row.getValue('id')}`}>Editar</Link>
    ),
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    header: 'Fecha',
    accessorFn: ({ operativo: { fecha } }) =>
      DateTime.fromISO(fecha, {
        setZone: true,
      }).toLocaleString(DateTime.DATE_SHORT),
  },
  {
    header: 'Hora',
    accessorFn: ({ operativo: { hora } }) =>
      DateTime.fromISO(hora, {
        setZone: true,
      }).toLocaleString(DateTime.TIME_24_SIMPLE),
  },
  {
    accessorFn: (row) => row.operativo?.legajo_a_cargo,
    header: 'Legajo a cargo',
  },
  {
    accessorFn: (row) => row.operativo?.legajo_planilla,
    header: 'Legajo planilla',
  },
  {
    accessorFn: (row) => row.operativo?.qth,
    header: 'QTH',
  },
  {
    accessorFn: (row) => row.operativo?.localidad?.barrio,
    header: 'Barrio',
  },
  {
    accessorFn: (row) => row.operativo?.localidad?.cp,
    header: 'CP',
  },
  {
    accessorFn: (row) =>
      row.operativo?.turno === turnos.MA_ANA ? 'MAÑANA' : row.operativo?.turno,
    header: 'Turno',
  },
  {
    accessorFn: (row) => row.operativo?.seguridad,
    header: 'Seguridad',
  },
  {
    accessorKey: 'dominio',
    header: 'Dominio',
  },
  {
    accessorKey: 'licencia',
    header: 'Licencia',
  },
  {
    accessorFn: (row) => row.tipo_licencias?.tipo,
    header: 'Tipo de licencia',
  },
  {
    accessorFn: (row) => row.tipo_licencias?.vehiculo,
    header: 'Tipo de vehículo',
  },
  {
    accessorFn: (row) => row.zona_infractor?.barrio,
    header: 'Zona infractor',
  },
  {
    accessorKey: 'resolucion',
    header: 'Resolución',
  },
  {
    accessorFn: (row) => row.motivos.map((m) => m.motivo).join(', '),
    header: 'Motivos',
  },
  {
    accessorKey: 'acta',
    header: 'Acta',
  },
]
