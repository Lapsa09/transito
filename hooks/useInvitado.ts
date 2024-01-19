'use client'

import { examen, rinde_examen } from '@prisma/client'
import { jwtDecode } from 'jwt-decode'
import { useSessionStorage } from 'usehooks-ts'
import { useMemo } from 'react'

export const useInvitado = () => {
  const [token, setToken] = useSessionStorage<string>('invitado', '')

  const usuario = useMemo(() => {
    try {
      return jwtDecode(token) as rinde_examen & { examen: examen }
    } catch (error) {
      return {} as rinde_examen & { examen: examen }
    }
  }, [token])

  const setUsuario = (token: string) => {
    setToken(token)

    return jwtDecode(token) as rinde_examen & { examen: examen }
  }

  const logout = () => {
    setToken('')
  }

  return {
    usuario,
    setUsuario,
    logout,
    token,
  }
}
