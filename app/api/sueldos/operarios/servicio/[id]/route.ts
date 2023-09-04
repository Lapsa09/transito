import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function PUT(req: NextRequest, state: { params: { id: string } }) {
  const { id } = state.params
  const { cancelado } = await req.json()

  const update = await prisma.operarios_servicios.update({
    where: { id: +id },
    data: {
      cancelado: !cancelado,
    },
  })

  const servicio = await prisma.servicios.update({
    where: { id_servicio: update.id_servicio },
    data: {
      importe_servicio: !cancelado
        ? {
            decrement: update.a_cobrar!,
          }
        : {
            increment: update.a_cobrar!,
          },
    },
    include: {
      operarios_servicios: {
        include: {
          operarios: true,
        },
      },
    },
  })

  return NextResponse.json(servicio)
}
