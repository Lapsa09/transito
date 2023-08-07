import { Registro } from '@/types/autos'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/edit/autos/${row.getValue('id')}`}>Editar</Link>
    ),
  },
  {
    accessorFn: (row) => row.id,
    id: 'id',
  },
  {
    accessorFn: (row) => row.operativo?.fecha,
    id: 'fecha',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
  {
    accessorFn: (row) => row.operativo?.hora,
    id: 'hora',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleTimeString(),
  },
  {
    accessorFn: (row) => row.operativo?.qth?.toLocaleUpperCase(),
    id: 'qth',
    size: 450,
  },
  {
    accessorFn: (row) => row.operativo?.localidad?.barrio,
    id: 'localidad',
  },
  {
    accessorFn: (row) => row.operativo?.localidad?.cp,
    id: 'cp',
  },
  {
    accessorFn: (row) => row.operativo?.turno,
    id: 'turno',
  },
  {
    accessorFn: (row) => row.operativo?.seguridad,
    id: 'seguridad',
  },
  {
    accessorFn: (row) => row.dominio?.toLocaleUpperCase(),
    id: 'dominio',
  },
  {
    accessorFn: (row) => row.licencia,
    id: 'licencia',
  },
  {
    accessorFn: (row) => row.tipo_licencia?.tipo,
    id: 'tipo_licencia',
  },
  {
    accessorFn: (row) => row.tipo_licencia?.vehiculo,
    id: 'tipo_vehiculo',
  },
  {
    accessorFn: (row) => row.graduacion_alcoholica,
    id: 'graduacion_alcoholica',
  },
  {
    accessorFn: (row) => row.resultado,
    id: 'resultado_alcoholemia',
  },
  {
    accessorFn: (row) => row.zona_infractor?.barrio,
    id: 'zona_infractor',
  },
  {
    accessorFn: (row) => row.es_del,
    id: 'vecino',
    cell: ({ getValue }) => (getValue() === 'VILO' ? 'SI' : 'NO'),
  },
  {
    accessorFn: (row) => row.resolucion,
    id: 'resolucion',
  },
  {
    accessorFn: (row) => row.acta,
    id: 'acta',
  },
  {
    accessorFn: (row) => row.motivo?.motivo,
    id: 'motivo',
  },
  {
    accessorFn: (row) => row.operativo?.direccion_full?.toLocaleUpperCase(),
    id: 'direccion_full',
    size: 800,
  },
  {
    accessorFn: (row) => row.operativo?.latitud,
    id: 'latitud',
  },
  {
    accessorFn: (row) => row.operativo?.longitud,
    id: 'longitud',
  },
]
