'use client'
import React from 'react'
import useSWR from 'swr'
import { DataTable } from '@/components/table'
import Loader from '@/components/Loader'
import { getCamiones } from '@/services'
import { columns } from './columns'

function page() {
  const { data, isLoading } = useSWR('camiones', getCamiones)

  if (isLoading) return <Loader />
  return <DataTable columns={columns} data={data!} />
}

export default page
