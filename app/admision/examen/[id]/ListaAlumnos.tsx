import { rinde_examen } from '@prisma/client'
import React from 'react'

function ListaAlumnos({ alumnos }: { alumnos: rinde_examen[] }) {
  return (
    <div>
      <h1>Lista de alumnos</h1>
      {alumnos.map((alumno) => (
        <div key={alumno.id}>
          <p>{alumno.nombre}</p>
          <p>{alumno.apellido}</p>
          <p>{alumno.email}</p>
          <p>{alumno.dni}</p>
        </div>
      ))}
    </div>
  )
}

export default ListaAlumnos
