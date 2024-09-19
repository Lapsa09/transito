import React from 'react'
import { getter } from '@/services'
import Form from './Form'

const getPrecios = async () => {
  const data = await getter<
    [
      { id: 'precio_normal'; precio: number },
      { id: 'precio_pico'; precio: number },
    ]
  >({
    route: 'sueldos/precios',
  })
  return data
}

export const dynamic = 'force-dynamic'

async function page() {
  const data = await getPrecios()

  return <Form data={data} />
}

export default page
