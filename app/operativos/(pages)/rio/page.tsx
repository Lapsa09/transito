import { Registro } from '@/types/rio'
import PageClient from './page.client'
import { fetcher } from '@/services'

const getRio = async (searchParams: string) => {
  const res = await fetcher(
    `/operativos/rio${searchParams ? `?${searchParams}` : ''}`,
    {
      next: {
        tags: ['operativos', 'rio'],
      },
    },
  )
  const data: { data: Registro[]; pages: number } = await res.json()
  return data
}

async function page({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data, pages } = await getRio(
    new URLSearchParams(searchParams).toString(),
  )
  return <PageClient data={data} pages={pages} />
}

export default page
