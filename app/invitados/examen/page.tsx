import React from 'react'
import { getter } from '@/services'
import Quiz from './Quiz'
import { IPregunta } from '@/types/quiz'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Invitado } from '@/types'

const getPreguntas = async (id: string) => {
  const preguntas = await getter<IPregunta>({
    route: `invitados/examen/${id}/preguntas`,
  })
  return preguntas
}

async function page() {
  const session = await getServerSession(authOptions)
  const user = session?.user as Invitado
  const preguntas = await getPreguntas(user.id)

  if (user.metaData?.nota) return redirect('/invitados/examen/resultado')

  const { tipo_examenId } = user.metaData || { tipo_examenId: 1 }

  const tiempo = tipo_examenId <= 2 ? 1800 : 3600

  return (
    <div>
      <h1 className="text-center text-3xl font-bold">Examen</h1>

      <Quiz
        preguntas={preguntas?.examen_preguntas}
        tiempo={tiempo}
        id={user.id}
      />
    </div>
  )
}

export default page
