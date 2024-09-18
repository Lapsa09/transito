'use client'
import React from 'react'
import { getter } from '@/services'
import { IndexPageProps, SearchParams } from '@/types/data-table'
import { Cliente } from '@/types'
import { ClientesTable } from './table'

const getData = async (searchParams: SearchParams) => {
  const res = await getter<{
    data: Cliente[]
    pages: number
  }>({
    route: `sueldos/clientes${searchParams ? `?${searchParams.toString()}` : ''}`,
  })
  return res
}

async function page({ searchParams }: IndexPageProps) {
  const { data, pages } = await getData(searchParams)

  return <ClientesTable data={data} pages={pages} />
}

export default page
