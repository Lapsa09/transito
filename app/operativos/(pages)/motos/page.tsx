import React from 'react'
import { fetcher } from '@/services'
import { IndexPageProps, SearchParams } from '@/types/data-table'
import { MotosTable } from './table'
import { Filter } from '@/DTO/filters'
import { MotosDTO } from '@/DTO/operativos/motos'

const getMotos = async (searchParams: SearchParams) => {
  const params = new URLSearchParams(searchParams)

  const res = await fetcher(
    `api/operativos/motos${params ? `?${params.toString()}` : ''}`,
    {
      next: {
        tags: ['motos'],
      },
    },
  )
  const data: { data: MotosDTO[]; pages: number } = await res.json()
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
  const tasks = await getMotos(searchParams)
  const filters = await getFilters()
  return <MotosTable tasks={tasks} filters={filters} />
}

export default page
