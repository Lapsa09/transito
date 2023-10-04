import prisma from '@/lib/prismadb'
import { VTV } from '@/types/logistica'
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
      fecha_emision: body.fecha_emision,
      vencimiento: body.vencimiento,
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
