import React from 'react'
import Table from './table'
import Export from './exporter'
import { getter } from '@/services'
import { Servicio } from '@/types/servicios.sueldos'
import { IndexPageProps, SearchParams } from '@/types/data-table'

const getServicios = async (params: SearchParams) => {
  const data = await getter<{ data: Servicio[]; pages: number }>({
    route: `sueldos/servicios${params ? `?${params.toString()}` : ''}`,
  })
  return data
}

async function page({ searchParams }: IndexPageProps) {
  const { data, pages } = await getServicios(searchParams)

  return (
    <div>
      <Export />
      <Table data={data} pages={pages} />
    </div>
  )
}

export default page
