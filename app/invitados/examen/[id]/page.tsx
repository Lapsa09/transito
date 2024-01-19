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
  searchParams: Record<any, any>
}) {
  const examen = await getExamen(params.id)

  const token: string = searchParams.u

  if (!token || !examen) redirect('/invitados/examen')
  try {
    const usuario = await getPreguntas(token)
    return (
      <div>
        <h1 className="text-center text-3xl font-bold">Examen</h1>
        {!examen.habilitado ? (
          <Waitzone />
        ) : (
          <Quiz preguntas={usuario.examen_preguntas} />
        )}
      </div>
    )
  } catch (error) {
    console.log(error)
    redirect('/invitados/examen')
  }
}

export default page
