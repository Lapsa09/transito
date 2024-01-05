import React from 'react'
import NuevoAlumno from './NuevoAlumno'
import ListaAlumnos from './ListaAlumnos'
import { redirect } from 'next/navigation'
import { examen, rinde_examen } from '@prisma/client'
import BeginButton from './BeginButton'
import QuitButton from './QuitButton'
import { getter } from '@/services'

const getExamen = async (id: string) => {
  const examen = await getter<(examen & { alumnos: rinde_examen[] }) | null>({
    route: `admision/examen/${id}`,
  })

  return examen
}

async function page({ params }: { params: { id: string } }) {
  const { id } = params
  const examen = await getExamen(id)
  if (!examen || examen.terminado) {
    redirect('/admision/examen')
  }
  return (
    <div>
      <h1>Examen</h1>
      <ListaAlumnos alumnos={examen.alumnos} />
      <NuevoAlumno id={id} />
      <span>Clave:{examen.clave}</span>
      <BeginButton id={id} />
      <QuitButton id={id} />
    </div>
  )
}

export default page
