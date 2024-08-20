import { getter } from '@/services'
import React from 'react'
import Resultado from './Resultado'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Respuesta } from '@/types/quiz'
import { Invitado } from '@/types'
import { Calificacion, RindeExamen } from '@/drizzle/schema/examen'

const getExamen = async (id: string | null) => {
  const data = await getter<RindeExamen & { calificacion: Calificacion }>({
    route: `invitados/examen/${id}/resultado`,
  })
  return data
}

const getRespuestas = async (id: string | null) => {
  const data = await getter<Respuesta[]>({
    route: `admision/examen/${id}/respuestas`,
  })
  return data
}

async function page() {
  const session = await getServerSession(authOptions)
  const user = session?.user as Invitado
  const examen = await getExamen(user?.metaData.id)
  const respuestas = await getRespuestas(user?.metaData.id)

  return <Resultado examen={examen} respuestas={respuestas} />
}

export default page
