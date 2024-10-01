import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Historial } from '@/types/quiz'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

export const getColumns = (): ColumnDef<Historial>[] => [
  {
    accessorFn: (row) => `${row.nombre} ${row.apellido}`.toUpperCase(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre y apellido" />
    ),
    id: 'nombre',
    size: 300,
  },
  {
    accessorFn: (row) => row.dni,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DNI" />
    ),
    id: 'dni',
  },
  {
    accessorFn: (row) => row.tipoExamen,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo Examen" />
    ),
    id: 'tipoExamen',
    enableColumnFilter: false,
    size: 300,
  },
  {
    accessorFn: (row) =>
      new Date(row.fecha!).toLocaleDateString('utc', {
        timeZone: 'UTC',
      }),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    id: 'fecha',
  },
  {
    accessorFn: (row) => row.nota,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nota" />
    ),
    enableColumnFilter: false,
    id: 'nota',
  },
  {
    cell: ({ row }) => (
      <Link href={`/admision/examen/historial/${row.original.id}`}>
        Ver examen
      </Link>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Respuestas" />
    ),
    enableColumnFilter: false,
    id: 'actions',
  },
]
