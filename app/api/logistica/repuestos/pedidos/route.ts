import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const pedidos = await prisma.pedido_repuesto.findMany({
    include: {
      repuesto: {
        include: {
          tipo_repuesto: true,
        },
      },
      proveedor: true,
    },
  })

  return NextResponse.json(pedidos)
}
