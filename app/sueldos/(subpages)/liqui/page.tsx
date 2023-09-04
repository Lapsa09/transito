import { getExportables } from '@/services'
import React from 'react'
import ClientTable from './ClientTable'

async function page() {
  const data = await getExportables()
  return <ClientTable data={data} />
}

export default page
