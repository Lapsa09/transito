import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const pedidos = await prisma.reparaciones.findMany({
    include: {
      movil: true,
      repuesto: {
        include: {
          tipo_repuesto: true,
        },
      },
    },
  })

  return NextResponse.json(pedidos)
}
