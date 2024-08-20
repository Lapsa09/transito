import React from 'react'
import { fetcher } from '@/services'
import { RepuestosTable } from './table'
import { RepuestosDTO } from '@/DTO/logistica/repuestos'

const getAutos = async (searchParams: string) => {
  const res = await fetcher(
    `api/logistica/repuestos${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'repuestos'],
        revalidate: 3600 * 24,
      },
    },
  )
  const data: { data: RepuestosDTO[]; pages: number } = await res.json()
  return data
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const data = await getAutos(new URLSearchParams(searchParams).toString())

  return <RepuestosTable tasks={data} />
}

export default page
