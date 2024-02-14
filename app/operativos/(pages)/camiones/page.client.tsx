'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Registro } from '@/types/camiones'

function page({ data, pages }: { data: Registro[]; pages: number }) {
  return <DataTable columns={columns} data={data} pageCount={pages} />
}

export default page
