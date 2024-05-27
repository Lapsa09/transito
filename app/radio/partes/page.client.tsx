'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import type { Parte } from '@/types/radio'

function ClientPage({ data, pages }: { data: Parte[]; pages: number }) {
  return <DataTable columns={columns} data={data} pageCount={pages} />
}

export default ClientPage
