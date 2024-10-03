import { getter } from '@/services'
import { Historial } from '@/types'
import { SearchParams } from '@/types/data-table'
import React from 'react'
import Table from './table'

const getData = async (id: string, searchParams: SearchParams) => {
  const res = await getter<{
    data: Historial[]
    pages: number
  }>({
    route: `sueldos/clientes/${id}/${searchParams ? `?${searchParams.toString()}` : ''}`,
  })
  return res
}

async function page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: SearchParams
}) {
  const { data, pages } = await getData(params.id, searchParams)
  return <Table data={data} pages={pages} />
}

export default page
