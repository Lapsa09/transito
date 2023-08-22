'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Registro } from '@/types/autos'
import useSWR from 'swr'
import { getAutos } from '@/services'

function page() {
  const { data, isLoading } = useSWR<Registro[]>('autos', getAutos)

  if (isLoading) return null

  return <DataTable columns={columns} data={data!} />
}

export default page
