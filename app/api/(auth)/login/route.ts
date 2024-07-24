import { invitadoDTO, userDTO } from '@/DTO/user'
import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  if (body.legajo) {
    const user = await userDTO(body)
    return NextResponse.json(user)
  }

  const invitado = await invitadoDTO(body)

  await prisma.invitado.update({
    where: {
      id: invitado?.id,
    },
    data: {
      utilizado: true,
      examen: {
        update: {
          hora_ingresado: new Date(),
        },
      },
    },
  })

  return NextResponse.json(invitado)
}
