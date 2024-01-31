'use client'

import { rinde_examen, tipo_examen } from '@prisma/client'
import React, { useState } from 'react'
import AlumnoCard from './AlumnoCard'
import { Input } from '@nextui-org/react'

function ListaAlumnos({
  alumnos,
}: {
  alumnos: Array<rinde_examen & { tipo_examen: tipo_examen }>
}) {
  const [inputValue, setInputValue] = useState('')

  const filterAlumnos = (
    alumno: rinde_examen & { tipo_examen: tipo_examen },
  ) => {
    if (inputValue === '') return true
    return (
      alumno.apellido?.includes(inputValue) ||
      alumno.nombre?.includes(inputValue) ||
      alumno.dni.toString().includes(inputValue)
    )
  }

  return (
    <div className="my-2 col-span-3">
      <h1 className="ml-5">Lista de alumnos</h1>
      <Input
        value={inputValue}
        onValueChange={setInputValue}
        placeholder="Buscar alumno"
      />
      <div className="grid grid-cols-3 max-h-unit-9xl p-3 gap-3 overflow-y-auto">
        {alumnos.filter(filterAlumnos).map((alumno) => (
          <AlumnoCard key={alumno.id} alumno={alumno} />
        ))}
        I
      </div>
    </div>
  )
}

export default ListaAlumnos
