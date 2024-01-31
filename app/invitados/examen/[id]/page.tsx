import React from 'react'
import { examen } from '@prisma/client'
import Waitzone from './Waitzone'
import { getter } from '@/services'
import { redirect } from 'next/navigation'
import Quiz from './Quiz'
import { IPregunta } from '@/types/quiz'

const getExamen = async (id: string) => {
  const examen = await getter<examen | null>({ route: `examen/${id}` })
  return examen
}

const getPreguntas = async (id: string) => {
  const preguntas = await getter<IPregunta>({
    route: `examen/${id}/preguntas`,
  })
  return preguntas
}

async function page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { u?: string }
}) {
  const examen = await getExamen(params.id)

  const token = searchParams.u

  if (!token || !examen) redirect('/invitados/examen')
  try {
    const usuario = await getPreguntas(token)
    if (usuario.nota) redirect(`/invitados/examen/${usuario.id}/resultado`)
    return (
      <div>
        <h1 className="text-center text-3xl font-bold">Examen</h1>
        {!examen.habilitado ? (
          <Waitzone />
        ) : (
          <Quiz preguntas={usuario.examen_preguntas} id={usuario.id} />
        )}
      </div>
    )
  } catch (error) {
    console.error(error)
    redirect('/invitados/examen')
  }
}

export default page
