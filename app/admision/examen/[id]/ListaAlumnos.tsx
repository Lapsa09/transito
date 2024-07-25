'use client'

import React, { useState } from 'react'
import AlumnoCard from './AlumnoCard'
import { Input } from '@nextui-org/react'
import { Alumno } from '@/types/quiz'

function ListaAlumnos({ alumnos }: { alumnos: Alumno[] }) {
  const [inputValue, setInputValue] = useState('')

  const filterAlumnos = (alumno: Alumno) => {
    if (inputValue === '') return true
    return (
      alumno.usuario.apellido
        ?.toLowerCase()
        .includes(inputValue.toLowerCase()) ||
      alumno.usuario.nombre?.toLowerCase().includes(inputValue.toLowerCase()) ||
      alumno.usuario.dni.toString().includes(inputValue)
    )
  }

  return (
    <div className="my-2 col-span-3">
      <h1 className="ml-5">Lista de alumnos</h1>
      <Input
        value={inputValue}
        onValueChange={setInputValue}
        isClearable
        placeholder="Buscar alumno"
        className="px-3"
        classNames={{
          input: 'uppercase',
        }}
      />
      <div className="grid grid-cols-3 max-h-unit-9xl p-3 gap-3 overflow-y-auto">
        {alumnos
          ?.filter(filterAlumnos)
          .map((alumno) => <AlumnoCard key={alumno.id} alumno={alumno} />)}
      </div>
    </div>
  )
}

export default ListaAlumnos
