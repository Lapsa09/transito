'use client'

import { DataTable } from '@/components/table'
import { getter } from '@/services'
import React from 'react'
import useSWR from 'swr'
import { columns } from './columns'
import { proveedor } from '@prisma/client'

function page() {
  const { data, isLoading } = useSWR<proveedor[]>(
    { route: '/logistica/repuestos/proveedores' },
    getter,
  )

  if (isLoading) return null
  return (
    <div>
      <h1 className="mb-5 text-center">Lista de proveedores</h1>
      <DataTable data={data} columns={columns} />
    </div>
  )
}

export default page
