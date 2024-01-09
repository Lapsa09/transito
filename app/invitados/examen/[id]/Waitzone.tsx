'use client'

import { examen } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import Quiz from './Quiz'
import { useInvitado } from '@/hooks/useInvitado'
import { Spinner } from '@nextui-org/react'

function Waitzone({ examen }: { examen: examen | null }) {
  const router = useRouter()
  const { usuario } = useInvitado()

  useEffect(() => {
    if (!usuario || !examen || usuario.id_examen !== examen.id) {
      router.push('/invitados/examen')
    }
  }, [])

  return !examen?.habilitado ? (
    <div className="text-center mt-5">
      <h2>Zona de espera</h2>
      <p>El examen aún no ha comenzado</p>
      <Spinner size="lg" />
    </div>
  ) : (
    <Quiz id={usuario?.id} />
  )
}

export default Waitzone
