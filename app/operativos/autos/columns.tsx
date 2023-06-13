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
    accessorFn: (row) => row.operativos?.fecha,
    id: 'fecha',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
  {
    accessorFn: (row) => row.operativos?.hora,
    id: 'hora',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleTimeString(),
  },
  {
    accessorFn: (row) => row.operativos?.qth,
    id: 'qth',
    size: 450,
  },
  {
    accessorFn: (row) => row.operativos?.localidad?.barrio,
    id: 'localidad',
  },
  {
    accessorFn: (row) => row.operativos?.localidad?.cp,
    id: 'cp',
  },
  {
    accessorFn: (row) => row.operativos?.turno,
    id: 'turno',
  },
  {
    accessorFn: (row) => row.operativos?.seguridad,
    id: 'seguridad',
  },
  {
    accessorFn: (row) => row.dominio,
    id: 'dominio',
  },
  {
    accessorFn: (row) => row.licencia,
    id: 'licencia',
  },
  {
    accessorFn: (row) => row.tipo_licencias?.tipo,
    id: 'tipo_licencia',
  },
  {
    accessorFn: (row) => row.tipo_licencias?.vehiculo,
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
    id: 'es_del',
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
    accessorFn: (row) => row.motivos?.motivo,
    id: 'motivo',
  },
  {
    accessorFn: (row) => row.operativos?.direccion_full,
    id: 'direccion_full',
    size: 800,
  },
  {
    accessorFn: (row) => row.operativos?.latitud,
    id: 'latitud',
  },
  {
    accessorFn: (row) => row.operativos?.longitud,
    id: 'longitud',
  },
]
