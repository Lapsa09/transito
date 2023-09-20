import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET({ params }: { params: { patente: string } }) {
  const { patente } = params

  const vehiculo = await prisma.kilometraje_fecha.findMany({
    where: {
      patente,
    },
    include: {
      kilometraje_vehiculos: {
        include: {
          movil: true,
        },
      },
    },
  })

  return NextResponse.json(vehiculo)
}
