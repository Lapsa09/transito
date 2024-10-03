import React from 'react'
import { fetcher } from '@/services'
import { IndexPageProps, SearchParams } from '@/types/data-table'
import { AutosTable } from './table'
import { Filter } from '@/DTO/filters'
import { AutosDTO } from '@/DTO/operativos/autos'

const getAutos = async (searchParams: SearchParams) => {
  const params = new URLSearchParams(searchParams)

  const res = await fetcher(
    `api/operativos/autos${params ? `?${params.toString()}` : ''}`,
    {
      next: {
        tags: ['autos'],
      },
    },
  )
  const data: { data: AutosDTO[]; pages: number } = await res.json()
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
  const tasks = await getAutos(searchParams)
  const filters = await getFilters()
  return <AutosTable tasks={tasks} filters={filters} />
}

export default page
