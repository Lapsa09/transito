import React from 'react'
import PageClient from './page.client'
import { Registro } from '@/types/autos'
import { fetcher } from '@/services'

const getAutos = async (searchParams: string) => {
  const res = await fetcher(
    `api/operativos/autos${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['operativos', 'autos'],
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
  const { data, pages } = await getAutos(
    new URLSearchParams(searchParams).toString(),
  )

  return <PageClient data={data} pages={pages} />
}

export default page
