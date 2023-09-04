'use client'
import { getExportables } from '@/services'
import React from 'react'
import { DataTable } from '@/components/table'
import { LiquiColumns } from './columns'
import useSWR from 'swr'

function page() {
  const { data, isLoading } = useSWR('liqui', getExportables)

  if (isLoading) return null

  return <DataTable columns={LiquiColumns} data={data} />
}

export default page
