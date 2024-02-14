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
  },
  {
    accessorFn: (row) => row.operativo?.legajo,
    header: 'Legajo',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.operativo?.direccion,
    header: 'Direccion',
  },
  {
    accessorFn: (row) => row.operativo?.localidad?.barrio,
    header: 'Localidad',
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
  },
  {
    accessorKey: 'destino',
    header: 'Destino',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.localidad_destino?.barrio,
    header: 'Localidad Destino',
  },
  {
    accessorKey: 'remito',
    header: 'Remito',
    cell: ({ row }) => (row.getValue('remito') ? 'Si' : 'No'),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'carga',
    header: 'Carga',
    cell: ({ row }) => (row.getValue('carga') ? 'Si' : 'No'),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'acta',
    header: 'Acta',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.motivo?.motivo,
    header: 'Motivo',
    enableColumnFilter: false,
  },
  {
    accessorKey: 'resolucion',
    header: 'Resolucion',
    enableColumnFilter: false,
  },
]
