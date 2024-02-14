'use client'

import { DataTable } from '@/components/table'
import React from 'react'
import { columns } from './columns'
import { Registro } from '@/types/rio'

function page({ data, pages }: { data: Registro[]; pages: number }) {
  return <DataTable columns={columns} data={data} pageCount={pages} />
}

export default page
