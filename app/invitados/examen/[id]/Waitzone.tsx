'use client'

import { examen } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import Quiz from './Quiz'
import { useInvitado } from '@/hooks/useInvitado'

function Waitzone({ examen }: { examen: examen | null }) {
  const router = useRouter()
  const { usuario } = useInvitado()

  useEffect(() => {
    if (!usuario || !examen || usuario.id_examen !== examen.id) {
      router.push('/invitados/examen')
    }
  }, [])

  return !examen?.habilitado ? (
    <div>
      <h1>Zona de espera</h1>
      <p>El examen aún no ha comenzado</p>
    </div>
  ) : (
    <Quiz id={usuario?.id} />
  )
}

export default Waitzone
