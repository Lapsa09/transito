import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const _user = await prisma.user.findUnique({
    where: {
      legajo: +body.legajo,
    },
    include: {
      op: {
        select: {
          permisos: { select: { permiso: true } },
          turno: true,
        },
      },
    },
  })
  let user = null
  if (_user) {
    const { op, ...rest } = _user

    user = {
      ...rest,
      role: op?.permisos?.permiso,
      turno: op?.turno,
    }
  }

  return NextResponse.json(user)
}
