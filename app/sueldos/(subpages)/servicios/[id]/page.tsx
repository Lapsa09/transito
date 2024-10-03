import React from 'react'
import Table from './table'
import { getter } from '@/services'
import { OperariosDTO } from '@/types/servicios.sueldos'
import { IndexPageProps, SearchParams } from '@/types/data-table'
import { Fetched } from '@/types'

const getServicios = async (id: string, params: SearchParams) => {
  const data = await getter<Fetched<OperariosDTO>>({
    route: `sueldos/servicios/${id}${params ? `?${params.toString()}` : ''}`,
  })
  return data
}

async function page({
  searchParams,
  params,
}: IndexPageProps & { params: { id: string } }) {
  const { data, pages } = await getServicios(params.id, searchParams)

  return (
    <div>
      <Table data={data} pages={pages} />
    </div>
  )
}

export default page
