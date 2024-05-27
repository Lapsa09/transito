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
    meta: {
      filterVariant: 'date',
    },
  },
  {
    header: 'Hora',
    accessorFn: ({ operativo }) =>
      operativo?.hora &&
      DateTime.fromISO(operativo.hora, {
        setZone: true,
      }).toLocaleString(DateTime.TIME_24_SIMPLE),
    meta: {
      filterVariant: 'time',
    },
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
    id: 'localidad',
    meta: {
      filterVariant: 'select',
    },
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
    id: 'turno',
    meta: {
      filterVariant: 'select',
    },
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
    id: 'tipo_licencia',
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorFn: (row) => row.tipo_licencias?.vehiculo,
    header: 'Tipo de vehículo',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.zona_infractor?.barrio,
    header: 'Zona infractor',
    id: 'zona_infractor',
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorKey: 'resolucion',
    header: 'Resolución',
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorFn: (row) => row.motivos.map((m) => m.motivo.motivo).join(', '),
    header: 'Motivos',
    id: 'motivo',
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorKey: 'acta',
    header: 'Acta',
    enableColumnFilter: false,
  },
]
