import { ColumnDef } from '@tanstack/react-table'
import { Registro } from '@/types/motos'
import { DateTime } from 'luxon'
import { turnos } from '@prisma/client'
import { Link } from '@nextui-org/react'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/motos/${row.getValue('id')}`}>Editar</Link>
    ),
  },
  {
    accessorKey: 'id',
    header: 'ID',
    enableColumnFilter: false,
    size: 100,
  },
  {
    header: 'Fecha',
    accessorFn: (row) =>
      row?.operativo?.fecha &&
      DateTime.fromISO(row.operativo.fecha, {
        setZone: true,
      }).toLocaleString(DateTime.DATE_SHORT),
  },
  {
    header: 'Hora',
    accessorFn: ({ operativo }) =>
      operativo?.hora &&
      DateTime.fromISO(operativo.hora, {
        setZone: true,
      }).toLocaleString(DateTime.TIME_24_SIMPLE),
  },
  {
    accessorFn: (row) => row.operativo?.legajo_a_cargo,
    header: 'Legajo a cargo',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.operativo?.legajo_planilla,
    header: 'Legajo planilla',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.operativo?.qth,
    header: 'QTH',
    size: 350,
  },
  {
    accessorFn: (row) => row.operativo?.localidad?.barrio,
    header: 'Barrio',
  },
  {
    accessorFn: (row) => row.operativo?.localidad?.cp,
    header: 'CP',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) =>
      row.operativo?.turno === turnos.MA_ANA ? 'MAÑANA' : row.operativo?.turno,
    header: 'Turno',
  },
  {
    accessorFn: (row) => row.operativo?.seguridad,
    header: 'Seguridad',
    enableColumnFilter: false,
  },
  {
    accessorKey: 'dominio',
    header: 'Dominio',
  },
  {
    accessorKey: 'licencia',
    header: 'Licencia',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.tipo_licencias?.tipo,
    header: 'Tipo de licencia',
  },
  {
    accessorFn: (row) => row.tipo_licencias?.vehiculo,
    header: 'Tipo de vehículo',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.zona_infractor?.barrio,
    header: 'Zona infractor',
  },
  {
    accessorKey: 'resolucion',
    header: 'Resolución',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.motivos.map((m) => m.motivo.motivo).join(', '),
    header: 'Motivos',
  },
  {
    accessorKey: 'acta',
    header: 'Acta',
    enableColumnFilter: false,
  },
]
