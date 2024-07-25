import React from 'react'
import Form from './Form'
import { fetcher } from '@/services'
import { permisos, turnos } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const getRoles = async () => {
  const res = await fetcher('/api/roles')
  const data: permisos[] = await res.json()
  return data
}

const getTurnos = async () => {
  const res = await fetcher('/api/turnos')
  const data: { id: turnos; label: string }[] = await res.json()
  return data
}

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
