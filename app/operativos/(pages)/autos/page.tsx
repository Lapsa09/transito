'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Registro } from '@/types/autos'
import useSWR from 'swr'
import { getAutos } from '@/services'
import Loader from '@/components/Loader'

function page() {
  const { data, isLoading } = useSWR<Registro[]>('autos', getAutos)

  if (isLoading) return <Loader />

  return <DataTable columns={columns} data={data} />
}

export default page
