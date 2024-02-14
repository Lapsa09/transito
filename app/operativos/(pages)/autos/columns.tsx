import { Registro } from '@/types/autos'
import { turnos } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'
import Link from 'next/link'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/autos/${row.getValue('id')}`}>Editar</Link>
    ),
    size: 100,
  },
  {
    accessorFn: (row) => row.id,
    id: 'id',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) =>
      row.operativo?.fecha &&
      DateTime.fromISO(row.operativo.fecha, { setZone: true }).toLocaleString(
        DateTime.DATE_SHORT,
      ),
    id: 'fecha',
    header: 'Fecha',
  },
  {
    accessorFn: (row) =>
      row.operativo?.hora &&
      DateTime.fromISO(row.operativo.hora, { setZone: true }).toLocaleString(
        DateTime.TIME_24_SIMPLE,
      ),
    id: 'hora',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.operativo?.qth?.toLocaleUpperCase(),
    id: 'qth',
    size: 300,
  },
  {
    accessorFn: (row) => row.operativo?.localidad?.barrio,
    id: 'localidad',
  },
  {
    accessorFn: (row) => row.operativo?.localidad?.cp,
    id: 'cp',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) =>
      row.operativo?.turno === turnos.MA_ANA ? 'MAÑANA' : row.operativo?.turno,
    id: 'turno',
  },
  {
    accessorFn: (row) => row.operativo?.seguridad,
    id: 'seguridad',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.dominio?.toLocaleUpperCase(),
    id: 'dominio',
  },
  {
    accessorFn: (row) => row.licencia,
    id: 'licencia',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.tipo_licencia?.tipo,
    id: 'tipo_licencia',
  },
  {
    accessorFn: (row) => row.tipo_licencia?.vehiculo,
    id: 'tipo_vehiculo',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.graduacion_alcoholica,
    id: 'graduacion_alcoholica',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.resultado,
    id: 'resultado_alcoholemia',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.zona_infractor?.barrio,
    id: 'zona_infractor',
  },
  {
    accessorFn: (row) => row.es_del,
    id: 'vecino',
    cell: ({ getValue }) => (getValue() === 'VILO' ? 'SI' : 'NO'),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.resolucion,
    id: 'resolucion',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.acta,
    id: 'acta',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.motivo?.motivo,
    id: 'motivo',
    size: 400,
  },
  {
    accessorFn: (row) => row.operativo?.direccion_full?.toLocaleUpperCase(),
    id: 'direccion_full',
    size: 800,
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.operativo?.latitud,
    id: 'latitud',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.operativo?.longitud,
    id: 'longitud',
    enableColumnFilter: false,
  },
]
