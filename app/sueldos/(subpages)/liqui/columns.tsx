import CSVDownloadButton from '@/components/CSVDownloadButton'
import { getForExport } from '@/services'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

export const LiquiColumns: ColumnDef<{
  mes: number
  año: number
}>[] = [
  {
    id: 'mes',
    header: () => <span>Mes</span>,
    cell: (info) => info.getValue(),
    accessorFn: (row) => row.mes,
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
