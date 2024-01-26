import { rinde_examen, tipo_examen } from '@prisma/client'
import React from 'react'
import AlumnoCard from './AlumnoCard'

function ListaAlumnos({
  alumnos,
}: {
  alumnos: Array<rinde_examen & { tipo_examen: tipo_examen }>
}) {
  return (
    <div className="my-2 col-span-3">
      <h1 className="ml-5">Lista de alumnos</h1>
      <div className="grid grid-cols-3 max-h-unit-9xl p-3 gap-3 overflow-y-auto">
        {alumnos.map((alumno) => (
          <AlumnoCard key={alumno.id} alumno={alumno} />
        ))}
      </div>
    </div>
  )
}

export default ListaAlumnos
