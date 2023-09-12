import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Registro } from '@/types/motos'

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
    accessorFn: (row) => row.operativo?.fecha,
    header: 'Fecha',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    sortingFn: (a, b) => {
      const dateA = new Date(a.original.operativo?.fecha!)
      const dateB = new Date(b.original.operativo?.fecha!)

      if (dateA > dateB) {
        return 1
      }
      if (dateA < dateB) {
        return -1
      }
      return 0
    },
  },
  {
    accessorFn: (row) => row.operativo?.hora,
    header: 'Hora',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleTimeString(),
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
    accessorFn: (row) => row.operativo?.turno,
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
    accessorFn: (row) => row.barrio?.barrio,
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
