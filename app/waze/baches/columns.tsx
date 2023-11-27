import { CustomRepararBacheButton } from '@/components/CustomLinks'
import { Button } from '@/components/ui'
import { baches } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<baches>[] = [
  {
    accessorKey: 'id',
  },
  {
    accessorKey: 'fecha',
  },
  {
    accessorKey: 'qth',
  },
  {
    accessorKey: 'latitud',
  },
  {
    accessorKey: 'longitud',
  },
  {
    accessorFn: (row) => (row.reparado ? 'SI' : 'NO'),
    header: 'Reparado',
  },
  {
    accessorKey: 'fecha_reparacion',
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      row.original.reparado && (
        <CustomRepararBacheButton id={row.original.id.toString()} />
      ),
  },
]
