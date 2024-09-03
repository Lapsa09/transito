import React from 'react'
import { getOperarios, getter } from '@/services'
import Table from './table'
import { Operario } from '@/types/operarios.sueldos'
import { IndexPageProps, SearchParams } from '@/types/data-table'

const getData = async (params: SearchParams) => {
  const data = await getter<{ data: Operario[]; pages: number }>({
    route: `sueldos/operarios${params ? `?${params.toString()}` : ''}`,
  })
  return data
}

async function page({ searchParams }: IndexPageProps) {
  const { data, pages } = await getData(searchParams)
  return <Table data={data} pages={pages} />
}

export default page
