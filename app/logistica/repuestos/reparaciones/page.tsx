import React from 'react'
import PageClient from './page.client'
import { fetcher } from '@/services'
import { Reparacion } from '@/types/logistica'

const getAutos = async (searchParams: string) => {
  const res = await fetcher(
    `api/logistica/repuestos/reparaciones${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'repuestos', 'reparaciones'],
        revalidate: 3600 * 24,
      },
    },
  )
  const data: { data: Reparacion[]; pages: number } = await res.json()
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
