'use client'

import { calificacion, rinde_examen } from '@prisma/client'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Resultado({
  examen,
}: {
  examen: rinde_examen & { calificacion: calificacion }
}) {
  const router = useRouter()
  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      setTimeout(() => {
        router.push('/login/invitado')
      }, 5000)
    })
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
