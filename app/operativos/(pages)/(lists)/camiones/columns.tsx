import { Registro } from '@/types/camiones'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/edit/camiones/${row.getValue('id')}`}>
        Editar
      </Link>
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
    id: 'fecha',
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
    accessorFn: (row) => row.operativo?.legajo,
    header: 'Legajo',
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
  },
  {
    accessorFn: (row) => row.operativo?.turno,
    header: 'Turno',
  },
  {
    accessorKey: 'hora',
    header: 'Hora',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleTimeString(),
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
    accessorKey: 'origen',
    header: 'Origen',
  },
  {
    accessorFn: (row) => row.localidad_origen?.barrio,
    header: 'Localidad Origen',
  },
  {
    accessorKey: 'destino',
    header: 'Destino',
  },
  {
    accessorFn: (row) => row.localidad_destino?.barrio,
    header: 'Localidad Destino',
  },
  {
    accessorKey: 'remito',
    header: 'Remito',
    cell: ({ row }) => (row.getValue('remito') ? 'Si' : 'No'),
  },
  {
    accessorKey: 'carga',
    header: 'Carga',
    cell: ({ row }) => (row.getValue('carga') ? 'Si' : 'No'),
  },
  {
    accessorKey: 'acta',
    header: 'Acta',
  },
  {
    accessorFn: (row) => row.motivo?.motivo,
    header: 'Motivo',
  },
  {
    accessorKey: 'resolucion',
    header: 'Resolucion',
  },
]
