import React from 'react'
import { fetcher } from '@/services'
import { proveedor } from '@/drizzle/schema/logistica'
import { ProveedoresTable } from './table'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const getAutos = async (searchParams: string) => {
  const res = await fetcher(
    `api/logistica/repuestos/proveedores${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'repuestos', 'proveedores'],
        revalidate: 3600 * 24,
      },
    },
  )
  const data: { data: (typeof proveedor.$inferSelect)[]; pages: number } =
    await res.json()
  return data
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const data = await getAutos(new URLSearchParams(searchParams).toString())

  return <ProveedoresTable tasks={data} />
}

export default page
