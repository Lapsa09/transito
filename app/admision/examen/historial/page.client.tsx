'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Historial } from '@/types/quiz'

function page({ data, pages }: { data: Historial[]; pages: number }) {
  return <DataTable columns={columns} data={data} pageCount={pages} />
}

export default page
