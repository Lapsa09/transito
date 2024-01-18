'use client'

import { DataTable } from '@/components/table'
import { getPaseo } from '@/services'
import React from 'react'
import useSWR from 'swr'
import { columns } from './columns'
import Loader from '@/components/Loader'

function page() {
  const { data, isLoading } = useSWR('rio', getPaseo)
  if (isLoading) return <Loader />

  return <DataTable columns={columns} data={data!} />
}

export default page
