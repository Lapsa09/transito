'use client'

import React, { useEffect } from 'react'
import { DataTable } from '@/components/table'
import { columns } from './columns'
import { Registro } from '@/types/motos'
import { mutate } from 'swr'

function ClientTable({ data }: { data: Registro[] }) {
  useEffect(() => {
    mutate('motos', data)
  }, [])
  return <DataTable columns={columns} data={data} />
}

export default ClientTable
