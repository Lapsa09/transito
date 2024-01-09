import React from 'react'
import NuevoAlumno from './NuevoAlumno'
import ListaAlumnos from './ListaAlumnos'
import { redirect } from 'next/navigation'
import { examen, rinde_examen, tipo_examen } from '@prisma/client'
import BeginButton from './BeginButton'
import QuitButton from './QuitButton'
import { getter } from '@/services'

type Alumno = rinde_examen & { tipo_examen: tipo_examen }

type Examen = examen & {
  alumnos: Alumno[]
}

const getExamen = async (id: string) => {
  const examen = await getter<Examen | null>({
    route: `admision/examen/${id}`,
  })

  return examen
}

async function page({ params }: { params: { id: string } }) {
  const { id } = params
  const examen = await getExamen(id)
  if (!examen) {
    redirect('/admision/examen')
  }
  return (
    <div>
      <div className="flex mx-5">
        <ListaAlumnos alumnos={examen.alumnos} />

        <NuevoAlumno id={examen.id} />
      </div>
      <div className="flex justify-center items-center gap-5">
        <BeginButton id={examen.id} />
        <span>Clave: {examen.clave}</span>
        <QuitButton id={examen.id} />
      </div>
    </div>
  )
}

export default page
