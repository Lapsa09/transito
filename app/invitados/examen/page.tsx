import React from 'react'
import Waitzone from './Waitzone'
import { getter } from '@/services'
import Quiz from './Quiz'
import { IPregunta } from '@/types/quiz'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { InvitedUser } from '@/types'
import { redirect } from 'next/navigation'

const getPreguntas = async (id: string) => {
  const preguntas = await getter<IPregunta>({
    route: `examen/${id}/preguntas`,
  })
  return preguntas
}

async function page() {
  const session = await getServerSession(authOptions)
  const user = session?.user as InvitedUser
  const preguntas = await getPreguntas(user.id)
  if (user.nota) return redirect('/invitados/examen/resultado')
  return (
    <div>
      <h1 className="text-center text-3xl font-bold">Examen</h1>
      {!preguntas.examen.habilitado ? (
        <Waitzone />
      ) : (
        <Quiz preguntas={preguntas.examen_preguntas} id={user.id} />
      )}
    </div>
  )
}

export default page
