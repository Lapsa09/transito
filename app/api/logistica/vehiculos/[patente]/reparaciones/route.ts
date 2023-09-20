import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET({ params }: { params: { patente: string } }) {
  const { patente } = params

  const reparaciones = await prisma.reparaciones.findMany({
    where: {
      dominio: patente,
    },
    include: {
      suministro: {
        include: {
          proveedor: true,
        },
      },
    },
  })

  return NextResponse.json(reparaciones)
}
