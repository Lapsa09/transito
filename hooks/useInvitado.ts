'use client'

import { rinde_examen } from '@prisma/client'
import { useSessionStorage } from 'usehooks-ts'

export const useInvitado = () => {
  const [usuario, setUsuario] = useSessionStorage<rinde_examen | undefined>(
    'invitado',
    undefined,
  )

  return {
    usuario,
    setUsuario,
  }
}
