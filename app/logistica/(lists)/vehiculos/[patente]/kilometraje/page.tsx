import React from 'react'
import { fetcher } from '@/services'
import { KilometrajeDTO } from '@/DTO/logistica/kilometraje'
import { KilometrajeTable } from './table'

const getKilometraje = async (patente: string, searchParams: string) => {
  const res = await fetcher(
    `api/logistica/vehiculos/${patente}/kilometraje${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'vehiculos', patente, 'kilometraje'],
        revalidate: 3600 * 24,
      },
    },
  )
  const data: { data: KilometrajeDTO[]; pages: number } = await res.json()
  return data
}

async function page({
  params,
  searchParams,
}: {
  params: { patente: string }
  searchParams: Record<string, string>
}) {
  const { patente } = params

  const data = await getKilometraje(
    patente,
    new URLSearchParams(searchParams).toString(),
  )
  return (
    <div>
      <h1 className="text-center mb-5 uppercase">{patente}</h1>
      <KilometrajeTable tasks={data} />
    </div>
  )
}

export default page
