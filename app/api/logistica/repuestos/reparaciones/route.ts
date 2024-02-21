import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const pageIndex = parseInt(searchParams.get('page') ?? '0')
  const pedidos = await prisma.reparaciones.findMany({
    include: {
      movil: true,
      repuesto: {
        include: {
          tipo_repuesto: true,
        },
      },
    },
    skip: pageIndex * 10,
    take: 10,
  })

  return NextResponse.json({
    data: pedidos,
    pages: pedidos.length.toString(),
  })
}
