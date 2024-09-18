import React from 'react'
import { fetcher } from '@/services'
import { PedidosDTO } from '@/DTO/logistica/pedidos'
import { PedidosTable } from './table'

const getAutos = async (searchParams: string) => {
  const res = await fetcher(
    `api/logistica/repuestos/pedidos${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'repuestos', 'pedidos'],
        revalidate: 3600 * 24,
      },
    },
  )
  const data: { data: PedidosDTO[]; pages: number } = await res.json()
  return data
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const data = await getAutos(new URLSearchParams(searchParams).toString())

  return <PedidosTable tasks={data} />
}

export default page
