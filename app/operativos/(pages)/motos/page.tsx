import React from 'react'
import PageClient from './page.client'
import { Registro } from '@/types/motos'
import { fetcher } from '@/services'

const getMotos = async (searchParams: string) => {
  const res = await fetcher(
    `/api/operativos/motos${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['operativos', 'motos'],
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
  const { data, pages } = await getMotos(
    new URLSearchParams(searchParams).toString(),
  )
  return <PageClient data={data} pages={pages} />
}

export default page
