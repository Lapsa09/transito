import prisma from '@/lib/prismadb'
import { Reparacion } from '@/types/logistica'
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
  const reparaciones = await prisma.reparaciones.findMany({
    where: {
      patente,
    },
    include: {
      repuesto: {
        include: {
          pedido_repuesto: {
            include: {
              proveedor: true,
            },
          },
        },
      },
      movil: true,
    },
    skip: pageIndex * 10,
    take: 10,
  })

  const total = await prisma.reparaciones.count({ where: { patente } })

  return NextResponse.json({
    data: reparaciones,
    pages: Math.ceil(total / 10).toString(),
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const body: Reparacion = await req.json()
  const { patente } = params

  const reparacion = await prisma.reparaciones.create({
    data: {
      movil: {
        connect: {
          patente,
        },
      },
      repuesto: {
        connect: {
          id: body.repuesto.id,
        },
      },
      fecha: DateTime.fromFormat(String(body.fecha), 'yyyy-MM-dd').toISO(),
      concepto: body.concepto,
      estado: body.estado,
      observacion: body.observacion,
      retira: body.retira,
    },
    include: {
      repuesto: {
        include: {
          pedido_repuesto: {
            include: {
              proveedor: true,
            },
          },
        },
      },
      movil: true,
    },
  })
  revalidateTag('reparaciones')
  return NextResponse.json(reparacion)
}
