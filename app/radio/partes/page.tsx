import React from 'react'
import ClientPage from './page.client'
import { fetcher } from '@/services'
import { Parte } from '@/types/radio'

const getPartes = async (searchParams: string) => {
  const res = await fetcher(
    `/api/radio/partes${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['radio/partes'],
      },
    },
  )
  const data: { data: Parte[]; pages: number } = await res.json()
  return data
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data, pages } = await getPartes(
    new URLSearchParams(searchParams).toString(),
  )
  return <ClientPage data={data} pages={pages} />
}

export default page
