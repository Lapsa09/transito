import React from 'react'
import PageClient from './page.client'
import { fetcher } from '@/services'
import { Repuesto } from '@/types/logistica'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const getAutos = async (searchParams: string) => {
  const res = await fetcher(
    `api/logistica/repuestos${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'repuestos'],
        revalidate: 3600 * 24,
      },
    },
  )
  const data: { data: Repuesto[]; pages: number } = await res.json()
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
