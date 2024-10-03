import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Operario } from '@/types/operarios.sueldos'
import Link from 'next/link'

export const operarioColumns = (): ColumnDef<Operario>[] => [
  {
    id: 'expander',
    cell: ({ row }) => {
      return (
        row.getCanExpand() && (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
          >
            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
          </button>
        )
      )
    },
  },
  {
    accessorFn: (row) => row.legajo,
    id: 'legajo',
    header: () => <span>Legajo</span>,
    cell: ({ getValue }) => getValue<number>(),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.nombre,
    id: 'nombre',
    header: () => <span>Nombre</span>,
    cell: ({ getValue }) => getValue<string>(),
    footer: (props) => props.column.id,
  },
  {
    id: 'servicios',
    cell: ({ row }) => (
      <Link href={`/sueldos/servicios?operario=${row.original.legajo}`}>
        Servicios
      </Link>
    ),
  },
]
