import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function POST(req: NextRequest) {
  const { fecha } = await req.json()

  const agenda = await prisma.servicios.findMany({
    where: {
      fecha_servicio: fecha,
    },
    include: {
      clientes: true,
      operarios_servicios: {
        include: {
          operarios: true,
        },
      },
    },
  })

  return NextResponse.json(agenda)
}
