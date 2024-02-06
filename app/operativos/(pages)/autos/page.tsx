'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Registro } from '@/types/autos'
import useSWR from 'swr'
import { getter } from '@/services'
import Loader from '@/components/Loader'
import { useSearchParams } from 'next/navigation'

function page() {
  const queryParams = useSearchParams()
  const { data, isLoading } = useSWR<{ data: Registro[]; pages: number }>(
    { route: `operativos/autos?${queryParams.toString()}` },
    getter,
  )

  if (isLoading) return <Loader />

  return (
    <DataTable
      columns={columns}
      data={data?.data}
      pageCount={data?.pages}
      manualPagination
    />
  )
}

export default page
