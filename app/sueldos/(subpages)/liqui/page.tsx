import { getter } from '@/services'
import React from 'react'
import DataTable from './table'
import { IndexPageProps, SearchParams } from '@/types/data-table'

const getData = async (searchParams: SearchParams) => {
  const data = await getter<{
    data: {
      mes: number
      año: number
      total: number
    }[]
    pages: number
  }>({
    route: `sueldos/servicios/liqui/list${searchParams ? `?${searchParams.toString()}` : ''}`,
  })
  return data
}

async function page({ searchParams }: IndexPageProps) {
  const { data, pages } = await getData(searchParams)

  return <DataTable data={data} pages={pages} />
}

export default page
