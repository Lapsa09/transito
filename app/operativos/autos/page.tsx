'use client'
import useSWR from 'swr'
import { DataTable } from '@/components'
import { getAutos } from '@/services'
import { columns } from './columns'

function page() {
  const { data, isLoading } = useSWR('Autos', getAutos)

  if (isLoading) return <p>Loading</p>
  return <DataTable columns={columns} data={data!} />
}

export default page
