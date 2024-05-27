import { Registro } from '@/types/camiones'
import { turnos } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'
import Link from 'next/link'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/camiones/${row.getValue('id')}`}>Editar</Link>
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
    accessorFn: ({ operativo }) =>
      operativo?.fecha &&
      DateTime.fromISO(operativo?.fecha, { setZone: true }).toLocaleString(
        DateTime.DATE_SHORT,
      ),
    id: 'fecha',
    meta: {
      filterVariant: 'date',
    },
  },
  {
    accessorFn: (row) => row.operativo?.legajo,
    header: 'Legajo',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.operativo?.direccion,
    header: 'Direccion',
    id: 'qth',
  },
  {
    accessorFn: (row) => row.operativo?.localidad?.barrio,
    header: 'Localidad',
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
    header: 'Hora',
    accessorFn: ({ hora }) =>
      DateTime.fromISO(hora, { setZone: true }).toLocaleString(
        DateTime.TIME_24_SIMPLE,
      ),
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
    accessorKey: 'origen',
    header: 'Origen',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.localidad_origen?.barrio,
    header: 'Localidad Origen',
    id: 'localidad_origen',
    meta: {
      filterVariant: 'select',
      filterTag: 'zona_infractor',
    },
  },
  {
    accessorKey: 'destino',
    header: 'Destino',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.localidad_destino?.barrio,
    header: 'Localidad Destino',
    id: 'localidad_destino',
    meta: {
      filterVariant: 'select',
      filterTag: 'zona_infractor',
    },
  },
  {
    accessorKey: 'remito',
    header: 'Remito',
    cell: ({ row }) => (row.getValue('remito') ? 'Si' : 'No'),
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorKey: 'carga',
    header: 'Carga',
    cell: ({ row }) => (row.getValue('carga') ? 'Si' : 'No'),
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorKey: 'acta',
    header: 'Acta',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.motivo?.motivo,
    header: 'Motivo',
    id: 'motivo',
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorKey: 'resolucion',
    header: 'Resolucion',
    id: 'resolucion',
    meta: {
      filterVariant: 'select',
    },
  },
]
