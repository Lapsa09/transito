import React from 'react'
import NuevoAlumno from './NuevoAlumno'
import ListaAlumnos from './ListaAlumnos'
import { redirect } from 'next/navigation'
import { examen } from '@prisma/client'
import QuitButton from './QuitButton'
import { fetcher } from '@/services'
import { Alumno } from '@/types/quiz'

type Examen = examen & {
  alumnos: Alumno[]
}

const getExamen = async (id: string) => {
  const res = await fetcher(`api/admision/examen/${id}`, {
    cache: 'no-store',
  })

  const examen: Examen | null = await res.json()

  return examen
}

async function page({ params }: { params: { id: string } }) {
  const { id } = params
  const examen = await getExamen(id)
  if (!examen) {
    return redirect('/admision/examen')
  }

  return (
    <section className="grid gap-5">
      <div className="grid grid-flow-col gap-5">
        <ListaAlumnos alumnos={examen.alumnos} />

        <NuevoAlumno id={examen.id} />
      </div>
      <div className="flex justify-center items-center gap-5">
        <span className="text-xl font-semibold">Clave: {examen.clave}</span>
        <QuitButton id={examen.id} />
      </div>
    </section>
  )
}

export default page
