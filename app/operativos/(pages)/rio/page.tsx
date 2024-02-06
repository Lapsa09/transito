'use client'

import { DataTable } from '@/components/table'
import { getter } from '@/services'
import React from 'react'
import useSWR from 'swr'
import { columns } from './columns'
import Loader from '@/components/Loader'
import { useSearchParams } from 'next/navigation'
import { Registro } from '@/types/rio'

function page() {
  const queryParams = useSearchParams()
  const { data, isLoading } = useSWR<{ data: Registro[]; pages: number }>(
    { route: `operativos/rio?${queryParams.toString()}` },
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
