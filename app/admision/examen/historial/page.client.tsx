'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Examen } from './page'

function page({ data, pages }: { data: Examen[]; pages: number }) {
  return <DataTable columns={columns} data={data} pageCount={pages} />
}

export default page
