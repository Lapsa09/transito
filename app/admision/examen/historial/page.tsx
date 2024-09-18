import { fetcher } from '@/services'
import React from 'react'
import PageClient from './table'
import { Historial } from '@/types/quiz'
import { IndexPageProps } from '@/types/data-table'

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

async function page({ searchParams }: IndexPageProps) {
  const { data, pages } = await getExamenes(
    new URLSearchParams(searchParams).toString(),
  )
  return <PageClient data={data} pages={pages} />
}

export default page
