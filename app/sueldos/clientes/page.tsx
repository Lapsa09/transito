import React from 'react'
import { getClientes } from '@/services'
import ClientTable from './ClientTable'

async function page() {
  const data = await getClientes()
  return <ClientTable data={data} />
}

export default page
