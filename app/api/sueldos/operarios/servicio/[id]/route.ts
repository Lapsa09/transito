import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function PUT(req: NextRequest, state: { params: { id: number } }) {
  const { id } = state.params
  const { legajo, cancelado } = await req.json()

  const update = await prisma.operarios_servicios.update({
    where: { id, legajo },
    data: {
      cancelado: !cancelado,
    },
  })

  return NextResponse.json(update)
}
