'use client'

import { examen, rinde_examen } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import Quiz from './Quiz'

function Waitzone({ examen }: { examen: examen | null }) {
  const router = useRouter()
  const [usuario] = useSessionStorage<rinde_examen | undefined>(
    'invitado',
    undefined,
  )

  useEffect(() => {
    if (!usuario || !examen || usuario.id_examen !== examen.id) {
      router.push('/invitados/examen')
    }
  }, [])

  return examen?.habilitado ? (
    <div>
      <h1>Zona de espera</h1>
      <p>El examen aún no ha comenzado</p>
    </div>
  ) : (
    <Quiz id={usuario?.id} />
  )
}

export default Waitzone
