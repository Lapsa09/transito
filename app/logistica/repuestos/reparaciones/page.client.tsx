'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Reparacion } from '@/types/logistica'
import { useRouter } from 'next/navigation'

function page({ data, pages }: { data: Reparacion[]; pages: number }) {
  const router = useRouter()
  return (
    <div>
      <h1 className="text-center mb-5 capitalize">Reparaciones totales</h1>
      <h1 className="cursor-pointer w-fit" onClick={router.back}>
        Atras
      </h1>

      <DataTable
        enableColumnFilters={false}
        enableFilters={false}
        enableSorting={false}
        columns={columns}
        data={data}
        pageCount={pages}
      />
    </div>
  )
}

export default page
