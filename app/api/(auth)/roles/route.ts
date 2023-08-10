import prisma from '@/lib/prismadb'
import { permisos } from '@prisma/client'

const roleObject = (res: permisos[]) =>
  res.reduce<Record<permisos['permiso'], permisos['url']>>((acc, permiso) => {
    acc[permiso.permiso] = permiso.url
    return acc
  }, {})

export async function GET() {
  const roles = await prisma.permisos.findMany()
  return roleObject(roles)
}
