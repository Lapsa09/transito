import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params

  const vehiculo = await prisma.kilometraje_vehiculos.findMany({
    where: {
      patente,
    },
    include: {
      movil: true,
    },
  })

  return NextResponse.json(vehiculo)
}
