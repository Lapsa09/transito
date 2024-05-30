import { fetcher } from '@/services'
import { examen, rinde_examen, tipo_examen } from '@prisma/client'
import React from 'react'
import PageClient from './page.client'

export type Examen = rinde_examen & {
  tipo_examen: tipo_examen
  examen: examen
}

const getExamenes = async (searchParams: string) => {
  const response = await fetcher(
    `/api/admision/examen/historial${searchParams ? `?${searchParams}` : ''}`,
    {
      cache: 'no-store',
    },
  )
  const examenes: { data: Examen[]; pages: number } = await response.json()
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
