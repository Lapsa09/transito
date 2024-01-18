'use client'

import { rinde_examen } from '@prisma/client'
import { jwtDecode } from 'jwt-decode'
import { useSessionStorage } from 'usehooks-ts'
import bcrypt from 'bcrypt'
import { useMemo } from 'react'

export const useInvitado = () => {
  const [token, setToken] = useSessionStorage<string>('invitado', '')

  const usuario = useMemo(() => jwtDecode<rinde_examen>(token), [token])

  const setUsuario = (usuario: rinde_examen) => {
    const token = bcrypt.hashSync(JSON.stringify(usuario), 10)
    setToken(token)
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
