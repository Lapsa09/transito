'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import type { Parte } from '@/types/radio'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ClientPage({ data, pages }: { data: Parte[]; pages: number }) {
  const params = useSearchParams()
  return (
    <div>
      <Link
        target="popup"
        href={'/radio/partes/printable?' + params.toString()}
      >
        Imprimir partes del dia
      </Link>
      <DataTable columns={columns} data={data} pageCount={pages} />
    </div>
  )
}

export default ClientPage
