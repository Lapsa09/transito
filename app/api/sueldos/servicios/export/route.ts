import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { DateTime } from 'luxon'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const fecha = DateTime.fromFormat(body.fecha, 'yyyy-MM-dd').toISO()

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
