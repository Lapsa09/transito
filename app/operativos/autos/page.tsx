'use client'
import useSWR from 'swr'
import { DataTable, Loader } from '@/components'
import { getAutos } from '@/services'
import { columns } from './columns'

function page() {
  const { data, isLoading } = useSWR('Autos', getAutos)

  if (isLoading) return <Loader />
  return <DataTable columns={columns} data={data!} />
}

export default page
