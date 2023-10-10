import prisma from '@/lib/prismadb'
import { VTV } from '@/types/logistica'
import { DateTime } from 'luxon'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params

  const vehiculo = await prisma.vtv.findMany({
    where: {
      patente,
    },
    include: {
      movil: true,
    },
    orderBy: {
      fecha_emision: 'desc',
    },
  })

  return NextResponse.json(vehiculo)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const body: VTV = await req.json()
  const { patente } = params
  const vehiculo = await prisma.vtv.create({
    data: {
      movil: {
        connect: {
          patente,
        },
      },
      fecha_emision: DateTime.fromFormat(
        String(body.fecha_emision),
        'yyyy-MM-dd',
      ).toISO(),
      vencimiento: DateTime.fromFormat(
        String(body.vencimiento),
        'yyyy-MM-dd',
      ).toISO(),
      condicion: body.condicion,
      estado: body.estado,
      observacion: body.observacion,
    },
    include: {
      movil: true,
    },
  })

  return NextResponse.json(vehiculo)
}
