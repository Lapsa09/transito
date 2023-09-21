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
          proveedor: true,
          repuesto: true,
        },
      },
      movil: true,
    },
  })

  return NextResponse.json(reparaciones)
}
