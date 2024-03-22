import React from 'react'
import Form from './Form'
import { fetcher } from '@/services'
import { permisos } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const getRoles = async () => {
  const res = await fetcher('/api/roles')
  const data: permisos[] = await res.json()
  return data
}

async function page() {
  const roles = await getRoles()

  return (
    <div>
      <h1 className="text-center text-4xl font-bold">Nuevo empleado</h1>
      <Form roles={roles} />
    </div>
  )
}

export default page
