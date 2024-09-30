import { fetcher } from '@/services'
import React from 'react'
import PageClient from './table'
import { Historial } from '@/types/quiz'
import { IndexPageProps, SearchParams } from '@/types/data-table'

const getExamenes = async (searchParams: SearchParams) => {
  const params = new URLSearchParams(searchParams)
  const response = await fetcher(
    `/api/admision/examen/historial${params ? `?${params.toString()}` : ''}`,
    {
      cache: 'no-store',
    },
  )
  const examenes: { data: Historial[]; pages: number } = await response.json()
  return examenes
}

async function page({ searchParams }: IndexPageProps) {
  const { data, pages } = await getExamenes(searchParams)
  return <PageClient data={data} pages={pages} />
}

export default page
