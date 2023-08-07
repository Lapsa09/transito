import React from 'react'
import { getServicios } from '@/services'
import ClientTable from './ClientTable'

async function page() {
  const data = await getServicios()
  return <ClientTable data={data} />
}

export default page
