import React from 'react'
import { fetcher } from '@/services'
import { VTVTable } from './table'
import { VTVDTO } from '@/DTO/logistica/vtv'

const getKilometraje = async (patente: string, searchParams: string) => {
  const res = await fetcher(
    `api/logistica/vehiculos/${patente}/vtv${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'vehiculos', patente, 'vtv'],
        revalidate: 3600 * 24,
      },
    },
  )
  const data: { data: VTVDTO[]; pages: number } = await res.json()
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
      <VTVTable tasks={data} />
    </div>
  )
}

export default page
