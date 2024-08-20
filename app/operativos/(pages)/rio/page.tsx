import { fetcher } from '@/services'
import { IndexPageProps, SearchParams } from '@/types/data-table'
import { RioDTO } from '@/DTO/operativos/rio'
import { Filter } from '@/DTO/filters'
import { RioTable } from './table'

const getRio = async (searchParams: SearchParams) => {
  const params = new URLSearchParams(searchParams)
  const res = await fetcher(
    `/api/operativos/rio${params ? `?${params.toString()}` : ''}`,
    {
      next: {
        tags: ['rio'],
      },
    },
  )
  const data: { data: RioDTO[]; pages: number } = await res.json()
  return data
}

const getFilters = async () => {
  const res = await fetcher('api/filters', {
    next: {
      tags: ['filters'],
    },
  })
  const data: Filter = await res.json()
  return data
}

async function page({ searchParams }: IndexPageProps) {
  const tasks = await getRio(searchParams)

  const filters = await getFilters()

  return <RioTable tasks={tasks} filters={filters} />
}

export default page
