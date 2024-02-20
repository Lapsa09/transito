'use client'

import { calificacion, rinde_examen } from '@prisma/client'
import { signOut } from 'next-auth/react'
import React, { useEffect } from 'react'

function Resultado({
  examen,
}: {
  examen: rinde_examen & { calificacion: calificacion }
}) {
  useEffect(() => {
    signOut({ redirect: false })
  }, [])

  return (
    <div>
      <h1>El examen ha finalizado</h1>
      <p>Resultado: {examen.calificacion.nota}</p>
      <p>{examen.calificacion.resultado}</p>
    </div>
  )
}

export default Resultado
