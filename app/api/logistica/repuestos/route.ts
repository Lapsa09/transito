import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const pageIndex = parseInt(searchParams.get('page') ?? '0')
  const repuestos = await prisma.repuesto.findMany({
    include: {
      tipo_repuesto: true,
      reparacion: true,
      pedido_repuesto: true,
    },
    skip: pageIndex * 10,
    take: 10,
  })

  const total = await prisma.repuesto.count()

  return NextResponse.json({
    data: repuestos,
    pages: Math.ceil(total / 10).toString(),
  })
}
