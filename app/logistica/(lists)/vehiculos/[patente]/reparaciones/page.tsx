import React from 'react'
import { fetcher } from '@/services'
import { Reparacion } from '@/types/logistica'
import PageClient from './page.client'

const getKilometraje = async (patente: string, searchParams: string) => {
  const res = await fetcher(
    `api/logistica/vehiculos/${patente}/reparaciones${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['logistica', 'vehiculos', patente, 'reparaciones'],
        revalidate: 3600 * 24,
      },
    },
  )
  const data: { data: Reparacion[]; pages: number } = await res.json()
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
      <PageClient data={data.data} pages={data.pages} />
    </div>
  )
}

export default page
