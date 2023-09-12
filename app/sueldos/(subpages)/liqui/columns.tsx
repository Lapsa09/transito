import CSVDownloadButton from '@/components/CSVDownloadButton'
import { getForExport } from '@/services'
import { Meses } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

export const LiquiColumns: ColumnDef<{
  mes: number
  año: number
}>[] = [
  {
    id: 'mes',
    header: () => <span>Mes</span>,
    accessorFn: (row) => Meses[row.mes as keyof typeof Meses],
  },
  {
    id: 'año',
    header: () => <span>Año</span>,
    cell: (info) => info.getValue(),
    accessorFn: (row) => row.año,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <CSVDownloadButton
        fetcher={async () =>
          await getForExport({
            mes: row.original.mes,
            año: row.original.año,
          })
        }
      >
        Exportar
      </CSVDownloadButton>
    ),
  },
]
