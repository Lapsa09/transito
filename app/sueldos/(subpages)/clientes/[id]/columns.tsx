import { Historial, Meses } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const historialColumns = (): ColumnDef<Historial>[] => [
  {
    id: 'expander',
    header: () => null,
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
    accessorFn: (row) => Meses[row.mes as keyof typeof Meses],
    header: 'Mes',
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.año,
    id: 'año',
    cell: (info) => info.getValue(),
    header: 'Año',
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.gastos,
    id: 'gastos',
    header: 'Gastos',
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.acopio,
    id: 'acopio',
    header: 'Acopio',
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    footer: (props) => props.column.id,
  },
  {
    id: 'servicios',
    cell: ({ row }) => (
      <Link
        href={`/sueldos/servicios?mes=${row.original.mes}&año=${row.original.año}`}
      >
        Servicios
      </Link>
    ),
  },
]
