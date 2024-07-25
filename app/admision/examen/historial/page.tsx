import { fetcher } from '@/services'
import React from 'react'
import PageClient from './page.client'
import { Historial } from '@/types/quiz'

const getExamenes = async (searchParams: string) => {
  const response = await fetcher(
    `/api/admision/examen/historial${searchParams ? `?${searchParams}` : ''}`,
    {
      cache: 'no-store',
    },
  )
  const examenes: { data: Historial[]; pages: number } = await response.json()
  return examenes
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data, pages } = await getExamenes(
    new URLSearchParams(searchParams).toString(),
  )
  return <PageClient data={data} pages={pages} />
}

export default page
