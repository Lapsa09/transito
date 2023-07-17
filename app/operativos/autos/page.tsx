'use client'
import useSWR from 'swr'
import { DataTable } from '@/components/table'
import Loader from '@/components/Loader'
import { getAutos } from '@/services'
import { columns } from './columns'

function page() {
  const { data, isLoading } = useSWR('autos', getAutos)

  if (isLoading) return <Loader />
  return <DataTable columns={columns} data={data!} />
}

export default page
