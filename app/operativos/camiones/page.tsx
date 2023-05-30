'use client'
import React from 'react'
import useSWR from 'swr'
import { DataTable } from '@/components'
import { getCamiones } from '@/services'
import { columns } from './columns'

function page() {
  const { data, isLoading } = useSWR('Camiones', getCamiones)

  if (isLoading) return <p>Loading</p>
  return <DataTable columns={columns} data={data!} />
}

export default page
