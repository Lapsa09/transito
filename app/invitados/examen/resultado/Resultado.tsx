'use client'

import { calificacion, rinde_examen } from '@prisma/client'
import { signOut } from 'next-auth/react'
import React, { useRef } from 'react'
import { useEventListener } from 'usehooks-ts'

function Resultado({
  examen,
}: {
  examen: rinde_examen & { calificacion: calificacion }
}) {
  const documentRef = useRef<Document>(document)

  useEventListener('visibilitychange', () => signOut(), documentRef)

  return (
    <div>
      <h1>El examen ha finalizado</h1>
      <p>Resultado: {examen.calificacion.nota}</p>
      <p>{examen.calificacion.resultado}</p>
    </div>
  )
}

export default Resultado
