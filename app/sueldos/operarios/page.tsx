import React from 'react'
import { getOperarios } from '@/services'
import ClientTable from './ClientTable'

async function page() {
  const data = await getOperarios()
  return <ClientTable data={data} />
}

export default page
