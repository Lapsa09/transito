'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Registro } from '@/types/motos'
import useSWR from 'swr'
import { getMotos } from '@/services'

function ClientTable() {
  const { data, isLoading } = useSWR<Registro[]>('motos', getMotos)

  if (isLoading) return null

  return <DataTable columns={columns} data={data!} />
}

export default ClientTable
