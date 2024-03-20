import { getter } from '@/services'
import { calificacion, rinde_examen } from '@prisma/client'
import React from 'react'
import Resultado from './Resultado'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const getExamen = async (id?: string) => {
  const data = await getter<rinde_examen & { calificacion: calificacion }>({
    route: `/examen/${id}/resultado`,
  })
  return data
}

async function page() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const examen = await getExamen(user?.id)
  return <Resultado examen={examen} />
}

export default page
