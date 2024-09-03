import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Historial } from '@/types/quiz'

export const getColumns = (): ColumnDef<Historial>[] => [
  {
    accessorFn: (row) => `${row.nombre} ${row.apellido}`,
    header: 'Nombre y apellido',
    id: 'nombre',
  },
  {
    accessorFn: (row) => row.dni,
    header: 'DNI',
  },
  {
    accessorFn: (row) => row.tipoExamen,
    header: 'Tipo de examen',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => new Date(row.fecha!).toLocaleDateString(),
    header: 'Fecha',
  },
  {
    accessorFn: (row) => row.nota,
    header: 'Nota',
    enableColumnFilter: false,
  },
  {
    cell: ({ row }) => (
      <Link href={`/admision/examen/historial/${row.original.id}`}>
        Ver examen
      </Link>
    ),
    header: 'Respuestas',
    enableColumnFilter: false,
  },
]
