'use client'

import { DataTable } from '@/components/table'
import { getter } from '@/services'
import { baches } from '@prisma/client'
import React from 'react'
import useSWR from 'swr'
import { columns } from './columns'

function page() {
  const { data, isLoading } = useSWR<baches[]>(
    { route: '/waze/baches' },
    getter,
  )
  if (isLoading) return null
  return <DataTable data={data} columns={columns} />
}

export default page
