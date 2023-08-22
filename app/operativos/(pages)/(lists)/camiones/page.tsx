'use client'

import React from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Registro } from '@/types/camiones'
import useSWR from 'swr'
import { getCamiones } from '@/services'

function ClientTable() {
  const { data, isLoading } = useSWR<Registro[]>('camiones', getCamiones)

  if (isLoading) return null

  return <DataTable columns={columns} data={data!} />
}

export default ClientTable
