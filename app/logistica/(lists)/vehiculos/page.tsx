import React from 'react'
import { fetcher } from '@/services'
import { VehiculoDTO } from '@/DTO/logistica/vehiculos'
import { VehiculosTable } from './table'

const getAutos = async (searchParams: string) => {
  const res = await fetcher(
    `api/logistica/vehiculos${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'vehiculos'],
        revalidate: 3600 * 24,
      },
    },
  )
  const data: { data: VehiculoDTO[]; pages: number } = await res.json()
  return data
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const data = await getAutos(new URLSearchParams(searchParams).toString())

  return <VehiculosTable tasks={data} />
}

export default page
