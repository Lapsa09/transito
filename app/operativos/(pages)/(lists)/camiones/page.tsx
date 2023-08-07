import React from 'react'
import { getCamiones } from '@/services'
import ClientTable from './ClientTable'

async function page() {
  const data = await getCamiones()

  return <ClientTable data={data} />
}

export default page
