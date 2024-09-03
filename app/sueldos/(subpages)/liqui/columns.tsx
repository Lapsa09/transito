import { Button } from '@/components/ui/button'
import { getForExport } from '@/services'
import { Meses } from '@/types'
import { exporter } from '@/utils/csvExport'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

export const liquiColumns = (): ColumnDef<{
  mes: number
  año: number
}>[] => [
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
      <Button
        onClick={async () =>
          exporter(
            await getForExport({
              mes: row.original.mes,
              año: row.original.año,
            }),
          )
        }
      >
        Exportar
      </Button>
    ),
  },
]
