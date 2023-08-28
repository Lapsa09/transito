import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prismadb'

export async function PUT(req: NextRequest, state: { params: { id: string } }) {
  const { memo } = await req.json()
  const { id } = state.params

  const memoActualizado = await prisma.servicios.update({
    where: { id_servicio: Number(id) },
    data: {
      memo,
    },
    include: {
      operarios_servicios: {
        include: {
          operarios: true,
        },
      },
    },
  })

  return NextResponse.json(memoActualizado)
}
