import { getter } from '@/services'
import React from 'react'
import Resultados from './Resultado'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { type Resultado } from '@/types/quiz'
import { Invitado } from '@/types'

const getExamen = async (id: string | null) => {
  const data = await getter<Resultado>({
    route: `invitados/examen/${id}/resultado`,
  })
  return data
}
async function page() {
  const session = await getServerSession(authOptions)
  const user = session?.user as Invitado
  const examen = await getExamen(user?.metaData.id)

  return <Resultados examen={examen} />
}

export default page
