import prisma from '@/lib/prismadb'
import bycript from 'bcrypt'
import { Roles } from '@/types'

export const userDTO = async (body: { legajo: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      legajo: +body.legajo,
    },
    select: {
      id: true,
      legajo: true,
      nombre: true,
      apellido: true,
      turno: true,
      rol: true,
      user_password: true,
    },
  })
  if (!user) return null
  const user_password = await bycript.compare(
    body.password,
    user.user_password || '',
  )
  if (!user_password) return null
  const { user_password: _, turno, rol, ...rest } = user
  return {
    metaData: { turno, rol, isAdmin: rol.permiso === Roles.ADMIN },
    ...rest,
  }
}

export const invitadoDTO = async (body: { dni: string }) => {
  const invitado = await prisma.invitado.findFirst({
    where: {
      dni: +body.dni,
      utilizado: false,
    },
    select: {
      id: true,
      dni: true,
      nombre: true,
      apellido: true,
      examen: {
        include: {
          tipo_examen: true,
        },
      },
    },
    orderBy: {
      fecha: 'desc',
    },
  })
  if (!invitado) return null
  const { examen, ...rest } = invitado
  return { metaData: examen, ...rest }
}
