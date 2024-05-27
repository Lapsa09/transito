import React from 'react'
import ClientPage from './page.client'
import { fetcher } from '@/services'
import { Parte } from '@/types/radio'

const getPartes = async () => {
  const res = await fetcher('/api/radio/partes', {
    next: {
      tags: ['radio/partes'],
    },
  })
  const data: { data: Parte[]; pages: number } = await res.json()
  return data
}

async function page() {
  const { data, pages } = await getPartes()
  return <ClientPage data={data} pages={pages} />
}

export default page
