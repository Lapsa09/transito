import React from 'react'
import { fetcher } from '@/services'
import { ReparacionesTable } from './table'
import { ReparacionesDTO } from '@/DTO/logistica/reparaciones'

const getAutos = async (searchParams: string) => {
  const res = await fetcher(
    `api/logistica/repuestos/reparaciones${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'repuestos', 'reparaciones'],
        revalidate: 3600 * 24,
      },
    },
  )
  const data: { data: ReparacionesDTO[]; pages: number } = await res.json()
  return data
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const data = await getAutos(new URLSearchParams(searchParams).toString())

  return <ReparacionesTable tasks={data} />
}

export default page
