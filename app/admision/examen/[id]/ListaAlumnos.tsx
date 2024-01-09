'use client'

import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { rinde_examen, tipo_examen } from '@prisma/client'
import React from 'react'

function ListaAlumnos({
  alumnos,
}: {
  alumnos: Array<rinde_examen & { tipo_examen: tipo_examen }>
}) {
  return (
    <div className="flex-1 my-2">
      <h1>Lista de alumnos</h1>
      <div className="flex flex-wrap mt-3 gap-3">
        {alumnos.map((alumno) => (
          <Card key={alumno.id}>
            <CardHeader>
              <h1>{alumno.nombre + ' ' + alumno.apellido}</h1>
            </CardHeader>
            <CardBody>
              <p>Email: {alumno.email}</p>
              <p>DNI: {alumno.dni}</p>
              <p>Rinde examen de: {alumno.tipo_examen.tipo}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ListaAlumnos
