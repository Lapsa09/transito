import prisma from '@/lib/prismadb'
import { Reparacion } from '@/types/logistica'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params

  const reparaciones = await prisma.reparaciones.findMany({
    where: {
      patente,
    },
    include: {
      suministro: {
        include: {
          pedido: {
            include: {
              proveedor: true,
            },
          },
        },
      },
      movil: true,
    },
  })

  return NextResponse.json(reparaciones)
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
      suministro: {
        connect: {
          id: body.suministro.id,
        },
      },
      fecha: body.fecha,
      articulo: body.articulo,
      concepto: body.concepto,
      estado: body.estado,
      observacion: body.observacion,
      retira: body.retira,
    },
    include: {
      suministro: {
        include: {
          pedido: {
            include: {
              proveedor: true,
            },
          },
        },
      },
      movil: true,
    },
  })

  return NextResponse.json(reparacion)
}
