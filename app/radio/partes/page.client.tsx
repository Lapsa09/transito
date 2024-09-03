'use client'

import React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { getColumns } from './columns'
import type { Parte } from '@/types/radio'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useDataTable } from '@/hooks/use-data-table'

function ClientPage({ data, pages }: { data: Parte[]; pages: number }) {
  const params = useSearchParams()
  const columns = React.useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pages,
    // optional props
    defaultPerPage: 10,
    defaultSort: 'id.desc',
  })

  return (
    <div>
      <Link
        target="popup"
        href={'/radio/partes/printable?' + params.toString()}
      >
        Imprimir partes del dia
      </Link>
      <DataTable table={table} />
    </div>
  )
}

export default ClientPage
