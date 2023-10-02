import prisma from '@/lib/prismadb'
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
