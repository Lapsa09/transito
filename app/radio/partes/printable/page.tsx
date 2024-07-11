import { fetcher } from '@/services'
import { Parte } from '@/types/radio'
import React from 'react'
import ClientPage from './page.client'

const getPartes = async (searchParams: string) => {
  const res = await fetcher(
    `/api/radio/partes/printables${searchParams ? `?${searchParams}` : ''}`,
    {
      cache: 'no-cache',
    },
  )
  const data: Parte[] = await res.json()
  return data
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const data = await getPartes(new URLSearchParams(searchParams).toString())

  return <ClientPage data={data} />
}

export default page
