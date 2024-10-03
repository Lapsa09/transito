import { Cliente } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const clientesColumns = (): ColumnDef<Cliente>[] => [
  {
    accessorKey: 'cliente',
    header: 'Cliente',
    cell: ({ row, getValue }) => (
      <div
        style={{
          // Since rows are flattened by default,
          // we can use the row.depth property
          // and paddingLeft to visually indicate the depth
          // of the row
          paddingLeft: `${row.depth * 2}rem`,
        }}
      >
        {getValue<string>()}
      </div>
    ),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.a_favor,
    id: 'a_favor',
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    header: 'A Favor',
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.a_deudor,
    id: 'a_deudor',
    header: 'Gastado',
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    footer: (props) => props.column.id,
  },
  {
    id: 'historial',
    cell: ({ row }) => (
      <Link href={`/sueldos/clientes/${row.original.idCliente}`}>
        Historial
      </Link>
    ),
  },
]
