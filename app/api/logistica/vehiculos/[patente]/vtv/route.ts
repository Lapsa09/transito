import prisma from '@/lib/prismadb'
import { VTV } from '@/types/logistica'
import { DateTime } from 'luxon'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params

  const { searchParams } = req.nextUrl
  const pageIndex = parseInt(searchParams.get('page') ?? '0')

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
    skip: pageIndex * 10,
    take: 10,
  })

  const total = await prisma.vtv.count({ where: { patente } })

  return NextResponse.json({
    data: vehiculo,
    pages: Math.ceil(total / 10).toString(),
  })
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
  revalidateTag('vtv')
  return NextResponse.json(vehiculo)
}
