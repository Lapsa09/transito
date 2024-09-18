import React from 'react'
import { fetcher } from '@/services'
import { IndexPageProps, SearchParams } from '@/types/data-table'
import { CamionesDTO } from '@/DTO/operativos/camiones'
import { Filter } from '@/DTO/filters'
import { CamionesTable } from './table'

const getCamiones = async (searchParams: SearchParams) => {
  const params = new URLSearchParams(searchParams)

  const res = await fetcher(
    `api/operativos/camiones${params ? `?${params.toString()}` : ''}`,
    {
      next: {
        tags: ['camiones'],
      },
    },
  )
  const data: { data: CamionesDTO[]; pages: number } = await res.json()
  return data
}

const getFilters = async () => {
  const res = await fetcher('api/filters', {
    next: {
      tags: ['filters'],
    },
  })
  const data: Filter = await res.json()
  return data
}

async function page({ searchParams }: IndexPageProps) {
  const tasks = await getCamiones(searchParams)
  const filters = await getFilters()

  return <CamionesTable tasks={tasks} filters={filters} />
}

export default page
