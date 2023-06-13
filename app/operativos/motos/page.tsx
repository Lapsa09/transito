'use client'
import useSWR from 'swr'
import { DataTable, Loader } from '@/components'
import { getMotos } from '@/services'
import { columns } from './columns'

function page() {
  const { data, isLoading } = useSWR('Motos', getMotos)

  if (isLoading) return <Loader />
  return <DataTable columns={columns} data={data!} />
}

export default page
