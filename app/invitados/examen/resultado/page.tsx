import { getter } from '@/services'
import { calificacion, rinde_examen } from '@prisma/client'
import React from 'react'
import Resultado from './Resultado'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Respuesta } from '@/types/quiz'

const getExamen = async (id?: string) => {
  const data = await getter<rinde_examen & { calificacion: calificacion }>({
    route: `/examen/${id}/resultado`,
  })
  return data
}

const getRespuestas = async (id?: string) => {
  const data = await getter<Respuesta[]>({
    route: `admision/examen/${id}/respuestas`,
  })
  return data
}

async function page() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const examen = await getExamen(user?.id)
  const respuestas = await getRespuestas(user?.id)
  return <Resultado examen={examen} respuestas={respuestas} />
}

export default page
