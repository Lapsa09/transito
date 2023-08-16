'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Registro } from '@/types/autos'
import useSWR from 'swr'

function ClientTable({ data }: { data: Registro[] }) {
  const { data: posts } = useSWR<Registro[]>('autos', () => data, {
    fallbackData: data,
  })

  return <DataTable columns={columns} data={posts!} />
}

export default ClientTable
