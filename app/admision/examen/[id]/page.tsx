import React from 'react'
import NuevoAlumno from './NuevoAlumno'
import ListaAlumnos from './ListaAlumnos'
import { redirect } from 'next/navigation'
import { examen, rinde_examen } from '@prisma/client'
import BeginButton from './BeginButton'
// import QuitButton from './QuitButton'

const getExamen = async (id: string) => {
  const examen: (examen & { alumnos: rinde_examen[] }) | null = await fetch(
    `/api/admision/examen/${id}`,
    {
      next: { tags: [`examen/${id}`] },
    },
  ).then((res) => res.json())
  return examen
}

async function page({ params: { id } }: { params: { id: string } }) {
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
      {/* <QuitButton id={id} /> */}
    </div>
  )
}

export default page
