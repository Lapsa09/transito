import React from 'react'
import { examen, rinde_examen } from '@prisma/client'
import Waitzone from './Waitzone'
import { getter } from '@/services'
import { redirect } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import Quiz from './Quiz'
import { IPregunta } from '@/types/quiz'

const getExamen = async (id: string) => {
  const examen = await getter<examen | null>({ route: `examen/${id}` })
  return examen
}

const getPreguntas = async (id: string) => {
  const preguntas = await getter<IPregunta[]>({
    route: `examen/${id}/preguntas`,
  })
  return preguntas
}

async function page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: URLSearchParams
}) {
  const examen = await getExamen(params.id)
  const token = searchParams.get('u')

  if (!token || !examen) redirect('/invitados/examen')
  try {
    const usuario: rinde_examen & { examen: examen } = jwtDecode(token)
    const preguntas = await getPreguntas(usuario.id)
    return (
      <div>
        <h1 className="text-center text-3xl font-bold">Examen</h1>
        {!usuario.examen.habilitado ? (
          <Waitzone />
        ) : (
          <Quiz preguntas={preguntas} />
        )}
      </div>
    )
  } catch (error) {
    redirect('/invitados/examen')
  }
}

export default page
