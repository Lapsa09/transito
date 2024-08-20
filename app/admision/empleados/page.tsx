import React from 'react'
import Form from './Form'
import { fetcher } from '@/services'
import { Permiso, Turno } from '@/drizzle/schema/schema'

const getRoles = async () => {
  const res = await fetcher('/api/roles')
  const data: Permiso[] = await res.json()
  return data
}

const getTurnos = async () => {
  const res = await fetcher('/api/turnos')
  const data: { id: Turno; label: string }[] = await res.json()
  return data
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function page() {
  const [roles, turnos] = await Promise.all([getRoles(), getTurnos()])

  return (
    <div>
      <h1 className="text-center text-4xl font-bold">Nuevo empleado</h1>
      <Form roles={roles} turnos={turnos} />
    </div>
  )
}

export default page
