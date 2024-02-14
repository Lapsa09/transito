import { Registro } from '@/types/camiones'
import PageClient from './page.client'
import React from 'react'
import { fetcher } from '@/services'

const getCamiones = async (searchParams: string) => {
  const res = await fetcher(
    `/api/operativos/camiones${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['operativos', 'camiones'],
      },
    },
  )
  const data: { data: Registro[]; pages: number } = await res.json()
  return data
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data, pages } = await getCamiones(
    new URLSearchParams(searchParams).toString(),
  )
  return <PageClient data={data} pages={pages} />
}

export default page
