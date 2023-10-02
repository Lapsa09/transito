import prisma from '@/lib/prismadb'
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
          pedidos: {
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
