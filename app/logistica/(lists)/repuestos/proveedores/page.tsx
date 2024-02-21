import React from 'react'
import PageClient from './page.client'
import { fetcher } from '@/services'
import { proveedor } from '@prisma/client'

const getAutos = async (searchParams: string) => {
  const res = await fetcher(
    `api/logistica/repuestos/proveedores${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'repuestos', 'proveedores'],
      },
    },
  )
  const data: { data: proveedor[]; pages: number } = await res.json()
  return data
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data, pages } = await getAutos(
    new URLSearchParams(searchParams).toString(),
  )

  return <PageClient data={data} pages={pages} />
}

export default page
