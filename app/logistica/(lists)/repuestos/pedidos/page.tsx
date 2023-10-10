'use client'

import { DataTable } from '@/components/table'
import { getter } from '@/services'
import { PedidoRepuesto } from '@/types/logistica'
import React from 'react'
import useSWR from 'swr'
import { columns } from './columns'
import { Repuestos } from './expansions'

function page() {
  const { data, isLoading } = useSWR<PedidoRepuesto[]>(
    { route: 'logistica/repuestos/pedidos' },
    getter,
  )

  if (isLoading) return null
  return (
    <div>
      <h1 className="mb-5 text-center">Historial de pedidos de repuestos</h1>
      <DataTable data={data} columns={columns} expand={Repuestos} />
    </div>
  )
}

export default page
