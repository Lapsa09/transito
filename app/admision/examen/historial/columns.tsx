import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Historial } from '@/types/quiz'

export const columns: ColumnDef<Historial>[] = [
  {
    accessorFn: (row) => `${row.usuario.nombre} ${row.usuario.apellido}`,
    header: 'Nombre y apellido',
    id: 'nombre',
  },
  {
    accessorFn: (row) => row.usuario.dni,
    header: 'DNI',
  },
  {
    accessorFn: (row) => row.tipo_examen.tipo,
    header: 'Tipo de examen',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => new Date(row.examen.fecha!).toLocaleDateString(),
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
