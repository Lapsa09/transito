'use client'

import { calificacion, rinde_examen } from '@prisma/client'
import { signOut } from 'next-auth/react'
import React from 'react'
import { useEventListener } from 'usehooks-ts'

function Resultado({
  examen,
}: {
  examen: rinde_examen & { calificacion: calificacion }
}) {
  useEventListener('pagehide', () => setTimeout(signOut, 5000))

  return (
    <div>
      <h1>El examen ha finalizado</h1>
      <p>Resultado: {examen.calificacion.nota}</p>
      <p>{examen.calificacion.resultado}</p>
    </div>
  )
}

export default Resultado
